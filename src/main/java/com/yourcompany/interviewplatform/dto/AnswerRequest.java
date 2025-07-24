package com.yourcompany.interviewplatform.dto;

public class AnswerRequest {
    private Long sessionId;
    private String answer;
    private String type;

    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }
    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
} 