import { useInterview } from '@/hooks/useInterview';
import { TopicSelection } from '@/components/interview/TopicSelection';
import { InterviewInterface } from '@/components/interview/InterviewInterface';
import { FeedbackDisplay } from '@/components/interview/FeedbackDisplay';
import { InterviewSummary } from '@/components/interview/InterviewSummary';

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

  const renderCurrentPhase = () => {
    switch (state.currentPhase) {
      case 'topic-selection':
        return <TopicSelection onSelectTopic={startInterview} />;
      
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

  return renderCurrentPhase();
};

export default Index;
