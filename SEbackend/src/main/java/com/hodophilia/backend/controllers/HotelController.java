package com.hodophilia.backend.controllers;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hodophilia.backend.exceptions.ResourceNotFoundException;
import com.hodophilia.backend.models.Hotel;
import com.hodophilia.backend.models.Location;
import com.hodophilia.backend.payload.request.RatingsUpdateRequest;
import com.hodophilia.backend.payload.response.HotelResponse;
import com.hodophilia.backend.repository.HotelRepository;
import com.hodophilia.backend.repository.LocationRepository;
import com.hodophilia.backend.security.services.hotels.HotelService;
import com.hodophilia.backend.security.services.image.ImageService;
import com.nimbusds.jose.shaded.json.JSONObject;

import lombok.AllArgsConstructor;

@CrossOrigin(origins = "*", maxAge = 3600)
@AllArgsConstructor
@RestController
@Produces(MediaType.APPLICATION_JSON)
@RequestMapping("/api/hotels")
public class HotelController {

    private final HotelService hotelService;
    
    private final ImageService imageService;
    
    @Autowired
    private final HotelRepository hotelRepository;
    
    @Autowired
    private LocationRepository locationRepository;
    
    @GetMapping("findHotels")
	public ResponseEntity<?> findHotels(@RequestParam("location") String locationName
			) {
		

    	Location location = locationRepository.findByName(locationName).get();
    	
		List<Hotel> hotels = hotelRepository.findHotelsByLocation(location.getId());
		
		JSONObject jsonObj = new JSONObject();
        jsonObj.put("hotels", hotels);
		
		return new ResponseEntity<>(hotels,HttpStatus.OK);
		

	}

    @GetMapping("")
    public ResponseEntity<List<Hotel>> getAllHotels() {
        List<Hotel> hotels = hotelService.fetchAllHotels();
        return new ResponseEntity<>(hotels, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getHotelById(@PathVariable Long id) {
        Hotel hotel = hotelService.findById(id);
        
        String hotelImage = "";
		try {
			hotelImage = imageService.getImage(hotel.getImage().getPath());
		} catch (IOException e) {
			// TODO Auto-generated catch block
			return new ResponseEntity<>(new ResourceNotFoundException("image","restaurant",hotelImage),HttpStatus.BAD_REQUEST);
		}
        
		if (hotelImage != "") {
			HotelResponse hotelResponse = new HotelResponse(hotel.getName(),hotel.getGeoPoint(),hotelImage);
	        
	        return new ResponseEntity<>(hotelResponse, HttpStatus.OK);
		}
        
		return new ResponseEntity<>("Image not able to decode",HttpStatus.BAD_REQUEST);
    }

    @PostMapping("")
    public ResponseEntity<Map<String, Boolean>> createHotel(@Valid @RequestBody Hotel hotel) {
        hotelService.createHotel(hotel);
        Map<String, Boolean> map = new HashMap<>();
        map.put("success", true);
        return new ResponseEntity<>(map, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> updateHotel(@PathVariable Long id,
                                                            @Valid @RequestBody Hotel hotel) {
        hotel.setId(id);
        hotelService.updateHotel(hotel);
        Map<String, Boolean> map = new HashMap<>();
        map.put("success", true);
        return new ResponseEntity<>(map, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteHotel(@PathVariable Long id) {
        hotelService.deleteHotel(id);
        Map<String, Boolean> map = new HashMap<>();
        map.put("success", true);
        return new ResponseEntity<>(map, HttpStatus.OK);
    }
    
    @GetMapping("/ratings/{id}")
    public ResponseEntity<?> getRatingsByHotel(@PathVariable Long id)
    {
    	Hotel hotel = hotelRepository.findById(id).get();
    	
    	return new ResponseEntity<>(hotel.getRatings(),HttpStatus.OK);
    }
    
    @PutMapping("/ratings/update/{id}")
    public ResponseEntity<?> updateRatingsForHotel(@PathVariable Long id,@Valid @RequestBody RatingsUpdateRequest request)
    {
    	System.out.println(request.getKey());
    	if (request.getKey().equals("HOTEL"))
    	{
    		Hotel hotel = hotelRepository.findById(id).get();
    		Double currentHotelRatings = hotel.getRatings();
    		Double updatedHotelRatings = (currentHotelRatings + Integer.parseInt(request.getRatings()))/2;
    		hotel.setRatings(updatedHotelRatings);
    		hotelRepository.save(hotel);
    		return new ResponseEntity<>(updatedHotelRatings,HttpStatus.OK);
    	}
    	
    	return new ResponseEntity<>("Wrong update Request",HttpStatus.BAD_REQUEST);
    }
}