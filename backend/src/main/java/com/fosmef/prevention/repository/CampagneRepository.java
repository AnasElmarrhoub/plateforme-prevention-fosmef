package com.fosmef.prevention.repository;

import com.fosmef.prevention.entity.Campagne;
import com.fosmef.prevention.entity.StatutCampagne;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CampagneRepository extends JpaRepository<Campagne, Long> {
    List<Campagne> findByStatut(StatutCampagne statut);
}