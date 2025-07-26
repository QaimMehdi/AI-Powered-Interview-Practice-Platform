import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Code } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface TopicSelectionProps {
  onSelect?: (topic: string) => void;
}

export const TopicSelection: React.FC<TopicSelectionProps> = ({ onSelect }) => {
  const navigate = useNavigate();
  const handleSelect = (topic: string) => {
    if (onSelect) {
      onSelect(topic);
    } else {
      navigate(`/interview/${topic}`);
    }
  };
  return (
    <section className="w-full" id="topics">
      <div className="relative z-20 flex flex-col items-center mb-12 mt-8">
        <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent drop-shadow-lg tracking-tight mb-2">
          Choose Your Interview Type
        </h2>
        <div className="w-12 h-1 rounded-full bg-primary/30 mb-2" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
        {/* Technical Interview Card */}
        <Card
          className="group transition-all duration-300 shadow-xl border-2 border-primary/20 bg-white rounded-2xl p-10 flex flex-col items-center cursor-pointer hover:scale-105 hover:shadow-2xl hover:border-primary/40 hover:ring-2 hover:ring-primary/20"
          onClick={() => handleSelect('technical')}
        >
          <div className="rounded-full bg-primary/10 p-6 flex items-center justify-center mb-6 shadow-md">
            <Code className="w-12 h-12 text-primary group-hover:scale-110 transition-transform duration-300" />
          </div>
          <CardTitle className="text-2xl font-extrabold text-primary mb-2 tracking-tight text-center">Technical Interview</CardTitle>
          <CardDescription className="text-gray-700 mb-4 text-lg text-center">Practice coding, algorithms, and technical questions with AI.</CardDescription>
        </Card>
        {/* HR Interview Card */}
        <Card
          className="group transition-all duration-300 shadow-xl border-2 border-accent/30 bg-white rounded-2xl p-10 flex flex-col items-center cursor-pointer hover:scale-105 hover:shadow-2xl hover:border-accent/60 hover:ring-2 hover:ring-accent/30"
          onClick={() => handleSelect('hr')}
        >
          <div className="rounded-full bg-accent/10 p-6 flex items-center justify-center mb-6 shadow-md">
            <User className="w-12 h-12 text-accent group-hover:scale-110 transition-transform duration-300" />
          </div>
          <CardTitle className="text-2xl font-extrabold text-accent mb-2 tracking-tight text-center">HR Interview</CardTitle>
          <CardDescription className="text-gray-700 mb-4 text-lg text-center">Prepare for behavioral, communication, and HR questions.</CardDescription>
        </Card>
      </div>
    </section>
  );
};