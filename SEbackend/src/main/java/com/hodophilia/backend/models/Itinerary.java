package com.hodophilia.backend.models;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.io.Serializable;

@Entity
@Table(	name = "itinerary",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "itineraryId")
        })

public class Itinerary implements Serializable {
    @Id
    //@TableGenerator(name = "id_generator", table = "itinerary", pkColumnName = "itineraryId",
     //       pkColumnValue="task_gen", initialValue=1, allocationSize=10)
    @SequenceGenerator(name = "itinerarySeqGen", sequenceName = "itinerary_seq", initialValue= 1, allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "itinerarySeqGen")
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "itineraryId", nullable = false)
    private Integer itineraryId;

    @NotBlank
    @Size(max = 50)
    private Long userId;

    @NotBlank
    @Size(max = 150)
    private String itineraryName;

    @NotBlank
    @Size(max = 150)
    private String firstTravelDay;

    @NotBlank
    private String startDate;

    @NotBlank
    @Size(max = 1000)
    private String actionWithDate;

    @NotBlank
    @Size(max = 500)
//    @Column
//    @ElementCollection(targetClass=String.class)
    private String locationId;

    public Itinerary(Integer itineraryId, Long userId, String itineraryName, String firstTravelDay,
                     String startDate, String actionWithDate, String locationId) {
        this.userId = userId;
        this.itineraryId = itineraryId;
        this.itineraryName = itineraryName;
        this.firstTravelDay = firstTravelDay;
        this.startDate = startDate;
        this.actionWithDate = actionWithDate;
        this.locationId = locationId;
    }

    public Integer getItineraryId() {
        return itineraryId;
    }

    public void setItineraryId(Integer itineraryId) {
        this.itineraryId = itineraryId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getItineraryName() {
        return itineraryName;
    }

    public void setItineraryName(String itineraryName) {
        this.itineraryName = itineraryName;
    }

    public String getFirstTravelDay() {
        return firstTravelDay;
    }

    public void setFirstTravelDay(String firstTravelDay) {
        this.firstTravelDay = firstTravelDay;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getActionWithDate() {
        return actionWithDate;
    }

    public void setActionWithDate(String actionWithDate) {
        this.actionWithDate = actionWithDate;
    }

    public String getLocationId() {
        return locationId;
    }

    public void setLocationId(String locationId) {
        this.locationId = locationId;
    }
}