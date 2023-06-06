package com.hodophilia.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hodophilia.backend.models.GeoPoint;

@Repository
public interface GeoPointRepository extends JpaRepository<GeoPoint,Long>{
	
	Optional<GeoPoint> findById(Long Id);
}
