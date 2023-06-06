package com.hodophilia.backend.security.services;


import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hodophilia.backend.exceptions.BadRequestException;
import com.hodophilia.backend.exceptions.ResourceNotFoundException;
import com.hodophilia.backend.models.Search;
import com.hodophilia.backend.repository.SearchRepository;

@Service
@Transactional
public class SearchServiceImpl implements SearchService {

    @Autowired
    SearchRepository searchRepository;

    @Override
    public List<String> fetchAllPlaces() {
        return searchRepository.findAll();
    }

    @Override
    public List<Search> fetchTopPlaces() {
    	
    	List<String> places = searchRepository.findTopPlaces();
    	
    	List<Search> topPlaces = new ArrayList<Search>();
    	
    	for (int i = 0; i < places.size(); i++ )
    	{
    		topPlaces.add(searchRepository.findByPlace(places.get(i)));
    	}

        return topPlaces;
    }

    @Override
    public Search fetchDetailsByPlace(String place) throws ResourceNotFoundException {
        return searchRepository.findByPlace(place);
    }

    @Override
    public Search addPlace(String placeId, String place, String description, String travelAdvice,
                           String hotels, String thingsToDo, String restaurants,
                           String travelForum, Integer ratings) throws BadRequestException {
        String responsePlace = searchRepository.create(placeId, place, description, travelAdvice, hotels, thingsToDo, restaurants, travelForum, ratings);
        return searchRepository.findByPlace(responsePlace);
    }

    @Override
    public Integer fetchRatingsByPlace(String place) throws ResourceNotFoundException {

        return searchRepository.findRatingsByPlace(place);
    }

    @Override
    public Integer updateRatingsByPlace(String place, Integer newRatings) throws BadRequestException {

        searchRepository.changeRatingsByPlace(place, newRatings);
        return searchRepository.findRatingsByPlace(place);
    }


}
