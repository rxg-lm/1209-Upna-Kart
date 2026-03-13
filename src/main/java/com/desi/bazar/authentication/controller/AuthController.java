package com.desi.bazar.authentication.controller;

import com.desi.bazar.authentication.model.UserRequest;
import com.desi.bazar.authentication.model.AuthenticationRequest;
import com.desi.bazar.authentication.model.AuthenticationResponse;
import com.desi.bazar.authentication.model.User;
import com.desi.bazar.authentication.service.JwtService;
import com.desi.bazar.authentication.service.UserService;
import com.desi.bazar.util.mapper.MapperHelper;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/v1/user")
public class AuthController {

    private static final Logger LOG = LoggerFactory.getLogger(AuthController.class);
    @Value("${jwt.secure-cookie}")
    private boolean secureCookie;

    private final AuthenticationManager authenticationManager;
    private final JwtService jswtService;
    private final UserService userDetailsService;
    private final PasswordEncoder passwordEncoder;
    @PostMapping(value = "/login" , consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> login(HttpServletRequest request,
                                                        HttpServletResponse response,
                                                        @RequestBody AuthenticationRequest authenticationRequest){
        LOG.info("Login attempt for user: {}", authenticationRequest.getEmail());
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authenticationRequest.getEmail(),authenticationRequest.getPassword()));
        UserDetails user = userDetailsService.loadUserByUsername(authenticationRequest.getEmail());
        if(user.getUsername() != null){
            String token = jswtService.generateToken(user);
            System.out.println("generated token: " + token);
            if(StringUtils.isNotEmpty(token)){
                LOG.info("JWT token generated successfully for user: {}", user.getUsername());
                Cookie jwtCookie = new Cookie("jwt", token);
                jwtCookie.setHttpOnly(true);
                jwtCookie.setSecure(secureCookie);
                jwtCookie.setPath("/");
                jwtCookie.setMaxAge(3600);

                String csrfToken = UUID.randomUUID().toString();
                Cookie csrfCookie = new Cookie("XSRF-TOKEN", csrfToken);
                csrfCookie.setHttpOnly(false);
                csrfCookie.setPath("/");
                csrfCookie.setMaxAge(3600);

                response.addCookie(jwtCookie);
                response.addCookie(csrfCookie);
            }
        }
        return ResponseEntity.ok(Map.of("message", "Login successful"));
    }
    @PostMapping(value = "/register",consumes = "application/json",produces = "text/plain;charset=UTF-8")
    public ResponseEntity<String> register(@RequestBody UserRequest userRequest) throws InstantiationException, IllegalAccessException {
        User user = (User) MapperHelper.mapObject(userRequest, User.class);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user = userDetailsService.registerUser(user);
        LOG.info("User registration attempted for username: {}", user.getUsername());
        if(user.getId() == null) {
            LOG.error("User registration failed for username: {}", user.getUsername());
            throw new RuntimeException("User registration failed for username: " + user.getUsername());
        }
        return ResponseEntity.ok("User registered successfully with username: " + user.getUsername());
    }
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        LOG.info("User logout initiated");
        Cookie jwtCookie = new Cookie("jwt", null);
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(0);
        response.addCookie(jwtCookie);

        Cookie csrfCookie = new Cookie("XSRF-TOKEN", null);
        csrfCookie.setPath("/");
        csrfCookie.setMaxAge(0);
        response.addCookie(csrfCookie);
        LOG.info("User logged out successfully");
        return ResponseEntity.ok().build();
    }
    @GetMapping("/profile")
    public ResponseEntity<UserRequest> getProfile(Authentication authentication) {
        String username = authentication.getName();
        LOG.info("Fetching profile for user: {}", username);
        UserRequest profile = userDetailsService.loadUserByEmail(username);
        LOG.info("Profile fetched successfully for user: {}",profile);
        return ResponseEntity.ok(profile);
    }

}
