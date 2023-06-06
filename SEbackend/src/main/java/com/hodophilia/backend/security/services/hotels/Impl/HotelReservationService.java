package com.hodophilia.backend.security.services.hotels.Impl;

import java.util.List;

import com.hodophilia.backend.models.HotelReservation;
import com.hodophilia.backend.payload.request.HotelReservationRequest;

public interface HotelReservationService {
	public HotelReservation bookHotel(HotelReservationRequest request,String userEmail);
	
	public List<HotelReservation> findReservationsByEmail(String email,Integer itineraryId);
	
}
