package com.fosmef.prevention.service;

import com.fosmef.prevention.dto.request.LoginRequest;
import com.fosmef.prevention.dto.request.RegisterRequest;
import com.fosmef.prevention.dto.response.UserResponse;

public interface UserService {
    UserResponse register(RegisterRequest request);
    UserResponse login(LoginRequest request);
    UserResponse getUserProfile(Long id);
}
