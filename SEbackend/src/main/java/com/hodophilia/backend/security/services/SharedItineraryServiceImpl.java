package com.hodophilia.backend.security.services;


import com.hodophilia.backend.exceptions.BadRequestException;
import com.hodophilia.backend.exceptions.ResourceNotFoundException;
import com.hodophilia.backend.repository.SharedItineraryRepository;
import com.nimbusds.jose.shaded.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SharedItineraryServiceImpl implements SharedItineraryService {

    @Autowired
    SharedItineraryRepository sharedItineraryRepository;

    @Override
    public List fetchSharedItineraryList() throws ResourceNotFoundException {
        return sharedItineraryRepository.findSharedItineraryList();
    }

    @Override
    public JSONObject addItinerary(Long userId, Integer itineraryId, String email) throws BadRequestException {
        Integer respItineraryId = sharedItineraryRepository.createItinerary(userId, itineraryId, email);
        return sharedItineraryRepository.findById(userId, respItineraryId);
    }

    @Override
    public void deleteSharedListById(Long userId, Integer itineraryId) throws ResourceNotFoundException {
        sharedItineraryRepository.removeById(userId, itineraryId);
    }


}
