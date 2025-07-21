import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Import Link for routing
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
import Navbar from '@/components/Navbar';
import Contact from './Contact';

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
    <section className="w-full min-h-[60vh] relative bg-black overflow-hidden">
      {/* Mobile: Full background image with overlay */}
      <div className="block md:hidden absolute inset-0 w-full h-full z-0">
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
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90 z-20" />
      </div>
      {/* Desktop: Split layout */}
      <div className="hidden md:flex w-full h-full min-h-[60vh] flex-row items-stretch justify-center relative z-10">
        {/* Left: Image slideshow */}
        <div className="relative w-1/2 h-auto flex-shrink-0 overflow-hidden">
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
        {/* Right: Content */}
        <div className="w-1/2 flex items-center justify-center px-4 py-8 md:py-0 bg-transparent">
          <div className="flex flex-col items-center md:items-start w-full max-w-xl mx-auto md:ml-0 gap-4 md:gap-0">
            <img src="/logo-white.png" alt="PREPZA Logo" className="h-16 w-16 md:h-[100px] md:w-[100px] object-contain mb-4 mx-auto" />
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold mb-4 text-center md:text-left" style={{color: '#7fe3e0', textShadow: '0 2px 16px #18404a44'}}>AI-Powered Interview Platform</h1>
            <p className="text-base sm:text-lg md:text-xl mb-8 min-h-[56px] text-center md:text-left" style={{color: '#aaf2f0', letterSpacing: '0.01em', textShadow: '0 1px 8px #18404a22'}}>
              {typingSubtitle}
              <span className="inline-block w-2 h-6 align-middle" style={{background: '#aaf2f0', animation: 'blink 1s steps(1) infinite', marginLeft: '0.25rem', borderRadius: '0.125rem', verticalAlign: 'middle'}}></span>
            </p>
            <a
              href="#topics"
              onClick={handleGetStarted}
              className="inline-block w-full md:w-auto px-8 py-3 rounded-full font-semibold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 focus:scale-105 hover:shadow-2xl text-center"
              style={{background: '#7fe3e0', color: '#18404a', boxShadow: '0 2px 16px #18404a33'}}
              onMouseOver={e => e.currentTarget.style.background = '#5ff5e0'}
              onMouseOut={e => e.currentTarget.style.background = '#7fe3e0'}
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
      {/* Mobile: Overlay content centered */}
      <div className="md:hidden relative z-30 flex flex-col items-center justify-center w-full min-h-[60vh] px-4 py-10 text-center">
        <img src="/logo-white.png" alt="PREPZA Logo" className="h-16 w-16 object-contain mb-4 mx-auto" />
        <h1 className="text-3xl font-extrabold mb-4" style={{color: '#7fe3e0', textShadow: '0 2px 16px #18404a44'}}>AI-Powered Interview Platform</h1>
        <p className="text-lg mb-8 min-h-[56px]" style={{color: '#aaf2f0', letterSpacing: '0.01em', textShadow: '0 1px 8px #18404a22'}}>
          {typingSubtitle}
          <span className="inline-block w-2 h-6 align-middle" style={{background: '#aaf2f0', animation: 'blink 1s steps(1) infinite', marginLeft: '0.25rem', borderRadius: '0.125rem', verticalAlign: 'middle'}}></span>
      </p>
      <a
        href="#topics"
        onClick={handleGetStarted}
          className="inline-block w-full px-8 py-3 rounded-full font-semibold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 focus:scale-105 hover:shadow-2xl text-center"
          style={{background: '#7fe3e0', color: '#18404a', boxShadow: '0 2px 16px #18404a33'}}
          onMouseOver={e => e.currentTarget.style.background = '#5ff5e0'}
          onMouseOut={e => e.currentTarget.style.background = '#7fe3e0'}
      >
        Get Started
      </a>
      </div>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
};

