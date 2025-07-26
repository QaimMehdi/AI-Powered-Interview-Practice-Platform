package com.yourcompany.interviewplatform.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yourcompany.interviewplatform.ai.AIService;
import com.yourcompany.interviewplatform.dto.*;
import com.yourcompany.interviewplatform.model.*;
import com.yourcompany.interviewplatform.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

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
        // Set interview type if provided
        if (req.getType() != null && !req.getType().isEmpty()) {
            session.setInterviewType(req.getType());
        }
        // AI Mock Interview Agent: always start with greeting, not a real question
        session.setHasChosenRole(false);
        session = sessionRepo.save(session);
        String greeting;
        String interviewType = session.getInterviewType();
        if ("technical".equalsIgnoreCase(interviewType)) {
            greeting = "Hello, I'm your technical interviewer. What role are you applying for so we can start your prep?";
        } else if ("hr".equalsIgnoreCase(interviewType)) {
            greeting = "Hello, I'm your HR interviewer. What role are you applying for so we can start your prep?";
        } else {
            greeting = "Welcome to your mock interview! What kind of position or role would you like to prepare for today?";
        }
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

        ObjectMapper mapper = new ObjectMapper();

        // If role not chosen yet, treat this answer as the role
        if (!session.isHasChosenRole()) {
            String role = req.getAnswer();
            session.setRole(role);
            String roleLower = role.toLowerCase();
            String interviewType = session.getInterviewType();
            if (interviewType == null || interviewType.isEmpty()) {
                interviewType = (roleLower.contains("hr") || roleLower.contains("human resource") || roleLower.contains("manager")) ? "hr" : "technical";
                session.setInterviewType(interviewType);
            }
            session.setHasChosenRole(true);
            sessionRepo.save(session);
            lastQa.setAnswer(role);
            qaRepo.save(lastQa);
            // Custom greeting based on type
            String intro = "";
            if ("hr".equalsIgnoreCase(interviewType)) {
                intro = "Hello, I'm your HR interviewer. Let's start your HR/behavioral interview.";
            } else {
                intro = "Hello, I'm your technical interviewer. Let's start your technical interview.";
            }
            // Save intro as a QA
            QuestionAnswer introQa = new QuestionAnswer();
            introQa.setSession(session);
            introQa.setOrderIndex(lastQa.getOrderIndex() + 1);
            introQa.setQuestion(intro);
            qaRepo.save(introQa);
            // Now generate the first real question
            String firstQuestion = aiService.generateQuestion(role, List.of(), List.of(), interviewType);
            QuestionAnswer qa = new QuestionAnswer();
            qa.setSession(session);
            qa.setOrderIndex(introQa.getOrderIndex() + 1);
            qa.setQuestion(firstQuestion);
            qaRepo.save(qa);
            SessionResponse resp = new SessionResponse();
            resp.setSessionId(session.getId());
            resp.setTopic(session.getTopic());
            resp.setStartedAt(session.getStartedAt());
            resp.setCurrentQuestion(firstQuestion);
            resp.setFeedbackText("");
            return resp;
        }

        // Usual feedback → next question loop
        lastQa.setAnswer(req.getAnswer());
        Map<String, Object> feedbackMap = aiService.generateFeedback(lastQa.getQuestion(), req.getAnswer(), session.getInterviewType());
        String feedback = (String) feedbackMap.getOrDefault("feedback", "");
        int score = (int) feedbackMap.getOrDefault("score", 0);
        List<String> strengths = (List<String>) feedbackMap.getOrDefault("strengths", new ArrayList<>());
        List<String> improvements = (List<String>) feedbackMap.getOrDefault("improvements", new ArrayList<>());
        try {
            lastQa.setStrengths(mapper.writeValueAsString(strengths));
            lastQa.setImprovements(mapper.writeValueAsString(improvements));
        } catch (Exception e) {
            lastQa.setStrengths("[]");
            lastQa.setImprovements("[]");
        }
        lastQa.setScore(score);
        lastQa.setFeedback(feedback);
        qaRepo.save(lastQa);
        List<String> prevQuestions = qaList.stream().map(QuestionAnswer::getQuestion).collect(Collectors.toList());
        List<String> prevAnswers = qaList.stream().map(qa -> qa.getAnswer() == null ? "" : qa.getAnswer()).collect(Collectors.toList());
        String nextQuestion = aiService.generateQuestion(session.getRole(), prevQuestions, prevAnswers, session.getInterviewType());
        if (nextQuestion == null || nextQuestion.trim().isEmpty()) {
            nextQuestion = "Let's continue. Can you tell me about a challenge you faced in your field and how you overcame it?";
        }
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
        resp.setFeedbackText(feedback);
        // Build feedback as a list of objects for the frontend (for summary view)
        List<Map<String, Object>> feedbackList = new ArrayList<>();
        Map<String, Object> feedbackObj = new HashMap<>();
        feedbackObj.put("score", score);
        feedbackObj.put("strengths", strengths);
        feedbackObj.put("improvements", improvements);
        feedbackList.add(feedbackObj);
        resp.setFeedback(feedbackList);
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
        
        ObjectMapper mapper = new ObjectMapper(); // Added this line
        
        // Aggregate scores, strengths, improvements
        int totalScore = 0;
        int count = 0;
        List<String> allStrengths = new ArrayList<>();
        List<String> allImprovements = new ArrayList<>();
        try {
            for (QuestionAnswer qa : qaList) {
                // Only include scores from questions that were actually answered (not greetings)
                if (qa.getScore() > 0 && qa.getAnswer() != null && !qa.getAnswer().trim().isEmpty()) {
                    totalScore += qa.getScore();
                    count++;
                    List<String> s = mapper.readValue(qa.getStrengths(), List.class);
                    List<String> i = mapper.readValue(qa.getImprovements(), List.class);
                    allStrengths.addAll(s);
                    allImprovements.addAll(i);
                }
            }
        } catch (Exception e) {
            // ignore
        }
        int overallScore = count > 0 ? Math.round((float) totalScore / count) : 0;
        String summary = aiService.summarizeSession(session.getTopic(), questions, answers, feedbacks, null);
        SessionResponse resp = new SessionResponse();
        resp.setSessionId(session.getId());
        resp.setTopic(session.getTopic());
        resp.setStartedAt(session.getStartedAt());
        resp.setEndedAt(session.getEndedAt());
        resp.setSummary(summary);
        resp.setFeedbackText("");
        resp.setOverallScore(overallScore);
        // Always set feedback as a non-null array
        List<Map<String, Object>> feedbackList = new ArrayList<>();
        if (qaList != null) {
            for (QuestionAnswer qa : qaList) {
                Map<String, Object> feedbackObj = new HashMap<>();
                feedbackObj.put("score", qa.getScore());
                try {
                    feedbackObj.put("strengths", mapper.readValue(qa.getStrengths(), List.class));
                    feedbackObj.put("improvements", mapper.readValue(qa.getImprovements(), List.class));
                } catch (Exception e) {
                    feedbackObj.put("strengths", new ArrayList<>());
                    feedbackObj.put("improvements", new ArrayList<>());
                }
                feedbackList.add(feedbackObj);
            }
        }
        resp.setFeedback(feedbackList);
        resp.setSummaryStrengths(allStrengths);
        resp.setSummaryImprovements(allImprovements);
        return resp;
    }
} 