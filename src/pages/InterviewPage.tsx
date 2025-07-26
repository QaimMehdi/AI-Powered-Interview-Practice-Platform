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
import Loader from '@/components/ui/Loader';

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
  // Modal state for end interview confirmation
  const [showEndInterviewDialog, setShowEndInterviewDialog] = useState(false);
  // Loader state for end interview
  const [showEndLoader, setShowEndLoader] = useState(false);
  // Call status state
  const [isCallActive, setIsCallActive] = useState(false);
  // AI speaking state
  const [isAISpeaking, setIsAISpeaking] = useState(false);

  // On interview start, add the first AI message
  useEffect(() => {
    if (topic && state.currentPhase === 'topic-selection') {
      startInterview('interview', topic); // Pass 'interview' as topic, and the actual type (hr/technical) as type
    }
    if (!topic) navigate('/');
  }, [topic, state.currentPhase, startInterview, navigate]);

  // When session starts or changes, add the first AI message
  useEffect(() => {
    if (
      state.currentPhase === 'interview' &&
      state.currentSession &&
      chatMessages.length === 0
    ) {
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
  }, [state.currentPhase, state.currentSession, chatMessages.length]);

  // Handle sending a user answer
  const handleSend = async (text: string) => {
    setChatMessages(prev => [...prev, { sender: 'user', text }]);
    setShowTyping(true);
    let data: any = null;
    try {
      data = await submitAnswer(text);
    } catch (e) {
      // Ignore, will handle below
    }
    setShowTyping(false);

    if (!data) {
      setChatMessages(prev => [
        ...prev,
        { sender: 'ai', text: "Sorry, there was a problem processing your answer. Let's continue. Can you tell me about a challenge you faced in your field and how you overcame it?" }
      ]);
      return;
    }

    // Append feedback if present and is a string
    if (typeof data.feedbackText === 'string' && data.feedbackText.trim() !== '') {
      setChatMessages(prev => [...prev, { sender: 'ai', text: data.feedbackText }]);
    }

    // Append next question if present and is a string, else fallback
    if (typeof data.currentQuestion === 'string' && data.currentQuestion.trim() !== "") {
      setChatMessages(prev => [...prev, { sender: 'ai', text: data.currentQuestion }]);
    } else {
      setChatMessages(prev => [
        ...prev,
        { sender: 'ai', text: "Let's continue. Can you tell me about a challenge you faced in your field and how you overcame it?" }
      ]);
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

  // End interview confirmation logic
  const handleEndInterview = () => {
    setShowEndInterviewDialog(true);
  };

  const confirmEndInterview = async () => {
    setShowEndInterviewDialog(false);
    setShowEndLoader(true);
    await endInterview();
    setShowEndLoader(false);
  };

  // Typing indicator logic - removed since we have typewriter effect now
  const chatWithTyping = chatMessages;

  // Handle call status changes
  const handleCallStatusChange = (callActive: boolean) => {
    setIsCallActive(callActive);
    // If call is ending, also stop AI speaking
    if (!callActive) {
      setIsAISpeaking(false);
    }
  };

  // Handle AI speaking status changes
  const handleAISpeakingChange = (speaking: boolean) => {
    setIsAISpeaking(speaking);
  };

  // Always show chat if phase is 'interview', even if question is repeated or paused
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Loader overlay for end interview */}
      {showEndLoader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          <Loader />
        </div>
      )}
      <Navbar 
        onLogoClick={() => handleRequestLeave('/')} 
        isInInterview={isInInterview} 
        onRequestLeave={handleRequestLeave} 
      />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12 flex flex-row relative">
        {/* Floating AI Avatar on the left, outside the chat card - only show during interview */}
        {state.currentPhase === 'interview' && (
          <div className="hidden lg:flex flex-col items-center absolute left-[20px] top-24 z-10">
            <AIAvatar isSpeaking={isAISpeaking} isListening={false} message={isAISpeaking ? 'Speaking...' : undefined} />
          </div>
        )}
        <div className="flex-1 flex flex-col items-center">
          {state.currentPhase === 'interview' && state.currentSession && (
            <ChatInterview
              messages={chatWithTyping}
              onSend={handleSend}
              onEnd={handleEndInterview}
              loading={loading}
              avatarArea={null}
              onCallStatusChange={handleCallStatusChange}
              onAISpeakingChange={handleAISpeakingChange}
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
      {/* End Interview Confirmation Dialog */}
      <Dialog open={showEndInterviewDialog} onOpenChange={setShowEndInterviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>End Interview?</DialogTitle>
            <DialogDescription>
              Are you sure you want to end this interview? You'll be taken to your results and feedback summary.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEndInterviewDialog(false)}>
              Continue Interview
            </Button>
            <Button variant="default" onClick={confirmEndInterview} className="text-white">
              End Interview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InterviewPage; 