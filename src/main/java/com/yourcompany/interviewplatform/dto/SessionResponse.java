package com.yourcompany.interviewplatform.dto;

import java.time.Instant;
import java.util.List;
import java.util.Map;

public class SessionResponse {
    private Long sessionId;
    private String topic;
    private Instant startedAt;
    private Instant endedAt;
    private String currentQuestion;
    private List<Map<String, Object>> feedback;
    private String feedbackText; // Add this field for the actual feedback string
    private String summary;
    private Integer overallScore; // New: overall score for the interview
    private List<String> summaryStrengths; // New: aggregated strengths
    private List<String> summaryImprovements; // New: aggregated improvements

    // getters and setters
    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }
    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }
    public java.time.Instant getStartedAt() { return startedAt; }
    public void setStartedAt(java.time.Instant startedAt) { this.startedAt = startedAt; }
    public java.time.Instant getEndedAt() { return endedAt; }
    public void setEndedAt(java.time.Instant endedAt) { this.endedAt = endedAt; }
    public String getCurrentQuestion() { return currentQuestion; }
    public void setCurrentQuestion(String currentQuestion) { this.currentQuestion = currentQuestion; }
    public List<Map<String, Object>> getFeedback() { return feedback; }
    public void setFeedback(List<Map<String, Object>> feedback) { this.feedback = feedback; }
    public String getFeedbackText() { return feedbackText; }
    public void setFeedbackText(String feedbackText) { this.feedbackText = feedbackText; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public Integer getOverallScore() { return overallScore; }
    public void setOverallScore(Integer overallScore) { this.overallScore = overallScore; }
    public List<String> getSummaryStrengths() { return summaryStrengths; }
    public void setSummaryStrengths(List<String> summaryStrengths) { this.summaryStrengths = summaryStrengths; }
    public List<String> getSummaryImprovements() { return summaryImprovements; }
    public void setSummaryImprovements(List<String> summaryImprovements) { this.summaryImprovements = summaryImprovements; }
} 