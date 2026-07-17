package com.fosmef.prevention.dto.response;

import com.fosmef.prevention.entity.Role;

public record UserResponse(
        Long id,
        String email,
        String nom,
        String prenom,
        String ppm,
        String telephone,
        Role role) {
}
