package com.hodophilia.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hodophilia.backend.models.Image;

@Repository
public interface ImageRepository extends JpaRepository<Image,Long>{
	
	Optional<Image> findById(Long id);
	
	Optional<Image> findByPath(String path);

}
