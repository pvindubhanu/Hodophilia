package com.hodophilia.backend.payload.response;

import com.hodophilia.backend.models.GeoPoint;

import lombok.Data;

@Data
public class HotelResponse {
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public GeoPoint getLocation() {
		return location;
	}

	public void setLocation(GeoPoint location) {
		this.location = location;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	private String name;
	
	private GeoPoint location;
	
	private String image;

	public HotelResponse(String name, GeoPoint location, String image) {
		super();
		this.name = name;
		this.location = location;
		this.image = image;
	}
}
