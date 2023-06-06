package com.hodophilia.backend.models;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
@NoArgsConstructor
@Table(name = "rooms")
@Entity
public class HotelRoom extends AbstractEntity {

    @ManyToOne
    @JoinColumn(name = "id_hotel")
    @NotNull(message = "Please choose hotel")
    @JsonIgnore
    private Hotel idHotel;

  
    @Size(max = 500, message = "Size is exceeded")
    @Column(length = 500)
    private String description;

    @NotNull(message = "Please enter room price")
    @Column(nullable = false)
    private Double price;

    private RoomType roomType;

    @NotNull(message = "Please enter number of adult")
    @Column(nullable = false)
    private Integer numOfAdult;

    @NotNull(message = "Please enter number of children")
    @Column(nullable = false)
    private Integer numOfChildren;

    @NotNull(message = "Room is available!")
    @Column(nullable = false)
    private Boolean isAvailable;
}