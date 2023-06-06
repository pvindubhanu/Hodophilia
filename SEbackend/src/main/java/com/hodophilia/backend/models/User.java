package com.hodophilia.backend.models;



import java.io.Serializable;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@Table(	name = "users", 
		uniqueConstraints = { 
			@UniqueConstraint(columnNames = "email") 
		})
public class User implements Serializable{
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	public User(User user) {
        
        this.email = user.email;
        this.password = user.password;	
        
    }
	
	public User(String email, String password) {
  
        this.password = password;
        this.email = email;
        
    }

	
	private boolean mfa;
	
    public boolean isMfa() {
		return mfa;
	}

	public void setMfa(boolean mfa) {
		this.mfa = mfa;
	}

	public String getSecret() {
		return secret;
	}

	public void setSecret(String secret) {
		this.secret = secret;
	}

	private String secret;
	
	@Email
    @Column(nullable = false)
	@Size(max = 50)
	@NotBlank
    private String email;
	

	@Column(nullable = false)
    private String name;

	
	@NotBlank
	@Size(max = 120)
	private String password;
	
	@Column(nullable = false)
    private Boolean emailVerified = false;
	

	
	private String imageUrl;
	
	private String providerId;
	
	@Column(name = "reset_password_token")
    private String resetPasswordToken;
	
	@NotBlank
	@Size(max = 20)
	private String securityQuestion1;
	
	@NotBlank
	@Size(max = 20)
	private String securityQuestion2;
	
	@OneToMany(
	        cascade = CascadeType.ALL
	)
	@JoinColumn(name = "email",referencedColumnName = "email")
	private List<Ticket> flighttickets;

	public String getResetPasswordToken() {
		return resetPasswordToken;
	}

	public void setResetPasswordToken(String resetPasswordToken) {
		this.resetPasswordToken = resetPasswordToken;
	}

	public User() {
	}


	
	public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	
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

	@Enumerated(EnumType.STRING)
    private Provider provider;
 
    public Provider getProvider() {
        return provider;
    }
 
    public void setProvider(Provider provider) {
        this.provider = provider;
    }
    
    public Boolean getEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(Boolean emailVerified) {
        this.emailVerified = emailVerified;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    
    public String getProviderId() {
        return providerId;
    }

    public void setProviderId(String providerId) {
        this.providerId = providerId;
    }

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
