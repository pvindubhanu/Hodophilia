package com.hodophilia.backend.security.services.restaurants.Impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hodophilia.backend.exceptions.ResourceNotFoundException;
import com.hodophilia.backend.models.Restaurant;
import com.hodophilia.backend.repository.RestaurantRepository;
import com.hodophilia.backend.security.services.restaurants.RestaurantService;

@Service
public class RestaurantServiceImpl implements RestaurantService{

	@Autowired
	private RestaurantRepository restaurantRepository;
	
	@Override
	public Restaurant findById(Long id) {
		return restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Restaurant not found", id)));
	}

	@Override
	public Restaurant findByName(String name) {
		
		return restaurantRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Restaurant not found", name)));
	}

}
