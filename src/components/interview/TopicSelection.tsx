import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code, Database, Users, Globe, Cpu, Zap } from 'lucide-react';
import React from 'react';

interface TopicSelectionProps {
  onSelectTopic: (topicId: string) => void;
}

const topics = [
  {
    id: 'java-oop',
    name: 'Java OOP',
    description: 'Object-oriented programming concepts, inheritance, polymorphism, and design patterns.',
    difficulty: 'Intermediate',
    estimatedTime: '15-20 min',
    icon: <Code className="w-8 h-8 text-accent" />,
  },
  {
    id: 'data-structures',
    name: 'Data Structures',
    description: 'Arrays, linked lists, trees, graphs, hash tables, and their implementations.',
    difficulty: 'Intermediate',
    estimatedTime: '20-25 min',
    icon: <Database className="w-8 h-8 text-accent" />,
  },
  {
    id: 'algorithms',
    name: 'Algorithms',
    description: 'Sorting, searching, dynamic programming, and algorithm complexity analysis.',
    difficulty: 'Advanced',
    estimatedTime: '25-30 min',
    icon: <Cpu className="w-8 h-8 text-accent" />,
  },
  {
    id: 'system-design',
    name: 'System Design',
    description: 'Scalable system architecture, microservices, databases, and distributed systems.',
    difficulty: 'Advanced',
    estimatedTime: '30-45 min',
    icon: <Globe className="w-8 h-8 text-accent" />,
  },
  {
    id: 'behavioral',
    name: 'Behavioral',
    description: 'Communication skills, teamwork, problem-solving, and leadership scenarios.',
    difficulty: 'Beginner',
    estimatedTime: '15-20 min',
    icon: <Users className="w-8 h-8 text-accent" />,
  },
  {
    id: 'react',
    name: 'React',
    description: 'React hooks, component lifecycle, state management, and best practices.',
    difficulty: 'Intermediate',
    estimatedTime: '20-25 min',
    icon: <Zap className="w-8 h-8 text-accent" />,
  },
];

const difficultyColors: Record<string, string> = {
  Beginner: 'bg-accent/10 text-accent',
  Intermediate: 'bg-primary/10 text-primary',
  Advanced: 'bg-primary-dark/10 text-primary-dark',
};

export const TopicSelection = ({ onSelectTopic }: TopicSelectionProps) => (
  <section className="w-full relative" id="topics">
    {/* Wavy SVG divider for smooth transition from hero */}
    <div className="absolute -top-12 left-0 w-full overflow-hidden leading-none z-10">
      <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16">
        <path d="M0,0 C480,80 960,0 1440,80 L1440,0 L0,0 Z" fill="#f8fafc" />
      </svg>
    </div>
    {/* Blurred/glowing background shape behind heading */}
    <div className="absolute left-1/2 -translate-x-1/2 -top-8 w-96 h-32 bg-primary/10 blur-2xl rounded-full z-0" />
    <div className="relative z-20 flex flex-col items-center mb-12 mt-8">
      <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent drop-shadow-lg tracking-tight mb-2">
        Choose a Topic
      </h2>
      {/* Accent dot/line */}
      <div className="w-12 h-1 rounded-full bg-primary/30 mb-2" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
      {topics.map((topic) => (
        <Card
          key={topic.id}
          className="group transition-all duration-300 shadow-xl border border-primary/20 bg-white/30 backdrop-blur-lg rounded-3xl p-8 flex flex-col items-start cursor-pointer hover:scale-105 hover:shadow-2xl hover:border-primary/40 hover:bg-white/50 hover:backdrop-blur-2xl hover:ring-2 hover:ring-primary/20"
          style={{ boxShadow: '0 8px 32px 0 rgba(0,0,0,0.12), 0 1.5px 8px 0 rgba(0,0,0,0.08) inset' }}
          onClick={() => onSelectTopic(topic.id)}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-full bg-primary/10 p-4 flex items-center justify-center shadow-md">
              {/* Gradient icon effect */}
              <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                {topic.icon}
              </span>
            </div>
            <Badge className={`ml-2 px-4 py-1 rounded-full text-xs font-semibold shadow bg-primary text-white group-hover:shadow-lg group-hover:bg-primary/90 transition-all duration-300`}>{topic.difficulty}</Badge>
          </div>
          <CardTitle className="text-2xl font-extrabold text-primary mb-1 tracking-tight">{topic.name}</CardTitle>
          <div className="w-12 h-1 rounded-full bg-primary/20 mb-4" />
          <CardDescription className="text-gray-700 mb-6 text-base font-medium min-h-[48px]">{topic.description}</CardDescription>
          <div className="mt-auto flex items-center gap-2 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>
              {topic.estimatedTime}
            </span>
          </div>
        </Card>
      ))}
    </div>
  </section>
);