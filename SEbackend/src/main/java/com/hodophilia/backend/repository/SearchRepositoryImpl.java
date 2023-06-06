package com.hodophilia.backend.repository;

import com.hodophilia.backend.exceptions.BadRequestException;
import com.hodophilia.backend.exceptions.ResourceNotFoundException;
import com.hodophilia.backend.models.Search;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
public class SearchRepositoryImpl implements SearchRepository {

    private static final String SQL_FIND_ALL = "SELECT PLACE FROM SEARCH ";

    private static final String SQL_FIND_BY_PLACE = "SELECT S.SEARCH_ID SEARCH_ID, S.PLACE_ID PLACE_ID, S.PLACE PLACE, S.DESCRIPTION DESCRIPTION, "
            +
            "S.TRAVEL_ADVICE TRAVEL_ADVICE, S.HOTELS HOTELS, S.THINGS_TO_DO THINGS_TO_DO, S.RESTAURANTS RESTAURANTS, S.TRAVEL_FORUM TRAVEL_FORUM, S.RATINGS RATINGS, L.ID ID "
            +
            "FROM SEARCH S JOIN LOCATIONS L ON S.PLACE = L.NAME " +
            "WHERE S.PLACE = ? LIMIT 1";

    private static final String SQL_RATING_BY_PLACE = "SELECT RATINGS FROM SEARCH WHERE PLACE = ? ";

    private static final String SQL_UPDATE_RATING = "UPDATE SEARCH SET RATINGS = ? WHERE PLACE = ? ";

    private static final String SQL_TOP3_PLACES = "SELECT PLACE FROM SEARCH ORDER BY RATINGS DESC LIMIT 3 ";

    private static final String SQL_CREATE = "INSERT INTO SEARCH (SEARCH_ID, PLACE_ID, PLACE, DESCRIPTION, " +
            "TRAVEL_ADVICE, HOTELS, THINGS_TO_DO, RESTAURANTS, TRAVEL_FORUM, RATINGS) " +
            "VALUES(nextval('search_seq'), ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Override
    public ArrayList<String> findAll() throws ResourceNotFoundException {
        List<Map<String, Object>> rows = jdbcTemplate.queryForList(SQL_FIND_ALL);
        ArrayList<String> pList = new ArrayList<String>();
        for (Map<String, Object> row : rows) {
            String place = (String) row.get("place");
            pList.add(place);
        }
        return pList;
    }

    @Override
    public ArrayList<String> findTopPlaces() throws ResourceNotFoundException {
        List<Map<String, Object>> rows = jdbcTemplate.queryForList(SQL_TOP3_PLACES);
        ArrayList<String> pList = new ArrayList<String>();
        for (Map<String, Object> row : rows) {
            String place = (String) row.get("place");
            pList.add(place);
        }
        return pList;
    }

    @Override
    public Search findByPlace(String Place) throws ResourceNotFoundException {
        try {
            return jdbcTemplate.queryForObject(SQL_FIND_BY_PLACE, searchRowMapper, new Object[] { Place });
        } catch (Exception e) {
            throw new ResourceNotFoundException("Search not found: " + e.toString());
            // throw new ResourceNotFoundException("Search not found");
        }
    }

    @Override
    public String create(String placeId, String place, String description, String travelAdvice,
            String hotels, String thingsToDo, String restaurants,
            String travelForum, Integer ratings) throws BadRequestException {
        try {
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(SQL_CREATE, Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, placeId);
                ps.setString(2, place);
                ps.setString(3, description);
                ps.setString(4, travelAdvice);
                ps.setString(5, hotels);
                ps.setString(6, thingsToDo);
                ps.setString(7, restaurants);
                ps.setString(8, travelForum);
                ps.setInt(9, ratings);
                System.out.println("PS:" + ps);
                return ps;
            }, keyHolder);
            return (String) keyHolder.getKeys().get("PLACE");
        } catch (Exception e) {
            throw new BadRequestException("Invalid request");
        }
    }

    @Override
    public Integer findRatingsByPlace(String place) throws ResourceNotFoundException {
        Map<String, Object> row = jdbcTemplate.queryForMap(SQL_RATING_BY_PLACE, new Object[] { place });

        Integer ratings = (Integer) row.get("ratings");
        // JSONObject jsonObj = new JSONObject();
        // jsonObj.put("Ratings", row.get("ratings"));

        return ratings;
    }

    @Override
    public void changeRatingsByPlace(String place, Integer newRatings) throws BadRequestException {
        try {
            jdbcTemplate.update(SQL_UPDATE_RATING, new Object[] { newRatings, place });
        } catch (Exception e) {
            throw new BadRequestException("Invalid request");
        }
    }

    private RowMapper<Search> searchRowMapper = ((rs, rowNum) -> {
        return new Search(rs.getInt("SEARCH_ID"),
                rs.getString("PLACE_ID"),
                rs.getString("PLACE"),
                rs.getString("DESCRIPTION"),
                rs.getString("TRAVEL_ADVICE"),
                rs.getString("HOTELS"),
                rs.getString("THINGS_TO_DO"),
                rs.getString("RESTAURANTS"),
                rs.getString("TRAVEL_FORUM"),
                rs.getInt("RATINGS"),
                rs.getInt("ID"));
    });

}