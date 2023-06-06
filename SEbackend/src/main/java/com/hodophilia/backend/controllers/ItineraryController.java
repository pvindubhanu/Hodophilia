package com.hodophilia.backend.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.nimbusds.jose.shaded.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import com.hodophilia.backend.exceptions.OAuth2AuthenticationProcessingException;
import com.hodophilia.backend.security.TokenAuthenticationFilter;
import com.hodophilia.backend.security.TokenProvider;
import com.hodophilia.backend.security.services.ItineraryService;

//@Api(tags = "UserItinerary")
@RestController
@RequestMapping("/api/itinerary")
public class ItineraryController {

    @Autowired
    private TokenProvider tokenProvider;

    @Autowired
    private TokenAuthenticationFilter tokenAuthenticationFilter;

    @Autowired
    ItineraryService itineraryService;

    @CrossOrigin(origins = "*", allowedHeaders = {"Origin", "X-Requested-With", "Content-Type", "Accept"})
    @GetMapping("")
    public ResponseEntity<?> getItineraryList(HttpServletRequest request) {
        String jwt = tokenAuthenticationFilter.getJwtFromRequest(request);
        if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
            Long userId = tokenProvider.getUserIdFromToken(jwt);
            List itineraryList = itineraryService.fetchItineraryList(Long.valueOf(userId));
            return new ResponseEntity<>(itineraryList, HttpStatus.OK);
        }
        else {
            throw new OAuth2AuthenticationProcessingException("USER NOT AUTHORIZED TO USE THIS RESOURCE");
        }

    }

    @CrossOrigin(origins = "*", allowedHeaders = {"Origin", "X-Requested-With", "Content-Type", "Accept"})
    @GetMapping("/{itineraryId}")
    public ResponseEntity<?> getItineraryById(HttpServletRequest request,
                                                    @PathVariable("itineraryId") Integer itineraryId) {
        String jwt = tokenAuthenticationFilter.getJwtFromRequest(request);
        if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
            JSONObject itinerary = itineraryService.fetchDetailsByItineraryId(itineraryId);
            return new ResponseEntity<>(itinerary, HttpStatus.OK);
        }
        else {
            throw new OAuth2AuthenticationProcessingException("USER NOT AUTHORIZED TO USE THIS RESOURCE");
        }

    }

    @CrossOrigin(origins = "*", allowedHeaders = {"Origin", "X-Requested-With", "Content-Type", "Accept"})
    @PostMapping("")
    public ResponseEntity<?> addItinerary(HttpServletRequest request,
                                                  @RequestBody Map<String, Object> itineraryMap) {

        String jwt = tokenAuthenticationFilter.getJwtFromRequest(request);
        if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
            Long userId1 = tokenProvider.getUserIdFromToken(jwt);
            String itineraryName = (String) itineraryMap.get("itineraryName");
            String firstTravelDay = (String) itineraryMap.get("firstTravelDay");
            String startDate = (String) itineraryMap.get("startDate");
            String actionWithDate = (String) itineraryMap.get("actionWithDate");
            String locationId = (String) itineraryMap.get("locationId");
            JSONObject itinerary = itineraryService.addItinerary(userId1, itineraryName, firstTravelDay, startDate, actionWithDate, locationId);
            return new ResponseEntity<>(itinerary, HttpStatus.CREATED);
        }
        else {
            throw new OAuth2AuthenticationProcessingException("USER NOT AUTHORIZED TO USE THIS RESOURCE");
        }
    }

    @CrossOrigin(origins = "*", allowedHeaders = {"Origin", "X-Requested-With", "Content-Type", "Accept"})
    @PutMapping("/{itineraryId}")
    public ResponseEntity<?> updateItinerary(HttpServletRequest request, @PathVariable("itineraryId") Integer itineraryId,
                                                     @RequestBody Map<String, Object> itineraryMap) {
        String jwt = tokenAuthenticationFilter.getJwtFromRequest(request);
        if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
            Long userId = tokenProvider.getUserIdFromToken(jwt);
            String itineraryName = (String) itineraryMap.get("itineraryName");
            String firstTravelDay = (String) itineraryMap.get("firstTravelDay");
            String startDate = (String) itineraryMap.get("startDate");
            String actionWithDate = (String) itineraryMap.get("actionWithDate");
            String locationId = (String) itineraryMap.get("locationId");
            JSONObject itineraryRes = itineraryService.updateItinerary(userId, itineraryId, itineraryName, firstTravelDay, startDate, actionWithDate, locationId);
            return new ResponseEntity<>(itineraryRes, HttpStatus.OK);
        }
        else {
            throw new OAuth2AuthenticationProcessingException("USER NOT AUTHORIZED TO USE THIS RESOURCE");
        }
    }


    @CrossOrigin(origins = "*", allowedHeaders = {"Origin", "X-Requested-With", "Content-Type", "Accept"})
    @DeleteMapping("/{itineraryId}")
    public ResponseEntity<Map<String, Boolean>> deleteItinerary(HttpServletRequest request,
                                                                @PathVariable("itineraryId") Integer itineraryId) {
        String jwt = tokenAuthenticationFilter.getJwtFromRequest(request);
        if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
            Long userId = tokenProvider.getUserIdFromToken(jwt);
            itineraryService.deleteItineraryById(userId, itineraryId);
            Map<String, Boolean> map = new HashMap<>();
            map.put("success", true);
            return new ResponseEntity<>(map, HttpStatus.OK);
        }
        else {
            throw new OAuth2AuthenticationProcessingException("USER NOT AUTHORIZED TO USE THIS RESOURCE");
        }
    }


}