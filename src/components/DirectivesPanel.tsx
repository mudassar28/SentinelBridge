import React from 'react';
import { ShieldCheck, AlertTriangle, FileText, Activity } from 'lucide-react';

const directives = [
  {
    id: 'DIR-001',
    title: 'Slippage Guard',
    description: 'Blocks routes with >1.5% price impact',
    icon: AlertTriangle,
    status: 'active' as const,
  },
  {
    id: 'DIR-002',
    title: 'Asset Verification',
    description: 'Validates destination token trust level',
    icon: ShieldCheck,
    status: 'active' as const,
  },
  {
    id: 'DIR-003',
    title: 'Transparency Report',
    description: 'Full route audit on every transaction',
    icon: FileText,
    status: 'active' as const,
  },
];

const DirectivesPanel: React.FC = () => {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-accent" />
          <span className="font-mono text-xs font-semibold tracking-wider text-accent">
            SOC DIRECTIVES
          </span>
        </div>
        <span className="font-mono text-[10px] text-safe">ALL ACTIVE</span>
      </div>

      {/* Directives List */}
      <div className="divide-y divide-border/50">
        {directives.map((dir) => (
          <div key={dir.id} className="flex items-start gap-3 px-4 py-3">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-primary/10 border border-primary/15">
              <dir.icon className="h-3 w-3 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-primary/60">{dir.id}</span>
                <span className="font-mono text-xs font-medium text-foreground">
                  {dir.title}
                </span>
              </div>
              <p className="font-mono text-[11px] text-muted-foreground mt-0.5">
                {dir.description}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-safe pulse-dot" />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-border px-4 py-2">
        <p className="font-mono text-[10px] text-muted-foreground/60 text-center">
          LI.FI BRIDGE PROTOCOL // SOLANA DESTINATION
        </p>
      </div>
    </div>
  );
};

export default DirectivesPanel;
