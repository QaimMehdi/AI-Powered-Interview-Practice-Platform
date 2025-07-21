import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInterview } from '@/hooks/useInterview';
import { InterviewInterface } from '@/components/interview/InterviewInterface';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const InterviewPage = () => {
  const { topic } = useParams();
  const navigate = useNavigate();
  const {
    state,
    startInterview,
    submitAnswer,
    nextQuestion,
    endInterview,
    resetInterview,
    setRecording
  } = useInterview();

  // Modal state for leave confirmation
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  useEffect(() => {
    if (topic && state.currentPhase === 'topic-selection') {
      startInterview(topic);
    }
    if (!topic) navigate('/');
  }, [topic, state.currentPhase, startInterview, navigate]);

  // Only show interview interface if in interview/feedback/summary phase
  const isInInterview = ['interview', 'feedback', 'summary'].includes(state.currentPhase);
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        onLogoClick={() => handleRequestLeave('/')} 
        isInInterview={isInInterview} 
        onRequestLeave={handleRequestLeave} 
      />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12">
        {state.currentPhase === 'interview' && state.currentSession && (
          <InterviewInterface
            session={state.currentSession}
            isRecording={state.isRecording}
            isAvatarSpeaking={state.isAvatarSpeaking}
            onSubmitAnswer={submitAnswer}
            onEndInterview={endInterview}
            onToggleRecording={setRecording}
          />
        )}
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