import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Feedback, Question, Answer } from '@/types/interview';
import { CheckCircle, AlertCircle, XCircle, ArrowRight, Lightbulb } from 'lucide-react';

interface FeedbackDisplayProps {
  question: Question;
  answer: Answer;
  feedback: Feedback;
  onNextQuestion: () => void;
  isLastQuestion: boolean;
}

export const FeedbackDisplay = ({
  question,
  answer,
  feedback,
  onNextQuestion,
  isLastQuestion
}: FeedbackDisplayProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-success';
    if (score >= 6) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 8) return <CheckCircle className="w-5 h-5 text-success" />;
    if (score >= 6) return <AlertCircle className="w-5 h-5 text-warning" />;
    return <XCircle className="w-5 h-5 text-destructive" />;
  };

  const getRatingBadge = (rating: string) => {
    const colors = {
      excellent: 'bg-success text-success-foreground',
      good: 'bg-info text-info-foreground',
      fair: 'bg-warning text-warning-foreground',
      poor: 'bg-destructive text-destructive-foreground'
    };
    return colors[rating as keyof typeof colors] || colors.fair;
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Question Feedback</CardTitle>
              <Badge className={getRatingBadge(feedback.overallRating)}>
                {feedback.overallRating.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Question Review */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Question</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground mb-4">{question.text}</p>
            <div className="flex gap-2">
              <Badge variant="outline">{question.difficulty}</Badge>
              <Badge variant="outline">{question.topic}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Your Answer */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Answer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-foreground italic">"{answer.text}"</p>
            </div>
            <div className="mt-3 text-sm text-muted-foreground">
              Duration: {Math.floor(answer.duration / 60)}m {answer.duration % 60}s
            </div>
          </CardContent>
        </Card>

        {/* Score and Rating */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              {getScoreIcon(feedback.score)}
              Score & Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(feedback.score)}`}>
                    {feedback.score}/10
                  </div>
                  <p className="text-sm text-muted-foreground">Overall Score</p>
                </div>
                <div className="flex-1">
                  <Progress value={feedback.score * 10} className="h-3" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detailed Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              
              {/* Strengths */}
              <div>
                <h4 className="font-semibold text-success mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Strengths
                </h4>
                <ul className="space-y-2">
                  {feedback.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-success mt-2 flex-shrink-0" />
                      <span className="text-foreground">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Areas for Improvement */}
              <div>
                <h4 className="font-semibold text-warning mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Areas for Improvement
                </h4>
                <ul className="space-y-2">
                  {feedback.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-warning mt-2 flex-shrink-0" />
                      <span className="text-foreground">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Detailed Comments */}
              <div>
                <h4 className="font-semibold text-info mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Detailed Comments
                </h4>
                <div className="bg-muted/30 p-4 rounded-lg border-l-4 border-info">
                  <p className="text-foreground">{feedback.detailedFeedback}</p>
                </div>
              </div>

              {/* Suggested Resources */}
              {feedback.suggestedResources && feedback.suggestedResources.length > 0 && (
                <div>
                  <h4 className="font-semibold text-accent mb-3">Suggested Resources</h4>
                  <ul className="space-y-1">
                    {feedback.suggestedResources.map((resource, index) => (
                      <li key={index} className="text-accent hover:underline cursor-pointer">
                        📚 {resource}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center">
              <Button 
                onClick={onNextQuestion} 
                size="lg"
                className="w-full max-w-sm"
              >
                {isLastQuestion ? (
                  <>Finish Interview</>
                ) : (
                  <>
                    Continue to Next Question
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};