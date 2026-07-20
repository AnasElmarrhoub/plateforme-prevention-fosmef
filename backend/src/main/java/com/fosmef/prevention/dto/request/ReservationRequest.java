package com.fosmef.prevention.dto.request;

import jakarta.validation.constraints.NotNull;

public record ReservationRequest(
    @NotNull(message = "L'ID de la campagne est obligatoire") Long campagneId
) {}
