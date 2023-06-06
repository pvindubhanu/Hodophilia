package com.hodophilia.backend.security.services.hotels;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hodophilia.backend.exceptions.BadRequestException;
import com.hodophilia.backend.exceptions.ResourceNotFoundException;
import com.hodophilia.backend.models.HotelRoom;
import com.hodophilia.backend.repository.HotelRoomRepository;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class HotelRoomService {
	private final HotelRoomRepository roomRepository;
    private static final String ROOM_NOT_FOUND_MSG = "room with id %d not found";

    public List<HotelRoom> fetchAllRooms() {
        return roomRepository.findAll();
    }

    public HotelRoom findById(Long id) throws ResourceNotFoundException {
        return roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format(ROOM_NOT_FOUND_MSG, id)));
    }

    public void createRoom(HotelRoom room) throws BadRequestException {
        try {
            roomRepository.save(room);
        } catch (Exception e) {
        	System.out.println(e.getMessage());
            throw new BadRequestException("invalid request");
        }
    }

    public void updateRoom(HotelRoom room) throws BadRequestException {
        try {
            roomRepository.save(room);
        } catch (Exception e) {
            throw new BadRequestException("invalid request");
        }
    }

    public void deleteRoom(Long id) throws ResourceNotFoundException {
        boolean roomExist = roomRepository.findById(id).isPresent();

        if (!roomExist)
            throw new ResourceNotFoundException("room does not exist");

        roomRepository.deleteById(id);
    }
}
