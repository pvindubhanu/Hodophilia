package com.hodophilia.backend.payload.response;

import java.util.List;

import com.hodophilia.backend.models.HotelReservation;
import com.hodophilia.backend.models.Ticket;

import lombok.Data;

@Data
public class BookingDetailsResponse {
	
	List<HotelReservation> hotelReservations;
	
	List<Ticket> flightTickets;
	
	public List<HotelReservation> getHotelReservations() {
		return hotelReservations;
	}

	public void setHotelReservations(List<HotelReservation> hotelReservations) {
		this.hotelReservations = hotelReservations;
	}

	public List<Ticket> getFlightTickets() {
		return flightTickets;
	}

	public void setFlightTickets(List<Ticket> flightTickets) {
		this.flightTickets = flightTickets;
	}

	public BookingDetailsResponse(List<HotelReservation> hotelReservations, List<Ticket> flightTickets) {
		super();
		this.hotelReservations = hotelReservations;
		this.flightTickets = flightTickets;
	}

	
}
