package com.fosmef.prevention.controller;

import com.fosmef.prevention.dto.request.ReservationRequest;
import com.fosmef.prevention.dto.response.ReservationResponse;
import com.fosmef.prevention.service.ReservationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    /**
     * POST /api/reservations
     * Réserver une place dans une campagne (ADHERENT uniquement)
     */
    @PostMapping
    @PreAuthorize("hasRole('ADHERENT')")
    public ResponseEntity<ReservationResponse> reserver(
            Authentication authentication,
            @Valid @RequestBody ReservationRequest request) {
        String email = authentication.getName();
        ReservationResponse response = reservationService.reserverCampagne(email, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * GET /api/reservations/mes-reservations
     * Récupérer les réservations de l'adhérent connecté
     */
    @GetMapping("/mes-reservations")
    @PreAuthorize("hasRole('ADHERENT')")
    public ResponseEntity<List<ReservationResponse>> getMesReservations(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(reservationService.getMesReservations(email));
    }

    /**
     * GET /api/reservations/campagne/{campagneId}
     * Récupérer la liste des inscrits à une campagne (GESTIONNAIRE)
     */
    @GetMapping("/campagne/{campagneId}")
    @PreAuthorize("hasRole('GESTIONNAIRE')")
    public ResponseEntity<List<ReservationResponse>> getReservationsByCampagne(@PathVariable Long campagneId) {
        return ResponseEntity.ok(reservationService.getReservationsByCampagne(campagneId));
    }

    /**
     * GET /api/reservations
     * Récupérer toutes les réservations (GESTIONNAIRE)
     */
    @GetMapping
    @PreAuthorize("hasRole('GESTIONNAIRE')")
    public ResponseEntity<List<ReservationResponse>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    /**
     * DELETE /api/reservations/{id}
     * Annuler une réservation (ADHERENT propriétaire ou GESTIONNAIRE)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADHERENT', 'GESTIONNAIRE')")
    public ResponseEntity<Void> annuler(Authentication authentication, @PathVariable Long id) {
        String email = authentication.getName();
        reservationService.annulerReservation(email, id);
        return ResponseEntity.noContent().build();
    }
}
