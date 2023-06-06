package com.hodophilia.backend.repository;

import com.hodophilia.backend.exceptions.BadRequestException;
import com.hodophilia.backend.exceptions.ResourceNotFoundException;
import com.hodophilia.backend.models.Comments;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class CommentRepositoryImpl implements CommentRepository {

    private static final String SQL_FIND_COMMENT_LIST = "SELECT COMMENT_ID, COMMENT_TEXT, USER_ID, ITINERARY_ID, " +
            "USER_EMAIL FROM COMMENTS WHERE ITINERARY_ID = ?";

    private static final String SQL_FIND_BY_COMMENT_ID = "SELECT COMMENT_ID, COMMENT_TEXT, USER_ID, ITINERARY_ID, " +
            "USER_EMAIL FROM COMMENTS WHERE USER_ID = ? AND ITINERARY_ID = ? AND COMMENT_ID = ?";

    private static final String SQL_CREATE_COMMENT = "INSERT INTO COMMENTS (COMMENT_ID, COMMENT_TEXT, USER_ID, " +
            "ITINERARY_ID, USER_EMAIL) " +
            "VALUES(nextval('comment_seq'), ?, ?, ?, ?)";

    private static final String SQL_DELETE_COMMENT = "DELETE FROM COMMENTS WHERE ITINERARY_ID = ?";

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Override
    public List<Comments> findCommentList(Integer ItineraryId) throws ResourceNotFoundException {

        try {
            return jdbcTemplate.query(SQL_FIND_COMMENT_LIST, commentRowMapper, new Object[]{ItineraryId});
        }catch (Exception e) {
            throw new ResourceNotFoundException("Itinerary not found");
        }
    }

    @Override
    public Comments findByCommentId(Long UserId, Integer ItineraryId, Integer CommentId) throws ResourceNotFoundException {
        try {
            return jdbcTemplate.queryForObject(SQL_FIND_BY_COMMENT_ID, commentRowMapper, new Object[]{UserId, ItineraryId, CommentId});
        }catch (Exception e) {
            throw new ResourceNotFoundException("Itinerary not found");
        }
    }

    @Override
    public Integer createComment(Long UserId, Integer ItineraryId, String CommentText, String Email) throws BadRequestException {
        try {
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(SQL_CREATE_COMMENT, Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, CommentText);
                ps.setLong(2, UserId);
                ps.setInt(3, ItineraryId);
                ps.setString(4, Email);
                System.out.println("PS:"+ps);
                return ps;
            }, keyHolder);
            return (Integer) keyHolder.getKeys().get("COMMENT_ID");
        }catch (Exception e) {
            throw new BadRequestException("Invalid request");
        }
    }

    @Override
    public void removeById(Integer itineraryId) {
        jdbcTemplate.update(SQL_DELETE_COMMENT, new Object[]{itineraryId});
    }


    private RowMapper<Comments> commentRowMapper = ((rs, rowNum) -> {
        return new Comments(rs.getInt("COMMENT_ID"),
                rs.getString("COMMENT_TEXT"),
                rs.getLong("USER_ID"),
                rs.getInt("ITINERARY_ID"),
                rs.getString("USER_EMAIL"));
    });

}
