import React from 'react';
import { ApplicationStatus, ConsentStatus } from '../../types';

interface StatusBadgeProps {
  status: ApplicationStatus | ConsentStatus | string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  type BadgeVariant = 'success' | 'info' | 'warning' | 'error' | 'neutral';
  let variant: BadgeVariant = 'neutral';

  switch (status) {
    case 'ELIGIBLE':
    case 'APPROVED':
    case 'COMPLETED':
    case 'ACTIVE':
    case 'SUCCESS':
      variant = 'success';
      break;

    case 'INCOME_VERIFIED':
    case 'ELIGIBILITY_CHECK':
      variant = 'info';
      break;

    case 'SUBMITTED':
    case 'CONSENT_PENDING':
    case 'INCOME_VERIFICATION':
    case 'PAYMENT_PENDING':
    case 'PENDING':
      variant = 'warning';
      break;

    case 'NOT_ELIGIBLE':
    case 'REJECTED':
    case 'REVOKED':
    case 'EXPIRED':
    case 'FAILED':
      variant = 'error';
      break;
  }

  const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
    success: {
      background:   'var(--success-bg)',
      color:        'var(--success)',
      borderColor:  'var(--success-border)',
      '--dot-color': 'var(--success)',
    } as React.CSSProperties,
    info: {
      background:   'var(--info-bg)',
      color:        'var(--info)',
      borderColor:  'var(--info-border)',
      '--dot-color': 'var(--info)',
    } as React.CSSProperties,
    warning: {
      background:   'var(--warning-bg)',
      color:        'var(--warning)',
      borderColor:  'var(--warning-border)',
      '--dot-color': 'var(--warning)',
    } as React.CSSProperties,
    error: {
      background:   'var(--error-bg)',
      color:        'var(--error)',
      borderColor:  'var(--error-border)',
      '--dot-color': 'var(--error)',
    } as React.CSSProperties,
    neutral: {
      background:   'var(--surface-2)',
      color:        'var(--text-muted)',
      borderColor:  'var(--border)',
      '--dot-color': 'var(--text-dim)',
    } as React.CSSProperties,
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] font-semibold',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3 py-1.5 text-sm font-semibold',
  };

  const dotSizes = { sm: 'w-1.5 h-1.5', md: 'w-1.5 h-1.5', lg: 'w-2 h-2' };
  const styles = variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border tracking-wide ${sizeClasses[size]}`}
      style={styles}
    >
      <span
        className={`${dotSizes[size]} rounded-full flex-shrink-0`}
        style={{
          backgroundColor: styles.color as string,
          boxShadow: `0 0 4px ${styles.color as string}`,
        }}
      />
      {status.replace(/_/g, ' ')}
    </span>
  );
};
