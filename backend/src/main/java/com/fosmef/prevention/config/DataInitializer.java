package com.fosmef.prevention.config;

import com.fosmef.prevention.entity.Role;
import com.fosmef.prevention.entity.User;
import com.fosmef.prevention.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            // Créer uniquement le compte Administrateur / Gestionnaire s'il n'existe pas
            if (userRepository.findByEmail("admin@fosmef.ma").isEmpty()) {
                User admin = User.builder()
                        .nom("Gestionnaire")
                        .prenom("FOSMEF")
                        .email("admin@fosmef.ma")
                        .password(passwordEncoder.encode("admin123"))
                        .ppm("ADMIN-001")
                        .telephone("0600000000")
                        .role(Role.GESTIONNAIRE)
                        .build();

                userRepository.save(admin);
                System.out.println("✅ Compte Admin vérifié : admin@fosmef.ma / admin123");
            }
        };
    }
}
