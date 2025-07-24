package com.yourcompany.interviewplatform.dto;

import java.time.Instant;

public class SessionResponse {
    private Long sessionId;
    private String topic;
    private Instant startedAt;
    private Instant endedAt;
    private String currentQuestion;
    private String feedback;
    private String summary;

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
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
} 