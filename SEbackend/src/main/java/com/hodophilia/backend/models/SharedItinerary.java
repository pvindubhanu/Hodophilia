package com.hodophilia.backend.models;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.io.Serializable;

@Entity
@Table(	name = "share_Itinerary",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "shareId")
        })

public class SharedItinerary implements Serializable {
    @Id
    //@TableGenerator(name = "id_generator", table = "itinerary", pkColumnName = "itineraryId",
     //       pkColumnValue="task_gen", initialValue=1, allocationSize=10)
    @SequenceGenerator(name = "shareSeqGen", sequenceName = "share_seq", initialValue= 1, allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "shareSeqGen")
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "shareId", nullable = false)
    private Integer shareId;

    @NotBlank
    @Size(max = 50)
    private Long createdUserId;

    @NotBlank
    @Size(max = 50)
    private Integer itineraryId;

    @Email
    @Column(nullable = false)
    @Size(max = 150)
    @NotBlank
    private String createdUserEmail;

    public SharedItinerary(Integer shareId, Long createdUserId, Integer itineraryId, String createdUserEmail) {
        this.shareId = shareId;
        this.createdUserId = createdUserId;
        this.itineraryId = itineraryId;
        this.createdUserEmail = createdUserEmail;
    }

    public Integer getShareId() {
        return shareId;
    }

    public void setShareId(Integer shareId) {
        this.shareId = shareId;
    }

    public Long getCreatedUserId() {
        return createdUserId;
    }

    public void setCreatedUserId(Long createdUserId) {
        this.createdUserId = createdUserId;
    }

    public Integer getItineraryId() {
        return itineraryId;
    }

    public void setItineraryId(Integer itineraryId) {
        this.itineraryId = itineraryId;
    }

    public String getCreatedUserEmail() {
        return createdUserEmail;
    }

    public void setCreatedUserEmail(String createdUserEmail) {
        this.createdUserEmail = createdUserEmail;
    }
}
