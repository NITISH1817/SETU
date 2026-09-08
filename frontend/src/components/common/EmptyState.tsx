import React from 'react';
import { LucideIcon, Inbox, FileText, Search, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="w-16 h-16 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-[var(--color-text-dim)]" />
    </div>
    <h3 className="text-base font-semibold text-[var(--color-text)] mb-2">{title}</h3>
    {description && (
      <p className="text-sm text-[var(--color-text-muted)] max-w-sm leading-relaxed">{description}</p>
    )}
    {actionLabel && (
      <div className="mt-6">
        {actionTo ? (
          <Link to={actionTo} className="gc-btn-primary text-sm">
            {actionLabel}
          </Link>
        ) : (
          <button onClick={onAction} className="gc-btn-primary text-sm">
            {actionLabel}
          </button>
        )}
      </div>
    )}
  </div>
);

export const ErrorState: React.FC<{ onRetry?: () => void; message?: string }> = ({
  onRetry,
  message = "We couldn't load your data.",
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="w-16 h-16 rounded-2xl bg-rose-950/30 border border-rose-800/30 flex items-center justify-center mb-4">
      <AlertCircle className="w-8 h-8 text-rose-400" />
    </div>
    <h3 className="text-base font-semibold text-[var(--color-text)] mb-2">Something went wrong</h3>
    <p className="text-sm text-[var(--color-text-muted)] max-w-sm">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="gc-btn-secondary mt-6 text-sm">
        Try Again
      </button>
    )}
  </div>
);
