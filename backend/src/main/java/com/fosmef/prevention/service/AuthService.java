package com.fosmef.prevention.service;

import com.fosmef.prevention.dto.request.LoginRequest;
import com.fosmef.prevention.dto.request.RegisterRequest;
import com.fosmef.prevention.dto.response.AuthResponse;
import com.fosmef.prevention.dto.response.UserResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    UserResponse getProfile(String email);
}