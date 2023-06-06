package com.hodophilia.backend.controllers;

import com.hodophilia.backend.exceptions.OAuth2AuthenticationProcessingException;
import com.hodophilia.backend.security.TokenAuthenticationFilter;
import com.hodophilia.backend.security.TokenProvider;
import com.hodophilia.backend.security.services.SharedItineraryService;
import com.nimbusds.jose.shaded.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/share")
public class SharedItineraryController {

    @Autowired
    private TokenProvider tokenProvider;

    @Autowired
    private TokenAuthenticationFilter tokenAuthenticationFilter;

    @Autowired
    SharedItineraryService sharedItineraryService;

    @CrossOrigin(origins = "*", allowedHeaders = {"Origin", "X-Requested-With", "Content-Type", "Accept"})
    @GetMapping("")
    public ResponseEntity<?> getSharedList(HttpServletRequest request) {
        String jwt = tokenAuthenticationFilter.getJwtFromRequest(request);
        if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
            //Long userId = tokenProvider.getUserIdFromToken(jwt);
            List sharedItineraryList = sharedItineraryService.fetchSharedItineraryList();
            return new ResponseEntity<>(sharedItineraryList, HttpStatus.OK);
        }
        else {
            throw new OAuth2AuthenticationProcessingException("USER NOT AUTHORIZED TO USE THIS RESOURCE");
        }

    }


    @CrossOrigin(origins = "*", allowedHeaders = {"Origin", "X-Requested-With", "Content-Type", "Accept"})
    @PostMapping("/{itineraryId}")
    public ResponseEntity<?> addSharedItinerary(HttpServletRequest request, @PathVariable("itineraryId") Integer itineraryId) {

        String jwt = tokenAuthenticationFilter.getJwtFromRequest(request);
        if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
            Long userId = tokenProvider.getUserIdFromToken(jwt);
            String userEmail = tokenProvider.getUserEmailFromToken(jwt);
            JSONObject sharedItinerary = sharedItineraryService.addItinerary(userId, itineraryId, userEmail);
            return new ResponseEntity<>(sharedItinerary, HttpStatus.CREATED);
        }
        else {
            throw new OAuth2AuthenticationProcessingException("USER NOT AUTHORIZED TO USE THIS RESOURCE");
        }
    }

    @CrossOrigin(origins = "*", allowedHeaders = {"Origin", "X-Requested-With", "Content-Type", "Accept"})
    @DeleteMapping("/{itineraryId}")
    public ResponseEntity<Map<String, Boolean>> deleteSharedItinerary(HttpServletRequest request,
                                                                @PathVariable("itineraryId") Integer itineraryId) {
        String jwt = tokenAuthenticationFilter.getJwtFromRequest(request);
        if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
            Long userId = tokenProvider.getUserIdFromToken(jwt);
            sharedItineraryService.deleteSharedListById(userId, itineraryId);
            Map<String, Boolean> map = new HashMap<>();
            map.put("success", true);
            return new ResponseEntity<>(map, HttpStatus.OK);
        }
        else {
            throw new OAuth2AuthenticationProcessingException("USER NOT AUTHORIZED TO USE THIS RESOURCE");
        }
    }


}
