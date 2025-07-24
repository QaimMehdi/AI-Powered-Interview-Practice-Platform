package com.yourcompany.interviewplatform.model;

import jakarta.persistence.*;

@Entity
public class QuestionAnswer {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private InterviewSession session;

    @Column(length = 2000)
    private String question;
    @Column(length = 4000)
    private String answer;
    @Column(length = 4000)
    private String feedback;
    private int orderIndex;

    // getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public InterviewSession getSession() { return session; }
    public void setSession(InterviewSession session) { this.session = session; }
    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
    public int getOrderIndex() { return orderIndex; }
    public void setOrderIndex(int orderIndex) { this.orderIndex = orderIndex; }
} 