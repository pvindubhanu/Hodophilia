package com.hodophilia.backend.payload.request;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class PasswordSecurityQuestionsRequest {
	
	
	private final int NAME_MAX = 50;
    
    
	@NotBlank(message = "Email field cannot be blank.")
	@Size(max = NAME_MAX, message="Email must be no more than " + NAME_MAX + " characters.")
    @Email(message = "Email must be a valid email")
    private String email;
	
	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	@NotBlank(message = "Cannot be blank")
	private String securityQuestion1;
	
	@NotBlank(message = "Cannot be blank")
	private String securityQuestion2;
	
	public String getSecurityQuestion1() {
		return securityQuestion1;
	}

	public void setSecurityQuestion1(String securityQuestion1) {
		this.securityQuestion1 = securityQuestion1;
	}

	public String getSecurityQuestion2() {
		return securityQuestion2;
	}

	public void setSecurityQuestion2(String securityQuestion2) {
		this.securityQuestion2 = securityQuestion2;
	}

}
