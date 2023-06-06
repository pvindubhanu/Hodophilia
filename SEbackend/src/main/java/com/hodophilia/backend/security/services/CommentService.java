package com.hodophilia.backend.security.services;

import com.hodophilia.backend.exceptions.BadRequestException;
import com.hodophilia.backend.exceptions.ResourceNotFoundException;
import com.hodophilia.backend.models.Comments;

import java.util.List;

public interface CommentService {
    List fetchCommentList(Integer ItineraryId) throws ResourceNotFoundException;

    Comments addComment(Long UserId, Integer ItineraryId, String CommentText, String Email) throws BadRequestException;

    void deleteCommentListById(Integer itineraryId) throws ResourceNotFoundException;

}
