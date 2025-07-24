package com.yourcompany.interviewplatform.repository;

import com.yourcompany.interviewplatform.model.QuestionAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionAnswerRepository extends JpaRepository<QuestionAnswer, Long> {
} 