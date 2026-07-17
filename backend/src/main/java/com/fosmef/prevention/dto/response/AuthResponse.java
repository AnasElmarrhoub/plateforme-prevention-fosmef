package com.fosmef.prevention.dto.response;

public record AuthResponse(
    String token,
    UserResponse user
) {}