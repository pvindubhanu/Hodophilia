package com.hodophilia.backend.models;

import javax.persistence.Entity;
import javax.persistence.OneToOne;

@Entity
public class Flight extends AbstractEntity {
	private String flightNumber;
	private String operatingAirlines;
	private String dateOfDeparture;
	private Integer ticketPrice;
	
	public Integer getTicketPrice() {
		return ticketPrice;
	}

	public void setTicketPrice(Integer ticketPrice) {
		this.ticketPrice = ticketPrice;
	}

	@OneToOne
	private Location departureCityLocation;
	
	@OneToOne
	private Location arrivalCityLocation;
	

	public String getFlightNumber() {
		return flightNumber;
	}

	public void setFlightNumber(String flightNumber) {
		this.flightNumber = flightNumber;
	}

	public String getOperatingAirlines() {
		return operatingAirlines;
	}

	public void setOperatingAirlines(String operatingAirlines) {
		this.operatingAirlines = operatingAirlines;
	}

	public String getDateOfDeparture() {
		return dateOfDeparture;
	}

	public Location getDepartureCityLocation() {
		return departureCityLocation;
	}

	public void setDepartureCityLocation(Location departureCityLocation) {
		this.departureCityLocation = departureCityLocation;
	}

	public Location getArrivalCityLocation() {
		return arrivalCityLocation;
	}

	public void setArrivalCityLocation(Location arrivalCityLocation) {
		this.arrivalCityLocation = arrivalCityLocation;
	}

	public void setDateOfDeparture(String dateOfDeparture) {
		this.dateOfDeparture = dateOfDeparture;
	}

	@Override
	public String toString() {
		return "Flight [flightNumber=" + flightNumber + ", operatingAirlines=" + operatingAirlines + ", departureCity="
				+ departureCityLocation.getName() + ", arrivalCity=" + arrivalCityLocation.getName() + ", dateOfDeparture=" + dateOfDeparture
				+  "]";
	}

}