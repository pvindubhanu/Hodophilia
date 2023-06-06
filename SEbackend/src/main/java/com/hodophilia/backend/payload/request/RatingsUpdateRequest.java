package com.hodophilia.backend.payload.request;

public class RatingsUpdateRequest {
	
	private String key;
	
	private String name;
	
	private String ratings;

	public String getRatings() {
		return ratings;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setRatings(String ratings) {
		this.ratings = ratings;
	}
}
