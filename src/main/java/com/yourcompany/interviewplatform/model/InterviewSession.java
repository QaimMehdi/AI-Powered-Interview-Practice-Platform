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
    public java.util.List<QuestionAnswer> getQuestionAnswers() { return questionAnswers; }
    public void setQuestionAnswers(java.util.List<QuestionAnswer> questionAnswers) { this.questionAnswers = questionAnswers; }
} 