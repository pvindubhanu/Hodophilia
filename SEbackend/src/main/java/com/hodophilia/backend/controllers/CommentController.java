package com.hodophilia.backend.controllers;

import com.hodophilia.backend.exceptions.OAuth2AuthenticationProcessingException;
import com.hodophilia.backend.models.Comments;
import com.hodophilia.backend.security.TokenAuthenticationFilter;
import com.hodophilia.backend.security.TokenProvider;
import com.hodophilia.backend.security.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class CommentController {

    @Autowired
    private TokenProvider tokenProvider;

    @Autowired
    private TokenAuthenticationFilter tokenAuthenticationFilter;

    @Autowired
    CommentService commentService;

    @CrossOrigin(origins = "*", allowedHeaders = {"Origin", "X-Requested-With", "Content-Type", "Accept"})
    @GetMapping("/{itineraryId}/comments")
    public ResponseEntity<?> getCommentList(HttpServletRequest request,
                                            @PathVariable("itineraryId") Integer itineraryId) {
        String jwt = tokenAuthenticationFilter.getJwtFromRequest(request);
        if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
            Long userId = tokenProvider.getUserIdFromToken(jwt);
            List commentList = commentService.fetchCommentList(itineraryId);
            return new ResponseEntity<>(commentList, HttpStatus.OK);
        }
        else {
            throw new OAuth2AuthenticationProcessingException("USER NOT AUTHORIZED TO USE THIS RESOURCE");
        }

    }


    @CrossOrigin(origins = "*", allowedHeaders = {"Origin", "X-Requested-With", "Content-Type", "Accept"})
    @PostMapping("/{itineraryId}/comments")
    public ResponseEntity<Comments> addComment(HttpServletRequest request, @PathVariable("itineraryId") Integer itineraryId,
                                                 @RequestBody Map<String, Object> commentMap) {

        String jwt = tokenAuthenticationFilter.getJwtFromRequest(request);
        if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
            Long userId = tokenProvider.getUserIdFromToken(jwt);
            String userEmail = tokenProvider.getUserEmailFromToken(jwt);
            String commentText = (String) commentMap.get("commentText");
            Comments comments = commentService.addComment(userId, itineraryId, commentText, userEmail);
            return new ResponseEntity<>(comments, HttpStatus.CREATED);
        }
        else {
            throw new OAuth2AuthenticationProcessingException("USER NOT AUTHORIZED TO USE THIS RESOURCE");
        }
    }
/*
    @CrossOrigin(origins = "*", allowedHeaders = {"Origin", "X-Requested-With", "Content-Type", "Accept"})
    @PutMapping("/{itineraryId}")
    public ResponseEntity<Itinerary> updateItinerary(HttpServletRequest request, @PathVariable("itineraryId") Integer itineraryId,
                                                     @RequestBody Map<String, Object> itineraryMap) {
        String jwt = tokenAuthenticationFilter.getJwtFromRequest(request);
        if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
            Long userId = tokenProvider.getUserIdFromToken(jwt);
            String itineraryName = (String) itineraryMap.get("itineraryName");
            String firstTravelDay = (String) itineraryMap.get("firstTravelDay");
            String startDate = (String) itineraryMap.get("startDate");
            String actionWithDate = (String) itineraryMap.get("actionWithDate");
            Itinerary itineraryRes = itineraryService.updateItinerary(userId, itineraryId, itineraryName, firstTravelDay, startDate, actionWithDate);
            return new ResponseEntity<>(itineraryRes, HttpStatus.OK);
        }
        else {
            throw new OAuth2AuthenticationProcessingException("USER NOT AUTHORIZED TO USE THIS RESOURCE");
        }
    }

*/
    @CrossOrigin(origins = "*", allowedHeaders = {"Origin", "X-Requested-With", "Content-Type", "Accept"})
    @DeleteMapping("/{itineraryId}/comments")
    public ResponseEntity<Map<String, Boolean>> deleteComments(HttpServletRequest request,
                                                                @PathVariable("itineraryId") Integer itineraryId) {
        String jwt = tokenAuthenticationFilter.getJwtFromRequest(request);
        if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
            Long userId = tokenProvider.getUserIdFromToken(jwt);
            commentService.deleteCommentListById(itineraryId);
            Map<String, Boolean> map = new HashMap<>();
            map.put("success", true);
            return new ResponseEntity<>(map, HttpStatus.OK);
        }
        else {
            throw new OAuth2AuthenticationProcessingException("USER NOT AUTHORIZED TO USE THIS RESOURCE");
        }
    }


}
