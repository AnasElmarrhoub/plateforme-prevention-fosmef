package com.fosmef.prevention.service;

import com.fosmef.prevention.dto.request.CampagneRequest;
import com.fosmef.prevention.dto.response.CampagneResponse;
import java.util.List;

public interface CampagneService {
    List<CampagneResponse> getAllCampagnes();
    CampagneResponse createCampagne(CampagneRequest request);
}