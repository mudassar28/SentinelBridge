import React from 'react';
import { Shield, Activity } from 'lucide-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

const Header: React.FC = () => {
  const { connected } = useWallet();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 border border-primary/20">
            <Shield className="h-4 w-4 text-primary" />
            <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary pulse-dot" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-sm font-semibold tracking-wider text-foreground">
              SENTINEL<span className="text-primary">BRIDGE</span>
            </span>
            <span className="hidden font-mono text-[10px] tracking-widest text-muted-foreground sm:block">
              SECURITY OPERATIONS // v1.0
            </span>
          </div>
        </div>

        {/* Center Status */}
        <div className="hidden items-center gap-2 md:flex">
          <Activity className="h-3 w-3 text-primary animate-pulse-glow" />
          <span className="font-mono text-xs text-muted-foreground">
            LI.FI BRIDGE PROTOCOL
          </span>
          <span className="text-border">|</span>
          <span className="font-mono text-xs text-muted-foreground">
            3 SOC DIRECTIVES ACTIVE
          </span>
        </div>

        {/* Wallet & Status */}
        <div className="flex items-center gap-3">
          {connected && (
            <div className="hidden items-center gap-1.5 sm:flex">
              <div className="h-1.5 w-1.5 rounded-full bg-safe pulse-dot" />
              <span className="font-mono text-xs text-safe">LINKED</span>
            </div>
          )}
          <WalletMultiButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
