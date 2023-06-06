package com.hodophilia.backend.repository;

import com.hodophilia.backend.exceptions.BadRequestException;
import com.hodophilia.backend.exceptions.ResourceNotFoundException;
import com.nimbusds.jose.shaded.json.JSONObject;

import java.util.List;


public interface SharedItineraryRepository {
    List findSharedItineraryList() throws ResourceNotFoundException;

    JSONObject findById(Long UserId, Integer ItineraryId) throws ResourceNotFoundException;

    Integer createItinerary(Long UserId, Integer ItineraryId, String Email) throws BadRequestException;

    void removeById(Long userId, Integer itineraryId);

}
