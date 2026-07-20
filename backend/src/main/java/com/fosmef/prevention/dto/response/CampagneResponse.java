package com.fosmef.prevention.dto.response;

import com.fosmef.prevention.entity.StatutCampagne;
import java.time.LocalDate;

public record CampagneResponse(
    Long id,
    String titre,
    String description,
    String lieu,
    LocalDate dateDebut,
    LocalDate dateFin,
    Integer placesTotales,
    Integer placesReservees,
    StatutCampagne statut
) {}