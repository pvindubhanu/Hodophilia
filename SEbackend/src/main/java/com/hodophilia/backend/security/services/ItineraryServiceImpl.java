package com.hodophilia.backend.security.services;


import com.hodophilia.backend.exceptions.BadRequestException;
import com.hodophilia.backend.exceptions.ResourceNotFoundException;
import com.hodophilia.backend.repository.ItineraryRepository;
import com.nimbusds.jose.shaded.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ItineraryServiceImpl implements ItineraryService {

    @Autowired
    ItineraryRepository itineraryRepository;

    @Override
    public List fetchItineraryList(Long userId) throws ResourceNotFoundException {
        return itineraryRepository.findItineraryList(userId);
    }

    @Override
    public JSONObject fetchDetailsByItineraryId(Integer itineraryId) throws ResourceNotFoundException {
        return itineraryRepository.findByItineraryId(itineraryId);
    }

    @Override
    public JSONObject addItinerary(Long userId, String itineraryName,
                                  String firstTravelDay, String startDate, String actionWithDate, String locationId) throws BadRequestException {
        Integer respItineraryId = itineraryRepository.createItinerary(userId, itineraryName, firstTravelDay, startDate, actionWithDate, locationId);
        return itineraryRepository.findByItineraryId(respItineraryId);
    }

    @Override
    public JSONObject updateItinerary(Long userId, Integer itineraryId, String itineraryName,
                                     String firstTravelDay, String startDate, String actionWithDate, String locationId) throws BadRequestException {
        itineraryRepository.update(userId, itineraryId, itineraryName, firstTravelDay, startDate, actionWithDate, locationId);
        return itineraryRepository.findByItineraryId(itineraryId);
    }

    @Override
    public void deleteItineraryById(Long userId, Integer itineraryId) throws ResourceNotFoundException {
        this.fetchDetailsByItineraryId(itineraryId);
        itineraryRepository.removeById(userId, itineraryId);
    }


}