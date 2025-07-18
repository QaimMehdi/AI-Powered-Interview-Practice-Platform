import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AIAvatar } from './AIAvatar';
import { InterviewSession } from '@/types/interview';
import { Clock, Mic, MicOff, Send, SkipForward } from 'lucide-react';

interface InterviewInterfaceProps {
  session: InterviewSession;
  isRecording: boolean;
  isAvatarSpeaking: boolean;
  onSubmitAnswer: (answer: string) => void;
  onEndInterview: () => void;
  onToggleRecording: (recording: boolean) => void;
}

export const InterviewInterface = ({
  session,
  isRecording,
  isAvatarSpeaking,
  onSubmitAnswer,
  onEndInterview,
  onToggleRecording
}: InterviewInterfaceProps) => {
  const [answer, setAnswer] = useState('');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentQuestionTime, setCurrentQuestionTime] = useState(0);

  const currentQuestion = session.questions[session.currentQuestionIndex];
  const progress = ((session.currentQuestionIndex + 1) / session.questions.length) * 100;
  const isLastQuestion = session.currentQuestionIndex === session.questions.length - 1;

  // Timer effects
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
      setCurrentQuestionTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Reset question timer when question changes
  useEffect(() => {
    setCurrentQuestionTime(0);
  }, [session.currentQuestionIndex]);

  const handleSubmit = () => {
    if (answer.trim()) {
      onSubmitAnswer(answer.trim());
      setAnswer('');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-success text-success-foreground';
      case 'Medium':
        return 'bg-warning text-warning-foreground';
      case 'Hard':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Interview Complete</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You have completed all questions in this interview.
            </p>
            <Button onClick={onEndInterview} className="w-full">
              View Results
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - AI Avatar */}
        <div className="lg:col-span-1">
          <AIAvatar
            isSpeaking={isAvatarSpeaking}
            isListening={isRecording}
            message={isAvatarSpeaking ? "Let me provide some feedback on your answer..." : undefined}
          />
        </div>

        {/* Right Column - Interview Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Header with Progress */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Interview in Progress
                    <Badge variant="outline">
                      Question {session.currentQuestionIndex + 1} of {session.questions.length}
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Topic: {session.topic.replace('-', ' ').toUpperCase()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    Total: {formatTime(timeElapsed)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Current: {formatTime(currentQuestionTime)}
                  </div>
                </div>
              </div>
              <Progress value={progress} className="mt-4" />
            </CardHeader>
          </Card>

          {/* Question Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl">Current Question</CardTitle>
                <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                  {currentQuestion.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-foreground leading-relaxed">
                {currentQuestion.text}
              </p>
              <div className="mt-4 text-sm text-muted-foreground">
                💡 Expected duration: {currentQuestion.expectedDuration} minutes
              </div>
            </CardContent>
          </Card>

          {/* Answer Input */}
          <Card>
            <CardHeader>
              <CardTitle>Your Answer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Type your answer here or use voice recording..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="min-h-[150px] resize-none"
                disabled={isAvatarSpeaking}
              />
              
              <div className="flex items-center gap-3">
                {/* Voice Recording Button */}
                <Button
                  variant={isRecording ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => onToggleRecording(!isRecording)}
                  disabled={isAvatarSpeaking}
                >
                  {isRecording ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </Button>

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={!answer.trim() || isAvatarSpeaking}
                  className="flex-1"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Answer
                </Button>

                {/* Skip Button */}
                <Button
                  variant="outline"
                  onClick={() => onSubmitAnswer('Skipped')}
                  disabled={isAvatarSpeaking}
                >
                  <SkipForward className="w-4 h-4 mr-2" />
                  Skip
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* End Interview Option */}
          <Card className="border-destructive/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">End Interview Early</h3>
                  <p className="text-sm text-muted-foreground">
                    You can end the interview at any time to see your results
                  </p>
                </div>
                <Button 
                  variant="destructive" 
                  onClick={onEndInterview}
                  disabled={isAvatarSpeaking}
                >
                  End Interview
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};