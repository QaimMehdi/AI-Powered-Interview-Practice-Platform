package com.yourcompany.interviewplatform.ai;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AIService {
    public String generateQuestion(String topic, List<String> previousQuestions, List<String> previousAnswers, String type) {
        // TODO: Integrate with LangChain4j + Gemini
        return "[AI] Next question for topic: " + topic + " (type: " + type + ")";
    }

    public String generateFeedback(String question, String answer, String type) {
        // TODO: Integrate with LangChain4j + Gemini
        return "[AI] Feedback for answer: " + answer + " (type: " + type + ")";
    }

    public String summarizeSession(String topic, List<String> questions, List<String> answers, List<String> feedbacks, String type) {
        // TODO: Integrate with LangChain4j + Gemini
        return "[AI] Interview summary and improvement tips for topic: " + topic + " (type: " + type + ")";
    }
} 