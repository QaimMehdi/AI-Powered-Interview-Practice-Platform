import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { InterviewSession } from '@/types/interview';
import { 
  Trophy, 
  Clock, 
  Target, 
  TrendingUp, 
  Calendar,
  Award,
  BarChart3,
  Lightbulb,
  ArrowRight 
} from 'lucide-react';

interface InterviewSummaryProps {
  session: InterviewSession;
  onStartNewInterview: () => void;
}

export const InterviewSummary = ({ session, onStartNewInterview }: InterviewSummaryProps) => {
  const totalQuestions = session.questions.length;
  const answeredQuestions = session.answers.length;
  const averageScore = session.feedback.length > 0 
    ? session.feedback.reduce((sum, f) => sum + f.score, 0) / session.feedback.length 
    : 0;

  const duration = session.endTime && session.startTime
    ? Math.floor((session.endTime.getTime() - session.startTime.getTime()) / 1000 / 60)
    : 0;

  const getPerformanceLevel = (score: number) => {
    if (score >= 8) return { level: 'Excellent', color: 'text-success', bg: 'bg-success' };
    if (score >= 6) return { level: 'Good', color: 'text-info', bg: 'bg-info' };
    if (score >= 4) return { level: 'Fair', color: 'text-warning', bg: 'bg-warning' };
    return { level: 'Needs Improvement', color: 'text-destructive', bg: 'bg-destructive' };
  };

  const performance = getPerformanceLevel(averageScore);

  // Aggregate strengths and improvements
  const allStrengths = session.feedback.flatMap(f => f.strengths);
  const allImprovements = session.feedback.flatMap(f => f.improvements);
  
  const topStrengths = [...new Set(allStrengths)].slice(0, 5);
  const topImprovements = [...new Set(allImprovements)].slice(0, 5);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl mb-2">Interview Complete!</CardTitle>
            <p className="text-muted-foreground">
              Congratulations on completing your {session.topic.replace('-', ' ')} interview
            </p>
          </CardHeader>
        </Card>

        {/* Overall Performance */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className={`text-3xl font-bold ${performance.color} mb-2`}>
                {averageScore.toFixed(1)}/10
              </div>
              <p className="text-sm text-muted-foreground">Overall Score</p>
              <Badge className={`mt-2 ${performance.bg} text-white`}>
                {performance.level}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
                <Target className="w-6 h-6" />
                {answeredQuestions}/{totalQuestions}
              </div>
              <p className="text-sm text-muted-foreground">Questions Answered</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
                <Clock className="w-6 h-6" />
                {duration}m
              </div>
              <p className="text-sm text-muted-foreground">Total Duration</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
                <Calendar className="w-6 h-6" />
                {session.startTime.toLocaleDateString()}
              </div>
              <p className="text-sm text-muted-foreground">Interview Date</p>
            </CardContent>
          </Card>
        </div>

        {/* Score Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Score Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {session.feedback.map((feedback, index) => {
                const question = session.questions[index];
                return (
                  <div key={feedback.id} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          Q{index + 1}: {question?.text.substring(0, 60)}...
                        </span>
                        <span className={`font-semibold ${getPerformanceLevel(feedback.score).color}`}>
                          {feedback.score}/10
                        </span>
                      </div>
                      <Progress value={feedback.score * 10} className="h-2" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Strengths and Improvements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Strengths */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-success">
                <Award className="w-5 h-5" />
                Key Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {topStrengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-success mt-2 flex-shrink-0" />
                    <span className="text-foreground">{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Improvements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-warning">
                <TrendingUp className="w-5 h-5" />
                Areas to Improve
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {topImprovements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-warning mt-2 flex-shrink-0" />
                    <span className="text-foreground">{improvement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

        </div>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-accent" />
              Recommendations for Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Practice More:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Focus on areas where you scored below 7/10</li>
                  <li>• Practice explaining concepts with examples</li>
                  <li>• Work on structuring your answers better</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Study Resources:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Review fundamental concepts in {session.topic}</li>
                  <li>• Practice similar questions online</li>
                  <li>• Consider mock interviews with peers</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Button 
            onClick={onStartNewInterview}
            size="lg"
            className="flex items-center gap-2"
          >
            Start New Interview
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => window.print()}
          >
            Export Results
          </Button>
        </div>

      </div>
    </div>
  );
};