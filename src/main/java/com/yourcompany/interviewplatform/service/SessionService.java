package com.yourcompany.interviewplatform.service;

import com.yourcompany.interviewplatform.ai.AIService;
import com.yourcompany.interviewplatform.dto.*;
import com.yourcompany.interviewplatform.model.*;
import com.yourcompany.interviewplatform.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SessionService {
    private final InterviewSessionRepository sessionRepo;
    private final QuestionAnswerRepository qaRepo;
    private final AIService aiService;

    public SessionService(InterviewSessionRepository sessionRepo, QuestionAnswerRepository qaRepo, AIService aiService) {
        this.sessionRepo = sessionRepo;
        this.qaRepo = qaRepo;
        this.aiService = aiService;
    }

    @Transactional
    public SessionResponse startSession(StartSessionRequest req) {
        InterviewSession session = new InterviewSession();
        session.setTopic(req.getTopic());
        session.setUserId(req.getUserId());
        session = sessionRepo.save(session);
        // Generate first question using AIService
        String firstQuestion = aiService.generateQuestion(req.getTopic(), List.of(), List.of(), req.getType());
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
        List<QuestionAnswer> qaList = session.getQuestionAnswers();
        if (qaList == null || qaList.isEmpty()) throw new RuntimeException("No question to answer");
        // Find last QA
        QuestionAnswer lastQa = qaList.stream().max((a, b) -> Integer.compare(a.getOrderIndex(), b.getOrderIndex())).get();
        lastQa.setAnswer(req.getAnswer());
        // Generate feedback using AIService
        String feedback = aiService.generateFeedback(lastQa.getQuestion(), req.getAnswer(), req.getType());
        lastQa.setFeedback(feedback);
        qaRepo.save(lastQa);
        // Prepare history for next question
        List<String> prevQuestions = qaList.stream().map(QuestionAnswer::getQuestion).collect(Collectors.toList());
        List<String> prevAnswers = qaList.stream().map(qa -> qa.getAnswer() == null ? "" : qa.getAnswer()).collect(Collectors.toList());
        // Generate next question using AIService
        String nextQuestion = aiService.generateQuestion(session.getTopic(), prevQuestions, prevAnswers, req.getType());
        QuestionAnswer nextQa = new QuestionAnswer();
        nextQa.setSession(session);
        nextQa.setOrderIndex(lastQa.getOrderIndex() + 1);
        nextQa.setQuestion(nextQuestion);
        qaRepo.save(nextQa);
        SessionResponse resp = new SessionResponse();
        resp.setSessionId(session.getId());
        resp.setTopic(session.getTopic());
        resp.setStartedAt(session.getStartedAt());
        resp.setCurrentQuestion(nextQuestion);
        resp.setFeedback(feedback);
        return resp;
    }

    @Transactional
    public SessionResponse endSession(Long sessionId) {
        InterviewSession session = sessionRepo.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Session not found"));
        session.setEndedAt(java.time.Instant.now());
        sessionRepo.save(session);
        List<QuestionAnswer> qaList = session.getQuestionAnswers();
        List<String> questions = qaList == null ? List.of() : qaList.stream().map(QuestionAnswer::getQuestion).collect(Collectors.toList());
        List<String> answers = qaList == null ? List.of() : qaList.stream().map(qa -> qa.getAnswer() == null ? "" : qa.getAnswer()).collect(Collectors.toList());
        List<String> feedbacks = qaList == null ? List.of() : qaList.stream().map(qa -> qa.getFeedback() == null ? "" : qa.getFeedback()).collect(Collectors.toList());
        String summary = aiService.summarizeSession(session.getTopic(), questions, answers, feedbacks, null);
        SessionResponse resp = new SessionResponse();
        resp.setSessionId(session.getId());
        resp.setTopic(session.getTopic());
        resp.setStartedAt(session.getStartedAt());
        resp.setEndedAt(session.getEndedAt());
        resp.setSummary(summary);
        return resp;
    }
} 