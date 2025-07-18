import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, Database, Users, Globe, Cpu, Zap } from 'lucide-react';
import { Topic, TopicType } from '@/types/interview';

interface TopicSelectionProps {
  onSelectTopic: (topic: TopicType) => void;
}

const topics: Topic[] = [
  {
    id: 'java-oop',
    name: 'Java OOP',
    description: 'Object-oriented programming concepts, inheritance, polymorphism, and design patterns.',
    difficulty: 'Intermediate',
    estimatedTime: '15-20 min',
    icon: 'Code'
  },
  {
    id: 'data-structures',
    name: 'Data Structures',
    description: 'Arrays, linked lists, trees, graphs, hash tables, and their implementations.',
    difficulty: 'Intermediate',
    estimatedTime: '20-25 min',
    icon: 'Database'
  },
  {
    id: 'algorithms',
    name: 'Algorithms',
    description: 'Sorting, searching, dynamic programming, and algorithm complexity analysis.',
    difficulty: 'Advanced',
    estimatedTime: '25-30 min',
    icon: 'Cpu'
  },
  {
    id: 'system-design',
    name: 'System Design',
    description: 'Scalable system architecture, microservices, databases, and distributed systems.',
    difficulty: 'Advanced',
    estimatedTime: '30-45 min',
    icon: 'Globe'
  },
  {
    id: 'behavioral',
    name: 'Behavioral',
    description: 'Communication skills, teamwork, problem-solving, and leadership scenarios.',
    difficulty: 'Beginner',
    estimatedTime: '15-20 min',
    icon: 'Users'
  },
  {
    id: 'react',
    name: 'React',
    description: 'React hooks, component lifecycle, state management, and best practices.',
    difficulty: 'Intermediate',
    estimatedTime: '20-25 min',
    icon: 'Zap'
  }
];

const getIcon = (iconName: string) => {
  const icons = {
    Code: Code,
    Database: Database,
    Users: Users,
    Globe: Globe,
    Cpu: Cpu,
    Zap: Zap
  };
  return icons[iconName as keyof typeof icons] || Code;
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner':
      return 'bg-success text-success-foreground';
    case 'Intermediate':
      return 'bg-warning text-warning-foreground';
    case 'Advanced':
      return 'bg-destructive text-destructive-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export const TopicSelection = ({ onSelectTopic }: TopicSelectionProps) => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AI Interview Practice
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose your interview topic and practice with our AI interviewer. 
            Get real-time feedback and improve your interview skills.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => {
            const IconComponent = getIcon(topic.icon);
            return (
              <Card 
                key={topic.id} 
                className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
                onClick={() => onSelectTopic(topic.id)}
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <Badge className={getDifficultyColor(topic.difficulty)}>
                      {topic.difficulty}
                    </Badge>
                  </div>
                  <div>
                    <CardTitle className="text-xl mb-2">{topic.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {topic.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      ⏱️ {topic.estimatedTime}
                    </span>
                    <Button 
                      size="sm" 
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTopic(topic.id);
                      }}
                    >
                      Start Interview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-full bg-avatar-background border-2 border-avatar-border flex items-center justify-center">
                  🤖
                </div>
                Meet Your AI Interviewer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our AI interviewer will ask you relevant questions, listen to your responses, 
                and provide constructive feedback to help you improve. Each session is tailored 
                to your chosen topic and difficulty level.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};