import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input'; // Remove Input import
import { Card } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Mic, MicOff, Phone, PhoneOff, AlertCircle } from 'lucide-react';

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
  onCallStatusChange?: (isCallActive: boolean) => void;
  onAISpeakingChange?: (isSpeaking: boolean) => void;
}

const ChatInterview: React.FC<ChatInterviewProps> = ({
  messages,
  onSend,
  onEnd,
  loading = false,
  avatarArea,
  onCallStatusChange,
  onAISpeakingChange
}) => {
  const [input, setInput] = React.useState('');
  const [isListening, setIsListening] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [typingMessage, setTypingMessage] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const speechRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSpeechError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    // Create speech recognition instance
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    const recognition = recognitionRef.current;
    recognition.continuous = true; // Keep listening continuously
    recognition.interimResults = true; // Enable interim results for real-time display
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setSpeechError(null);
      setInterimTranscript('');
      console.log('Recognition started');
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Show interim results in real-time
      setInterimTranscript(interimTranscript);

      // Handle final results
      if (finalTranscript) {
        if (isCallActive) {
          // In call mode, automatically send the speech as answer
          onSend(finalTranscript);
          // Keep listening - don't stop recognition
        } else {
          // In text mode, append to input
          setInput(prev => {
            return prev.trim() ? `${prev.trim()} ${finalTranscript}` : finalTranscript;
          });
        }
        setInterimTranscript('');
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      
      // Only stop on critical errors
      if (event.error === 'not-allowed' || event.error === 'network') {
        setIsListening(false);
        if (isCallActive) {
          setIsCallActive(false);
        }
      } else if (isCallActive) {
        // In call mode, try to restart on non-critical errors
        console.log('Non-critical error in call mode, attempting restart...');
        setTimeout(() => {
          if (isCallActive && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (error) {
              console.log('Error restarting recognition:', error);
            }
          }
        }, 100);
      }
      setInterimTranscript('');
      
      switch (event.error) {
        case 'not-allowed':
          setSpeechError('Microphone access denied. Please allow microphone access and try again.');
          break;
        case 'no-speech':
          setSpeechError('No speech detected. Please try speaking again.');
          break;
        case 'network':
          setSpeechError('Network error. Please check your connection and try again.');
          break;
        default:
          setSpeechError('Speech recognition error. Please try again.');
      }
    };

    recognition.onend = () => {
      console.log('Recognition ended, isCallActive:', isCallActive, 'isListening:', isListening);
      
      // In call mode, always restart recognition
      if (isCallActive) {
        console.log('Call mode active, restarting recognition...');
        setTimeout(() => {
          if (isCallActive && recognitionRef.current) {
            try {
              recognitionRef.current.start();
              console.log('Recognition restarted successfully');
            } catch (error) {
              console.log('Call mode recognition restart error:', error);
              // Only stop if there's a critical error
              if (error.toString().includes('not-allowed') || error.toString().includes('network')) {
                setIsListening(false);
                setIsCallActive(false);
              }
            }
          }
        }, 100);
      } else if (isListening && !isCallActive) {
        // Regular mic mode - restart recognition to keep listening continuously
        setTimeout(() => {
          try {
            recognitionRef.current.start();
          } catch (error) {
            console.log('Recognition restart error:', error);
            setIsListening(false);
          }
        }, 100);
      } else {
        setIsListening(false);
      }
      setInterimTranscript('');
    };

    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isCallActive, onSend]);

  // Initialize text-to-speech
  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechRef.current = window.speechSynthesis;
    }
  }, []);

  // Typewriter effect for AI responses with real-time speech
  const typeMessage = (message: string) => {
    setIsTyping(true);
    setTypingMessage('');
    
    let index = 0;
    let hasSpoken = false; // Track if we've already spoken this message
    
    const interval = setInterval(() => {
      if (index < message.length) {
        const char = message[index];
        setTypingMessage(message.substring(0, index + 1));
        
        // Speak the entire message once when we reach the first sentence end or after 50% of the message
        if (!hasSpoken && isCallActive && 
            (char === '.' || char === '!' || char === '?' || 
             index > message.length * 0.5)) {
          speakMessage(message);
          hasSpoken = true;
        }
        
        index++;
      } else {
        // If we haven't spoken yet, speak the complete message
        if (!hasSpoken && isCallActive) {
          speakMessage(message);
        }
        setIsTyping(false);
        setTypingMessage(null);
        clearInterval(interval);
      }
    }, 30); // Adjust speed here (lower = faster)

    return () => clearInterval(interval);
  };

  // Function to speak the complete message
  const speakMessage = (message: string) => {
    if (speechRef.current && isCallActive) {
      // Create new speech utterance for the complete message
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 1.0; // Normal speed
      utterance.pitch = 1;
      utterance.volume = 1;
      
      // Notify parent that AI is speaking
      if (onAISpeakingChange) {
        onAISpeakingChange(true);
      }
      
      // Handle speech end
      utterance.onend = () => {
        if (onAISpeakingChange) {
          onAISpeakingChange(false);
        }
      };
      
      // Handle speech error
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        if (onAISpeakingChange) {
          onAISpeakingChange(false);
        }
      };
      
      // Speak the complete message
      speechRef.current.speak(utterance);
    }
  };

  // Handle new AI messages with typewriter effect
  useEffect(() => {
    if (messages.length > 0 && !isTyping) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'ai') {
        // Show typewriter effect for ALL AI messages (including hello and feedback)
        // Speech is now handled within the typewriter effect for real-time speaking
        typeMessage(lastMessage.text);
      }
    }
  }, [messages.length]); // Removed isCallActive dependency to prevent repetition

  // Handle Shift+Enter for new line, Enter for submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Don't stop speech recognition when typing - keep it continuous
    // if (isListening && recognitionRef.current) {
    //   recognitionRef.current.stop();
    // }
    
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !loading) {
        onSend(input.trim());
        setInput('');
      }
    }
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (input.trim() && !loading) {
      onSend(input.trim());
      setInput('');
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setSpeechError(null);
      recognitionRef.current.start();
    }
  };

  const toggleCall = () => {
    if (isCallActive) {
      // End call
      setIsCallActive(false);
      setIsListening(false); // Stop listening state
      if (speechRef.current) {
        speechRef.current.cancel(); // Stop any ongoing speech
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop(); // Stop recognition
      }
    } else {
      // Start call
      setIsCallActive(true);
      setIsListening(true); // Start listening state
      setSpeechError(null);
      // Automatically start listening when call begins
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (error) {
          console.log('Recognition start error:', error);
        }
      }
    }
  };

  const clearSpeechError = () => {
    setSpeechError(null);
  };

  // Notify parent when call status changes
  useEffect(() => {
    if (onCallStatusChange) {
      onCallStatusChange(isCallActive);
    }
  }, [isCallActive, onCallStatusChange]);

  // Periodic check to ensure microphone stays active during call mode
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isCallActive) {
      interval = setInterval(() => {
        // Check if recognition is still active
        if (recognitionRef.current && !isListening) {
          console.log('Call mode: Recognition stopped, restarting...');
          try {
            recognitionRef.current.start();
          } catch (error) {
            console.log('Error restarting recognition in periodic check:', error);
          }
        }
      }, 2000); // Check every 2 seconds
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isCallActive, isListening]);

  return (
    <div className="flex flex-col h-[80vh] max-h-[700px] w-full max-w-3xl mx-auto bg-background rounded-lg shadow-lg border border-border">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-background">
        {messages.map((msg, idx) => {
          // Don't show the last AI message if it's currently being typed
          if (msg.sender === 'ai' && idx === messages.length - 1 && isTyping) {
            return null;
          }
          
          return (
            <div key={idx} className={`flex items-end ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'ai' && (
                <div className="mr-2 flex-shrink-0">{avatarArea || <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">AI</div>}</div>
              )}
              <div className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm text-base whitespace-pre-line
                ${msg.sender === 'ai' ? 'bg-primary/10 text-primary' : 'bg-accent text-accent-foreground'}
              `}>
                {msg.sender === 'ai' ? (
                  <ReactMarkdown
                    components={{
                      code({node, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '');
                        if (Boolean((props as any).inline)) {
                          return (
                            <code className="bg-gray-800 text-white rounded px-1 py-0.5 font-mono text-sm" {...props}>{children}</code>
                          );
                        }
                        return (
                          <SyntaxHighlighter
                            style={oneDark}
                            language={match ? match[1] : 'plaintext'}
                            PreTag="div"
                            customStyle={{
                              borderRadius: '0.5rem',
                              padding: '1rem',
                              background: '#282c34',
                              fontSize: '1rem',
                              margin: '0.5rem 0',
                              overflowX: 'auto',
                            }}
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        );
                      }
                    }}
                  >{msg.text}</ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>
              {msg.sender === 'user' && <div className="ml-2 w-10" />}
            </div>
          );
        })}
        
        {/* Typewriter Effect for AI Response */}
        {isTyping && typingMessage && (
          <div className="flex items-end justify-start">
            <div className="mr-2 flex-shrink-0">{avatarArea || <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">AI</div>}</div>
            <div className="max-w-[75%] px-4 py-2 rounded-2xl shadow-sm text-base whitespace-pre-line bg-primary/10 text-primary">
              <ReactMarkdown
                components={{
                  code({node, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '');
                    if (Boolean((props as any).inline)) {
                      return (
                        <code className="bg-gray-800 text-white rounded px-1 py-0.5 font-mono text-sm" {...props}>{children}</code>
                      );
                    }
                    return (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match ? match[1] : 'plaintext'}
                        PreTag="div"
                        customStyle={{
                          borderRadius: '0.5rem',
                          padding: '1rem',
                          background: '#282c34',
                          fontSize: '1rem',
                          margin: '0.5rem 0',
                          overflowX: 'auto',
                        }}
                        {...props}
                      >
                        {String(typingMessage).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    );
                  }
                }}
              >{typingMessage}</ReactMarkdown>
              <span className="animate-pulse">|</span>
            </div>
          </div>
        )}
        
        <div ref={chatEndRef} />
      </div>
      
      {/* Speech Recognition Status */}
      {isListening && (
        <div className="px-4 py-2 bg-blue-50 border-t border-blue-200">
          <div className="flex items-center gap-2 text-blue-700">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Listening... Speak now</span>
          </div>
        </div>
      )}
      
      {/* Call Mode Status */}
      {isCallActive && (
        <div className="px-4 py-2 bg-green-50 border-t border-green-200">
          <div className="flex items-center gap-2 text-green-700">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Voice call active - Speak to AI directly</span>
          </div>
        </div>
      )}
      
      {/* Input Area */}
      <form onSubmit={handleSend} className="flex items-center gap-2 p-4 border-t border-border bg-background">
        <textarea
          className="flex-1 text-base rounded-lg border px-3 py-2 resize-none min-h-[44px] max-h-40 focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder={isCallActive ? "Voice mode active - speak your answer or type here" : "Type your answer. Press Enter to send, Shift+Enter for a new line."}
          value={isListening ? (input + (interimTranscript ? ' ' + interimTranscript : '')) : input}
          onChange={e => {
            setInput(e.target.value);
            // Don't stop speech recognition when typing - keep it continuous
            // if (isListening && recognitionRef.current) {
            //   recognitionRef.current.stop();
            // }
          }}
          onKeyDown={handleKeyDown}
          disabled={loading}
          autoFocus
          rows={2}
        />
        {/* Microphone Button - only show in text mode */}
        {!isCallActive && (
          <Button
            type="button"
            variant={isListening ? "destructive" : "outline"}
            size="icon"
            onClick={toggleListening}
            disabled={loading || !!speechError}
            className={`w-10 h-10 ${isListening ? 'animate-pulse' : ''}`}
            title={isListening ? 'Stop recording' : 'Start voice input'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
        )}
        {/* Call AI Button */}
        <Button 
          type="button" 
          variant={isCallActive ? "destructive" : "outline"} 
          size="icon" 
          onClick={toggleCall} 
          disabled={loading || !!speechError} 
          className={`w-10 h-10 ${isCallActive ? 'animate-pulse' : ''}`}
          title={isCallActive ? 'End voice call' : 'Start voice call with AI'}
        >
          {isCallActive ? <PhoneOff className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
        </Button>
        <Button type="submit" disabled={!input.trim() || loading} className="px-6 text-white">
          Send
        </Button>
        <Button type="button" variant="destructive" onClick={onEnd} className="ml-2 text-white">
          End Interview
        </Button>
      </form>
      
      {/* Speech Recognition Error */}
      {speechError && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{speechError}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearSpeechError}
              className="ml-auto text-red-700 hover:text-red-800 hover:bg-red-100"
            >
              ×
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterview; 