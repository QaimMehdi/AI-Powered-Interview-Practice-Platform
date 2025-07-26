import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff } from 'lucide-react';

interface AIAvatarProps {
  isSpeaking: boolean;
  isListening: boolean;
  message?: string;
  className?: string;
}

export const AIAvatar = ({ isSpeaking, isListening, message, className = '' }: AIAvatarProps) => {
  const [currentMessage, setCurrentMessage] = useState(message || '');
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Typewriter effect for messages
  useEffect(() => {
    if (message && message !== currentMessage) {
      setCurrentMessage(message);
      setDisplayedMessage('');
      setIsTyping(true);
      
      let index = 0;
      const interval = setInterval(() => {
        if (index < message.length) {
          setDisplayedMessage(message.substring(0, index + 1));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(interval);
        }
      }, 30);

      return () => clearInterval(interval);
    }
  }, [message, currentMessage]);

  const getAvatarState = () => {
    if (isSpeaking) return 'speaking';
    if (isListening) return 'listening';
    return 'idle';
  };

  const getStatusColor = () => {
    switch (getAvatarState()) {
      case 'speaking':
        return 'bg-primary text-primary-foreground';
      case 'listening':
        return 'bg-info text-info-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = () => {
    switch (getAvatarState()) {
      case 'speaking':
        return 'AI is speaking';
      case 'listening':
        return 'Listening to your answer';
      default:
        return 'Ready';
    }
  };

  return (
    <div className={`space-y-[12px] ${className}`}>
      {/* Avatar Container */}
      <Card className="p-[16px] text-center bg-avatar-background border-avatar-border">
        <div className="relative inline-block">
          {/* Main Avatar Circle */}
          <div 
            className={`
              w-[64px] h-[64px] rounded-full mx-auto mb-[8px] flex items-center justify-center text-[20px]
              border-[2px] transition-all duration-300
              ${isSpeaking ? 'border-primary animate-pulse scale-110' : 'border-avatar-border'}
              ${isListening ? 'border-info animate-pulse' : ''}
              bg-gradient-to-br from-primary/20 to-accent/20
            `}
          >
            🤖
          </div>

          {/* Pulse Animation for Speaking */}
          {isSpeaking && (
            <div className="absolute inset-0 w-[64px] h-[64px] mx-auto rounded-full border-[2px] border-primary/30 animate-ping" />
          )}

          {/* Microphone Indicator */}
          <div className="absolute -bottom-[4px] -right-[4px] w-[24px] h-[24px] rounded-full bg-background border border-border flex items-center justify-center">
            {isListening ? (
              <Mic className="w-[12px] h-[12px] text-info animate-pulse" />
            ) : (
              <MicOff className="w-[12px] h-[12px] text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Status Badge */}
        <Badge className={`${getStatusColor()} text-white text-[10px] ml-[2px] px-[8px] py-[2px]`}>
          {getStatusText()}
        </Badge>

        {/* AI Name */}
        <h3 className="text-[14px] font-semibold mt-[4px] text-foreground">
          Alex - AI Interviewer
        </h3>
        <p className="text-[12px] text-muted-foreground">
          Professional Interview Assistant
        </p>
      </Card>

      {/* Message Display */}
      {(displayedMessage || isTyping) && (
        <Card className="p-4 bg-card border border-border">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
              🤖
            </div>
            <div className="flex-1 min-h-[1.5rem]">
              <p className="text-sm text-card-foreground">
                {displayedMessage}
                {isTyping && (
                  <span className="animate-pulse">|</span>
                )}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Audio Visualization (Simulated) */}
      {isSpeaking && (
        <div className="flex justify-center items-end space-x-1 h-16">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`
                w-2 bg-primary rounded-full animate-pulse
                ${i === 0 || i === 4 ? 'h-6' : ''}
                ${i === 1 || i === 3 ? 'h-12' : ''}
                ${i === 2 ? 'h-16' : ''}
              `}
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.8s'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};