package com.hodophilia.backend.repository;

import com.hodophilia.backend.exceptions.BadRequestException;
import com.hodophilia.backend.exceptions.ResourceNotFoundException;
import com.hodophilia.backend.models.Search;

import java.util.List;


public interface SearchRepository{
    List<String> findAll() throws ResourceNotFoundException;

    Search findByPlace(String Place) throws ResourceNotFoundException;

    String create(String PlaceId, String Place, String Description, String TravelAdvice,
                  String Hotels, String ThingsToDo, String Restaurants,
                  String TravelForum, Integer Ratings) throws BadRequestException;

    Integer findRatingsByPlace(String Place) throws ResourceNotFoundException;

    void changeRatingsByPlace(String place, Integer newRatings) throws BadRequestException;

    List<String> findTopPlaces() throws ResourceNotFoundException;
}
