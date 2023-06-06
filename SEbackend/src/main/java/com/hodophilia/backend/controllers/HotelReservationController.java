package com.hodophilia.backend.controllers;


import java.io.UnsupportedEncodingException;
import java.util.List;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.validation.Valid;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hodophilia.backend.models.HotelReservation;
import com.hodophilia.backend.payload.request.HotelReservationRequest;
import com.hodophilia.backend.security.TokenProvider;
import com.hodophilia.backend.security.services.hotels.Impl.HotelReservationService;
import com.nimbusds.jose.shaded.json.JSONObject;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@Produces(MediaType.APPLICATION_JSON)
@RequestMapping("/api/hotels/reservation")
public class HotelReservationController {
	
	private final HotelReservationService hotelReservationService;
	
	@Autowired
	private TokenProvider tokenProvider;
	
	@Autowired
    private JavaMailSender mailSender;
	
	
    @GetMapping("/{itineraryId}")
    public ResponseEntity<List<HotelReservation>> getReservationByUsername(@Param("email") String email,@PathVariable Integer itineraryId) {
        List<HotelReservation> hotelReservations = hotelReservationService.findReservationsByEmail(email,itineraryId);
        
        JSONObject obj = new JSONObject();
        obj.put("hotelReservations", hotelReservations);
        return new ResponseEntity<>(hotelReservations, HttpStatus.OK);
    }

    
    @PostMapping("/completeReservation")
	public ResponseEntity<?> completeReservation(@RequestHeader("Authorization") String token,@Valid @RequestBody HotelReservationRequest request) {
		if (request == null || request.getHotelId() == null || request.getRoomId()==null) {
			
			return new ResponseEntity<>("Invalid entry",HttpStatus.BAD_REQUEST);
		}
		
		if (tokenProvider.validateToken(token.substring(7, token.length()))) {
			String userEmail = tokenProvider.getUserEmailFromToken(token.substring(7, token.length()));

			
			HotelReservation hotelReservation = hotelReservationService.bookHotel(request,userEmail);
			
			if(hotelReservation == null)
			{
				return new ResponseEntity<>("Room not available, select another room",HttpStatus.BAD_REQUEST);
			}
			
			try {
				sendEmail(userEmail,hotelReservation);
			} catch (UnsupportedEncodingException e) {
				
				e.printStackTrace();
			} catch (MessagingException e) {
				
				e.printStackTrace();
			}
			
			JSONObject jsonObj = new JSONObject();
			jsonObj.put("hotelReservationDetails", hotelReservation);
		
			return new ResponseEntity<>(hotelReservation,HttpStatus.OK);
		}
		
		return new ResponseEntity<>("Invalid User",HttpStatus.UNAUTHORIZED);
		
	}
    
    public void sendEmail(String recipientEmail,HotelReservation reservationDetails) throws MessagingException, UnsupportedEncodingException{
		MimeMessage message = mailSender.createMimeMessage();              
	    MimeMessageHelper helper = new MimeMessageHelper(message);
	    helper.setFrom("akshaybharadwaj003@gmail.com", "Hodo Booking Support");
	    helper.setTo(recipientEmail);
	    String hotelName = reservationDetails.getHotel().getName();
	    String subject = "This is your hotel booking confirmation at "+hotelName ;
	     
	    String content = "<p>Hello,</p>"
	            + "<p>You have successfully made a booking at "+hotelName+" .</p>";

	     
	    helper.setSubject(subject);
	     
	    try {
			helper.setText(content, true);
		} catch (MessagingException e) {
			e.printStackTrace();
		}
	     
	    mailSender.send(message);
    } 
	
}
