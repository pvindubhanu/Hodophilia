package com.hodophilia.backend.payload.request;

import lombok.Data;

@Data
public class VerifyCodeRequest {
	
    private String email;
    private String code;
    
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
}
