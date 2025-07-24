package com.yourcompany.interviewplatform.service;

import com.yourcompany.interviewplatform.dto.AuthRequest;
import com.yourcompany.interviewplatform.dto.AuthResponse;
import com.yourcompany.interviewplatform.dto.SignupRequest;
import com.yourcompany.interviewplatform.model.User;
import com.yourcompany.interviewplatform.repository.UserRepository;
import com.yourcompany.interviewplatform.security.JwtTokenProvider;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Transactional
    public void signup(SignupRequest req) {
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }
        User user = new User();
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setName(req.getName());
        user.setProvider("local");
        userRepository.save(user);
    }

    public AuthResponse login(AuthRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        String accessToken = jwtTokenProvider.generateTokenForUser(user);
        return new AuthResponse(accessToken, user.getEmail(), user.getName());
    }

    public Long getUserIdFromToken(String token) {
        return jwtTokenProvider.getUserIdFromJWT(token);
    }

    public java.util.Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
} 