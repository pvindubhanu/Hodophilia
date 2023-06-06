package com.hodophilia.backend.controllers;


import java.io.UnsupportedEncodingException;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hodophilia.backend.models.Ticket;
import com.hodophilia.backend.payload.request.TicketRequest;
import com.hodophilia.backend.repository.FlightRepository;
import com.hodophilia.backend.repository.TicketRepository;
import com.hodophilia.backend.security.TokenProvider;
import com.hodophilia.backend.security.services.flights.TicketService;
import com.nimbusds.jose.shaded.json.JSONObject;


@RestController
@RequestMapping("/api/ticket")
public class TicketController {

	@Autowired
	FlightRepository flightRepository;
	
	@Autowired
	TicketService ticketService; 
	
	@Autowired
	TicketRepository ticketRepository;
	
	@Autowired
	TokenProvider tokenProvider;

	@Autowired
    private JavaMailSender mailSender;
	
	@PostMapping("/completeReservation")
	public ResponseEntity<?> completeReservation(@RequestHeader("Authorization") String token,@Valid @RequestBody TicketRequest request) {
		if (request == null || request.getFlightId() == null) {
			
             return null;
	
		}
		
		if (tokenProvider.validateToken(token.substring(7, token.length()))) {
			String userEmail = tokenProvider.getUserEmailFromToken(token.substring(7, token.length()));
			Ticket ticket = ticketService.bookFlight(request,userEmail);
			
			if (ticket == null) {
				return new ResponseEntity<>("Failed to book ticket",HttpStatus.BAD_REQUEST);
			}
			
			try {
				sendEmail(userEmail,ticket);
			} catch (UnsupportedEncodingException e) {
				
				e.printStackTrace();
			} catch (MessagingException e) {
				
				e.printStackTrace();
			}
			JSONObject jsonObj = new JSONObject();
	        jsonObj.put("ticket", ticket);
			
			return new ResponseEntity<>(ticket,HttpStatus.OK);
		}
		
		return new ResponseEntity<>("Invalid User",HttpStatus.UNAUTHORIZED);
		
	}
	
	@RequestMapping("/reservations/{id}")
	public Ticket findReservation(@PathVariable Long id) {

		
		return ticketRepository.findById(id).get();

	}
	
	public void sendEmail(String recipientEmail,Ticket ticket) throws MessagingException, UnsupportedEncodingException{
		MimeMessage message = mailSender.createMimeMessage();              
	    MimeMessageHelper helper = new MimeMessageHelper(message);
	    helper.setFrom("akshaybharadwaj003@gmail.com", "Hodo Booking Support");
	    helper.setTo(recipientEmail);
	    String flightNo = ticket.getFlight().getFlightNumber();
	    String flightAirlines = ticket.getFlight().getOperatingAirlines();
	    
	    String subject = "This is your flight booking confirmation for flight number "+flightNo ;
	     
	    String content = "<p>Hello,</p>"
	            + "<p>You have successfully made a ticket booking for flight "+flightNo+" operated by "+flightAirlines+".</p>";

	     
	    helper.setSubject(subject);
	     
	    try {
			helper.setText(content, true);
		} catch (MessagingException e) {
			e.printStackTrace();
		}
	     
	    mailSender.send(message);
    } 
	


}


