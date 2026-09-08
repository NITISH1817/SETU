import React, { useState } from 'react';
import { InteroperabilityMonitor } from '../interoperability/InteroperabilityMonitor';
import { MetricCard } from '../common/MetricCard';
import { Layers, ShieldCheck, Cpu, ArrowRightLeft, Server, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const MiddlewareHub: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 gc-accent-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-6 h-6" style={{ color: 'var(--text)' }} />
            <h2 className="text-xl font-extrabold" style={{ color: 'var(--text)' }}>{t('hub.title', 'Interoperability Hub')}</h2>
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {t('hub.subtitle', 'Central gateway for cross-department data exchange')}
          </p>
        </div>

        <span className="gc-badge gc-badge-info font-mono font-bold">
          {t('hub.engineActive', 'Engine Active')} ⚡
        </span>
      </div>

      {/* Interoperability Gateway Architecture Visualizer */}
      <div className="gc-glass p-6 space-y-4">
        <h3 className="text-sm font-extrabold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          {t('topology.title', 'Gateway Topology')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl gc-surface space-y-2">
            <div className="flex justify-between items-center text-xs font-bold" style={{ color: 'var(--text)' }}>
              <span>{t('topology.welfareTitle', 'Welfare Dept')}</span>
              <span className="text-[10px] gc-badge gc-badge-primary">{t('topology.welfareType', 'Consumer')}</span>
            </div>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              {t('topology.welfareDesc', 'Requests income verification via common model')}
            </p>
          </div>

          <div className="p-4 rounded-xl gc-surface-2 space-y-2 shadow-sm scale-[1.02]" style={{ borderColor: 'var(--text)' }}>
            <div className="flex justify-between items-center text-xs font-bold" style={{ color: 'var(--text)' }}>
              <span>{t('topology.middlewareTitle', 'Middleware Hub')}</span>
              <span className="text-[10px] gc-badge gc-badge-primary">{t('topology.middlewareType', 'Gateway')}</span>
            </div>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              {t('topology.middlewareDesc', 'Translates XML/JSON and enforces consent')}
            </p>
          </div>

          <div className="p-4 rounded-xl gc-surface space-y-2">
            <div className="flex justify-between items-center text-xs font-bold" style={{ color: 'var(--text)' }}>
              <span>{t('topology.revenueTitle', 'Revenue Dept')}</span>
              <span className="text-[10px] gc-badge gc-badge-primary">{t('topology.revenueType', 'Provider')}</span>
            </div>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              {t('topology.revenueDesc', 'Provides raw XML income data from legacy DB')}
            </p>
          </div>
        </div>
      </div>

      {/* Embedded Live Interoperability Monitor */}
      <InteroperabilityMonitor />
    </div>
  );
};
