package com.yourcompany.interviewplatform.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;
import com.fasterxml.jackson.databind.ObjectMapper;

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
        
        if ("hr".equalsIgnoreCase(type)) {
            // HR/Behavioral Interview Prompt
            prompt.append("You are an HR interviewer conducting a behavioral interview. ");
            prompt.append("You must NOT ask any technical, coding, or programming questions. Only ask behavioral, situational, or soft skills questions. ");
            prompt.append("Focus on: teamwork, leadership, conflict resolution, problem-solving, communication, adaptability, work ethic, and past experiences. ");
            prompt.append("Use the STAR method framework (Situation, Task, Action, Result) in your questions. ");
            prompt.append("The candidate is applying for: '").append(role).append("'. ");
            prompt.append("Ask relevant behavioral questions for this role. ");
            prompt.append("Examples: 'Tell me about a time when...', 'How would you handle...', 'Describe a situation where...' ");
        } else {
            // Technical Interview Prompt
            prompt.append("You are a technical interviewer conducting a coding/technical interview. ");
            prompt.append("Ask SHORT, specific technical questions (max 2-3 sentences). ");
            prompt.append("Focus on: programming concepts, algorithms, data structures, system design, debugging, optimization, and technical problem-solving. ");
            prompt.append("Ask for specific implementations, not just definitions. ");
            prompt.append("The candidate is applying for: '").append(role).append("'. ");
            prompt.append("Ask questions relevant to this specific technical role. ");
            prompt.append("Examples: 'How would you implement a hash table from scratch?', 'Explain the time complexity of quicksort and when you'd use it', 'Design a system to handle 1 million concurrent users', 'Write code to find the longest palindrome in a string' ");
        }
        
        prompt.append("Keep questions SHORT and CONCISE. Never answer the questions yourself. Never end the interview unless the user says so. ");
        prompt.append("Do not repeat previous questions. Gradually increase difficulty based on previous answers. ");
        prompt.append("If the previous answer was poor, ask a simpler question. If it was excellent, ask a more challenging one. ");
        
        if (!previousQuestions.isEmpty()) {
            prompt.append("Previous questions asked: ").append(String.join(" | ", previousQuestions)).append(". ");
        }
        if (!previousAnswers.isEmpty()) {
            prompt.append("Previous answers given: ").append(String.join(" | ", previousAnswers)).append(". ");
            prompt.append("Consider the quality of previous answers when choosing the next question. ");
        }
        
        prompt.append("Ask ONE SHORT, specific question now (max 2-3 sentences). Make it require a detailed response but keep the question itself concise.");
        
        return callGemini(prompt.toString());
    }

    public Map<String, Object> generateFeedback(String question, String answer, String type) {
        // Analyze the answer first to determine the type of response
        String answerLower = answer.toLowerCase().trim();
        boolean isRefusal = answerLower.contains("no") && (answerLower.contains("tell") || answerLower.contains("answer") || answerLower.contains("say"));
        boolean isVague = answer.length() < 20 || answerLower.contains("i don't know") || answerLower.contains("not sure");
        boolean isOffensive = answerLower.contains("fuck") || answerLower.contains("shit") || answerLower.contains("damn");
        boolean isEmpty = answer.trim().isEmpty() || answer.equals(".");
        boolean isDetailed = answer.length() > 120 || answer.split("\\n").length > 2;
        boolean asksForExplanation = answerLower.contains("explain") || answerLower.contains("why") || answerLower.contains("how") || answerLower.contains("what") || answerLower.contains("can you");
        
        // Detect unprofessional/unacceptable behavior
        boolean isUnprofessional = answerLower.contains("not in the mood") || 
                                  answerLower.contains("don't feel like") || 
                                  answerLower.contains("can't be bothered") || 
                                  answerLower.contains("don't want to") || 
                                  answerLower.contains("not interested") || 
                                  answerLower.contains("whatever") || 
                                  answerLower.contains("i don't care") ||
                                  answerLower.contains("this is stupid") ||
                                  answerLower.contains("waste of time") ||
                                  answerLower.contains("boring") ||
                                  answerLower.contains("annoying");
        
        String prompt = "You are an expert interview coach. Analyze this " + (type != null ? type : "general") + " interview answer. ";
        prompt += "If the answer is detailed, well-structured, and covers the question thoroughly, reward it with a high score and praise. Only call an answer 'basic' if it is truly short, vague, or missing key points. If the answer is copied from a textbook or is very comprehensive, acknowledge the depth and completeness. ";
        prompt += "If the answer is vague, incomplete, or off-topic, be honest and point out what is missing. ";
        prompt += "If the answer is inappropriate, unprofessional, or shows a bad attitude (like 'not in the mood', 'don't feel like', 'whatever', etc.), be VERY harsh and direct. This is completely unacceptable in a real interview. ";
        prompt += "If the candidate asks for explanation or clarification, provide helpful guidance without giving away the complete answer. ";
        prompt += "For wrong technical answers, be constructive and educational, not harsh. ";
        prompt += "Be SPECIFIC about what was good and what needs improvement. Don't give generic feedback. ";
        prompt += "Return a JSON object with: score (1-10, integer), strengths (array of short strings), improvements (array of short strings), feedback (specific, direct string, 2-3 sentences, use Markdown). ";
        prompt += "Score honestly: 1-3 for terrible, 4-6 for poor, 7-8 for good, 9-10 for excellent. ";
        prompt += "Be specific about the answer content. Don't give generic advice. ";
        prompt += "\nQuestion: " + question + "\nAnswer: " + answer + "\nReturn ONLY a JSON object, no explanation.";
        
        String aiResponse = callGemini(prompt);
        ObjectMapper mapper = new ObjectMapper();
        try {
            Map<String, Object> result = mapper.readValue(aiResponse, Map.class);
            // Defensive: ensure all fields exist
            if (!result.containsKey("score")) result.put("score", 0);
            if (!result.containsKey("strengths")) result.put("strengths", new java.util.ArrayList<>());
            if (!result.containsKey("improvements")) result.put("improvements", new java.util.ArrayList<>());
            if (!result.containsKey("feedback")) result.put("feedback", "");
            // Post-process: if answer is unprofessional or offensive, override Gemini's response
            if (isUnprofessional) {
                result.put("score", 1);
                result.put("strengths", java.util.List.of());
                result.put("improvements", java.util.List.of("Show professionalism", "Demonstrate enthusiasm", "Take interviews seriously"));
                result.put("feedback", "**Completely unacceptable attitude.** Saying you're 'not in the mood' or showing disinterest is grounds for immediate rejection. In a real interview, this would end your candidacy instantly. You must demonstrate professionalism and enthusiasm regardless of your mood.");
            } else if (isOffensive) {
                result.put("score", 1);
                result.put("strengths", java.util.List.of());
                result.put("improvements", java.util.List.of("Maintain professionalism", "Use appropriate language", "Show respect"));
                result.put("feedback", "**Completely unprofessional.** Using inappropriate language in an interview is grounds for immediate rejection. Maintain professional communication at all times.");
            }
            return result;
        } catch (Exception e) {
            // Contextual fallback based on answer type
            Map<String, Object> fallback = new java.util.HashMap<>();
            if (isUnprofessional) {
                fallback.put("score", 1);
                fallback.put("strengths", java.util.List.of());
                fallback.put("improvements", java.util.List.of("Show professionalism", "Demonstrate enthusiasm", "Take interviews seriously"));
                fallback.put("feedback", "**Completely unacceptable attitude.** Saying you're 'not in the mood' or showing disinterest is grounds for immediate rejection. In a real interview, this would end your candidacy instantly. You must demonstrate professionalism and enthusiasm regardless of your mood.");
            } else if (isRefusal) {
                fallback.put("score", 1);
                fallback.put("strengths", java.util.List.of());
                fallback.put("improvements", java.util.List.of("Answer the question directly", "Show willingness to engage", "Demonstrate professionalism"));
                fallback.put("feedback", "**Unacceptable behavior.** Refusing to answer questions shows poor interview etiquette. In a real interview, this would end your candidacy immediately. You must engage with questions, even if you're unsure.");
            } else if (asksForExplanation) {
                fallback.put("score", 6);
                fallback.put("strengths", java.util.List.of("Shows curiosity", "Willing to learn"));
                fallback.put("improvements", java.util.List.of("Try to answer first", "Then ask for clarification"));
                fallback.put("feedback", "**Good initiative asking for clarification!** However, try to provide your best answer first, then ask for specific guidance. This shows confidence and willingness to learn.");
            } else if (isVague) {
                fallback.put("score", 3);
                fallback.put("strengths", java.util.List.of());
                fallback.put("improvements", java.util.List.of("Provide specific examples", "Explain your reasoning", "Give complete answers"));
                fallback.put("feedback", "**Too vague.** Your answer lacks substance and specific details. Interviewers need concrete examples and clear explanations. Expand your response with relevant details and experiences.");
            } else if (isOffensive) {
                fallback.put("score", 1);
                fallback.put("strengths", java.util.List.of());
                fallback.put("improvements", java.util.List.of("Maintain professionalism", "Use appropriate language", "Show respect"));
                fallback.put("feedback", "**Completely unprofessional.** Using inappropriate language in an interview is grounds for immediate rejection. Maintain professional communication at all times.");
            } else if (isEmpty) {
                fallback.put("score", 0);
                fallback.put("strengths", java.util.List.of());
                fallback.put("improvements", java.util.List.of("Provide any response", "Show engagement", "Demonstrate effort"));
                fallback.put("feedback", "**No answer provided.** This is completely unacceptable. Even saying 'I need to think about this' is better than silence. You must respond to every question.");
            } else if (isDetailed) {
                fallback.put("score", 9);
                fallback.put("strengths", java.util.List.of("Very detailed", "Comprehensive explanation", "Well-structured"));
                fallback.put("improvements", java.util.List.of("Minor improvements possible"));
                fallback.put("feedback", "**Excellent detail!** Your answer is thorough and well-structured. Keep up this level of depth and clarity in your responses.");
            } else {
                fallback.put("score", 5);
                fallback.put("strengths", java.util.List.of("Attempted to answer"));
                fallback.put("improvements", java.util.List.of("Be more specific", "Provide examples", "Explain your reasoning"));
                fallback.put("feedback", "**Basic response.** Your answer needs more depth and specificity. Provide concrete examples and explain your thought process clearly.");
            }
            return fallback;
        }
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