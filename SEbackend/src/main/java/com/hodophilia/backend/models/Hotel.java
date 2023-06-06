package com.hodophilia.backend.models;


import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
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
@Entity
@Table(name = "hotels")
public class Hotel extends AbstractEntity {

	@NotNull
    private String name;

    @Column(nullable = false)
    private int stars;

    @Size(max = 250, message = "Size is exceeded")
    @NotNull(message = "Please enter hotel address")
    @Column(nullable = false, length = 250)
    private String address;

    @Pattern(regexp = "^((\\(\\d{3}\\))|\\d{3})[- .]?\\d{3}[- .]?\\d{4}$",
            message = "Please enter valid phone number")
    @Size(min = 10, max= 14, message = "Phone number should be exact 10 characters")
    @NotNull(message = "Please enter hotel phone number")
    @Column(nullable = false, length = 14)
    private String phone;

    @Email(message = "Please enter valid email")
    @Size(min = 5, max = 254)
    @NotNull(message = "Please enter hotel email")
    @Column(nullable = false, length = 254)
    private String email;
    
    @OneToOne
    private Location location;
   
    @OneToMany(mappedBy="idHotel")
    private List<HotelRoom> rooms;
    
    @OneToOne
    private GeoPoint geoPoint;
    
    @OneToOne
    private Image image;
    
    private Double ratings;
    
    public Hotel(String name, String address, String phone, String email,Location location,GeoPoint geoPoint,Image image) {
        this.name = name;
        this.address = address;
        this.phone = phone;
        this.email = email;
        this.location = location;
        this.image = image;
        this.geoPoint = geoPoint;
    }
    
    
}

