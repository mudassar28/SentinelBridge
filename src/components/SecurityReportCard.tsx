import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Droplets,
  TrendingDown,
  ArrowRight,
  Clock,
  DollarSign,
  CheckSquare,
  Square,
  Send,
} from 'lucide-react';
import type { SecurityReport } from '@/lib/types';

interface SecurityReportCardProps {
  report: SecurityReport;
  onExecute?: () => void;
}

function computeTrustScore(report: SecurityReport): number {
  let score = 100;
  if (report.securityStatus === 'blocked') score -= 50;
  else if (report.securityStatus === 'warning') score -= 20;
  if (report.slippage > 1.5) score -= 15;
  else if (report.slippage > 0.5) score -= 5;
  if (report.priceImpact > 1.5) score -= 15;
  else if (report.priceImpact > 0.5) score -= 5;
  return Math.max(0, Math.min(100, score));
}

const STATUS_MAP = {
  safe: {
    icon: ShieldCheck,
    label: 'CLEARED',
    color: 'text-safe',
    border: 'border-safe/30',
    bg: 'bg-safe/5',
    glow: 'shadow-[0_0_20px_hsl(155_80%_45%/0.15)]',
  },
  warning: {
    icon: ShieldAlert,
    label: 'FLAGGED',
    color: 'text-warning',
    border: 'border-warning/30',
    bg: 'bg-warning/5',
    glow: 'shadow-[0_0_20px_hsl(38_95%_55%/0.15)]',
  },
  blocked: {
    icon: ShieldX,
    label: 'BLOCKED',
    color: 'text-destructive',
    border: 'border-destructive/30',
    bg: 'bg-destructive/5',
    glow: 'shadow-[0_0_20px_hsl(0_85%_55%/0.15)]',
  },
} as const;

function getScoreColor(score: number) {
  if (score >= 80) return 'text-safe';
  if (score >= 50) return 'text-warning';
  return 'text-destructive';
}

function getScoreStroke(score: number) {
  if (score >= 80) return 'hsl(var(--safe))';
  if (score >= 50) return 'hsl(var(--warning))';
  return 'hsl(var(--destructive))';
}

function getScoreFilter(score: number) {
  if (score >= 80) return 'drop-shadow(0 0 4px hsl(155 80% 45% / 0.6))';
  if (score >= 50) return 'drop-shadow(0 0 4px hsl(38 95% 55% / 0.6))';
  return 'drop-shadow(0 0 4px hsl(0 85% 55% / 0.6))';
}

const SecurityReportCard: React.FC<SecurityReportCardProps> = ({
  report,
  onExecute,
}) => {
  const [acknowledged, setAcknowledged] = useState(false);
  const trustScore = computeTrustScore(report);
  const slippageOk = report.slippage <= 1.5 && report.priceImpact <= 1.5;
  const bridgeName =
    report.providers.length > 0 ? report.providers.join(' + ') : 'Unknown';

  const statusConfig = STATUS_MAP[report.securityStatus];
  const StatusIcon = statusConfig.icon;
  const circumference = 2 * Math.PI * 28;
  const dashLen = (trustScore / 100) * circumference;

  return (
    <div
      className={`fade-in rounded-lg border ${statusConfig.border} ${statusConfig.bg} ${statusConfig.glow} overflow-hidden`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/40 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
          <span className="font-mono text-xs font-semibold tracking-wider text-foreground">
            SECURITY CLEARANCE REPORT
          </span>
        </div>
        <span
          className={`font-mono text-[10px] font-bold tracking-widest ${statusConfig.color}`}
        >
          {statusConfig.label}
        </span>
      </div>

      {/* Body Grid */}
      <div className="grid grid-cols-1 gap-px bg-border/20 sm:grid-cols-3">
        {/* Trust Score */}
        <div className="flex flex-col items-center justify-center gap-1.5 bg-card/60 px-4 py-4">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Trust Score
          </span>
          <div className="relative flex items-center justify-center">
            <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="4"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke={getScoreStroke(trustScore)}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${dashLen} ${circumference}`}
                style={{ filter: getScoreFilter(trustScore) }}
              />
            </svg>
            <span
              className={`absolute font-mono text-lg font-bold ${getScoreColor(trustScore)}`}
            >
              {trustScore}%
            </span>
          </div>
        </div>

        {/* Liquidity Check */}
        <div className="flex flex-col items-center justify-center gap-1.5 bg-card/60 px-4 py-4">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Liquidity Check
          </span>
          <Droplets className="h-5 w-5 text-accent" />
          <span className="font-mono text-xs font-semibold text-accent">
            {bridgeName}
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            {report.route.totalSteps} step
            {report.route.totalSteps !== 1 ? 's' : ''} verified
          </span>
        </div>

        {/* Slippage Audit */}
        <div className="flex flex-col items-center justify-center gap-1.5 bg-card/60 px-4 py-4">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Slippage Audit
          </span>
          <TrendingDown
            className={`h-5 w-5 ${slippageOk ? 'text-safe' : 'text-destructive'}`}
          />
          <span
            className={`font-mono text-sm font-bold ${
              slippageOk ? 'text-safe' : 'text-destructive'
            }`}
          >
            {Math.max(report.slippage, report.priceImpact).toFixed(2)}%
          </span>
          <span
            className={`font-mono text-[10px] font-semibold ${
              slippageOk ? 'text-safe/70' : 'text-destructive/70'
            }`}
          >
            {slippageOk ? 'WITHIN SAFE THRESHOLD' : 'EXCEEDS 1.5% THRESHOLD'}
          </span>
        </div>
      </div>

      {/* Route Summary */}
      <div className="border-t border-border/30 px-4 py-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <ArrowRight className="h-3 w-3 text-primary/60" />
            {report.inputAmount} {report.sourceToken}
            <span className="text-primary/40 mx-0.5">{'→'}</span>
            {report.outputAmount} {report.destinationToken}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-primary/60" />
            {report.estimatedTime}
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="h-3 w-3 text-primary/60" />
            Fees: {report.networkFees}
          </span>
        </div>
      </div>

      {/* Acknowledgement & Execute */}
      <div className="border-t border-border/30 px-4 py-3">
        <button
          type="button"
          className="flex cursor-pointer items-center gap-2 select-none bg-transparent border-none p-0"
          onClick={() => setAcknowledged((a) => !a)}
        >
          {acknowledged ? (
            <CheckSquare className="h-4 w-4 text-primary" />
          ) : (
            <Square className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="font-mono text-[11px] text-foreground/80 text-left">
            I acknowledge the security assessment and accept the risk profile of
            this transaction.
          </span>
        </button>

        <button
          type="button"
          disabled={!acknowledged}
          onClick={() => onExecute?.()}
          className={`mt-3 flex w-full items-center justify-center gap-2 rounded-md border px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider transition-all ${
            acknowledged
              ? 'border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 hover:border-primary/60 hover:shadow-glow cursor-pointer'
              : 'border-border bg-secondary/30 text-muted-foreground/40 cursor-not-allowed'
          }`}
        >
          <Send className="h-3.5 w-3.5" />
          Sign &amp; Execute
        </button>
      </div>
    </div>
  );
};

export default SecurityReportCard;
