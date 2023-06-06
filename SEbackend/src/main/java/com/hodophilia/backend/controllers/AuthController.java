package com.hodophilia.backend.controllers;

import java.net.URI;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.validation.Errors;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.hodophilia.backend.models.Provider;
import com.hodophilia.backend.models.User;
import com.hodophilia.backend.payload.request.LoginRequest;
import com.hodophilia.backend.payload.request.SignupRequest;
import com.hodophilia.backend.payload.request.VerifyCodeRequest;
import com.hodophilia.backend.payload.response.AuthResponse;
import com.hodophilia.backend.payload.response.MessageResponse;
import com.hodophilia.backend.payload.response.SignupResponse;
import com.hodophilia.backend.repository.UserRepository;
import com.hodophilia.backend.security.TokenProvider;
import com.hodophilia.backend.security.services.CustomUserDetailsService;
import com.hodophilia.backend.security.services.TotpManager;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/auth")
public class AuthController {
	@Autowired
	AuthenticationManager authenticationManager;

	@Autowired
	UserRepository userRepository;

	@Autowired
	PasswordEncoder passwordEncoder;
	
	@Autowired
    private TokenProvider tokenProvider;

	
	@Autowired
	private TotpManager totpManager;
	
	@Autowired
	private CustomUserDetailsService customUserDetailsService;

	
	@PostMapping("/login")
	public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest, Errors errors) {

		if (errors.hasErrors()) {
			String returnString = "";
			for (ObjectError er : errors.getAllErrors()) {
				returnString += er.getDefaultMessage() + '\n';
			}
			return ResponseEntity
					.badRequest()
					.body(new MessageResponse(returnString));
		}
		
		
		if(!userRepository.existsByEmail(loginRequest.getEmail())) {
			return ResponseEntity.badRequest().body(new MessageResponse("User with email entered does not exist"));
		}
		
		
		User user = userRepository.findByEmail(loginRequest.getEmail()).get();
		
		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
		
		if(user.isMfa()) {
	           return ResponseEntity.ok().body(new MessageResponse(""));
	       }

		SecurityContextHolder.getContext().setAuthentication(authentication);
		String token = tokenProvider.createToken(authentication);

		
		return ResponseEntity.ok(new AuthResponse(token,!StringUtils.hasLength (token)));

		
	}

	@PostMapping("/signup")
	public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest, Errors errors) {

		boolean hasError = 
			userRepository.existsByEmail(signUpRequest.getEmail()) ||
			errors.hasErrors();

		if (hasError) {
			String returnString = "";

			if (userRepository.existsByEmail(signUpRequest.getEmail())) {
				return ResponseEntity.badRequest().body(new MessageResponse("User with email ID "+signUpRequest.getEmail()+" already exists"));
			}
		}


			User user = new User();
	        user.setName(signUpRequest.getName());
	        user.setEmail(signUpRequest.getEmail());
	        user.setPassword(signUpRequest.getPassword());
	        user.setProvider(Provider.LOCAL);
	        user.setSecurityQuestion1(signUpRequest.getSecurityQuestion1());
	        user.setSecurityQuestion2(signUpRequest.getSecurityQuestion2());
	        user.setMfa(signUpRequest.isMfa());
	        
	        if(user.isMfa()) {
	            user.setSecret(totpManager.generateSecret());
	        }

	        user.setPassword(passwordEncoder.encode(user.getPassword()));

	        User result = userRepository.save(user);

	        URI location = ServletUriComponentsBuilder
	                .fromCurrentContextPath().path("/user/me")
	                .buildAndExpand(result.getId()).toUri();
	        
	  
	        return ResponseEntity
	        		.created(location)
	                .body(new SignupResponse(user.isMfa(),
	                		totpManager.getUriForImage(user.getSecret())));
	}
	
	
	@PostMapping("/verify")
    public ResponseEntity<?> verifyCode(@Valid @RequestBody VerifyCodeRequest verifyCodeRequest) {
        String token = customUserDetailsService.verify(verifyCodeRequest.getEmail(), verifyCodeRequest.getCode());
        return ResponseEntity.ok(new AuthResponse(token, !StringUtils.hasLength (token)));
    }

}
