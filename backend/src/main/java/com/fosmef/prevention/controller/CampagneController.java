package com.fosmef.prevention.controller;

import com.fosmef.prevention.dto.request.CampagneRequest;
import com.fosmef.prevention.dto.response.CampagneResponse;
import com.fosmef.prevention.service.CampagneService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campagnes")
public class CampagneController {

    private final CampagneService campagneService;

    public CampagneController(CampagneService campagneService) {
        this.campagneService = campagneService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADHERENT', 'GESTIONNAIRE')")
    public ResponseEntity<List<CampagneResponse>> getAllCampagnes() {
        return ResponseEntity.ok(campagneService.getAllCampagnes());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADHERENT', 'GESTIONNAIRE')")
    public ResponseEntity<CampagneResponse> getCampagneById(@PathVariable Long id) {
        return ResponseEntity.ok(campagneService.getCampagneById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('GESTIONNAIRE')")
    public ResponseEntity<CampagneResponse> createCampagne(@Valid @RequestBody CampagneRequest request) {
        CampagneResponse response = campagneService.createCampagne(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('GESTIONNAIRE')")
    public ResponseEntity<Void> deleteCampagne(@PathVariable Long id) {
        campagneService.deleteCampagne(id);
        return ResponseEntity.noContent().build();
    }
}