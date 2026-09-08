import React from 'react';
import { UserCheck, Layers } from 'lucide-react';
import { servicesRegistry } from '../../data/serviceRegistry';
import { ServiceCard } from '../common/ServiceCard';
import { useTranslation } from 'react-i18next';

export const CitizenServicesPortal: React.FC = () => {
  const { t } = useTranslation();
  const citizenServices = servicesRegistry.filter(s => s.departmentId === 'citizen-services');

  return (
    <div className="space-y-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="gc-glass rounded-2xl overflow-hidden">
        <div className="h-1 w-full" style={{ background: 'var(--gradient-primary)' }} />
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center gc-surface-2" style={{ borderColor: 'var(--border-2)' }}>
              <UserCheck className="w-5 h-5" style={{ color: 'var(--text)' }} />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>{t('portals.citizen.title', 'Citizen Services & Grievance')}</h2>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('portals.citizen.desc', 'Unified entry point for certificates, welfare, and public grievances.')}</p>
            </div>
          </div>
          <span className="gc-badge gc-badge-info self-start sm:self-auto">
            {citizenServices.length} {t('portals.servicesAvailable', 'Services Available')}
          </span>
        </div>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {citizenServices.map(service => (
          <ServiceCard key={service.id} service={service} />
        ))}
        {/* Coming soon placeholder */}
        <div className="gc-card p-5 flex flex-col items-center justify-center text-center min-h-[200px] opacity-50">
          <Layers className="w-8 h-8 mb-2" style={{ color: 'var(--text-muted)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{t('portals.comingSoon', 'More services coming soon')}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>{t('portals.integrating', 'Integrating state department nodes...')}</p>
        </div>
      </div>
    </div>
  );
};
