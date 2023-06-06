package com.hodophilia.backend.models;



import javax.persistence.*;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
@NoArgsConstructor
@Table(name = "hotel_reservations")
@Entity
public class HotelReservation extends AbstractEntity {

    
	@ManyToOne
	@JoinColumn(name="hotel_id")
    private Hotel hotel;
	
	@OneToOne
	private HotelRoom room;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;

    @NotNull(message = "Please enter room price")
    @Column(nullable = false)
    private Double price;

    
    private String startDate;

    
    private String endDate;

    @NotNull(message = "Please enter number of adult")
    @Column(nullable = false)
    private Integer numOfAdult;

    @NotNull(message = "Please enter number of children")
    @Column(nullable = false)
    private Integer numOfChildren;

   @Pattern(regexp = "^((\\(\\d{3}\\))|\\d{3})[- .]?\\d{3}[- .]?\\d{4}$",
            message = "Please enter valid phone number")
    @Size(min = 10, max= 14, message = "Phone number should be exact 10 characters")
    @NotNull(message = "Please enter your phone number")
    @Column(nullable = false, length = 14)
    private String contactPhone;

    @Email(message = "Please enter valid email")
    @NotNull(message = "Please enter your email")
    @Size(min = 5, max = 254)
    @Column(nullable = false, length = 254)
    private String contactEmail;
    
    private Integer itineraryId;

}