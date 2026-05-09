import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Shield, Loader2 } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import type { ChatMessage as ChatMessageType } from '@/lib/types';
import { processSentinelMessage } from '@/lib/sentinel';
import ChatMessage from './ChatMessage';
import SecurityReportCard from './SecurityReportCard';

const INITIAL_MESSAGE: ChatMessageType = {
  id: 'init_001',
  role: 'sentinel',
  content: `SENTINEL v1.0 // Security Operations Agent initialized.

I monitor and secure cross-chain asset transfers to Solana via the LI.FI protocol. All routes are processed through three SOC directives before execution:

DIR-001 > Slippage guard (threshold: 1.5%)
DIR-002 > Asset verification (SOL, USDC, USDT trusted)
DIR-003 > Full transparency report on every route

To initiate a bridge request, type a command like:
"bridge 0.5 ETH from ethereum to SOL"
"swap 100 USDC from polygon to USDT"

Type "help" for more information.`,
  timestamp: new Date(),
};

const SecurityTerminal: React.FC = () => {
  const { publicKey } = useWallet();
  const [messages, setMessages] = useState<ChatMessageType[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isProcessing) return;

    const userMessage: ChatMessageType = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    const typingId = `typing_${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: typingId,
        role: 'sentinel',
        content: '',
        timestamp: new Date(),
        isTyping: true,
      },
    ]);

    try {
      const walletAddress = publicKey?.toBase58();

      const statusLine: ChatMessageType | null = !walletAddress
        ? {
            id: `status_${Date.now()}`,
            role: 'system' as const,
            content: '[STATUS] Identity: Simulated // Using Public Audit Address',
            timestamp: new Date(),
          }
        : null;

      const responses = await processSentinelMessage(trimmed, walletAddress);

      setMessages((prev) => [
        ...prev.filter((m) => m.id !== typingId),
        ...(statusLine ? [statusLine] : []),
        ...responses,
      ]);
    } catch {
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== typingId),
        {
          id: `error_${Date.now()}`,
          role: 'sentinel',
          content:
            'SYSTEM ERROR: Unexpected failure in security processing pipeline. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExecute = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: `exec_${Date.now()}`,
        role: 'system',
        content:
          '[EXECUTE] Transaction signed and submitted. Awaiting on-chain confirmation...',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-panel">
      {/* Terminal Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Shield className="h-3.5 w-3.5 text-primary" />
          <span className="font-mono text-xs font-semibold tracking-wider text-primary">
            SECURITY TERMINAL
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-safe pulse-dot" />
            <span className="font-mono text-[10px] text-muted-foreground">
              SENTINEL ONLINE
            </span>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground">
            {messages.length} LOG{messages.length !== 1 ? 'S' : ''}
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto scanline">
        <div className="divide-y divide-border/50">
          {messages.map((msg) => (
            <div key={msg.id}>
              <ChatMessage message={msg} />
              {msg.securityReport && (
                <div className="px-4 py-3">
                  <SecurityReportCard
                    report={msg.securityReport}
                    onExecute={handleExecute}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-border bg-secondary/30 px-3 py-2.5"
      >
        <span className="font-mono text-xs text-primary/60 select-none">
          {'>'}_
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            isProcessing ? 'Processing...' : 'Enter bridge command...'
          }
          disabled={isProcessing}
          className="flex-1 bg-transparent font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isProcessing || !input.trim()}
          className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 border border-primary/20 text-primary transition-all hover:bg-primary/20 hover:border-primary/40 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Send className="h-3.5 w-3.5" />
          )}
        </button>
      </form>
    </div>
  );
};

export default SecurityTerminal;
