package com.hodophilia.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hodophilia.backend.models.Flight;
import com.hodophilia.backend.models.Location;
import com.hodophilia.backend.repository.FlightRepository;
import com.hodophilia.backend.repository.LocationRepository;
import com.nimbusds.jose.shaded.json.JSONObject;



@RestController
@RequestMapping("/api/flights/")
public class FlightController {

	@Autowired
	FlightRepository flightRepository;
	
	@Autowired
	LocationRepository locationRepository;

	@GetMapping("findFlights")
	public ResponseEntity<?> findFlight(@RequestParam("from") String from, @RequestParam("to") String to,
			@RequestParam("departureDate") String departureDate) {
		
		Location fromLocation = locationRepository.findByName(from).get();
		
		Location toLocation = locationRepository.findByName(to).get();
		
		List<Flight> flights = flightRepository.findFlights(fromLocation.getId(), toLocation.getId(), departureDate);
		
		JSONObject jsonObj = new JSONObject();
        jsonObj.put("flights", flights);
		
		return new ResponseEntity<>(flights,HttpStatus.OK);
		

	}
	
	
	
}