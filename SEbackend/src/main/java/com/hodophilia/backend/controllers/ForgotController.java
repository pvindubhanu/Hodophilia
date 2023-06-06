package com.hodophilia.backend.controllers;
import java.io.UnsupportedEncodingException;
import java.util.Optional;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hodophilia.backend.models.User;
import com.hodophilia.backend.payload.request.ForgotPasswordRequest;
import com.hodophilia.backend.payload.request.PasswordSecurityQuestionsRequest;
import com.hodophilia.backend.payload.request.ResetPasswordRequest;
import com.hodophilia.backend.payload.response.ApiResponse;
import com.hodophilia.backend.payload.response.MessageResponse;
import com.hodophilia.backend.repository.UserRepository;
import com.hodophilia.backend.security.services.CustomUserDetailsService;

import net.bytebuddy.utility.RandomString;

@RestController
@RequestMapping("/auth")
public class ForgotController {
	
	@Autowired
    private JavaMailSender mailSender;
	
	@Autowired
    private CustomUserDetailsService customUserDetailsService;
	
	@Autowired
	private UserRepository userRepository;
	
	@CrossOrigin(origins = "*", allowedHeaders = { "Origin", "X-Requested-With", "Content-Type", "Accept" })
	@PostMapping("/forgot_password")
    public ResponseEntity<?> processForgotPassword(@Valid @RequestBody ForgotPasswordRequest forgotPasswordRequest) {
		
		String email = forgotPasswordRequest.getEmail();
		String token = RandomString.make(30);
		
		try {
		customUserDetailsService.updateResetPasswordToken(token, email);
		
		String resetPasswordLink  = "http://localhost:3000/auth/reset_password?token=" +token;
		sendEmail(email, resetPasswordLink);
		} catch(UsernameNotFoundException ex) {
			
			return ResponseEntity
					.badRequest()
					.body(new MessageResponse("User not found with email : " + email));
					
		}catch (UnsupportedEncodingException | MessagingException e) {
			
		}
	    return ResponseEntity
				.ok()
				.body(new MessageResponse("Password reset mail sent successfully"));
    }
	
	public void sendEmail(String recipientEmail, String link) throws MessagingException, UnsupportedEncodingException{
		MimeMessage message = mailSender.createMimeMessage();              
	    MimeMessageHelper helper = new MimeMessageHelper(message);
	    helper.setFrom("akshaybharadwaj003@gmail.com", "Hodo Support");
	    helper.setTo(recipientEmail);
	    String subject = "Here's the link to reset your password";
	     
	    String content = "<p>Hello,</p>"
	            + "<p>You have requested to reset your password.</p>"
	            + "<p>Click the link below to change your password:</p>"
	            + "<p><a href=\"" + link + "\">Change my password</a></p>"
	            + "<br>"
	            + "<p>Ignore this email if you do remember your password, "
	            + "or you have not made the request.</p>";
	     
	    helper.setSubject(subject);
	     
	    helper.setText(content, true);
	     
	    mailSender.send(message);
    } 
	
	@GetMapping("/reset_password")
    public String showResetPasswordForm() {
		
		return "";
    }
	
	@CrossOrigin(origins = "*", allowedHeaders = { "Origin", "X-Requested-With", "Content-Type", "Accept" })
	@PostMapping("/reset_password")
    public ResponseEntity<?> processResetPassword(@Valid @RequestBody ResetPasswordRequest resetPasswordRequest) {
		
		String token = resetPasswordRequest.getToken();
		String password = resetPasswordRequest.getPassword();
		
		Optional<User> user = customUserDetailsService.getByResetPasswordToken(token);
		
		if(user == null) {
			return ResponseEntity
					.badRequest()
					.body(new MessageResponse("Invalid Token"));
		}
		else {
			customUserDetailsService.updatePassword(user, password);
		}
		
		return ResponseEntity
				.ok()
				.body(new MessageResponse("Password updated successfully"));
    }
	
	@CrossOrigin(origins = "*", allowedHeaders = { "Origin", "X-Requested-With", "Content-Type", "Accept" })
	@PostMapping("/forgot_password_questions")
    public ResponseEntity<?> processForgotPasswordWithSecurityQuestions(@Valid @RequestBody PasswordSecurityQuestionsRequest passwordSecurityQuestionRequest) {
		
		String email = passwordSecurityQuestionRequest.getEmail();
		
		String securityQuestion1 = passwordSecurityQuestionRequest.getSecurityQuestion1();
		
		String securityQuestion2 = passwordSecurityQuestionRequest.getSecurityQuestion2();
		
		if(!userRepository.existsByEmail(email)) {
			return ResponseEntity.badRequest().body(new MessageResponse("User with email "+email+" does not exist"));
		}
		
		String token = RandomString.make(30);
		
		try {
			customUserDetailsService.updateResetPasswordToken(token, email);
			
		}catch(UsernameNotFoundException ex) {
			
			return ResponseEntity
					.badRequest()
					.body(new MessageResponse("User not found with email : " + email));
					
		}
		
		Optional<User> user = userRepository.findByEmail(email);
		
		if ( !(user.get().getSecurityQuestion1().equals(securityQuestion1) && user.get().getSecurityQuestion2().equals(securityQuestion2))) {
			return ResponseEntity.badRequest().body(new MessageResponse("Security questions incorrect"));
		}
		
		return ResponseEntity.ok().body(new ApiResponse(true,token));
		
		
		
	
	}
	
	@CrossOrigin(origins = "*", allowedHeaders = { "Origin", "X-Requested-With", "Content-Type", "Accept" })
	@PostMapping("/reset_password_questions")
    public ResponseEntity<?> processResetPasswordWithSecurityQuestions(@Valid @RequestBody ResetPasswordRequest resetPasswordRequest) {
		
		String token = resetPasswordRequest.getToken();
		String password = resetPasswordRequest.getPassword();
		
		Optional<User> user = customUserDetailsService.getByResetPasswordToken(token);
		
		if(user == null) {
			return ResponseEntity
					.badRequest()
					.body(new MessageResponse("Invalid Token"));
		}
		else {
			customUserDetailsService.updatePassword(user, password);
		}
		
		return ResponseEntity
				.ok()
				.body(new MessageResponse("Password updated successfully"));
		
	}
}

