package com.hodophilia.backend.controllers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hodophilia.backend.models.HotelReservation;
import com.hodophilia.backend.models.Location;
import com.hodophilia.backend.models.Ticket;
import com.hodophilia.backend.payload.response.BookingDetailsResponse;
import com.hodophilia.backend.repository.HotelRepository;
import com.hodophilia.backend.repository.LocationRepository;
import com.hodophilia.backend.security.TokenProvider;
import com.hodophilia.backend.security.services.flights.TicketService;
import com.hodophilia.backend.security.services.hotels.Impl.HotelReservationService;
import com.nimbusds.jose.shaded.json.JSONObject;

@RestController
@RequestMapping("/api/bookingDetails/")
public class BookingDetailsController {
	
	@Autowired
	private TokenProvider tokenProvider;
	
	@Autowired
	HotelReservationService hotelReservationService;
	
	@Autowired
	TicketService ticketService; 
	
	@Autowired
	LocationRepository locationRepository;
	
	@Autowired
	HotelRepository hotelRepository;
	
	@GetMapping("/{itineraryId}")
	public ResponseEntity<?> getBookingDetails(@RequestHeader("Authorization") String token,@PathVariable("itineraryId") Integer itineraryId ) {
	
		String userEmail = ""; 
		if (tokenProvider.validateToken(token.substring(7, token.length()))) {
			userEmail = tokenProvider.getUserEmailFromToken(token.substring(7, token.length()));
		}
		
		else
		{
			return new ResponseEntity<>("Unauthorized user",HttpStatus.UNAUTHORIZED);
		}
		
		List<HotelReservation> hotelReservations = hotelReservationService.findReservationsByEmail(userEmail,itineraryId);
		
		List<Ticket> flightTickets = ticketService.findTicketsByEmail(userEmail,itineraryId);
		
		BookingDetailsResponse bookingDetailsResponse = new BookingDetailsResponse(hotelReservations,flightTickets);
		
		if (hotelReservations!=null && flightTickets!=null ) {
			JSONObject obj = new JSONObject();
	        obj.put("bookingDetails", bookingDetailsResponse);
	        return new ResponseEntity<>(bookingDetailsResponse, HttpStatus.OK);
		}
		
		return new ResponseEntity<>("Error retrieving details",HttpStatus.BAD_REQUEST);
	}
	
	@GetMapping("/location")
	public ResponseEntity<?> getBookingDetailsByLocation(@RequestHeader("Authorization") String token,@Param("locationName") String locationName,@Param("itineraryId") Integer itineraryId)
	{
		String userEmail = ""; 
		if (tokenProvider.validateToken(token.substring(7, token.length()))) {
			userEmail = tokenProvider.getUserEmailFromToken(token.substring(7, token.length()));
		}
		else
		{
			return new ResponseEntity<>("Unauthorized user",HttpStatus.UNAUTHORIZED);
		}
		
		Location location = locationRepository.findByName(locationName).get();
				
		List<HotelReservation> hotelReservations = hotelReservationService.findReservationsByEmail(userEmail,itineraryId);
		
		List<HotelReservation> hotelReservationsByLocation = new ArrayList<HotelReservation>();
		
		for(int i=0; i < hotelReservations.size(); i ++)
		{
			Long hotelLocationId = hotelReservations.get(i).getHotel().getLocation().getId();
			
			if(hotelLocationId == location.getId()) {
				hotelReservationsByLocation.add(hotelReservations.get(i));
			}
		}
		
		List<Ticket> flightTicketsByLocation = new ArrayList<Ticket>();
		
		List<Ticket> flightTickets = ticketService.findTicketsByEmail(userEmail,itineraryId);
		
		for(int i=0; i < flightTickets.size(); i ++)
		{
			Long departureFlightLocationId = flightTickets.get(i).getFlight().getDepartureCityLocation().getId();
			
			Long arrivalFlightLocationId = flightTickets.get(i).getFlight().getArrivalCityLocation().getId();
			
			if(departureFlightLocationId == location.getId() || arrivalFlightLocationId == location.getId()) {
				flightTicketsByLocation.add(flightTickets.get(i));
			}
		}
		
		
		BookingDetailsResponse bookingDetailsResponse = new BookingDetailsResponse(hotelReservationsByLocation,flightTicketsByLocation);

		JSONObject obj = new JSONObject();
        obj.put("bookingDetailsByLocation", bookingDetailsResponse);
        return new ResponseEntity<>(bookingDetailsResponse, HttpStatus.OK);
		
	}
}
