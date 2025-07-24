package com.yourcompany.interviewplatform.dto;

public class StartSessionRequest {
    private String topic;
    private String userId; // nullable for anonymous

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
} 