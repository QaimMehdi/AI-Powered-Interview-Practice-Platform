import { useState, useCallback } from 'react';
import { InterviewState, InterviewSession, TopicType } from '@/types/interview';
import { toast } from '@/hooks/use-toast';

const API_BASE = 'http://localhost:8080/api/session';

export const useInterview = () => {
  const [state, setState] = useState<InterviewState>({
    currentSession: null,
    isRecording: false,
    isAvatarSpeaking: false,
    currentPhase: 'topic-selection'
  });
  const [loading, setLoading] = useState(false);

  // Start interview by calling backend
  const startInterview = useCallback(async (topic: string, type?: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, type })
      });
      if (!res.ok) throw new Error('Failed to start interview');
      const data = await res.json();
      // Map backend response to InterviewSession
      const session: InterviewSession = {
        id: data.sessionId.toString(),
        topic: data.topic,
        startTime: new Date(data.startedAt),
        status: 'in-progress',
        questions: [
          {
            id: '1',
            text: data.currentQuestion, // <-- fixed here
            topic: data.topic,
            difficulty: 'Medium' as const,
            expectedDuration: 5
          }
        ],
        answers: [],
        feedback: [],
        currentQuestionIndex: 0
      };
      setState(prev => ({ ...prev, currentSession: session, currentPhase: 'interview' }));
      toast({
        title: 'Interview Started',
        description: `Your ${topic} interview has begun. Good luck!`
      });
    } catch (err) {
      toast({ title: 'Error', description: 'Could not start interview.' });
    } finally {
      setLoading(false);
    }
  }, []);

  // Submit answer and get next question/feedback
  const submitAnswer = useCallback(async (answerText: string) => {
    if (!state.currentSession) return;
    setLoading(true);
    try {
      const sessionId = Number(state.currentSession.id);
      const res = await fetch(`${API_BASE}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, answer: answerText })
      });
      if (!res.ok) throw new Error('Failed to submit answer');
      const data = await res.json();
      setState(prev => {
        if (!prev.currentSession) return prev;
        const newAnswer = {
          id: Date.now().toString(),
          questionId: prev.currentSession.questions[prev.currentSession.currentQuestionIndex].id,
          text: answerText,
          timestamp: new Date(),
          duration: 60
        };
        
        // Map backend feedback data to frontend format
        const feedbackArray = Array.isArray(data.feedback) ? data.feedback : [];
        const mappedFeedback = feedbackArray.map((feedbackItem: any, index: number) => ({
          id: `feedback-${Date.now()}-${index}`,
          answerId: newAnswer.id,
          score: feedbackItem.score || 0,
          strengths: Array.isArray(feedbackItem.strengths) ? feedbackItem.strengths : [],
          improvements: Array.isArray(feedbackItem.improvements) ? feedbackItem.improvements : [],
          detailedFeedback: feedbackItem.feedback || '',
          overallRating: feedbackItem.score >= 8 ? 'excellent' : 
                        feedbackItem.score >= 6 ? 'good' : 
                        feedbackItem.score >= 4 ? 'fair' : 'poor'
        }));
        
        if (!data.currentQuestion) {
          const updatedSession = {
            ...prev.currentSession,
            answers: [...prev.currentSession.answers, newAnswer],
            status: 'completed' as const,
            endTime: new Date(),
            feedback: [...(prev.currentSession.feedback || []), ...mappedFeedback]
          };
          return {
            ...prev,
            currentSession: updatedSession,
            currentPhase: 'summary'
          };
        }
        const newQuestion = {
          id: (prev.currentSession.questions.length + 1).toString(),
          text: data.currentQuestion,
          topic: prev.currentSession.topic,
          difficulty: 'Medium' as const,
          expectedDuration: 5
        };
        const updatedSession = {
          ...prev.currentSession,
          answers: [...prev.currentSession.answers, newAnswer],
          questions: [...prev.currentSession.questions, newQuestion],
          feedback: [...(prev.currentSession.feedback || []), ...mappedFeedback],
          currentQuestionIndex: prev.currentSession.currentQuestionIndex + 1
        };
        return {
          ...prev,
          currentSession: updatedSession,
          currentPhase: 'interview'
        };
      });
      return data; // <-- return backend response
    } catch (err) {
      toast({ title: 'Error', description: 'Could not submit answer.' });
      return null;
    } finally {
      setLoading(false);
    }
  }, [state.currentSession]);

  // End interview and get summary
  const endInterview = useCallback(async () => {
    if (!state.currentSession) return;
    setLoading(true);
    try {
      const sessionId = Number(state.currentSession.id);
      const res = await fetch(`${API_BASE}/end`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });
      if (!res.ok) throw new Error('Failed to end interview');
      const data = await res.json();
      
      // Map backend response to frontend session structure
      setState(prev => {
        if (!prev.currentSession) return prev;
        
        // Extract feedback data from backend response
        const feedbackArray = Array.isArray(data.feedback) ? data.feedback : [];
        
        const updatedSession = {
          ...prev.currentSession,
          status: 'completed' as const,
          endTime: new Date(data.endedAt || Date.now()),
          overallScore: data.overallScore || 0,
          summary: data.summary || '',
          summaryStrengths: data.summaryStrengths || [],
          summaryImprovements: data.summaryImprovements || [],
          // Map the feedback array from backend to frontend format
          feedback: feedbackArray.map((feedbackItem: any, index: number) => ({
            id: `feedback-${index}`,
            answerId: `answer-${index}`,
            score: feedbackItem.score || 0,
            strengths: Array.isArray(feedbackItem.strengths) ? feedbackItem.strengths : [],
            improvements: Array.isArray(feedbackItem.improvements) ? feedbackItem.improvements : [],
            detailedFeedback: feedbackItem.feedback || '',
            overallRating: feedbackItem.score >= 8 ? 'excellent' : 
                          feedbackItem.score >= 6 ? 'good' : 
                          feedbackItem.score >= 4 ? 'fair' : 'poor'
          }))
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
    } catch (err) {
      toast({ title: 'Error', description: 'Could not end interview.' });
    } finally {
      setLoading(false);
    }
  }, [state.currentSession]);

  const resetInterview = useCallback(() => {
    setState({
      currentSession: null,
      isRecording: false,
      isAvatarSpeaking: false,
      currentPhase: 'topic-selection',
      _resetKey: Date.now(),
    } as any);
  }, []);

  return {
    state,
    loading,
    startInterview,
    submitAnswer,
    endInterview,
    resetInterview,
    setRecording: (recording: boolean) =>
      setState(prev => ({ ...prev, isRecording: recording })),
    setAvatarSpeaking: (speaking: boolean) =>
      setState(prev => ({ ...prev, isAvatarSpeaking: speaking }))
  };
};