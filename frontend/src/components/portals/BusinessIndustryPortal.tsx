import React from 'react';
import { Building2, Layers } from 'lucide-react';
import { servicesRegistry } from '../../data/serviceRegistry';
import { ServiceCard } from '../common/ServiceCard';
import { useTranslation } from 'react-i18next';

export const BusinessIndustryPortal: React.FC = () => {
  const { t } = useTranslation();
  const businessServices = servicesRegistry.filter(s => s.departmentId === 'business-industry');

  return (
    <div className="space-y-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="gc-glass rounded-2xl overflow-hidden">
        <div className="h-1 w-full" style={{ background: 'var(--gradient-primary)' }} />
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center gc-surface-2" style={{ borderColor: 'var(--border-2)' }}>
              <Building2 className="w-5 h-5" style={{ color: 'var(--text)' }} />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>{t('portals.business.title', 'Business & Industry Services')}</h2>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('portals.business.desc', 'Single-window for entrepreneurs, MSME, and industrial approvals.')}</p>
            </div>
          </div>
          <span className="gc-badge gc-badge-warning self-start sm:self-auto">
            {t('portals.business.badge', '🚀 Ease of Doing Business')}
          </span>
        </div>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {businessServices.map(service => (
          <ServiceCard key={service.id} service={service} />
        ))}
        <div className="gc-card p-5 flex flex-col items-center justify-center text-center min-h-[200px] opacity-50">
          <Layers className="w-8 h-8 mb-2" style={{ color: 'var(--text-muted)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{t('portals.startupSubsidies', 'Startup Subsidies')}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>{t('portals.connectingDpiit', 'Connecting to DPIIT nodes...')}</p>
        </div>
      </div>
    </div>
  );
};
