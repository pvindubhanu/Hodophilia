package com.hodophilia.backend.payload.request;

public class HotelReservationRequest {
	private Long hotelId;
	
	private Long roomId;
	
	private String checkInDate;
	
	private String checkOutDate;
	
	private Integer numOfAdult;
	
	private Integer numOfChildren;
	
	private String contactPhone;
	
	private String contactEmail;
	
	private Integer itineraryId;

	public Integer getItineraryId() {
		return itineraryId;
	}

	public void setItineraryId(Integer itineraryId) {
		this.itineraryId = itineraryId;
	}

	public Long getHotelId() {
		return hotelId;
	}

	public void setHotelId(Long hotelId) {
		this.hotelId = hotelId;
	}

	public Long getRoomId() {
		return roomId;
	}

	public void setRoomId(Long roomId) {
		this.roomId = roomId;
	}

	public String getCheckInDate() {
		return checkInDate;
	}

	public void setCheckInDate(String checkInDate) {
		this.checkInDate = checkInDate;
	}

	public String getCheckOutDate() {
		return checkOutDate;
	}

	public void setCheckOutDate(String checkOutDate) {
		this.checkOutDate = checkOutDate;
	}

	public Integer getNumOfAdult() {
		return numOfAdult;
	}

	public void setNumOfAdult(Integer numOfAdult) {
		this.numOfAdult = numOfAdult;
	}

	public Integer getNumOfChildren() {
		return numOfChildren;
	}

	public void setNumOfChildren(Integer numOfChildren) {
		this.numOfChildren = numOfChildren;
	}

	public String getContactPhone() {
		return contactPhone;
	}

	public void setContactPhone(String contactPhone) {
		this.contactPhone = contactPhone;
	}

	public String getContactEmail() {
		return contactEmail;
	}

	public void setContactEmail(String contactEmail) {
		this.contactEmail = contactEmail;
	}
}
