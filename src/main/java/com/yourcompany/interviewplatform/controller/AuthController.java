package com.yourcompany.interviewplatform.controller;

import com.yourcompany.interviewplatform.dto.AuthRequest;
import com.yourcompany.interviewplatform.dto.AuthResponse;
import com.yourcompany.interviewplatform.dto.SignupRequest;
import com.yourcompany.interviewplatform.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest req) {
        authService.signup(req);
        return ResponseEntity.ok("Signup successful");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest req) {
        AuthResponse response = authService.login(req);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("Missing or invalid Authorization header");
        }
        String token = authHeader.substring(7);
        Long userId;
        try {
            userId = authService.getUserIdFromToken(token);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid token");
        }
        var userOpt = authService.getUserById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }
        var user = userOpt.get();
        return ResponseEntity.ok(new com.yourcompany.interviewplatform.dto.AuthResponse(token, user.getEmail(), user.getName()));
    }
} 