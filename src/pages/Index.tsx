import React, { useState, useEffect, useRef } from 'react';
import { TopicSelection } from '@/components/interview/TopicSelection';
import { InterviewInterface } from '@/components/interview/InterviewInterface';
import { FeedbackDisplay } from '@/components/interview/FeedbackDisplay';
import { InterviewSummary } from '@/components/interview/InterviewSummary';
import { useInterview } from '@/hooks/useInterview';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const Navbar = ({ onLogoClick, isInInterview }: { onLogoClick: () => void; isInInterview: boolean }) => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [lastScrollY, setLastScrollY] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  // Persistent dark mode
  useEffect(() => {
    // On mount, check localStorage or system preference
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrolled = currentScrollY > 10;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection('up');
      }
      setScrolled(isScrolled);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (isInInterview) {
      e.preventDefault();
      return;
    }
  };

  return (
    <nav
      className={`
        w-full flex items-center justify-between px-6 py-2 bg-white shadow-sm sticky top-0 z-50 h-16
        transition-all duration-500 ease-out
        ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white/80 backdrop-blur-sm shadow-sm'}
        ${scrollDirection === 'down' && scrolled ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}
        hover:shadow-xl hover:bg-white/98
        dark:bg-gray-900/80 dark:backdrop-blur-lg dark:border-b dark:border-primary/20 dark:shadow-black/40
      `}
    >
      <div
        className="flex items-center gap-2 cursor-pointer group transition-all duration-300 hover:scale-105  hover:rounded-lg hover:px-2 hover:py-1"
        onClick={onLogoClick}
      >
        <img
          src="/logo.png"
          alt="PREPZA Logo"
          className={`
            h-[90px] w-[90px] object-contain transition-all duration-300
            ${scrolled ? 'h-[70px] w-[70px]' : 'h-[90px] w-[90px]'}
            group-hover:rotate-6 group-hover:scale-110 group-hover:drop-shadow-lg
          `}
        />
      </div>
      <div className="flex gap-6 text-base font-medium text-gray-600 dark:text-gray-200 items-center">
        <a
          href="#features"
          className={`
            hover:text-primary hover:font-semibold transition-all duration-300 relative group px-3 py-2 rounded-lg
            ${isInInterview ? 'pointer-events-none opacity-50' : 'hover:scale-110 hover:bg-primary/10 hover:shadow-md'}
          `}
          onClick={(e) => handleNavClick(e, '#features')}
        >
          <span className="relative z-10">Features</span>
          <span className="absolute inset-0 bg-primary/20 rounded-lg scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
        </a>
        <a
          href="#topics"
          className={`
            hover:text-primary hover:font-semibold transition-all duration-300 relative group px-3 py-2 rounded-lg
            ${isInInterview ? 'pointer-events-none opacity-50' : 'hover:scale-110 hover:bg-primary/10 hover:shadow-md'}
          `}
          onClick={(e) => handleNavClick(e, '#topics')}
        >
          <span className="relative z-10">Topics</span>
          <span className="absolute inset-0 bg-primary/20 rounded-lg scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
        </a>
        <a
          href="https://github.com/QaimMehdi/AI-Powered-Interview-Practice-Platform"
          target="_blank"
          rel="noopener noreferrer"
          className={`
            hover:text-primary hover:font-semibold transition-all duration-300 relative group px-3 py-2 rounded-lg
            ${isInInterview ? 'pointer-events-none opacity-50' : 'hover:scale-110 hover:bg-primary/10 hover:shadow-md'}
          `}
          onClick={(e) => handleNavClick(e, 'https://github.com/QaimMehdi/AI-Powered-Interview-Practice-Platform')}
        >
          <span className="relative z-10">GitHub</span>
          <span className="absolute inset-0 bg-primary/20 rounded-lg scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
        </a>
      </div>
      <div
        className={`
          absolute inset-0 bg-gradient-to-r from-blue-50/50 via-purple-50/50 to-pink-50/50 
          transition-opacity duration-1000 ease-out pointer-events-none
          ${scrolled ? 'opacity-100' : 'opacity-0'}
          dark:from-gray-900/80 dark:via-gray-900/80 dark:to-gray-900/80
        `}
      />
    </nav>
  );
};

const heroImages = ['/hero.png', '/hero1.jpg', '/hero2.jpg', '/hero3.jpg'];

const useTypingEffect = (texts: string[], speed = 60, pause = 1200) => {
  const [display, setDisplay] = useState('');
  const [idx, setIdx] = useState(0);
  const [char, setChar] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!deleting && char < texts[idx].length) {
      timeout = setTimeout(() => setChar(char + 1), speed);
    } else if (!deleting && char === texts[idx].length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && char > 0) {
      timeout = setTimeout(() => setChar(char - 1), speed / 2);
    } else if (deleting && char === 0) {
      setDeleting(false);
      setIdx((idx + 1) % texts.length);
    }
    setDisplay(texts[idx].slice(0, char));
    return () => clearTimeout(timeout);
  }, [char, deleting, idx, texts, speed, pause]);

  return display;
};

