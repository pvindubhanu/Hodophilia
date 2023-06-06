package com.hodophilia.backend.controllers;

import com.hodophilia.backend.models.Search;
import com.hodophilia.backend.security.services.SearchService;
import com.nimbusds.jose.shaded.json.JSONObject;
//import jakarta.servlet.http.HttpServletRequest;
//import net.minidev.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    @Autowired
    SearchService searchService;

    @CrossOrigin(origins = "*", allowedHeaders = {"Origin", "X-Requested-With", "Content-Type", "Accept"})
    @GetMapping("")
    public ResponseEntity<?> getAllPlaces(HttpServletRequest request) {
        List<String> placesList = searchService.fetchAllPlaces();
        JSONObject jsonObj = new JSONObject();
        jsonObj.put("places", placesList);
        return new ResponseEntity<>(jsonObj, HttpStatus.OK);
    }

    @CrossOrigin(origins = "*", allowedHeaders = {"Origin", "X-Requested-With", "Content-Type", "Accept"})
    @GetMapping("/topplaces")
    public ResponseEntity<?> getTopPlaces(HttpServletRequest request) {
        List<Search> placesList = searchService.fetchTopPlaces();
        JSONObject jsonObj = new JSONObject();
        jsonObj.put("places", placesList);
        return new ResponseEntity<>(jsonObj, HttpStatus.OK);
    }

    @CrossOrigin(origins = "*", allowedHeaders = {"Origin", "X-Requested-With", "Content-Type", "Accept"})
    @GetMapping("/{place}")
    public ResponseEntity<Search> getDetailsById(HttpServletRequest request,
                                                    @PathVariable("place") String place) {
        Search search = searchService.fetchDetailsByPlace(place);
        return new ResponseEntity<>(search, HttpStatus.OK);
    }

    @PostMapping("")
    public ResponseEntity<Search> addPlace(HttpServletRequest request,
                                              @RequestBody Map<String, Object> searchMap) {
        String placeId = (String) searchMap.get("PlaceId");
        String place = (String) searchMap.get("Place");
        String description = (String) searchMap.get("Description");
        String travelAdvice = (String) searchMap.get("TravelAdvice");
        String hotels = (String) searchMap.get("Hotels");
        String thingsToDo = (String) searchMap.get("ThingsToDo");
        String restaurants = (String) searchMap.get("Restaurants");
        String travelForum = (String) searchMap.get("TravelForum");
        Integer ratings = (Integer) searchMap.get("Ratings");
        Search search = searchService.addPlace(placeId, place, description, travelAdvice, hotels, thingsToDo, restaurants, travelForum, ratings);
        return new ResponseEntity<>(search, HttpStatus.CREATED);
    }

    @CrossOrigin(origins = "*", allowedHeaders = {"Origin", "X-Requested-With", "Content-Type", "Accept"})
    @GetMapping("/rating/{place}")
    public ResponseEntity<?> getRatingsByPlace(HttpServletRequest request,
                                                 @PathVariable("place") String place) {
        Integer ratings = searchService.fetchRatingsByPlace(place);
        JSONObject jsonObj = new JSONObject();
        jsonObj.put("Ratings", ratings);
        return new ResponseEntity<>(jsonObj, HttpStatus.OK);
    }



    @CrossOrigin(origins = "*", allowedHeaders = {"Origin", "X-Requested-With", "Content-Type", "Accept"})
    @PutMapping("/rating/{place}")
    public ResponseEntity<?> updateRatingsByPlace(HttpServletRequest request, @PathVariable("place") String place,
                                                     @RequestBody Map<String, Object> searchMap) {
        Integer dbRatings = searchService.fetchRatingsByPlace(place);
        Integer newRatings;
        newRatings = (Integer) searchMap.get("Ratings");
        newRatings = (dbRatings + newRatings) / 2;
        Integer updatedRatings = searchService.updateRatingsByPlace(place, newRatings);
        JSONObject jsonObj = new JSONObject();
        jsonObj.put("Ratings", updatedRatings);

        return new ResponseEntity<>(jsonObj, HttpStatus.OK);

    }

}
