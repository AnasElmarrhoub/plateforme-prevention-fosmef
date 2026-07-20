package com.fosmef.prevention.config;

import com.fosmef.prevention.entity.Campagne;
import com.fosmef.prevention.entity.Role;
import com.fosmef.prevention.entity.StatutCampagne;
import com.fosmef.prevention.entity.User;
import com.fosmef.prevention.repository.CampagneRepository;
import com.fosmef.prevention.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(
            UserRepository userRepository,
            CampagneRepository campagneRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            // 1. Créer le compte Administrateur / Gestionnaire s'il n'existe pas
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

            // 2. Créer des campagnes de démonstration à 0 places réservées si la base est vide
            if (campagneRepository.count() == 0) {
                Campagne c1 = Campagne.builder()
                        .titre("Dépistage Visuel & Glaucome 2026")
                        .description("Bilan ophtalmologique complet et dépistage précoce du glaucome pour les fonctionnaires du Ministère de l'Économie et des Finances.")
                        .lieu("Centre Médical FOSMEF - Rabat")
                        .dateDebut(LocalDate.now().plusDays(5))
                        .dateFin(LocalDate.now().plusDays(20))
                        .placesTotales(50)
                        .placesReservees(0) // 0% réservé au démarrage
                        .statut(StatutCampagne.EN_COURS)
                        .build();

                Campagne c2 = Campagne.builder()
                        .titre("Bilan Cardiovasculaire & Diabète")
                        .description("Contrôle de la tension artérielle, de la glycémie et consultation cardiologique préventive.")
                        .lieu("Complexe Médical FOSMEF - Casablanca")
                        .dateDebut(LocalDate.now().plusDays(10))
                        .dateFin(LocalDate.now().plusDays(30))
                        .placesTotales(80)
                        .placesReservees(0) // 0% réservé au démarrage
                        .statut(StatutCampagne.PLANIFIEE)
                        .build();

                Campagne c3 = Campagne.builder()
                        .titre("Campagne Santé Préventive de la Femme")
                        .description("Examens de santé préventifs, mammographie et dépistage gynécologique.")
                        .lieu("Centre Santé FOSMEF - Marrakech")
                        .dateDebut(LocalDate.now().plusDays(2))
                        .dateFin(LocalDate.now().plusDays(18))
                        .placesTotales(40)
                        .placesReservees(0) // 0% réservé au démarrage
                        .statut(StatutCampagne.EN_COURS)
                        .build();

                campagneRepository.save(c1);
                campagneRepository.save(c2);
                campagneRepository.save(c3);
                System.out.println("✅ Campagnes initialisées à 0% de réservation !");
            }
        };
    }
}
