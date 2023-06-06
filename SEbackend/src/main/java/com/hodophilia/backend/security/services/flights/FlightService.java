package com.hodophilia.backend.security.services.flights;

import java.util.List;
import java.util.Optional;

import com.hodophilia.backend.models.Flight;

public interface FlightService {

    void createFlight(Flight flight);

    void updateFlight(Long id, Flight flight);

    void deleteFlight(Long id);

    Optional<Flight> getOneFlight(Long id);

    List<Flight> getAllFlights();
}
