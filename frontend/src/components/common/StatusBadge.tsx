import React from 'react';
import { ApplicationStatus, ConsentStatus } from '../../types';

interface StatusBadgeProps {
  status: ApplicationStatus | ConsentStatus | string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  let colorStyle = 'bg-slate-800 text-slate-300 border-slate-700';

  switch (status) {
    case 'ELIGIBLE':
    case 'APPROVED':
    case 'COMPLETED':
    case 'ACTIVE':
    case 'SUCCESS':
      colorStyle = 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50 shadow-sm shadow-emerald-900/40';
      break;

    case 'INCOME_VERIFIED':
    case 'ELIGIBILITY_CHECK':
      colorStyle = 'bg-cyan-950/80 text-cyan-300 border-cyan-700/50 shadow-sm shadow-cyan-900/40';
      break;

    case 'SUBMITTED':
    case 'CONSENT_PENDING':
    case 'INCOME_VERIFICATION':
    case 'PAYMENT_PENDING':
    case 'PENDING':
      colorStyle = 'bg-amber-950/80 text-amber-300 border-amber-700/50 shadow-sm shadow-amber-900/40';
      break;

    case 'NOT_ELIGIBLE':
    case 'REJECTED':
    case 'REVOKED':
    case 'EXPIRED':
    case 'FAILED':
      colorStyle = 'bg-rose-950/80 text-rose-300 border-rose-700/50 shadow-sm shadow-rose-900/40';
      break;
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3 py-1.5 text-sm font-semibold'
  };

  return (
    <span className={`inline-flex items-center rounded-full border ${colorStyle} ${sizeClasses[size]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse"></span>
      {status.replace(/_/g, ' ')}
    </span>
  );
};
