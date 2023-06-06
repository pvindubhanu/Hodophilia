package com.hodophilia.backend.payload.request;


import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class SignupRequest {
	

    private final int NAME_MAX = 50;
    private final int PASS_MIN = 6;
    private final int PASS_MAX = 40;

	@NotBlank(message = "Email field cannot be blank.")
	@Size(max = NAME_MAX, message="Email must be no more than " + NAME_MAX + " characters.")
    @Email(message = "Email must be a valid email")
    private String email;
 
	@NotBlank
	@Size(max = NAME_MAX, message="Name must be no more than " + NAME_MAX + " characters.")
    private String name;
	
	@NotBlank
	@Size(max = 20)
	private String securityQuestion1;
	
	@NotBlank
	@Size(max = 20)
	private String securityQuestion2;
	
	private boolean mfa;
    
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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}


    @NotBlank(message = "Password field cannot be blank.")
    @Size(min = PASS_MIN, max = PASS_MAX, message = "Password must be between " + PASS_MIN + " and " + PASS_MAX
            + " characters.")
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

	public boolean isMfa() {
		return mfa;
	}

	public void setMfa(boolean mfa) {
		this.mfa = mfa;
	}
    
}
