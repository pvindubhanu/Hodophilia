package com.hodophilia.backend.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hodophilia.backend.models.Flight;

public interface FlightRepository extends JpaRepository<Flight, Long> {

//	@Query("from Flight where departureCity = :departureCity and arrivalCity = :arrivalCity and dateOfDeparture = :dateOfDeparture")
//	List<Flight> findFlights(@Param("departureCity") String from, @Param("arrivalCity") String to,
//			@Param("dateOfDeparture") String departureDate);
	
	@Query("from Flight where departure_city_location_id = :departure_city_location_id and arrival_city_location_id = :arrival_city_location_id and dateOfDeparture = :dateOfDeparture")
	List<Flight> findFlights(@Param("departure_city_location_id") Long from, @Param("arrival_city_location_id") Long to,
			@Param("dateOfDeparture") String departureDate);
	
	

}