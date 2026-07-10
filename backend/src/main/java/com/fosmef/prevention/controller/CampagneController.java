package com.fosmef.prevention.controller;

import com.fosmef.prevention.dto.request.CampagneRequest;
import com.fosmef.prevention.dto.response.CampagneResponse;
import com.fosmef.prevention.service.CampagneService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campagnes")
public class CampagneController {

    private final CampagneService campagneService;

    // Injection de l'interface (couplage faible)
    public CampagneController(CampagneService campagneService) {
        this.campagneService = campagneService;
    }

    @GetMapping
    public ResponseEntity<List<CampagneResponse>> getAllCampagnes() {
        return ResponseEntity.ok(campagneService.getAllCampagnes());
    }

    @PostMapping
    public ResponseEntity<CampagneResponse> createCampagne(@Valid @RequestBody CampagneRequest request) {
        CampagneResponse response = campagneService.createCampagne(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}