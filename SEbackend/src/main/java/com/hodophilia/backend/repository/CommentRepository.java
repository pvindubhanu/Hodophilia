package com.hodophilia.backend.repository;

import com.hodophilia.backend.exceptions.BadRequestException;
import com.hodophilia.backend.exceptions.ResourceNotFoundException;
import com.hodophilia.backend.models.Comments;

import java.util.List;


public interface CommentRepository {
    List findCommentList(Integer ItineraryId) throws ResourceNotFoundException;

    Comments findByCommentId(Long UserId, Integer ItineraryId, Integer CommentId) throws ResourceNotFoundException;

    Integer createComment(Long UserId, Integer ItineraryId, String CommentText, String Email) throws BadRequestException;

    void removeById(Integer itineraryId);

}
