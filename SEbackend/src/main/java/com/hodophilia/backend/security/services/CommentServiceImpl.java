package com.hodophilia.backend.security.services;


import com.hodophilia.backend.exceptions.BadRequestException;
import com.hodophilia.backend.exceptions.ResourceNotFoundException;
import com.hodophilia.backend.models.Comments;
import com.hodophilia.backend.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CommentServiceImpl implements CommentService {

    @Autowired
    CommentRepository commentRepository;

    @Override
    public List fetchCommentList(Integer itineraryId) throws ResourceNotFoundException {
        return commentRepository.findCommentList(itineraryId);
    }

    @Override
    public Comments addComment(Long userId, Integer itineraryId, String commentText, String email) throws BadRequestException {
        Integer respCommentId = commentRepository.createComment(userId, itineraryId, commentText, email);
        return commentRepository.findByCommentId(userId, itineraryId, respCommentId);
    }
/*
    @Override
    public Itinerary updateItinerary(Long userId, Integer itineraryId, String itineraryName,
                                     String firstTravelDay, String startDate, String actionWithDate) throws BadRequestException {
        itineraryRepository.update(userId, itineraryId, itineraryName, firstTravelDay, startDate, actionWithDate);
        return itineraryRepository.findByItineraryId(itineraryId);
    }
*/
    @Override
    public void deleteCommentListById(Integer itineraryId) throws ResourceNotFoundException {
        //this.fetchDetailsByItineraryId(itineraryId);
        commentRepository.removeById(itineraryId);
    }


}
