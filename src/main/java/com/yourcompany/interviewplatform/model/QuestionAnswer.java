package com.yourcompany.interviewplatform.model;

import jakarta.persistence.*;

@Entity
public class QuestionAnswer {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private InterviewSession session;

    @Column(columnDefinition = "LONGTEXT")
    private String question;
    @Column(columnDefinition = "LONGTEXT")
    private String answer;
    @Column(columnDefinition = "LONGTEXT")
    private String feedback;
    private int orderIndex;

    private int score; // AI score 1-10
    @Column(columnDefinition = "LONGTEXT")
    private String strengths; // JSON array as string
    @Column(columnDefinition = "LONGTEXT")
    private String improvements; // JSON array as string

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
    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
    public String getStrengths() { return strengths; }
    public void setStrengths(String strengths) { this.strengths = strengths; }
    public String getImprovements() { return improvements; }
    public void setImprovements(String improvements) { this.improvements = improvements; }
} 