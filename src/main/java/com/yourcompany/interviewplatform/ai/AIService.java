package com.yourcompany.interviewplatform.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@Service
public class AIService {
    @Value("${GEMINI_API_KEY}")
    private String geminiApiKey;

    private static final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    private String callGemini(String prompt) {
        RestTemplate restTemplate = new RestTemplate();
        String url = String.format(GEMINI_URL, geminiApiKey);

        Map<String, Object> requestBody = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(Map.of("text", prompt)))
            )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-goog-api-key", geminiApiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(GEMINI_URL, entity, Map.class);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.getBody().get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                if (parts != null && !parts.isEmpty()) {
                    return (String) parts.get(0).get("text");
                }
            }
        }
        return "[Gemini] No response";
    }

    public String generateQuestion(String role, List<String> previousQuestions, List<String> previousAnswers, String type) {
        StringBuilder prompt = new StringBuilder();
        // System prompt for endless mock interview
        prompt.append("You are an AI-powered mock interview agent. ");
        prompt.append("Your goal is to simulate an endless interview session with the user for either a technical or an HR interview, based on the role the user wants to prepare for. ");
        prompt.append("Never answer the questions yourself. Never end the interview unless the user says so.\n");
        prompt.append("The user is preparing for the role: '").append(role).append("'. ");
        prompt.append("This is a ").append(type != null ? type : "general").append(" interview. ");
        if (!previousQuestions.isEmpty()) {
            prompt.append("Here are the previous questions you have already asked: ").append(String.join(" | ", previousQuestions)).append(". ");
        }
        if (!previousAnswers.isEmpty()) {
            prompt.append("Here are the user's previous answers: ").append(String.join(" | ", previousAnswers)).append(". ");
        }
        prompt.append("Now, ask the next most relevant ").append(type != null ? type : "general").append(" interview question for the role '").append(role).append("'. ");
        prompt.append("Do not repeat previous questions. Gradually increase the difficulty. After the user answers, you will give detailed feedback and then ask the next question.\n");
        prompt.append("Ask the next question now.");
        return callGemini(prompt.toString());
    }

    public String generateFeedback(String question, String answer, String type) {
        String prompt = "You are an interview coach. Give detailed feedback for the following "
                + (type != null ? type : "general") + " interview answer.\n"
                + "Question: " + question + "\n"
                + "Answer: " + answer + "\n"
                + "Feedback:";
        return callGemini(prompt);
    }

    public String summarizeSession(String topic, List<String> questions, List<String> answers, List<String> feedbacks, String type) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("You are an interview AI. Summarize this ")
              .append(type != null ? type : "general")
              .append(" interview session about ")
              .append(topic)
              .append(".\n");
        for (int i = 0; i < questions.size(); i++) {
            prompt.append("Q: ").append(questions.get(i)).append("\n");
            if (i < answers.size()) prompt.append("A: ").append(answers.get(i)).append("\n");
            if (i < feedbacks.size()) prompt.append("Feedback: ").append(feedbacks.get(i)).append("\n");
        }
        prompt.append("Give a summary and improvement tips.");
        return callGemini(prompt.toString());
    }
} 