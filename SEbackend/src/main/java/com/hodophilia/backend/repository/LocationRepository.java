package com.hodophilia.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hodophilia.backend.models.Location;

import java.util.List;

@Repository
public interface LocationRepository extends JpaRepository<Location,Long>{
	Optional<Location> findById(Long Id);
	
	Optional<Location> findByName(String name);
	
	public List<Location> findAllByOrderByRatingsDesc();
}
