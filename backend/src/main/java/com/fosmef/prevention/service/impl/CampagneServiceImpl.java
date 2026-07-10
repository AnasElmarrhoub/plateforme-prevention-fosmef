package com.fosmef.prevention.service.impl;

import com.fosmef.prevention.dto.request.CampagneRequest;
import com.fosmef.prevention.dto.response.CampagneResponse;
import com.fosmef.prevention.entity.Campagne;
import com.fosmef.prevention.entity.StatutCampagne;
import com.fosmef.prevention.repository.CampagneRepository;
import com.fosmef.prevention.service.CampagneService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CampagneServiceImpl implements CampagneService {

    private final CampagneRepository campagneRepository;

    public CampagneServiceImpl(CampagneRepository campagneRepository) {
        this.campagneRepository = campagneRepository;
    }

    @Override
    public List<CampagneResponse> getAllCampagnes() {
        return campagneRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CampagneResponse createCampagne(CampagneRequest request) {
        // 1. Conversion DTO -> Entité
        Campagne campagne = Campagne.builder()
                .titre(request.titre())
                .description(request.description())
                .dateDebut(request.dateDebut())
                .dateFin(request.dateFin())
                .placesTotales(request.placesTotales())
                .placesReservees(0) // Initialisation logique
                .statut(StatutCampagne.PLANIFIEE)
                .build();

        // 2. Sauvegarde en base
        Campagne savedCampagne = campagneRepository.save(campagne);

        // 3. Conversion Entité -> DTO pour la réponse
        return mapToResponse(savedCampagne);
    }

    // Méthode utilitaire de mapping (qui sera plus tard remplacée par MapStruct)
    private CampagneResponse mapToResponse(Campagne campagne) {
        return new CampagneResponse(
                campagne.getId(),
                campagne.getTitre(),
                campagne.getDescription(),
                campagne.getDateDebut(),
                campagne.getDateFin(),
                campagne.getPlacesTotales(),
                campagne.getPlacesReservees(),
                campagne.getStatut()
        );
    }
}