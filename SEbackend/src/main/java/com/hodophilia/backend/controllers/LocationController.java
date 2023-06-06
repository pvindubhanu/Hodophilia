package com.hodophilia.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hodophilia.backend.models.GeoPoint;
import com.hodophilia.backend.models.Location;
import com.hodophilia.backend.repository.LocationRepository;
import com.nimbusds.jose.shaded.json.JSONObject;

@RestController
@RequestMapping("/api/locations/")
public class LocationController {
	
	@Autowired
	private LocationRepository locationRepository;



	@CrossOrigin(origins = "*", allowedHeaders = {"Origin", "X-Requested-With", "Content-Type", "Accept"})
	@GetMapping("/ratings/{id}")
	public ResponseEntity<?> getRatingsByLocations(@PathVariable("id") Long id)
	{
		Location location = locationRepository.findById(id).get();
		
		Double rating = location.getRatings();
		
		JSONObject obj = new JSONObject();
		obj.put("rating", rating);
		return new ResponseEntity<>(rating, HttpStatus.OK);
		
	}

	@CrossOrigin(origins = "*", allowedHeaders = {"Origin", "X-Requested-With", "Content-Type", "Accept"})
	@GetMapping("/geopoint/{id}")
	public ResponseEntity<?> getGeoPointByLocations(@PathVariable("id") Long id)
	{
		Location location = locationRepository.findById(id).get();
		
		GeoPoint geopoint = location.getGeoPoint();
		
		JSONObject obj = new JSONObject();
		obj.put("geopoint", geopoint);
		return new ResponseEntity<>(geopoint, HttpStatus.OK);
		
	}

	@CrossOrigin(origins = "*", allowedHeaders = {"Origin", "X-Requested-With", "Content-Type", "Accept"})
	@GetMapping("/ratings/topPlaces")
	public ResponseEntity<?> getTopLocations()
	{
		List<Location> locations = locationRepository.findAllByOrderByRatingsDesc();		
		
		JSONObject obj = new JSONObject();

		obj.put("locations",locations.subList(0,3));

		return new ResponseEntity<>(locations.subList(0,3),HttpStatus.OK);
		
	}
	
	

}
