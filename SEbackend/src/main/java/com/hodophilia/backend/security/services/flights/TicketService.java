package com.hodophilia.backend.security.services.flights;

import java.util.List;

import com.hodophilia.backend.models.Ticket;
import com.hodophilia.backend.payload.request.TicketRequest;

public interface TicketService {

	public Ticket bookFlight(TicketRequest request,String userEmail);
	
	public List<Ticket> findTicketsByEmail(String email,Integer itineraryId);
}