package com.hodophilia.backend.models;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.io.Serializable;

@Entity
@Table(	name = "comments",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "commentId")
        })

public class Comments implements Serializable {
    @Id
    //@TableGenerator(name = "id_generator", table = "itinerary", pkColumnName = "itineraryId",
     //       pkColumnValue="task_gen", initialValue=1, allocationSize=10)
    @SequenceGenerator(name = "commentSeqGen", sequenceName = "comment_seq", initialValue= 1, allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "commentSeqGen")
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "commentId", nullable = false)
    private Integer commentId;

    @NotBlank
    @Size(max = 500)
    private String commentText;

    @NotBlank
    @Size(max = 50)
    private Long userId;

    @NotBlank
    @Size(max = 50)
    private Integer itineraryId;

    @Email
    @Column(nullable = false)
    @Size(max = 150)
    @NotBlank
    private String userEmail;

    public Comments(Integer commentId, String commentText, Long userId, Integer itineraryId, String userEmail) {
        this.commentId = commentId;
        this.commentText = commentText;
        this.userId = userId;
        this.itineraryId = itineraryId;
        this.userEmail = userEmail;
    }

    public Integer getCommentId() {
        return commentId;
    }

    public void setCommentId(Integer commentId) {
        this.commentId = commentId;
    }

    public String getCommentText() {
        return commentText;
    }

    public void setCommentText(String commentText) {
        this.commentText = commentText;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Integer getItineraryId() {
        return itineraryId;
    }

    public void setItineraryId(Integer itineraryId) {
        this.itineraryId = itineraryId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }
}
