package com.hodophilia.backend.security.services.hotels;


import java.util.List;

import org.springframework.stereotype.Service;

import com.hodophilia.backend.exceptions.BadRequestException;
import com.hodophilia.backend.exceptions.ResourceNotFoundException;
import com.hodophilia.backend.models.Hotel;
import com.hodophilia.backend.repository.HotelRepository;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class HotelService {

    private final HotelRepository hotelRepository;
    private static final String HOTEL_NOT_FOUND_MSG = "hotel with id %d not found";

    public List<Hotel> fetchAllHotels() {
        return hotelRepository.findAll();
    }

    public Hotel findById(Long id) throws ResourceNotFoundException {
    	return hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format(HOTEL_NOT_FOUND_MSG, id)));
    }

    public void createHotel(Hotel hotel) throws BadRequestException {
        try {
            hotelRepository.save(hotel);
        } catch (Exception e) {
            throw new BadRequestException("invalid request");
        }
    }

    public void updateHotel(Hotel hotel) throws BadRequestException {
        try {
            hotelRepository.save(hotel);
        } catch (Exception e) {
            throw new BadRequestException("invalid request");
        }
    }
    public void deleteHotel(Long id) throws ResourceNotFoundException {
        boolean hotelExist = hotelRepository.findById(id).isPresent();

        if (!hotelExist)
            throw new ResourceNotFoundException("hotel not exist");

        hotelRepository.deleteById(id);
    }
    
}

