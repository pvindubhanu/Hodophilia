package com.hodophilia.backend.resources;

import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserResource {

    @PostMapping("/login")
    public String loginUser(@RequestBody Map<String, Object> userMap) {
        String email = (String) userMap.get("email");
        String password = (String) userMap.get("password");
        //User user = userService.validateUser(email, password);
        //return new ResponseEntity<>(generateJWTToken(user), HttpStatus.OK);
        return email + ", " + password;
    }

    @PostMapping("/register")
    public String registerUser(@RequestBody Map<String, Object> userMap) {
        String firstName = (String) userMap.get("firstName");
        String lastName = (String) userMap.get("lastName");
        String email = (String) userMap.get("email");
        String password = (String) userMap.get("password");
        //User user = userService.registerUser(firstName, lastName, email, password);
        //return new ResponseEntity<>(generateJWTToken(user), HttpStatus.OK);

        return firstName + ", " + lastName + ", " + email + ", " + password;
    }

}