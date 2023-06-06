package com.hodophilia.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.hodophilia.backend.models.Hotel;

@Repository
@Transactional(readOnly = true)
public interface HotelRepository extends JpaRepository<Hotel, Long> {
	
	@Query("from Hotel where location = :location")
	List<Hotel> findHotels(@Param("location") String location);
	
	@Query("from Hotel where location_id = :location_id")
	List<Hotel> findHotelsByLocation(@Param("location_id") Long location_id);
}
	