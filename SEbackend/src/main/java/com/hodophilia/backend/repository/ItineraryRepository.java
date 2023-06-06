package com.hodophilia.backend.repository;

import com.hodophilia.backend.exceptions.BadRequestException;
import com.hodophilia.backend.exceptions.ResourceNotFoundException;
import com.nimbusds.jose.shaded.json.JSONObject;

import java.util.List;


public interface ItineraryRepository {
    List findItineraryList(Long UserId) throws ResourceNotFoundException;

    JSONObject findByItineraryId(Integer ItineraryId) throws ResourceNotFoundException;

    JSONObject findByLocationId(Integer locationId) throws ResourceNotFoundException;

    Integer createItinerary(Long UserId, String ItineraryName,
                            String FirstTravelDay, String StartDate, String ActionWithDate, String LocationId) throws BadRequestException;

    void update(Long userId, Integer itineraryId, String ItineraryName,
                String FirstTravelDay, String StartDate, String ActionWithDate, String LocationId) throws BadRequestException;

    void removeById(Long userId, Integer itineraryId);

}