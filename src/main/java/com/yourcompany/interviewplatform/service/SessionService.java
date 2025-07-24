package com.yourcompany.interviewplatform.service;

import com.yourcompany.interviewplatform.dto.*;
import com.yourcompany.interviewplatform.model.*;
import com.yourcompany.interviewplatform.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class SessionService {
    private final InterviewSessionRepository sessionRepo;
    private final QuestionAnswerRepository qaRepo;

    public SessionService(InterviewSessionRepository sessionRepo, QuestionAnswerRepository qaRepo) {
        this.sessionRepo = sessionRepo;
        this.qaRepo = qaRepo;
    }

    @Transactional
    public SessionResponse startSession(StartSessionRequest req) {
        InterviewSession session = new InterviewSession();
        session.setTopic(req.getTopic());
        session.setUserId(req.getUserId());
        // TODO: set interviewType if needed
        session = sessionRepo.save(session);
        // Generate first question (placeholder)
        String firstQuestion = "[AI] First question for topic: " + req.getTopic();
        QuestionAnswer qa = new QuestionAnswer();
        qa.setSession(session);
        qa.setOrderIndex(0);
        qa.setQuestion(firstQuestion);
        qaRepo.save(qa);
        SessionResponse resp = new SessionResponse();
        resp.setSessionId(session.getId());
        resp.setTopic(session.getTopic());
        resp.setStartedAt(session.getStartedAt());
        resp.setCurrentQuestion(firstQuestion);
        return resp;
    }

    @Transactional
    public SessionResponse answerQuestion(AnswerRequest req) {
        InterviewSession session = sessionRepo.findById(req.getSessionId())
            .orElseThrow(() -> new RuntimeException("Session not found"));
        // Find last QA
        Optional<QuestionAnswer> lastQaOpt = session.getQuestionAnswers().stream()
            .max((a, b) -> Integer.compare(a.getOrderIndex(), b.getOrderIndex()));
        if (lastQaOpt.isEmpty()) throw new RuntimeException("No question to answer");
        QuestionAnswer lastQa = lastQaOpt.get();
        lastQa.setAnswer(req.getAnswer());
        // Generate feedback (placeholder)
        lastQa.setFeedback("[AI] Feedback for answer: " + req.getAnswer());
        qaRepo.save(lastQa);
        // Generate next question (placeholder)
        QuestionAnswer nextQa = new QuestionAnswer();
        nextQa.setSession(session);
        nextQa.setOrderIndex(lastQa.getOrderIndex() + 1);
        nextQa.setQuestion("[AI] Next question for topic: " + session.getTopic());
        qaRepo.save(nextQa);
        SessionResponse resp = new SessionResponse();
        resp.setSessionId(session.getId());
        resp.setTopic(session.getTopic());
        resp.setStartedAt(session.getStartedAt());
        resp.setCurrentQuestion(nextQa.getQuestion());
        resp.setFeedback(lastQa.getFeedback());
        return resp;
    }

    @Transactional
    public SessionResponse endSession(Long sessionId) {
        InterviewSession session = sessionRepo.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Session not found"));
        session.setEndedAt(java.time.Instant.now());
        sessionRepo.save(session);
        SessionResponse resp = new SessionResponse();
        resp.setSessionId(session.getId());
        resp.setTopic(session.getTopic());
        resp.setStartedAt(session.getStartedAt());
        resp.setEndedAt(session.getEndedAt());
        resp.setSummary("[AI] Interview summary and improvement tips.");
        return resp;
    }
} 