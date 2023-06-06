package com.hodophilia.backend.security.services.hotels.Impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hodophilia.backend.models.Hotel;
import com.hodophilia.backend.models.HotelReservation;
import com.hodophilia.backend.models.HotelRoom;
import com.hodophilia.backend.payload.request.HotelReservationRequest;
import com.hodophilia.backend.repository.HotelRepository;
import com.hodophilia.backend.repository.HotelReservationRepository;
import com.hodophilia.backend.repository.HotelRoomRepository;
import com.hodophilia.backend.repository.UserRepository;

@Service
public class HotelReservationServiceImpl implements HotelReservationService{
	
	@Autowired
	HotelRepository hotelRepository;

	@Autowired
	HotelRoomRepository hotelRoomRepository;
	
	@Autowired
	HotelReservationRepository hotelReservationRepository;
	
	@Autowired
	private UserRepository userRepository;
	
	public List<HotelReservation> findReservationsByEmail(String email,Integer itineraryId) 
	{
		Long userId = userRepository.findByEmail(email).get().getId();
		
		List<HotelReservation> hotelReservations = hotelReservationRepository.findByUserId(userId);
		
		List<HotelReservation> hotelReservationsByItinerary = new ArrayList<HotelReservation>();
		
		for (int i = 0; i < hotelReservations.size(); i++)
		{
			if(hotelReservations.get(i).getItineraryId() == itineraryId) {
				hotelReservationsByItinerary.add(hotelReservations.get(i));
			}
		}
		
		return hotelReservationsByItinerary;
	}
	
	
	@Override
	@Transactional
	public HotelReservation bookHotel(HotelReservationRequest request,String userEmail) {
		
		Long hotelId = request.getHotelId();
		
		Optional<Hotel> hotel = hotelRepository.findById(hotelId);
		
		Long roomId = request.getRoomId();
		
		Optional<HotelRoom> hotelRoom = hotelRoomRepository.findById(roomId);
		
		if(hotelRoom.get().getIsAvailable()) { 
		
		HotelReservation hotelReservation = new HotelReservation();
		
		hotelReservation.setContactEmail(request.getContactEmail());
		
		hotelReservation.setContactPhone(request.getContactPhone());
		
		hotelReservation.setStartDate(request.getCheckInDate());
		
		hotelReservation.setEndDate(request.getCheckOutDate());
		
		hotelReservation.setNumOfAdult(request.getNumOfAdult());
		
		hotelReservation.setNumOfChildren(request.getNumOfChildren());
		
		hotelReservation.setHotel(hotel.get());
		
		hotelReservation.setRoom(hotelRoom.get());
		
		hotelReservation.setPrice(hotelRoom.get().getPrice());
		
		hotelReservation.setUser(userRepository.findByEmail(userEmail).get());
		
		hotelReservation.setItineraryId(request.getItineraryId());
		
		hotelReservationRepository.save(hotelReservation);
		
		hotelRoom.get().setIsAvailable(false);
		
		return hotelReservation;
		
		}
		
		return null;
		
	}
}
