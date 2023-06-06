package com.hodophilia.backend.security.services.flights.Impl;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hodophilia.backend.models.Flight;
import com.hodophilia.backend.models.Passenger;
import com.hodophilia.backend.models.Ticket;
import com.hodophilia.backend.payload.request.TicketRequest;
import com.hodophilia.backend.repository.FlightRepository;
import com.hodophilia.backend.repository.PassengerRepository;
import com.hodophilia.backend.repository.TicketRepository;
import com.hodophilia.backend.repository.UserRepository;
import com.hodophilia.backend.security.services.CustomUserDetailsService;
import com.hodophilia.backend.security.services.flights.TicketService;


@Service
public class TicketServiceImpl implements TicketService {

	
	@Autowired
	FlightRepository flightRepository;
	@Autowired
	PassengerRepository passengerRepository;
	@Autowired
	TicketRepository ticketRepository;
	
	@Autowired
	CustomUserDetailsService customUserDetailsService;
	
	@Autowired
	private UserRepository userRepository;
	
	

	@Override
	@Transactional
	public Ticket bookFlight(TicketRequest request,String userEmail) {

		
		Long flightId = request.getFlightId();
		Optional<Flight> flight = flightRepository.findById(flightId);
		
		Passenger passenger = new Passenger();
		passenger.setFirstName(request.getPassengerFirstName());
		passenger.setLastName(request.getPassengerLastName());
		passenger.setEmail(request.getPassengerEmail());
		passenger.setPhone(request.getPassengerPhone());
		Passenger savedPassenger = passengerRepository.save(passenger);
		

		
		Ticket ticket = new Ticket();
		ticket.setFlight(flight.get());
		ticket.setPassenger(savedPassenger);
		ticket.setCheckedIn(false);
		ticket.setItineraryId(request.getItineraryId());
		ticket.setUser(userRepository.findByEmail(userEmail).get());
		ticket.setPrice(flight.get().getTicketPrice());
		Ticket savedTicket = ticketRepository.save(ticket);
		
		
		return savedTicket;
	}
	
	@Override
	@Transactional
	public List<Ticket> findTicketsByEmail(String email,Integer itineraryId) {
		Long userId = userRepository.findByEmail(email).get().getId();
		
		List<Ticket> flightTickets = ticketRepository.findByUserId(userId);
		
		List<Ticket> flightTicketsByItinerary = new ArrayList<Ticket>();
		
		for (int i = 0; i < flightTickets.size();i++)
		{
			if(flightTickets.get(i).getItineraryId() == itineraryId)
			{
				flightTicketsByItinerary.add(flightTickets.get(i));
			}
				
		}
		
		return flightTicketsByItinerary;
	}

}