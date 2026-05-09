import React from 'react';
import { Shield, Terminal, Radio } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '@/lib/types';
import SecurityAlertCard from './SecurityAlertCard';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  if (message.role === 'system') {
    return (
      <div className="fade-in flex items-center gap-2 py-2 px-3">
        <Radio className="h-3 w-3 text-accent animate-pulse-glow" />
        <span className="font-mono text-xs text-accent">{message.content}</span>
        <span className="font-mono text-[10px] text-muted-foreground ml-auto">
          {formatTime(message.timestamp)}
        </span>
      </div>
    );
  }

  if (message.role === 'user') {
    return (
      <div className="fade-in flex gap-3 py-3 px-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-secondary border border-border">
          <Terminal className="h-3.5 w-3.5 text-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-medium text-foreground">OPERATOR</span>
            <span className="font-mono text-[10px] text-muted-foreground">
              {formatTime(message.timestamp)}
            </span>
          </div>
          <p className="font-mono text-sm text-foreground/90 break-words">{message.content}</p>
        </div>
      </div>
    );
  }

  // Sentinel message
  return (
    <div className="fade-in flex gap-3 py-3 px-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 border border-primary/20">
        <Shield className="h-3.5 w-3.5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs font-medium text-primary">SENTINEL</span>
          <span className="font-mono text-[10px] text-muted-foreground">
            {formatTime(message.timestamp)}
          </span>
        </div>

        {/* Security Alert */}
        {message.securityAlert && (
          <SecurityAlertCard alert={message.securityAlert} />
        )}

        {/* Text content */}
        {message.content && (
          <div className="font-mono text-sm text-foreground/90 whitespace-pre-wrap break-words leading-relaxed">
            {message.content}
          </div>
        )}

        {/* Typing indicator */}
        {message.isTyping && (
          <div className="typing-indicator font-mono text-sm text-primary">
            <span>.</span><span>.</span><span>.</span>
          </div>
        )}
      </div>
    </div>
  );
};

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export default ChatMessage;