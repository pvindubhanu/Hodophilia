package com.hodophilia.backend.repository;

import com.hodophilia.backend.exceptions.BadRequestException;
import com.hodophilia.backend.exceptions.ResourceNotFoundException;
import com.hodophilia.backend.models.Itinerary;
import com.nimbusds.jose.shaded.json.JSONObject;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.*;

@Repository
public class ItineraryRepositoryImpl implements ItineraryRepository {

    private static final String SQL_FIND_ITINERARY_LIST = "SELECT USER_ID, ITINERARY_ID, ITINERARY_NAME, " +
            "FIRST_TRAVEL_DAY, START_DATE, ACTION_WITH_DATE, LOCATION_ID " +
            "FROM ITINERARY " +
            "WHERE USER_ID = ?";

    private static final String SQL_FIND_BY_ITINERARY_ID = "SELECT USER_ID, ITINERARY_ID, ITINERARY_NAME, " +
            "FIRST_TRAVEL_DAY, START_DATE, ACTION_WITH_DATE, LOCATION_ID " +
            "FROM ITINERARY " +
            "WHERE ITINERARY_ID = ?";

    private static final String SQL_CREATE_ITINERARY = "INSERT INTO ITINERARY (ITINERARY_ID, USER_ID, ITINERARY_NAME, "
            +
            "FIRST_TRAVEL_DAY, START_DATE, ACTION_WITH_DATE, LOCATION_ID) " +
            "VALUES(nextval('itinerary_seq'), ?, ?, ?, ?, ?, ?)";

    private static final String SQL_FIND_BY_LOCATION_ID = "SELECT LOCATIONS.ID, SEARCH.SEARCH_ID, SEARCH.PLACE, " +
            "SEARCH.RATINGS, GEOPOINT.* FROM LOCATIONS JOIN SEARCH ON LOCATIONS.NAME = SEARCH.PLACE " +
            "NATURAL JOIN GEOPOINT WHERE LOCATIONS.ID = ?";

    private static final String SQL_UPDATE_ITINERARY = "UPDATE ITINERARY SET ITINERARY_NAME = ?, FIRST_TRAVEL_DAY = ?, "
            +
            "START_DATE = ?, ACTION_WITH_DATE = ?, LOCATION_ID = ? WHERE ITINERARY_ID = ? AND USER_ID = ?";
    private static final String SQL_DELETE_ITINERARY = "DELETE FROM ITINERARY WHERE ITINERARY_ID = ? AND USER_ID = ?";

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Override
    public List<Itinerary> findItineraryList(Long UserId) throws ResourceNotFoundException {

        try {
            return jdbcTemplate.query(SQL_FIND_ITINERARY_LIST, itineraryRowMapper, new Object[] { UserId });
        } catch (Exception e) {
            throw new ResourceNotFoundException("Itinerary not found");
        }
    }

    @Override
    public JSONObject findByItineraryId(Integer ItineraryId) throws ResourceNotFoundException {
        try {
            Map<String, Object> row = jdbcTemplate.queryForMap(SQL_FIND_BY_ITINERARY_ID, new Object[] { ItineraryId });
            Set<String> place = row.keySet();
            JSONObject jsonObj = new JSONObject();
            place.forEach(res -> {
                jsonObj.put(res, row.get(res));
            });
            String locations = (String) row.get("location_id");
            ArrayList<JSONObject> pList = new ArrayList<>();
            if (locations != null) { // make sure we can account for itineraries with no locations set
                String[] locArray = locations.split("[|]");
                // System.out.println("RESULT:" +
                // locations+","+Arrays.stream(locArray).toList());
                for (String loc : locArray) {

                    JSONObject jsonObj1 = findByLocationId(Integer.valueOf(loc));
                    pList.add(jsonObj1);
                }
            }

            jsonObj.put("location_details", pList);

            return jsonObj;
        } catch (Exception e) {
            throw e;
            // throw new ResourceNotFoundException("Itinerary not found");
        }
    }

    @Override
    public JSONObject findByLocationId(Integer locationId) throws ResourceNotFoundException {
        try {

            Map<String, Object> row = jdbcTemplate.queryForMap(SQL_FIND_BY_LOCATION_ID, new Object[] { locationId });
            Set<String> place = row.keySet();
            JSONObject jsonObj = new JSONObject();
            place.forEach(res -> {
                jsonObj.put(res, row.get(res));
            });

            return jsonObj;
        } catch (Exception e) {
            throw e;
            // throw new ResourceNotFoundException("Location not found");
        }
    }

    @Override
    public Integer createItinerary(Long userId, String itineraryName,
            String firstTravelDay, String startDate, String actionWithDate, String locationId)
            throws BadRequestException {
        try {
            KeyHolder keyHolder = new GeneratedKeyHolder();
            SharedSessionContractImplementor session = null;
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(SQL_CREATE_ITINERARY,
                        Statement.RETURN_GENERATED_KEYS);
                ps.setLong(1, userId);
                ps.setString(2, itineraryName);
                ps.setString(3, firstTravelDay);
                ps.setString(4, startDate);
                ps.setString(5, actionWithDate);
                // Array locArray = session.connection().createArrayOf("list", locationId);
                // ArrayList<Object> locationVals = new ArrayList<>();
                // locationVals.add(locationId);
                // Object[] obj = locationId.toArray();
                ps.setString(6, locationId);
                return ps;
            }, keyHolder);
            return (Integer) keyHolder.getKeys().get("ITINERARY_ID");
        } catch (Exception e) {
            throw new BadRequestException("Invalid request");
        }
    }

    @Override
    public void update(Long userId, Integer itineraryId, String itineraryName,
            String firstTravelDay, String startDate, String actionWithDate, String locationId)
            throws BadRequestException {
        try {
            jdbcTemplate.update(SQL_UPDATE_ITINERARY, new Object[] { itineraryName, firstTravelDay,
                    startDate, actionWithDate, locationId, itineraryId, userId });
        } catch (Exception e) {
            throw new BadRequestException("Invalid request");
        }
    }

    @Override
    public void removeById(Long userId, Integer itineraryId) {
        jdbcTemplate.update(SQL_DELETE_ITINERARY, new Object[] { itineraryId, userId });
    }

    private RowMapper<Itinerary> itineraryRowMapper = ((rs, rowNum) -> {
        return new Itinerary(rs.getInt("ITINERARY_ID"),
                rs.getLong("USER_ID"),
                rs.getString("ITINERARY_NAME"),
                rs.getString("FIRST_TRAVEL_DAY"),
                rs.getString("START_DATE"),
                rs.getString("ACTION_WITH_DATE"),
                rs.getString("LOCATION_ID"));
    });

}