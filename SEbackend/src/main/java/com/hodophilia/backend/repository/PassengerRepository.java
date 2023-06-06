package com.hodophilia.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hodophilia.backend.models.Passenger;

public interface PassengerRepository extends JpaRepository<Passenger, Long> {

}
