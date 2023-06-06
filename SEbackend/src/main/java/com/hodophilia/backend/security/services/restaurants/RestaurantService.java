package com.hodophilia.backend.security.services.restaurants;

import com.hodophilia.backend.models.Restaurant;

public interface RestaurantService {
	
	Restaurant findById(Long Id);
	
	Restaurant findByName(String name);
}
