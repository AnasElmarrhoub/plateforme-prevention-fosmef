package com.fosmef.prevention.service.impl;

import com.fosmef.prevention.dto.request.LoginRequest;
import com.fosmef.prevention.dto.request.RegisterRequest;
import com.fosmef.prevention.dto.response.UserResponse;
import com.fosmef.prevention.entity.User;
import com.fosmef.prevention.repository.UserRepository;
import com.fosmef.prevention.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public UserResponse register(RegisterRequest request) {
        // 1. Vérification d'unicité de l'email
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cet email est déjà utilisé");
        }

        // 2. Hashage du mot de passe
        String hashedPassword = passwordEncoder.encode(request.password());

        // 3. Construction de l'entité User
        User user = User.builder()
                .email(request.email())
                .password(hashedPassword)
                .nom(request.nom())
                .prenom(request.prenom())
                .ppm(request.ppm())
                .telephone(request.telephone())
                .role(request.role())
                .build();

        // 4. Persistance
        User savedUser = userRepository.save(user);

        return mapToResponse(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse login(LoginRequest request) {
        // 1. Recherche par email
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email ou mot de passe incorrect"));

        // 2. Vérification du mot de passe crypté
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email ou mot de passe incorrect");
        }

        return mapToResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserProfile(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur non trouvé"));
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
