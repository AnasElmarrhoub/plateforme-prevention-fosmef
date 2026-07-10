package com.fosmef.prevention.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record CampagneRequest(
    @NotBlank String titre,
    String description,
    @NotNull LocalDate dateDebut,
    @NotNull LocalDate dateFin,
    @NotNull @Min(1) Integer placesTotales
) {}