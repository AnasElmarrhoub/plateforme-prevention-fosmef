package com.fosmef.prevention.service.impl;

import com.fosmef.prevention.dto.request.ReservationRequest;
import com.fosmef.prevention.dto.response.ReservationResponse;
import com.fosmef.prevention.entity.*;
import com.fosmef.prevention.repository.CampagneRepository;
import com.fosmef.prevention.repository.ReservationRepository;
import com.fosmef.prevention.repository.UserRepository;
import com.fosmef.prevention.service.ReservationService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final CampagneRepository campagneRepository;
    private final UserRepository userRepository;

    public ReservationServiceImpl(ReservationRepository reservationRepository,
                                   CampagneRepository campagneRepository,
                                   UserRepository userRepository) {
        this.reservationRepository = reservationRepository;
        this.campagneRepository = campagneRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public ReservationResponse reserverCampagne(String userEmail, ReservationRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));

        Campagne campagne = campagneRepository.findById(request.campagneId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Campagne introuvable"));

        // Vérifier si la campagne est ouverte
        if (campagne.getStatut() != StatutCampagne.EN_COURS && campagne.getStatut() != StatutCampagne.PLANIFIEE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cette campagne n'accepte plus de réservations.");
        }

        // Vérifier les places disponibles
        if (campagne.getPlacesReservees() >= campagne.getPlacesTotales()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Cette campagne est complète.");
        }

        // Vérifier si l'utilisateur n'a pas déjà réservé cette campagne
        boolean dejaReserve = reservationRepository.findByUserId(user.getId()).stream()
                .anyMatch(r -> r.getCampagne().getId().equals(campagne.getId())
                        && r.getStatut() != StatutReservation.ANNULEE);
        if (dejaReserve) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Vous avez déjà une réservation pour cette campagne.");
        }

        // Incrémenter les places réservées
        campagne.setPlacesReservees(campagne.getPlacesReservees() + 1);
        campagneRepository.save(campagne);

        // Créer la réservation
        Reservation reservation = Reservation.builder()
                .user(user)
                .campagne(campagne)
                .dateReservation(LocalDateTime.now())
                .statut(StatutReservation.CONFIRMEE)
                .build();

        Reservation saved = reservationRepository.save(reservation);
        return mapToResponse(saved);
    }

    @Override
    public List<ReservationResponse> getMesReservations(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));

        return reservationRepository.findByUserId(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReservationResponse> getReservationsByCampagne(Long campagneId) {
        return reservationRepository.findByCampagneId(campagneId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReservationResponse> getAllReservations() {
        return reservationRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void annulerReservation(String userEmail, Long reservationId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Réservation introuvable"));

        if (!reservation.getUser().getId().equals(user.getId()) && user.getRole() != Role.GESTIONNAIRE) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Vous ne pouvez pas annuler cette réservation.");
        }

        if (reservation.getStatut() == StatutReservation.ANNULEE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cette réservation est déjà annulée.");
        }

        // Libérer la place
        Campagne campagne = reservation.getCampagne();
        campagne.setPlacesReservees(Math.max(0, campagne.getPlacesReservees() - 1));
        campagneRepository.save(campagne);

        reservation.setStatut(StatutReservation.ANNULEE);
        reservationRepository.save(reservation);
    }

    private ReservationResponse mapToResponse(Reservation reservation) {
        Campagne c = reservation.getCampagne();
        User u = reservation.getUser();
        String uName = (u != null) ? (u.getPrenom() + " " + u.getNom()).trim() : "Adhérent";
        String uEmail = (u != null) ? u.getEmail() : "";
        String uPpm = (u != null) ? u.getPpm() : "";
        String uTel = (u != null) ? u.getTelephone() : "";

        return new ReservationResponse(
                reservation.getId(),
                c.getId(),
                c.getTitre(),
                c.getDescription(),
                c.getLieu(),
                c.getDateDebut(),
                c.getDateFin(),
                uName,
                uEmail,
                uPpm,
                uTel,
                reservation.getDateReservation(),
                reservation.getStatut()
        );
    }
}