const testimonials = [
  {
    name: 'Hooria Z',
    text: 'PREPZA gave me the confidence to ace my technical interview. The questions felt just like the real thing!',
    avatar: '/hooria.jpg',
  },
  {
    name: 'Rida M',
    text: 'PREPZA made practicing for HR interviews fun and effective. The AI questions were so helpful!',
    avatar: '/rida.jpg',
  },
  {
    name: 'Fatima S',
    text: 'The HR round practice was so realistic and helped me improve my soft skills. Highly recommended!',
    avatar: '/fatima.jpg',
  },

  {
    name: 'Amaar A',
    text: 'The best interview prep platform I have used. The questions and feedback are top-notch!',
    avatar: '/amaar.jpg',
  },
  {
    name: 'Farhan K',
    text: 'I loved the instant feedback and the modern interface. PREPZA helped me land my dream job!',
    avatar: '/farhan.jpg',
  },
  {
    name: 'Mehwish S',
    text: 'The technical interview prep was spot on. I felt prepared and confident going into my interviews.',
    avatar: '/mehwish.jpg',
  },
 

];

const Footer = ({ isInInterview, onRequestLeave }: { isInInterview: boolean; onRequestLeave: (path: string) => void }) => {
  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Features', href: '#features' },
    { name: 'Topics', href: '#topics' },
    { name: 'GitHub', href: 'https://github.com/QaimMehdi/AI-Powered-Interview-Practice-Platform', external: true },
    { name: 'Contact', href: '/contact' }, // Change to route
  ];

  const navigate = useNavigate();

  return (
    <footer className="w-full bg-[#1a1a1a] border-t-2 border-t-[#4fd1c5] py-10 px-4 text-gray-400 font-sans mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Logo/Brand */}
        <div className="flex items-center gap-3 mb-6 md:mb-0" style={{height: '96px', width: '96px', overflow: 'visible'}}>
          <img
            src="/logo-white.png"
            alt="Prepza Logo"
            className="object-contain transition-transform duration-300 hover:scale-125"
            style={{
              height: '96px',
              width: '96px',
              position: 'relative',
              zIndex: 2
            }}
          />
          <span className="text-2xl font-extrabold text-white tracking-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}></span>
        </div>
        {/* Navigation Links */}
        <nav className="flex flex-col md:flex-row gap-4 md:gap-8 items-center text-base font-medium">
          {navLinks.map((link) => (
            <span
              key={link.name}
              onClick={() => link.external ? window.open(link.href, '_blank') : link.href === '/contact' ? navigate('/contact') : onRequestLeave(link.href)}
              className="cursor-pointer hover:text-[#4fd1c5] transition-colors"
            >
              {link.name}
            </span>
          ))}
        </nav>
        {/* Social Icons */}
        <div className="flex gap-4 mt-6 md:mt-0">
          <a href="https://github.com/QaimMehdi/AI-Powered-Interview-Practice-Platform" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-[#4fd1c5] transition-colors">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.699 1.028 1.592 1.028 2.683 0 3.842-2.338 4.687-4.566 4.936.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .268.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" /></svg>
          </a>
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-[#4fd1c5] transition-colors">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 19c11 0 13-9 13-13v-.59A9.72 9.72 0 0022 3.13a9.3 9.3 0 01-2.65.73A4.62 4.62 0 0021.4 2.1a9.29 9.29 0 01-2.93 1.12A4.61 4.61 0 0012 6.07c0 .36.04.71.11 1.05A13.09 13.09 0 013 3.16s-4 9 5 13a13.07 13.07 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0024 4.59a9.3 9.3 0 01-2.65.73A4.62 4.62 0 0021.4 2.1z" /></svg>
          </a>
          <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-[#4fd1c5] transition-colors">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8a6 6 0 016 6v5a2 2 0 01-2 2H4a2 2 0 01-2-2v-5a6 6 0 016-6h8zm-6 8v-4m4 4v-4m-8 4v-4" /></svg>
          </a>
        </div>
      </div>
      <div className="mt-8 text-center text-sm text-gray-500" style={{fontFamily: 'Open Sans, Montserrat, sans-serif'}}>
        © 2025 Prepza. All rights reserved.
      </div>
    </footer>
  );
};

export { Footer };

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

  const navigate = useNavigate();
  const location = useLocation();
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  // Show hero only on topic selection
  const showHero = state.currentPhase === 'topic-selection';
  
  // Check if user is in an active interview
  const isInInterview = state.currentPhase !== 'topic-selection';

  const handleLogoClick = () => {
    if (state.currentPhase !== 'topic-selection') {
      setShowLeaveDialog(true);
    }
    // If already on topic selection, do nothing
  };

  const handleRequestLeave = (path: string) => {
    if (isInInterview) {
      setShowLeaveDialog(true);
    } else {
      if (path === '#' || path === '/#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate(path);
      }
    }
  };

  const confirmLeave = () => {
    setShowLeaveDialog(false);
    resetInterview();
  };

  const renderCurrentPhase = () => {
    switch (state.currentPhase) {
      case 'topic-selection':
        return <TopicSelection />;
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
        return <TopicSelection />;
    }
  };

  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const testimonialTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (testimonialTimeout.current) clearTimeout(testimonialTimeout.current);
    testimonialTimeout.current = setTimeout(() => {
      setTestimonialIdx((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => { if (testimonialTimeout.current) clearTimeout(testimonialTimeout.current); };
  }, [testimonialIdx]);

  // Scroll to section on hash change or mount
  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.replace('#', ''));
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 0);
      }
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar 
        onLogoClick={() => isInInterview ? handleRequestLeave('/') : navigate('/')}
        isInInterview={isInInterview}
        onRequestLeave={handleRequestLeave}
      />
      {showHero && <Hero />}
      {/* Features Section */}
      <section id="features" className="w-full py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-4 tracking-tight">Features</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Everything you need to ace your next interview—powered by AI, designed for real results.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#f8feff] rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-[#4fd1c5]/20 flex items-center justify-center mb-5">
                <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="#13b5b1"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              </div>
              <h3 className="text-xl font-bold text-[#18404a] mb-2">AI-Powered Questions</h3>
              <p className="text-gray-600">Get realistic, adaptive interview questions generated by advanced AI for every session.</p>
            </div>
            {/* Feature 2 */}
            <div className="bg-[#f8feff] rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-[#4fd1c5]/20 flex items-center justify-center mb-5">
                <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="#13b5b1"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2a4 4 0 018 0v2M12 7a4 4 0 100 8 4 4 0 000-8z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-[#18404a] mb-2">Real-Time Feedback</h3>
              <p className="text-gray-600">Instantly see your strengths and areas to improve after every answer, with actionable AI feedback.</p>
            </div>
            {/* Feature 3 */}
            <div className="bg-[#f8feff] rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-[#4fd1c5]/20 flex items-center justify-center mb-5">
                <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="#13b5b1"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M12 4a4 4 0 014 4v4a4 4 0 01-8 0V8a4 4 0 014-4z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-[#18404a] mb-2">Topic & Mode Selection</h3>
              <p className="text-gray-600">Practice technical or HR interviews, tailored to your goals and experience level.</p>
            </div>
            {/* Feature 4 */}
            <div className="bg-[#f8feff] rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-[#4fd1c5]/20 flex items-center justify-center mb-5">
                <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="#13b5b1"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 17a4 4 0 004 4h10a4 4 0 004-4V7a4 4 0 00-4-4H7a4 4 0 00-4 4v10z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-[#18404a] mb-2">Progress Tracking</h3>
              <p className="text-gray-600">Visualize your improvement over time and track your interview readiness with detailed analytics.</p>
            </div>
          </div>
        </div>
      </section>
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12" id="topics">
        {renderCurrentPhase()}
      </main>
      {/* Testimonials Section */}
      <section className="w-full bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">What Our Users Say</h2>
          <p className="text-gray-500 text-lg">Real feedback from PREPZA users who landed their dream jobs.</p>
        </div>
        <div className="flex justify-center items-center min-h-[320px] relative">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`bg-gray-50 rounded-2xl shadow-lg p-8 flex flex-col items-center transition-all duration-700 ease-in-out absolute w-full max-w-md mx-auto
                ${i === testimonialIdx ? 'opacity-100 scale-100 z-10 pointer-events-auto hover:scale-105 hover:shadow-2xl hover:ring-2 hover:ring-accent/40' : 'opacity-0 scale-95 z-0 pointer-events-none'}`}
              style={{
                transitionProperty: 'opacity, transform',
              }}
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 overflow-hidden">
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="text-2xl font-bold text-primary">{t.name[0]}</span>
                )}
              </div>
              <p className="text-gray-700 text-base mb-4 italic text-center">“{t.text}”</p>
              <div className="text-primary font-semibold text-lg">{t.name}</div>
            </div>
          ))}
        </div>
      </section>
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

export default Index;

// Add global smooth scroll style
if (typeof window !== 'undefined') {
  document.documentElement.style.scrollBehavior = 'smooth';
}
