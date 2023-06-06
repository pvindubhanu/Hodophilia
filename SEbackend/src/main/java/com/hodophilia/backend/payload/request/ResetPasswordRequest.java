package com.hodophilia.backend.payload.request;

import javax.validation.constraints.NotBlank;

public class ResetPasswordRequest {
	
	@NotBlank(message = "Password field cannot be blank.")
	private String password;
	
	private String token;

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}
}
