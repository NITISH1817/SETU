import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  variant?: 'blue' | 'emerald' | 'amber' | 'purple' | 'slate' | 'rose';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'blue'
}) => {
  const colorMap = {
    blue: 'from-blue-900/30 to-slate-900 border-blue-800/40 text-blue-400',
    emerald: 'from-emerald-900/30 to-slate-900 border-emerald-800/40 text-emerald-400',
    amber: 'from-amber-900/30 to-slate-900 border-amber-800/40 text-amber-400',
    purple: 'from-purple-900/30 to-slate-900 border-purple-800/40 text-purple-400',
    slate: 'from-slate-800/40 to-slate-900 border-slate-700/40 text-slate-300',
    rose: 'from-rose-900/30 to-slate-900 border-rose-800/40 text-rose-400'
  };

  return (
    <div className={`p-5 rounded-xl bg-gradient-to-br border ${colorMap[variant]} shadow-lg flex items-center justify-between`}>
      <div>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-extrabold text-white mt-1">{value}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        {trend && (
          <span className="inline-block text-xs text-emerald-400 font-semibold mt-1">
            ↑ {trend}
          </span>
        )}
      </div>
      <div className={`p-3 rounded-lg bg-slate-900/80 border border-white/5`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};
