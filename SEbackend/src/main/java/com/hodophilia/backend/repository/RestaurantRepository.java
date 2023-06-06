package com.hodophilia.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.hodophilia.backend.models.Restaurant;


@Repository
@Transactional(readOnly = true)
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
	
	@Query("from Restaurant where location = :location")
	List<Restaurant> findRestaurant(@Param("location") String location);
	
	Optional<Restaurant> findById(Long Id);
	
	Optional<Restaurant> findByName(String name);
	
	@Query("from Restaurant where location_id = :location_id")
	List<Restaurant> findRestaurantByLocation(@Param("location_id") Long location_id);
}
