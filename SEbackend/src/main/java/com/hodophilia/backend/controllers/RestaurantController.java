package com.hodophilia.backend.controllers;

import java.io.IOException;
import java.util.List;

import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hodophilia.backend.exceptions.ResourceNotFoundException;
import com.hodophilia.backend.models.Location;
import com.hodophilia.backend.models.Restaurant;
import com.hodophilia.backend.payload.request.RatingsUpdateRequest;
import com.hodophilia.backend.payload.response.RestaurantResponse;
import com.hodophilia.backend.repository.LocationRepository;
import com.hodophilia.backend.repository.RestaurantRepository;
import com.hodophilia.backend.security.services.image.ImageService;
import com.hodophilia.backend.security.services.restaurants.RestaurantService;
import com.nimbusds.jose.shaded.json.JSONObject;

import lombok.AllArgsConstructor;

@CrossOrigin(origins = "*", maxAge = 3600)
@AllArgsConstructor
@RestController
@Produces(MediaType.APPLICATION_JSON)
@RequestMapping("/api/restaurants")
public class RestaurantController {
	
	@Autowired
	private RestaurantRepository restaurantRepository;
	
	@Autowired
	private LocationRepository locationRepository;
	
	@Autowired
	private final RestaurantService restaurantService;
	
	@Autowired
	private final ImageService imageService;
	
	@GetMapping("findRestaurants")
	public ResponseEntity<?> findRestaurants(@RequestParam("location") String locationName) {
		
		Location location = locationRepository.findByName(locationName).get();
		
		List<Restaurant> restaurants = restaurantRepository.findRestaurantByLocation(location.getId());
		
		JSONObject jsonObj = new JSONObject();
        jsonObj.put("restaurants", restaurants);
		
		return new ResponseEntity<>(restaurants,HttpStatus.OK);
		

	}
	
	@GetMapping("/{id}")
    public ResponseEntity<?> getRestaurantById(@PathVariable Long id) {
        Restaurant restaurant = restaurantService.findById(id);
        
        String restaurantImage = "";
		try {
			restaurantImage = imageService.getImage(restaurant.getImage().getPath());
		} catch (IOException e) {
			// TODO Auto-generated catch block
			return new ResponseEntity<>(new ResourceNotFoundException("image","restaurant",restaurantImage),HttpStatus.BAD_REQUEST);
		}
        
		if (restaurantImage != "") {
			RestaurantResponse restaurantResponse = new RestaurantResponse(restaurant.getName(),restaurant.getGeoPoint(),restaurantImage);
	        
	        return new ResponseEntity<>(restaurantResponse, HttpStatus.OK);
		}
        
		return new ResponseEntity<>("Image not able to decode",HttpStatus.BAD_REQUEST);
    }
	
	@GetMapping("/ratings/{id}")
    public ResponseEntity<?> getRatingsByRestaurant(@PathVariable Long id)
    {
    	Restaurant restaurant = restaurantRepository.findById(id).get();
    	
    	return new ResponseEntity<>(restaurant.getRatings(),HttpStatus.OK);
    }
	
	@PutMapping("/ratings/update/{id}")
    public ResponseEntity<?> updateRatingsForRestaurant(@PathVariable Long id,@RequestBody RatingsUpdateRequest request)
    {
    	if (request.getKey().equals("RESTAURANT"))
    	{
    		Restaurant restaurant = restaurantRepository.findById(id).get();
    		Double currentRestaurantRatings = restaurant.getRatings();
    		Double updatedRestaurantRatings = (currentRestaurantRatings + Integer.parseInt(request.getRatings()))/2;
    		restaurant.setRatings(updatedRestaurantRatings);
    		restaurantRepository.save(restaurant);
    		return new ResponseEntity<>(updatedRestaurantRatings,HttpStatus.OK);
    	}
    	
    	return new ResponseEntity<>("Wrong update Request",HttpStatus.BAD_REQUEST);
    }
}
