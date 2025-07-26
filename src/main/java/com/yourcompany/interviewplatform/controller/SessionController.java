package com.yourcompany.interviewplatform.controller;

import com.yourcompany.interviewplatform.dto.*;
import com.yourcompany.interviewplatform.service.SessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/session")
public class SessionController {
    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @PostMapping("/start")
    public ResponseEntity<?> startSession(@RequestBody StartSessionRequest req) {
        if (req.getTopic() == null || req.getTopic().isBlank()) {
            return ResponseEntity.badRequest().body("Topic is required");
        }
        SessionResponse resp = sessionService.startSession(req);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/answer")
    public ResponseEntity<?> answerQuestion(@RequestBody AnswerRequest req) {
        if (req.getSessionId() == null || req.getAnswer() == null || req.getAnswer().isBlank()) {
            return ResponseEntity.badRequest().body("Session ID and answer are required");
        }
        try {
            SessionResponse resp = sessionService.answerQuestion(req);
            return ResponseEntity.ok(resp);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping("/end")
    public ResponseEntity<?> endSession(@RequestBody EndSessionRequest req) {
        if (req.getSessionId() == null) {
            return ResponseEntity.badRequest().body("Session ID is required");
        }
        try {
            SessionResponse resp = sessionService.endSession(req.getSessionId());
            return ResponseEntity.ok(resp);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // Placeholder for video avatar endpoint
    @GetMapping("/avatar-response")
    public ResponseEntity<?> getAvatarResponse(@RequestParam String text) {
        // In production, integrate with a video avatar service
        return ResponseEntity.ok("[Avatar Placeholder] Video avatar would say: " + text);
    }
} 