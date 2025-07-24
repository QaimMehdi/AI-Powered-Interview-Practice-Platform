package com.yourcompany.interviewplatform.dto;

public class AnswerRequest {
    private Long sessionId;
    private String answer;

    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }
    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }
} 