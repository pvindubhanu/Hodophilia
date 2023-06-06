package com.hodophilia.backend.payload.request;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

public class LoginRequest {

	@NotBlank(message = "Email field cannot be blank.")
	@Email(message = "Email field must be a valid email.")
	private String email;
	
  @NotBlank(message = "Password field cannot be blank.")
	private String password;

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

}
