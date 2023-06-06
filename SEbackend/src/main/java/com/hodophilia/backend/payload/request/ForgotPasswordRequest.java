package com.hodophilia.backend.payload.request;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

public class ForgotPasswordRequest {
	
	@NotBlank(message = "Email field cannot be blank.")
	@Email(message = "Email field must be a valid email.")
	private String email;
	
	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
}
