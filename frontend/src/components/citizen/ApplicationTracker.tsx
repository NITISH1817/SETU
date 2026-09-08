import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Application } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { EmptyState } from '../common/EmptyState';
import { PageSkeleton } from '../common/LoadingSkeleton';
import { Clock, CheckCircle2, ArrowRight, Activity, ChevronRight, Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ApplicationTracker: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selected, setSelected] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const citizenId = user?.citizenId || 'CIT-1001';

  useEffect(() => {
    api.get(`/applications?citizenId=${citizenId}`)
      .then(res => {
        const apps = res.data.applications || [];

        // Mock cross-department applications
        const mockApps: Application[] = [
          {
            applicationId: 'APP-BI-9941', citizenId, schemeId: 'business-registration',
            schemeTitle: t('tracker.bizReg', 'Business Registration'), status: 'INCOME_VERIFICATION' as any,
            currentDepartment: t('portals.business.title', 'Business & Industry Services'),
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
            updatedAt: new Date().toISOString(),
            nextStep: t('tracker.awaitingDoc', 'Awaiting Document Verification'),
            statusHistory: [
              { status: 'SUBMITTED' as any, changedAt: new Date(Date.now() - 86400000 * 2).toISOString(), note: t('tracker.noteSub', 'Application submitted.') },
              { status: 'INCOME_VERIFICATION' as any, changedAt: new Date(Date.now() - 86400000).toISOString(), note: t('tracker.noteDoc', 'Documents forwarded to processing desk.') }
            ]
          } as any,
          {
            applicationId: 'GRV-2201', citizenId, schemeId: 'grievance',
            schemeTitle: t('tracker.waterComp', 'Water Supply Complaint'), status: 'ELIGIBILITY_CHECK' as any,
            currentDepartment: t('portals.citizen.title', 'Citizen Services & Grievance'),
            createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
            updatedAt: new Date(Date.now() - 86400000).toISOString(),
            nextStep: t('tracker.assigned', 'Assigned to Ward Officer'),
            statusHistory: [
              { status: 'SUBMITTED' as any, changedAt: new Date(Date.now() - 86400000 * 5).toISOString(), note: t('tracker.noteGrv', 'Grievance registered.') }
            ]
          } as any,
        ];

        const unified = [...mockApps, ...apps];
        setApplications(unified);
        if (unified.length > 0) setSelected(unified[0]);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [citizenId, t]);

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-5 max-w-screen-xl mx-auto">
      {/* Page header */}
      <div className="gc-glass rounded-2xl overflow-hidden">
        <div className="h-1 w-full" style={{ background: 'var(--gradient-primary)' }} />
        <div className="p-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center gc-surface-2" style={{ borderColor: 'var(--border-2)' }}>
            <Clock className="w-5 h-5" style={{ color: 'var(--text)' }} />
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>{t('tracker.title', 'Unified Application Tracker')}</h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('tracker.subtitle', 'Track all applications across departments in one view.')}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Applications List */}
        <div className="gc-surface rounded-2xl overflow-hidden">
          <div className="p-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              {t('tracker.allApps', 'All Applications')} ({applications.length})
            </h3>
          </div>
          <div className="divide-y" style={{ divideColor: 'var(--border)' }}>
            {applications.length === 0 ? (
              <EmptyState
                icon={Activity}
                title={t('tracker.noApps', 'No applications')}
                description={t('tracker.noAppsDesc', "You haven't submitted any applications yet.")}
              />
            ) : (
              applications.map(app => (
                <button
                  key={app.applicationId}
                  onClick={() => setSelected(app)}
                  className={`w-full p-4 text-left transition-colors ${
                    selected?.applicationId === app.applicationId
                      ? 'gc-surface-2 shadow-inner border-l-2'
                      : 'hover:bg-[var(--surface-3)]'
                  }`}
                  style={{ borderLeftColor: selected?.applicationId === app.applicationId ? 'var(--text)' : 'transparent' }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-semibold" style={{ color: 'var(--text)' }}>{app.applicationId}</span>
                    <StatusBadge status={app.status} size="sm" />
                  </div>
                  <div className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{app.schemeTitle}</div>
                  <div className="text-xs mt-1 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                    <Building2 className="w-3 h-3" />
                    {app.currentDepartment}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Detail Panel */}
        {selected ? (
          <div className="lg:col-span-2 gc-surface rounded-2xl overflow-hidden">
            {/* Detail header */}
            <div className="p-5 flex items-start justify-between gap-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="min-w-0 flex-1">
                <span className="font-mono text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{selected.applicationId}</span>
                <h3 className="text-lg font-bold mt-0.5 truncate" style={{ color: 'var(--text)' }}>{selected.schemeTitle}</h3>
              </div>
              <StatusBadge status={selected.status} size="lg" />
            </div>

            {/* Metadata grid */}
            <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-4 gc-surface-2" style={{ borderBottom: '1px solid var(--border)' }}>
              {[
                { label: t('tracker.department', 'Department'), value: selected.currentDepartment },
                { label: t('tracker.submitted', 'Submitted'), value: new Date(selected.createdAt).toLocaleDateString() },
                { label: t('tracker.lastUpdated', 'Last Updated'), value: new Date(selected.updatedAt).toLocaleTimeString() },
                { label: t('tracker.incomeVerified', 'Income Verified'), value: selected.incomeVerification?.verified ? `₹${selected.incomeVerification.annualIncome?.toLocaleString('en-IN')}` : t('tracker.pending', 'Pending') },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="gc-section-label mb-1">{label}</div>
                  <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Next Step */}
            <div className="p-5" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between p-4 rounded-xl gc-surface border" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <div className="gc-section-label mb-1">{t('tracker.nextStep', 'Next Step Required')}</div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{selected.nextStep}</div>
                </div>
                <ArrowRight className="w-5 h-5 animate-pulse shrink-0" style={{ color: 'var(--text)' }} />
              </div>
            </div>

            {/* Timeline */}
            <div className="p-5 space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{t('tracker.auditTrail', 'Application Audit Trail')}</h4>
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-0 before:bottom-0 before:w-px" style={{ before: { backgroundColor: 'var(--border)' } }}>
                {selected.statusHistory?.map((hist, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[18px] top-0 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center gc-surface-3" style={{ borderColor: 'var(--surface)' }}>
                      <CheckCircle2 className="w-2 h-2" style={{ color: 'var(--text)' }} />
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{hist.status.replace(/_/g, ' ')}</span>
                      <span className="text-[10px] font-mono shrink-0" style={{ color: 'var(--text-dim)' }}>{new Date(hist.changedAt).toLocaleString()}</span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{hist.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 gc-surface rounded-2xl flex items-center justify-center">
            <EmptyState
              icon={Activity}
              title={t('tracker.selectApp', 'Select an application')}
              description={t('tracker.selectAppDesc', 'Click on an application from the left panel to see its details and history.')}
            />
          </div>
        )}
      </div>
    </div>
  );
};
