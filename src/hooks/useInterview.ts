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
  const startInterview = useCallback(async (topic: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
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
      // Update session with new question and answer
      setState(prev => {
        if (!prev.currentSession) return prev;
        const newAnswer = {
          id: Date.now().toString(),
          questionId: prev.currentSession.questions[prev.currentSession.currentQuestionIndex].id,
          text: answerText,
          timestamp: new Date(),
          duration: 60
        };
        const newQuestion = data.nextQuestion
          ? {
              id: (prev.currentSession.questions.length + 1).toString(),
              text: data.nextQuestion,
              topic: prev.currentSession.topic,
              difficulty: 'Medium' as const,
              expectedDuration: 5
            }
          : null;
        const updatedSession = {
          ...prev.currentSession,
          answers: [...prev.currentSession.answers, newAnswer],
          questions: newQuestion
            ? [...prev.currentSession.questions, newQuestion]
            : prev.currentSession.questions,
          currentQuestionIndex: newQuestion
            ? prev.currentSession.currentQuestionIndex + 1
            : prev.currentSession.currentQuestionIndex
        };
        // If no more questions, go to summary
        if (!newQuestion) {
          updatedSession.status = 'completed';
          updatedSession.endTime = new Date();
          return {
            ...prev,
            currentSession: updatedSession,
            currentPhase: 'summary'
          };
        }
        return {
          ...prev,
          currentSession: updatedSession,
          currentPhase: 'interview'
        };
      });
    } catch (err) {
      toast({ title: 'Error', description: 'Could not submit answer.' });
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
      setState(prev => {
        if (!prev.currentSession) return prev;
        const updatedSession = {
          ...prev.currentSession,
          status: 'completed' as const,
          endTime: new Date(),
          overallScore: data.overallScore || 0
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