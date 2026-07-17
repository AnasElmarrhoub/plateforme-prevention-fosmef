package com.fosmef.prevention.dto.response;

import java.time.LocalDateTime;

public record ErrorResponse(
    int statut,
    String message,
    LocalDateTime timestamp
) {}