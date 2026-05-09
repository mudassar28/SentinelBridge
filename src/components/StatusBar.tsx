import React, { useState, useEffect } from 'react';
import { Shield, Clock, Lock } from 'lucide-react';

const StatusBar: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="border-t border-border bg-secondary/30 px-4 py-1.5">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-4">
          {/* SOC Level */}
          <div className="flex items-center gap-1.5">
            <Shield className="h-3 w-3 text-primary" />
            <span className="font-mono text-[10px] text-muted-foreground">
              SOC LEVEL:{' '}
              <span className="font-bold text-safe text-glow">ACTIVE</span>
            </span>
          </div>

          {/* TLS */}
          <div className="hidden items-center gap-1.5 sm:flex">
            <Lock className="h-3 w-3 text-safe" />
            <span className="font-mono text-[10px] text-muted-foreground">
              TLS 1.3
            </span>
          </div>

          {/* Solana Mainnet */}
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-safe opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-safe" />
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              Solana Mainnet{' '}
              <span className="font-semibold text-safe">Active</span>
            </span>
          </div>

          {/* LI.FI Protocol */}
          <div className="hidden items-center gap-1.5 sm:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              LI.FI Protocol{' '}
              <span className="font-semibold text-accent">Online</span>
            </span>
          </div>
        </div>

        {/* Clock */}
        <div className="flex items-center gap-1.5">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="font-mono text-[10px] text-muted-foreground">
            {time.toLocaleTimeString('en-US', { hour12: false })} UTC
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
