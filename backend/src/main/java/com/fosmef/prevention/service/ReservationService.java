package com.fosmef.prevention.service;

import com.fosmef.prevention.dto.request.ReservationRequest;
import com.fosmef.prevention.dto.response.ReservationResponse;

import java.util.List;

public interface ReservationService {
    ReservationResponse reserverCampagne(String userEmail, ReservationRequest request);
    List<ReservationResponse> getMesReservations(String userEmail);
    List<ReservationResponse> getReservationsByCampagne(Long campagneId);
    List<ReservationResponse> getAllReservations();
    void annulerReservation(String userEmail, Long reservationId);
}
