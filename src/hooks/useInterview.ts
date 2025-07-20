import { useState, useCallback } from 'react';
import { InterviewState, InterviewSession, TopicType, Question, Answer, Feedback } from '@/types/interview';
import { toast } from '@/hooks/use-toast';

export const useInterview = () => {
  const [state, setState] = useState<InterviewState>({
    currentSession: null,
    isRecording: false,
    isAvatarSpeaking: false,
    currentPhase: 'topic-selection'
  });

  // Mock data for development (will be replaced with API calls)
  const mockQuestions: Record<TopicType, Question[]> = {
    'java-oop': [
      {
        id: '1',
        text: 'Explain the four pillars of Object-Oriented Programming and provide examples for each.',
        topic: 'java-oop',
        difficulty: 'Medium',
        expectedDuration: 5,
        followUpQuestions: ['How does encapsulation help in code maintainability?']
      },
      {
        id: '2',
        text: 'What is the difference between method overloading and method overriding in Java?',
        topic: 'java-oop',
        difficulty: 'Easy',
        expectedDuration: 3
      }
    ],
    'data-structures': [
      {
        id: '3',
        text: 'Explain the time complexity of different operations in a HashMap vs TreeMap.',
        topic: 'data-structures',
        difficulty: 'Medium',
        expectedDuration: 4
      }
    ],
    'behavioral': [
      {
        id: '4',
        text: 'Tell me about a time when you had to work with a difficult team member.',
        topic: 'behavioral',
        difficulty: 'Medium',
        expectedDuration: 5
      }
    ],
    'system-design': [
      {
        id: '5',
        text: 'Design a URL shortening service like bit.ly. What are the main components?',
        topic: 'system-design',
        difficulty: 'Hard',
        expectedDuration: 15
      }
    ],
    'algorithms': [
      {
        id: '6',
        text: 'Implement a function to reverse a linked list and explain your approach.',
        topic: 'algorithms',
        difficulty: 'Medium',
        expectedDuration: 10
      }
    ],
    'react': [
      {
        id: '7',
        text: 'Explain the difference between useState and useEffect hooks in React.',
        topic: 'react',
        difficulty: 'Easy',
        expectedDuration: 3
      }
    ]
  };

  const startInterview = useCallback((topic: string) => {
    // Map new topic keys to existing ones with questions
    let mappedTopic = topic;
    if (topic === 'technical') mappedTopic = 'java-oop';
    if (topic === 'hr') mappedTopic = 'behavioral';
    const questions = mockQuestions[mappedTopic] || [];
    const session: InterviewSession = {
      id: Date.now().toString(),
      topic,
      startTime: new Date(),
      status: 'in-progress',
      questions,
      answers: [],
      feedback: [],
      currentQuestionIndex: 0
    };

    setState(prev => ({
      ...prev,
      currentSession: session,
      currentPhase: 'interview'
    }));

    toast({
      title: 'Interview Started',
      description: `Your ${topic} interview has begun. Good luck!`
    });
  }, []);

  const submitAnswer = useCallback((answerText: string) => {
    if (!state.currentSession) return;

    const currentQuestion = state.currentSession.questions[state.currentSession.currentQuestionIndex];
    if (!currentQuestion) return;

    const answer: Answer = {
      id: Date.now().toString(),
      questionId: currentQuestion.id,
      text: answerText,
      timestamp: new Date(),
      duration: 60 // Mock duration
    };

    // Mock feedback generation (will be replaced with AI API call)
    const feedback: Feedback = {
      id: Date.now().toString(),
      answerId: answer.id,
      score: Math.floor(Math.random() * 4) + 7, // Random score 7-10
      strengths: ['Clear explanation', 'Good structure'],
      improvements: ['Could provide more examples', 'Consider edge cases'],
      detailedFeedback: 'Your answer demonstrates good understanding of the concept. Consider providing more practical examples to strengthen your response.',
      overallRating: 'good'
    };

    setState(prev => {
      if (!prev.currentSession) return prev;

      const updatedSession = {
        ...prev.currentSession,
        answers: [...prev.currentSession.answers, answer],
        feedback: [...prev.currentSession.feedback, feedback],
        currentQuestionIndex: prev.currentSession.currentQuestionIndex + 1
      };

      // Check if interview is complete
      if (updatedSession.currentQuestionIndex >= updatedSession.questions.length) {
        updatedSession.status = 'completed';
        updatedSession.endTime = new Date();
        updatedSession.overallScore = Math.floor(
          updatedSession.feedback.reduce((sum, f) => sum + f.score, 0) / updatedSession.feedback.length
        );
      }

      return {
        ...prev,
        currentSession: updatedSession,
        currentPhase: updatedSession.status === 'completed' ? 'summary' : 'interview'
      };
    });

    // Simulate AI feedback delay
    setState(prev => ({ ...prev, isAvatarSpeaking: true }));
    setTimeout(() => {
      setState(prev => ({ ...prev, isAvatarSpeaking: false }));
    }, 2000);

  }, [state.currentSession]);

  const nextQuestion = useCallback(() => {
    if (!state.currentSession) return;

    setState(prev => {
      if (!prev.currentSession) return prev;
      
      return {
        ...prev,
        currentPhase: 'interview'
      };
    });
  }, [state.currentSession]);

  const endInterview = useCallback(() => {
    setState(prev => {
      if (!prev.currentSession) return prev;

      const updatedSession = {
        ...prev.currentSession,
        status: 'completed' as const,
        endTime: new Date(),
        overallScore: prev.currentSession.feedback.length > 0 
          ? Math.floor(prev.currentSession.feedback.reduce((sum, f) => sum + f.score, 0) / prev.currentSession.feedback.length)
          : 0
      };

      return {
        ...prev,
        currentSession: updatedSession,
        currentPhase: 'summary'
      };
    });

    toast({
      title: 'Interview Completed',
      description: 'Thank you for completing the interview. Review your feedback below.'
    });
  }, []);

  const resetInterview = useCallback(() => {
    setState({
      currentSession: null,
      isRecording: false,
      isAvatarSpeaking: false,
      currentPhase: 'topic-selection',
      // Add a unique key to force re-render
      _resetKey: Date.now(),
    } as any);
  }, []);

  return {
    state,
    startInterview,
    submitAnswer,
    nextQuestion,
    endInterview,
    resetInterview,
    setRecording: (recording: boolean) => 
      setState(prev => ({ ...prev, isRecording: recording })),
    setAvatarSpeaking: (speaking: boolean) => 
      setState(prev => ({ ...prev, isAvatarSpeaking: speaking }))
  };
};