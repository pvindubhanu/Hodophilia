package com.hodophilia.backend.security.services;

import com.hodophilia.backend.exceptions.BadRequestException;
import com.hodophilia.backend.exceptions.ResourceNotFoundException;
import com.hodophilia.backend.models.Search;

import java.util.List;

public interface SearchService {
    List<String> fetchAllPlaces();

    Search fetchDetailsByPlace(String Place) throws ResourceNotFoundException;

    Search addPlace(String PlaceId, String Place, String Description, String TravelAdvice,
                    String Hotels, String ThingsToDo, String Restaurants,
                    String TravelForum, Integer Ratings) throws BadRequestException;

    Integer fetchRatingsByPlace(String Place) throws ResourceNotFoundException;

    Integer updateRatingsByPlace(String place, Integer newRatings) throws BadRequestException;

    List<Search> fetchTopPlaces();
}
