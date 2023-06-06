package com.hodophilia.backend.security.services;


import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hodophilia.backend.exceptions.BadRequestException;
import com.hodophilia.backend.exceptions.InternalServerException;
import com.hodophilia.backend.exceptions.ResourceNotFoundException;
import com.hodophilia.backend.models.User;
import com.hodophilia.backend.repository.UserRepository;
import com.hodophilia.backend.security.TokenProvider;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    UserRepository userRepository;
    
    @Autowired
    private TotpManager totpManager;
    
    @Autowired
    private TokenProvider tokenProvider;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found with email : " + email)
        );

        return UserPrincipal.create(user);
    }

    @Transactional
    public UserDetails loadUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow(
            () -> new ResourceNotFoundException("User", "id", id)
        );

        return UserPrincipal.create(user);
    }
    
    public void updateResetPasswordToken(String token, String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email).orElseThrow(
        		() -> new UsernameNotFoundException("User not found with email : " + email));
        
        if (user != null) {
            user.setResetPasswordToken(token);
            userRepository.save(user);
        } else {
            throw new UsernameNotFoundException("User not found with email : " + email);
        }
    }
    
    public Optional<User> getByResetPasswordToken(String token) {
        return userRepository.findByResetPasswordToken(token);
    }

	public void updatePassword(Optional<User> user, String password) {
		// TODO Auto-generated method stub
		BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode(password);
        user.get().setPassword(encodedPassword);
         
        user.get().setResetPasswordToken(null);
        userRepository.save(user.get());
		
	}
	
	public String verify(String email, String code) {
		User user = userRepository
                .findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: "+email));
		
		if(!totpManager.verifyCode(code, user.getSecret())) {
            throw new BadRequestException("Code is incorrect");
        }
		
		return Optional.of(user)
				.map(UserPrincipal::new)
                .map(userPrincipal -> new UsernamePasswordAuthenticationToken(userPrincipal,null,userPrincipal.getAuthorities()))
                .map(tokenProvider::createToken)
                .orElseThrow(() ->
                new InternalServerException("unable to generate access token"));
           
           
	}
}

