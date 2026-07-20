package com.fosmef.prevention.service.impl;

import com.fosmef.prevention.dto.request.LoginRequest;
import com.fosmef.prevention.dto.request.RegisterRequest;
import com.fosmef.prevention.dto.response.AuthResponse;
import com.fosmef.prevention.dto.response.UserResponse;
import com.fosmef.prevention.entity.Role;
import com.fosmef.prevention.entity.User;
import com.fosmef.prevention.repository.UserRepository;
import com.fosmef.prevention.security.CustomUserDetailsService;
import com.fosmef.prevention.security.JwtService;
import com.fosmef.prevention.service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public AuthServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            CustomUserDetailsService userDetailsService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new RuntimeException("Cet email est déjà utilisé.");
        }

        User user = User.builder()
                .nom(request.nom())
                .prenom(request.prenom())
                .email(request.email())
                .ppm(request.ppm())
                .telephone(request.telephone())
                .password(passwordEncoder.encode(request.password()))
                .role(request.role() != null ? request.role() : Role.ADHERENT)
                .build();

        User savedUser = userRepository.save(user);

        // Générer le token après inscription
        String jwtToken = jwtService.generateToken(userDetailsService.loadUserByUsername(user.getEmail()));

        return new AuthResponse(jwtToken, mapToResponse(savedUser));
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("Email ou mot de passe incorrect."));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new RuntimeException("Email ou mot de passe incorrect.");
        }

        // Générer le token
        String jwtToken = jwtService.generateToken(userDetailsService.loadUserByUsername(user.getEmail()));

        return new AuthResponse(jwtToken, mapToResponse(user));
    }

    @Override
    public UserResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable avec l'email: " + email));
        return mapToResponse(user);
    }

    private UserResponse mapToResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getNom(),
                user.getPrenom(),
                user.getPpm(),
                user.getTelephone(),
                user.getRole());
    }
}