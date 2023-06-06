package com.hodophilia.backend.security.services.hotels;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hodophilia.backend.exceptions.BadRequestException;
import com.hodophilia.backend.exceptions.ResourceNotFoundException;
import com.hodophilia.backend.models.HotelReservation;
import com.hodophilia.backend.repository.HotelReservationRepository;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class HotelReservationService {

    private final HotelReservationRepository reservationRepository;
    private static final String RESERVATION_NOT_FOUND_MSG = "reservation with id %d not found";

    public List<HotelReservation> fetchAllReservations() {
        return reservationRepository.findAll();
    }

    public HotelReservation findById(Long id) throws ResourceNotFoundException {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format(RESERVATION_NOT_FOUND_MSG, id)));
    }
    
    public List<HotelReservation> findAllById(Long id) {
        return reservationRepository.findAllById(id);
    }
    
    public void createReservation(HotelReservation reservation) throws BadRequestException {
        try {
            reservationRepository.save(reservation);
        } catch (Exception e) {
            throw new BadRequestException("invalid request");
        }
    }
    
   

    public void updateReservation(HotelReservation reservation) throws BadRequestException {
        try {
            reservationRepository.save(reservation);
        } catch (Exception e) {
            throw new BadRequestException("invalid request");
        }
    }

    public void deleteReservation(Long id) throws ResourceNotFoundException {
        boolean reservationExist = reservationRepository.findById(id).isPresent();

        if (!reservationExist)
            throw new ResourceNotFoundException("reservation does not exist");

        reservationRepository.deleteById(id);
    }
}