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
        // AI Mock Interview Agent: always start with greeting, not a real question
        session.setHasChosenRole(false);
        session = sessionRepo.save(session);
        String greeting = "Welcome to your mock interview! What kind of position or role would you like to prepare for today?";
        QuestionAnswer qa = new QuestionAnswer();
        qa.setSession(session);
        qa.setOrderIndex(0);
        qa.setQuestion(greeting);
        qaRepo.save(qa);
        SessionResponse resp = new SessionResponse();
        resp.setSessionId(session.getId());
        resp.setTopic(session.getTopic());
        resp.setStartedAt(session.getStartedAt());
        resp.setCurrentQuestion(greeting);
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

        // STOP/END detection
        String userAnswer = req.getAnswer() == null ? "" : req.getAnswer().trim().toLowerCase();
        if (userAnswer.contains("stop") || userAnswer.contains("end")) {
            lastQa.setAnswer(req.getAnswer());
            lastQa.setFeedback("Interview ended by user. Thank you for participating!");
            qaRepo.save(lastQa);
            SessionResponse resp = new SessionResponse();
            resp.setSessionId(session.getId());
            resp.setTopic(session.getTopic());
            resp.setStartedAt(session.getStartedAt());
            resp.setCurrentQuestion(null);
            resp.setFeedback("Interview ended by user. Thank you for participating!");
            return resp;
        }

        // If role not chosen yet, treat this answer as the role
        if (!session.isHasChosenRole()) {
            String role = req.getAnswer();
            session.setRole(role);
            // Simple logic: if role contains 'hr', 'human resource', 'manager', treat as HR, else technical
            String roleLower = role.toLowerCase();
            String interviewType = (roleLower.contains("hr") || roleLower.contains("human resource") || roleLower.contains("manager")) ? "hr" : "technical";
            session.setInterviewType(interviewType);
            session.setHasChosenRole(true);
            sessionRepo.save(session);
            lastQa.setAnswer(role);
            qaRepo.save(lastQa);
            // Generate first real question
            String firstQuestion = aiService.generateQuestion(role, List.of(), List.of(), interviewType);
            QuestionAnswer qa = new QuestionAnswer();
            qa.setSession(session);
            qa.setOrderIndex(lastQa.getOrderIndex() + 1);
            qa.setQuestion(firstQuestion);
            qaRepo.save(qa);
            SessionResponse resp = new SessionResponse();
            resp.setSessionId(session.getId());
            resp.setTopic(session.getTopic());
            resp.setStartedAt(session.getStartedAt());
            resp.setCurrentQuestion(firstQuestion);
            return resp;
        }

        // Usual feedback → next question loop
        lastQa.setAnswer(req.getAnswer());
        String feedback = aiService.generateFeedback(lastQa.getQuestion(), req.getAnswer(), session.getInterviewType());
        lastQa.setFeedback(feedback);
        qaRepo.save(lastQa);
        // Prepare history for next question
        List<String> prevQuestions = qaList.stream().map(QuestionAnswer::getQuestion).collect(Collectors.toList());
        List<String> prevAnswers = qaList.stream().map(qa -> qa.getAnswer() == null ? "" : qa.getAnswer()).collect(Collectors.toList());
        String nextQuestion = aiService.generateQuestion(session.getRole(), prevQuestions, prevAnswers, session.getInterviewType());
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