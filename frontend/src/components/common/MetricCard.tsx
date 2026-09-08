import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  variant?: 'blue' | 'emerald' | 'amber' | 'purple' | 'slate' | 'rose' | 'indigo'; // kept for backwards compatibility but unused
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendUp = true,
  variant = 'blue',
}) => {
  return (
    <div
      className={`gc-accent-card p-5 flex items-center justify-between group transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5`}
      style={{ borderTop: '2px solid var(--border)' }}
    >
      <div className="space-y-1.5 flex-1 min-w-0">
        <p className="gc-section-label truncate">{title}</p>
        <h3 className="text-2xl font-bold text-[var(--color-text)] tabular-nums leading-none" style={{ color: 'var(--text)' }}>
          {value}
        </h3>
        {subtitle && (
          <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
        )}
        {trend && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold`}
            style={{ color: trendUp ? 'var(--success)' : 'var(--warning)' }}
          >
            {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend}
          </span>
        )}
      </div>
      <div
        className={`ml-4 flex-shrink-0 w-12 h-12 rounded-xl border flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}
        style={{ background: 'var(--surface-3)', borderColor: 'var(--border-2)' }}
      >
        <Icon className={`w-6 h-6`} style={{ color: 'var(--text)' }} />
      </div>
    </div>
  );
};
