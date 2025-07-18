// Types for the interview platform

export type TopicType = 'java-oop' | 'data-structures' | 'behavioral' | 'system-design' | 'algorithms' | 'react';

export interface Topic {
  id: TopicType;
  name: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  icon: string;
}

export interface Question {
  id: string;
  text: string;
  topic: TopicType;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  expectedDuration: number; // in minutes
  followUpQuestions?: string[];
}

export interface Answer {
  id: string;
  questionId: string;
  text: string;
  timestamp: Date;
  duration: number; // in seconds
}

export interface Feedback {
  id: string;
  answerId: string;
  score: number; // 1-10
  strengths: string[];
  improvements: string[];
  detailedFeedback: string;
  suggestedResources?: string[];
  overallRating: 'poor' | 'fair' | 'good' | 'excellent';
}

export interface InterviewSession {
  id: string;
  topic: TopicType;
  startTime: Date;
  endTime?: Date;
  status: 'not-started' | 'in-progress' | 'completed' | 'paused';
  questions: Question[];
  answers: Answer[];
  feedback: Feedback[];
  currentQuestionIndex: number;
  overallScore?: number;
}

export interface InterviewState {
  currentSession: InterviewSession | null;
  isRecording: boolean;
  isAvatarSpeaking: boolean;
  currentPhase: 'topic-selection' | 'interview' | 'feedback' | 'summary';
}

// API Integration types (for future backend integration)
export interface APIQuestion {
  question: string;
  followUp?: string[];
}

export interface APIFeedback {
  score: number;
  feedback: string;
  suggestions: string[];
}

export interface APIRequest {
  topic: TopicType;
  previousAnswers?: string[];
  sessionId?: string;
}