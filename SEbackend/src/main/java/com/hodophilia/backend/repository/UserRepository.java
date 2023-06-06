package com.hodophilia.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hodophilia.backend.models.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long>{
	Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);

    
    Optional<User> findByResetPasswordToken(String token);

}
