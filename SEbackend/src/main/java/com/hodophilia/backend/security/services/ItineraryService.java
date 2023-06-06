package com.hodophilia.backend.security.services;

import com.hodophilia.backend.exceptions.BadRequestException;
import com.hodophilia.backend.exceptions.ResourceNotFoundException;
import com.nimbusds.jose.shaded.json.JSONObject;

import java.util.List;

public interface ItineraryService {
    List fetchItineraryList(Long UserId) throws ResourceNotFoundException;

    JSONObject fetchDetailsByItineraryId(Integer ItineraryId) throws ResourceNotFoundException;

    JSONObject addItinerary(Long UserId, String ItineraryName,
                           String FirstTravelDay, String StartDate, String ActionWithDate, String LocationId) throws BadRequestException;

    JSONObject updateItinerary(Long UserId, Integer ItineraryId, String ItineraryName,
                              String FirstTravelDay, String StartDate, String ActionWithDate, String LocationId) throws BadRequestException;

    void deleteItineraryById(Long userId, Integer itineraryId) throws ResourceNotFoundException;

}