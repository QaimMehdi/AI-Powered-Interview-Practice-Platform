package com.yourcompany.interviewplatform.repository;

import com.yourcompany.interviewplatform.model.InterviewSession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InterviewSessionRepository extends JpaRepository<InterviewSession, Long> {
} 