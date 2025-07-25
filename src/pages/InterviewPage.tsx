import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInterview } from '@/hooks/useInterview';
import ChatInterview, { ChatMessage } from '@/components/interview/ChatInterview';
import { InterviewSummary } from '@/components/interview/InterviewSummary';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AIAvatar } from '@/components/interview/AIAvatar';

const InterviewPage = () => {
  const { topic } = useParams();
  const navigate = useNavigate();
  const {
    state,
    startInterview,
    submitAnswer,
    endInterview,
    resetInterview,
    loading
  } = useInterview();

  // Chat messages state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  // Typing indicator state
  const [showTyping, setShowTyping] = useState(false);
  // Modal state for leave confirmation
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  // On interview start, add the first AI message
  useEffect(() => {
    if (topic && state.currentPhase === 'topic-selection') {
      startInterview(topic);
    }
    if (!topic) navigate('/');
  }, [topic, state.currentPhase, startInterview, navigate]);

  // When session starts or changes, add the first AI message
  useEffect(() => {
    if (state.currentPhase === 'interview' && state.currentSession) {
      const firstQ = state.currentSession.questions[0]?.text;
      if (firstQ) {
        setChatMessages([{ sender: 'ai', text: firstQ }]);
      }
    }
    if (state.currentPhase === 'summary' && state.currentSession) {
      // Add a summary message from the AI
      setChatMessages(prev => [
        ...prev,
        { sender: 'ai' as const, text: 'Great job! Here is your interview summary and feedback. You can review your answers and see areas for improvement below.' }
      ]);
    }
  }, [state.currentPhase, state.currentSession]);

  // Handle sending a user answer
  const handleSend = async (text: string) => {
    setChatMessages(prev => [...prev, { sender: 'user', text }]);
    setShowTyping(true);
    await submitAnswer(text);
    setShowTyping(false);
    // After answer, get the next AI question (if any)
    const nextIdx = state.currentSession?.currentQuestionIndex;
    const nextQ = nextIdx !== undefined ? state.currentSession?.questions[nextIdx]?.text : undefined;
    if (nextQ) {
      setChatMessages(prev => [...prev, { sender: 'ai', text: nextQ }]);
    }
  };

  // Only show interview interface if in interview/summary phase
  const isInInterview = ['interview', 'summary'].includes(state.currentPhase);
  if (!isInInterview) return null;

  // Centralized leave logic
  const handleRequestLeave = (path: string) => {
    setPendingPath(path);
    setShowLeaveDialog(true);
  };

  const confirmLeave = () => {
    setShowLeaveDialog(false);
    resetInterview();
    if (pendingPath) {
      navigate(pendingPath);
    }
  };

  // Typing indicator logic
  const chatWithTyping = showTyping && state.currentPhase === 'interview'
    ? [...chatMessages, { sender: 'ai' as const, text: 'AI is typing...' }]
    : chatMessages;

  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar 
        onLogoClick={() => handleRequestLeave('/')} 
        isInInterview={isInInterview} 
        onRequestLeave={handleRequestLeave} 
      />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12 flex flex-row relative">
        {/* Floating AI Avatar on the left, outside the chat card */}
        <div className="hidden lg:flex flex-col items-center absolute -left-[10px] top-24 z-10">
          <AIAvatar isSpeaking={showTyping} isListening={false} message={showTyping ? 'Thinking...' : undefined} />
        </div>
        <div className="flex-1 flex flex-col items-center">
          {state.currentPhase === 'interview' && state.currentSession && (
            <ChatInterview
              messages={chatWithTyping}
              onSend={handleSend}
              onEnd={endInterview}
              loading={loading}
              avatarArea={null}
            />
          )}
          {state.currentPhase === 'summary' && state.currentSession && (
            <InterviewSummary
              session={state.currentSession}
              onStartNewInterview={() => {
                resetInterview();
                navigate('/');
              }}
            />
          )}
        </div>
      </main>
      <Footer isInInterview={isInInterview} onRequestLeave={handleRequestLeave} />
      {/* Centralized Leave Interview Dialog */}
      <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to exit the interview?</DialogTitle>
            <DialogDescription>
              If you exit now, you'll lose your progress on the current question. Your previous answers and feedback will be saved.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLeaveDialog(false)}>
              Continue Interview
            </Button>
            <Button variant="destructive" onClick={confirmLeave}>
              Exit Interview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InterviewPage; 