package com.hodophilia.backend.security.services;

import com.hodophilia.backend.exceptions.BadRequestException;
import com.hodophilia.backend.exceptions.ResourceNotFoundException;
import com.nimbusds.jose.shaded.json.JSONObject;

import java.util.List;

public interface SharedItineraryService {
    List fetchSharedItineraryList() throws ResourceNotFoundException;

    JSONObject addItinerary(Long UserId, Integer ItineraryId, String Email) throws BadRequestException;

    void deleteSharedListById(Long userId, Integer itineraryId) throws ResourceNotFoundException;

}
