package com.hodophilia.backend.repository;

import com.hodophilia.backend.exceptions.BadRequestException;
import com.hodophilia.backend.exceptions.ResourceNotFoundException;
import com.hodophilia.backend.models.SharedItinerary;
import com.nimbusds.jose.shaded.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Repository
public class SharedItineraryRepositoryImpl implements SharedItineraryRepository {

    private static final String SQL_FIND_SHARED_LIST = "SELECT SHARE_ITINERARY.SHARE_ID, SHARE_ITINERARY.ITINERARY_ID, " +
            "ITINERARY.ITINERARY_NAME, ITINERARY.ACTION_WITH_DATE, ITINERARY.FIRST_TRAVEL_DAY, ITINERARY.START_DATE, " +
            "SHARE_ITINERARY.CREATED_USER_ID, SHARE_ITINERARY.CREATED_USER_EMAIL FROM SHARE_ITINERARY " +
            "INNER JOIN ITINERARY ON ITINERARY.ITINERARY_ID = SHARE_ITINERARY.ITINERARY_ID ";



   /* private static final String SQL_FIND_SHARED_LIST = "SELECT S.SHARE_ID, S.ITINERARY_ID, I.ITINERARY_NAME, I.ACTION_WITH_DATE, " +
            "I.FIRST_TRAVEL_DAY, I.START_DATE, S.CREATED_USER_ID, S.CREATED_USER_EMAIL " +
            "FROM ITINERARY I RIGHT OUTER JOIN SHARE_ITINERARY S ON I.ITINERARY_ID = S.ITINERARY_ID " +
            "WHERE S.CREATED_USER_ID = ? GROUP BY S.ITINERARY_ID";

    */
    private static final String SQL_FIND_BY_ID = "SELECT SHARE_ITINERARY.SHARE_ID, SHARE_ITINERARY.ITINERARY_ID, " +
            "ITINERARY.ITINERARY_NAME, ITINERARY.ACTION_WITH_DATE, ITINERARY.FIRST_TRAVEL_DAY, ITINERARY.START_DATE, " +
            "SHARE_ITINERARY.CREATED_USER_ID, SHARE_ITINERARY.CREATED_USER_EMAIL FROM SHARE_ITINERARY " +
            "INNER JOIN ITINERARY ON ITINERARY.ITINERARY_ID = SHARE_ITINERARY.ITINERARY_ID WHERE SHARE_ITINERARY.ITINERARY_ID=? AND " +
            "SHARE_ITINERARY.CREATED_USER_ID=? ";

    private static final String SQL_CREATE_SHARED_ITINERARY = "INSERT INTO SHARE_ITINERARY (SHARE_ID, CREATED_USER_ID, " +
            "ITINERARY_ID, CREATED_USER_EMAIL) " +
            "VALUES(nextval('share_seq'), ?, ?, ?)";

    private static final String SQL_DELETE_SHARED_LIST = "DELETE FROM SHARE_ITINERARY WHERE CREATED_USER_ID = ? AND ITINERARY_ID = ?";

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Override
    public ArrayList<JSONObject> findSharedItineraryList() throws ResourceNotFoundException {

        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(SQL_FIND_SHARED_LIST);
            ArrayList<JSONObject> pList = new ArrayList<>();
            for(Map<String, Object> row : rows){
                Set<String> place = row.keySet();
                JSONObject jsonObj = new JSONObject();
                place.forEach(res -> {
                            jsonObj.put(res, row.get(res));
                        });
                pList.add(jsonObj);
            }
            return pList;

        } catch (Exception e) {
            throw new ResourceNotFoundException("Shared Itinerary not found");
        }
    }

    @Override
    public JSONObject findById(Long UserId, Integer ItineraryId) throws ResourceNotFoundException {
        try {
            Map<String, Object> row = jdbcTemplate.queryForMap(SQL_FIND_BY_ID, new Object[]{ItineraryId, UserId});
            Set<String> place = row.keySet();
            JSONObject jsonObj = new JSONObject();
            place.forEach(res -> {
                jsonObj.put(res, row.get(res));
            });
            return jsonObj;
        }catch (Exception e) {
            throw new ResourceNotFoundException("Itinerary not found");
        }
    }

    @Override
    public Integer createItinerary(Long UserId, Integer ItineraryId, String Email) throws BadRequestException {
        try {
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(SQL_CREATE_SHARED_ITINERARY, Statement.RETURN_GENERATED_KEYS);
                ps.setLong(1, UserId);
                ps.setInt(2, ItineraryId);
                ps.setString(3, Email);
                return ps;
            }, keyHolder);
            return (Integer) keyHolder.getKeys().get("ITINERARY_ID");
        }catch (Exception e) {
            throw new BadRequestException("Invalid request");
        }
    }

    @Override
    public void removeById(Long userId, Integer itineraryId) {
        jdbcTemplate.update(SQL_DELETE_SHARED_LIST, new Object[]{userId, itineraryId});
    }


    private RowMapper<SharedItinerary> sharedItineraryRowMapper = ((rs, rowNum) -> {
        return new SharedItinerary(rs.getInt("SHARE_ID"),
                rs.getLong("CREATED_USER_ID"),
                rs.getInt("ITINERARY_ID"),
                rs.getString("CREATED_USER_EMAIL"));
    });

}
