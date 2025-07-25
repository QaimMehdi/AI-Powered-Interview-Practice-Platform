import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export type ChatMessage = {
  sender: 'ai' | 'user';
  text: string;
};

interface ChatInterviewProps {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  onEnd: () => void;
  loading?: boolean;
  avatarArea?: React.ReactNode;
}

const ChatInterview: React.FC<ChatInterviewProps> = ({
  messages,
  onSend,
  onEnd,
  loading = false,
  avatarArea
}) => {
  const [input, setInput] = React.useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (input.trim() && !loading) {
      onSend(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-[80vh] max-h-[700px] w-full max-w-3xl mx-auto bg-background rounded-lg shadow-lg border border-border">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-background">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex items-end ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'ai' && (
              <div className="mr-2 flex-shrink-0">{avatarArea || <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">AI</div>}</div>
            )}
            <div className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm text-base whitespace-pre-line
              ${msg.sender === 'ai' ? 'bg-primary/10 text-primary' : 'bg-accent text-accent-foreground'}
            `}>
              {msg.text}
            </div>
            {msg.sender === 'user' && <div className="ml-2 w-10" />}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      {/* Input Area */}
      <form onSubmit={handleSend} className="flex items-center gap-2 p-4 border-t border-border bg-background">
        <Input
          className="flex-1 text-base"
          placeholder="Type your answer and press Enter..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
          autoFocus
        />
        <Button type="submit" disabled={!input.trim() || loading} className="px-6">
          Send
        </Button>
        <Button type="button" variant="destructive" onClick={onEnd} className="ml-2">
          End Interview
        </Button>
      </form>
    </div>
  );
};

export default ChatInterview; 