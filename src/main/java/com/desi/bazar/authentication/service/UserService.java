package com.desi.bazar.authentication.service;

import com.desi.bazar.authentication.exception.UserAlreadyExistsException;
import com.desi.bazar.authentication.model.AuthenticationRequest;
import com.desi.bazar.authentication.model.User;
import com.desi.bazar.authentication.model.UserRequest;
import com.desi.bazar.authentication.repository.UserRepository;
import lombok.extern.java.Log;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {
    private static final Logger LOG = LoggerFactory.getLogger(UserService.class);
    @Autowired
    public UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User dbUser = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        LOG.info("User found: {}", dbUser.getEmail());
        return  org.springframework.security.core.userdetails.User.builder()
                .username(dbUser.getEmail())
                .password(dbUser.getPassword())
                .build();
    }

    public UserRequest loadUserByEmail(String email) {
        UserRequest authenticationRequest = new UserRequest();
        userRepository.findByEmail(email)
                .ifPresent(dbUser -> {
                    authenticationRequest.setEmail(dbUser.getEmail());
                    authenticationRequest.setUsername(dbUser.getUsername());
                    authenticationRequest.setMobile(dbUser.getMobile());
                });
        LOG.info("AuthenticationRequest created for email: {}", email);
        return authenticationRequest;
    }
    public User registerUser(User user) {
        User existingUser = userRepository.findByEmail(user.getEmail()).orElse(null);
        if (existingUser != null) {
            throw new UserAlreadyExistsException("User already exists with username: " + user.getUsername());
        }
        LOG.info("Registering new user: {}", user.getEmail());
        return userRepository.save(user);
    }
}
