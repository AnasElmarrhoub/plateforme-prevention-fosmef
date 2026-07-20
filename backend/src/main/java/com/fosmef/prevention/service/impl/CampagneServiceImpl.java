package com.fosmef.prevention.service.impl;

import com.fosmef.prevention.dto.request.CampagneRequest;
import com.fosmef.prevention.dto.response.CampagneResponse;
import com.fosmef.prevention.entity.Campagne;
import com.fosmef.prevention.entity.StatutCampagne;
import com.fosmef.prevention.repository.CampagneRepository;
import com.fosmef.prevention.service.CampagneService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CampagneServiceImpl implements CampagneService {

    private final CampagneRepository campagneRepository;

    public CampagneServiceImpl(CampagneRepository campagneRepository) {
        this.campagneRepository = campagneRepository;
    }

    @Override
    public List<CampagneResponse> getAllCampagnes() {
        return campagneRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CampagneResponse getCampagneById(Long id) {
        Campagne campagne = campagneRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Campagne introuvable avec l'id: " + id));
        return mapToResponse(campagne);
    }

    @Override
    @Transactional
    public CampagneResponse createCampagne(CampagneRequest request) {
        Campagne campagne = Campagne.builder()
                .titre(request.titre())
                .description(request.description())
                .lieu(request.lieu())
                .dateDebut(request.dateDebut())
                .dateFin(request.dateFin())
                .placesTotales(request.placesTotales())
                .placesReservees(0)
                .statut(StatutCampagne.PLANIFIEE)
                .build();

        Campagne savedCampagne = campagneRepository.save(campagne);
        return mapToResponse(savedCampagne);
    }

    @Override
    @Transactional
    public void deleteCampagne(Long id) {
        if (!campagneRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Campagne introuvable avec l'id: " + id);
        }
        campagneRepository.deleteById(id);
    }

    private CampagneResponse mapToResponse(Campagne campagne) {
        return new CampagneResponse(
                campagne.getId(),
                campagne.getTitre(),
                campagne.getDescription(),
                campagne.getLieu(),
                campagne.getDateDebut(),
                campagne.getDateFin(),
                campagne.getPlacesTotales(),
                campagne.getPlacesReservees(),
                campagne.getStatut()
        );
    }
}