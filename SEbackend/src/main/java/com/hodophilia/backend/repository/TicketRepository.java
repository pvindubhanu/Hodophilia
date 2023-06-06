package com.hodophilia.backend.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hodophilia.backend.models.Ticket;

@Repository
public interface TicketRepository extends JpaRepository<Ticket,Long> {

	List<Ticket> findByUserId(Long userId);
}