const Hero = () => {
  // Smooth scroll to topics section
  const handleGetStarted = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('topics');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Typing effect for subtitle
  const typingSubtitle = useTypingEffect([
    'Choose your interview topic and practice with our AI interviewer.',
    'Get real-time feedback and improve your interview skills with PREPZA.',
    'Practice. Improve. Succeed.'
  ]);

  // Slider state
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Autoplay effect (change every 6 seconds)
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [current]);

  // Remove manual navigation

  return (
    <section className="w-full min-h-[60vh] flex flex-col md:flex-row items-stretch justify-center bg-black relative overflow-hidden">
      {/* Left: Full image slideshow */}
      <div className="relative w-full md:w-1/2 h-64 md:h-auto flex-shrink-0 overflow-hidden">
        {heroImages.map((img, idx) => (
          <img
            key={img}
            src={img}
            alt={`Hero Background ${idx + 1}`}
            className={`w-full h-full object-cover transition-opacity duration-1000 absolute inset-0 ${idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            style={{ minHeight: '100%', minWidth: '100%' }}
            draggable={false}
          />
        ))}
        {/* Gradient fade overlay on the right edge for blending */}
        <div className="absolute right-0 top-0 h-full w-1/2 md:w-1/3 bg-gradient-to-l from-black via-black/70 to-transparent pointer-events-none z-20" />
      </div>
      {/* Glassmorphism card: overlap on desktop, below on mobile */}
      <div className="w-full flex items-center justify-center px-4 py-10 md:py-0 bg-transparent">
        <div className="relative z-30 flex flex-col items-center md:items-start w-full max-w-xl mx-auto rounded-3xl bg-white/20 backdrop-blur-lg shadow-2xl border border-white/30 px-6 py-10
          md:absolute md:right-8 md:top-1/2 md:-translate-y-1/2 md:w-[480px] md:mx-0">
          <img src="/logo.png" alt="PREPZA Logo" className="h-[100px] w-[100px] object-contain mb-4 mx-auto" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">AI-Powered Interview Practice</h1>
          <p className="text-lg md:text-xl text-gray-100 max-w-2xl mb-8 drop-shadow-md">
            {typingSubtitle}
            <span className="inline-block w-2 h-6 align-middle bg-white/80 animate-blink ml-1 rounded-sm" style={{verticalAlign: 'middle'}}></span>
          </p>
          <a
            href="#topics"
            onClick={handleGetStarted}
            className="inline-block px-8 py-3 rounded-full bg-primary text-white font-semibold text-lg shadow-lg hover:bg-primary-dark transition"
          >
            Get Started
          </a>
        </div>
      </div>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink { animation: blink 1s steps(1) infinite; }
      `}</style>
    </section>
  );
};

const Index = () => {
  const {
    state,
    startInterview,
    submitAnswer,
    nextQuestion,
    endInterview,
    resetInterview,
    setRecording
  } = useInterview();

  const [showNavigationDialog, setShowNavigationDialog] = useState(false);

  // Show hero only on topic selection
  const showHero = state.currentPhase === 'topic-selection';
  
  // Check if user is in an active interview
  const isInInterview = state.currentPhase !== 'topic-selection';

  const handleLogoClick = () => {
    if (state.currentPhase !== 'topic-selection') {
      setShowNavigationDialog(true);
    }
    // If already on topic selection, do nothing
  };

  const confirmNavigation = () => {
    setShowNavigationDialog(false);
    resetInterview();
  };

  const renderCurrentPhase = () => {
    switch (state.currentPhase) {
      case 'topic-selection':
        return <TopicSelection key={JSON.stringify(state)} onSelectTopic={startInterview} />;
      case 'interview':
        if (!state.currentSession) return null;
        return (
          <InterviewInterface
            session={state.currentSession}
            isRecording={state.isRecording}
            isAvatarSpeaking={state.isAvatarSpeaking}
            onSubmitAnswer={submitAnswer}
            onEndInterview={endInterview}
            onToggleRecording={setRecording}
          />
        );
      case 'feedback':
        if (!state.currentSession) return null;
        const currentQuestion = state.currentSession.questions[state.currentSession.currentQuestionIndex - 1];
        const currentAnswer = state.currentSession.answers[state.currentSession.answers.length - 1];
        const currentFeedback = state.currentSession.feedback[state.currentSession.feedback.length - 1];
        if (!currentQuestion || !currentAnswer || !currentFeedback) return null;
        return (
          <FeedbackDisplay
            question={currentQuestion}
            answer={currentAnswer}
            feedback={currentFeedback}
            onNextQuestion={nextQuestion}
            isLastQuestion={state.currentSession.currentQuestionIndex >= state.currentSession.questions.length}
          />
        );
      case 'summary':
        if (!state.currentSession) return null;
        return (
          <InterviewSummary
            session={state.currentSession}
            onStartNewInterview={resetInterview}
          />
        );
      default:
        return <TopicSelection onSelectTopic={startInterview} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar onLogoClick={handleLogoClick} isInInterview={isInInterview} />
      {showHero && <Hero />}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12" id="topics">
        {renderCurrentPhase()}
      </main>
      <footer className="w-full py-6 bg-white border-t text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} PREPZA. All rights reserved.
      </footer>

      {/* Navigation Confirmation Dialog */}
      <Dialog open={showNavigationDialog} onOpenChange={setShowNavigationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to exit the interview?</DialogTitle>
            <DialogDescription>
              If you exit now, you'll lose your progress on the current question. Your previous answers and feedback will be saved.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNavigationDialog(false)}>
              Continue Interview
            </Button>
            <Button variant="destructive" onClick={confirmNavigation}>
              Exit Interview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;

// Add global smooth scroll style
if (typeof window !== 'undefined') {
  document.documentElement.style.scrollBehavior = 'smooth';
}
