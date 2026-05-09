import React from 'react';
import { AlertTriangle, ShieldAlert, Info } from 'lucide-react';
import type { SecurityAlert } from '@/lib/types';

interface SecurityAlertCardProps {
  alert: SecurityAlert;
}

const SecurityAlertCard: React.FC<SecurityAlertCardProps> = ({ alert }) => {
  const config = getAlertConfig(alert.severity);

  return (
    <div
      className={`mb-3 rounded-md border p-3 ${config.containerClass}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <config.Icon className={`h-4 w-4 ${config.iconClass}`} />
        <span className={`font-mono text-xs font-semibold tracking-wider ${config.titleClass}`}>
          [{alert.directive}]
        </span>
      </div>

      {/* Title */}
      <h4 className={`font-mono text-sm font-bold mb-1 ${config.titleClass}`}>
        {alert.title}
      </h4>

      {/* Description */}
      <p className="font-mono text-xs text-foreground/70 mb-2 leading-relaxed">
        {alert.description}
      </p>

      {/* Details */}
      {alert.details && (
        <div className={`rounded-sm border px-2 py-1.5 ${config.detailsClass}`}>
          <span className="font-mono text-[11px] text-foreground/60">{alert.details}</span>
        </div>
      )}

      {/* Confirmation required badge */}
      {alert.requiresConfirmation && (
        <div className={`mt-2 inline-flex items-center gap-1 rounded-sm px-2 py-0.5 ${config.badgeClass}`}>
          <span className="font-mono text-[10px] font-medium tracking-wider">
            REQUIRES MANUAL CONFIRMATION
          </span>
        </div>
      )}
    </div>
  );
};

function getAlertConfig(severity: SecurityAlert['severity']) {
  switch (severity) {
    case 'critical':
      return {
        Icon: ShieldAlert,
        containerClass: 'border-destructive/40 bg-destructive/5',
        iconClass: 'text-destructive',
        titleClass: 'text-destructive',
        detailsClass: 'border-destructive/20 bg-destructive/5',
        badgeClass: 'bg-destructive/10 text-destructive',
      };
    case 'warning':
      return {
        Icon: AlertTriangle,
        containerClass: 'border-warning/40 bg-warning/5',
        iconClass: 'text-warning',
        titleClass: 'text-warning',
        detailsClass: 'border-warning/20 bg-warning/5',
        badgeClass: 'bg-warning/10 text-warning',
      };
    default:
      return {
        Icon: Info,
        containerClass: 'border-accent/40 bg-accent/5',
        iconClass: 'text-accent',
        titleClass: 'text-accent',
        detailsClass: 'border-accent/20 bg-accent/5',
        badgeClass: 'bg-accent/10 text-accent',
      };
  }
}

export default SecurityAlertCard;
