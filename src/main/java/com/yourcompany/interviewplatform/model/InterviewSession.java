package com.yourcompany.interviewplatform.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.List;

@Entity
public class InterviewSession {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String topic;
    private String userId; // nullable for anonymous
    private Instant startedAt = Instant.now();
    private Instant endedAt;

    // New fields for AI mock interview agent
    private String role; // e.g., "Java Developer"
    private String interviewType; // "technical" or "hr"
    private boolean hasChosenRole = false;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuestionAnswer> questionAnswers;

    // getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public Instant getStartedAt() { return startedAt; }
    public void setStartedAt(Instant startedAt) { this.startedAt = startedAt; }
    public Instant getEndedAt() { return endedAt; }
    public void setEndedAt(Instant endedAt) { this.endedAt = endedAt; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getInterviewType() { return interviewType; }
    public void setInterviewType(String interviewType) { this.interviewType = interviewType; }
    public boolean isHasChosenRole() { return hasChosenRole; }
    public void setHasChosenRole(boolean hasChosenRole) { this.hasChosenRole = hasChosenRole; }
    public java.util.List<QuestionAnswer> getQuestionAnswers() { return questionAnswers; }
    public void setQuestionAnswers(java.util.List<QuestionAnswer> questionAnswers) { this.questionAnswers = questionAnswers; }
} 