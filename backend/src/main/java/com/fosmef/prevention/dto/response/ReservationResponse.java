package com.fosmef.prevention.dto.response;

import com.fosmef.prevention.entity.StatutReservation;
import java.time.LocalDateTime;

public record ReservationResponse(
    Long id,
    Long campagneId,
    String campagneTitre,
    String campagneDescription,
    String campagneLieu,
    java.time.LocalDate campagneDateDebut,
    java.time.LocalDate campagneDateFin,
    String userName,
    String userEmail,
    String userPpm,
    String userTelephone,
    LocalDateTime dateReservation,
    StatutReservation statut
) {}
