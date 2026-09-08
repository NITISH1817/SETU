import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Application } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { MetricCard } from '../common/MetricCard';
import { ServiceGuide } from '../common/ServiceGuide';
import { useTranslation } from 'react-i18next';
import { PageSkeleton } from '../common/LoadingSkeleton';
import { EmptyState } from '../common/EmptyState';
import {
  FilePlus, ShieldCheck, CheckCircle, Award, Layers,
  Database, ArrowRight, ExternalLink, Clock, Zap, Building2, UserCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ── Small components ──────────────────────────────────────────────────────────
const ConnectedDeptNode: React.FC<{
  icon: React.ElementType; label: string;
}> = ({ icon: Icon, label }) => (
  <div className="flex flex-col items-center gap-2 group">
    <div className="w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-200 group-hover:scale-110"
         style={{ background: 'var(--surface-3)', borderColor: 'var(--border-2)', color: 'var(--text)' }}>
      <Icon className="w-5 h-5" />
    </div>
    <span className="text-[10px] font-medium text-center leading-tight w-20 transition-colors"
          style={{ color: 'var(--text-muted)' }}>{label}</span>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
export const UnifiedDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const citizenId = user?.citizenId || 'CIT-1001';

  useEffect(() => {
    api.get(`/applications?citizenId=${citizenId}`)
      .then(res => setApplications(res.data.applications || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [citizenId]);

  if (loading) return <PageSkeleton />;

  const deptNodes = [
    { icon: Database, label: t('dashboard.revenueDeptShort', 'Revenue Dept') },
    { icon: ShieldCheck, label: t('dashboard.welfareDeptShort', 'Social Welfare') },
    { icon: Building2, label: t('dashboard.businessDeptShort', 'Business & Industry') },
    { icon: UserCheck, label: t('dashboard.citizenServices', 'Citizen Services') },
  ];

  return (
    <div className="space-y-6 max-w-screen-xl mx-auto">

      {/* ── Service Navigator (Hero) ── */}
      <ServiceGuide />

      {/* ── Identity Banner ── */}
      <div className="gc-glass rounded-2xl overflow-hidden">
        <div className="h-1.5 w-full" style={{ background: 'var(--gradient-primary)' }} />
        <div className="p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="gc-badge gc-badge-success mb-2">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--success)' }} />
              {t('dashboard.unifiedProfile', 'Unified Citizen Profile')}
            </span>
            <h2 className="text-xl font-bold mt-1" style={{ color: 'var(--text)' }}>
              {t('dashboard.welcomeBack', 'Welcome back')}, {user?.name || 'Citizen'}
            </h2>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {t('dashboard.globalId', 'Global ID')}:{' '}
              <span className="font-mono font-semibold" style={{ color: 'var(--text)' }}>{citizenId}</span>
              {' '}·{' '}
              <span className="flex-inline items-center gap-1" style={{ color: 'var(--success)' }}>
                <CheckCircle className="w-3.5 h-3.5 inline mr-0.5" />
                {t('dashboard.aadhaarLinked', 'Aadhaar Linked')}
              </span>
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/tracking" className="gc-btn-secondary text-sm">
              <Clock className="w-4 h-4" />
              {t('dashboard.myApps', 'My Applications')}
            </Link>
            <Link to="/services/citizen" className="gc-btn-primary text-sm">
              <FilePlus className="w-4 h-4" />
              {t('dashboard.applyForService', 'Apply for Service')}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Summary Metrics ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title={t('dashboard.totalApplications', 'Total Applications')}
          value={applications.length + 2}
          subtitle={t('dashboard.acrossAllDepts', 'Across all departments')}
          icon={FilePlus}
        />
        <MetricCard
          title={t('dashboard.verifiedRecords', 'Verified Records')}
          value={applications.filter(a => a.incomeVerification?.verified).length}
          subtitle={t('dashboard.byRevenueDept', 'By Revenue Dept')}
          icon={CheckCircle}
        />
        <MetricCard
          title={t('dashboard.eligibleSchemes', 'Eligible Schemes')}
          value={applications.filter(a => a.status === 'ELIGIBLE' || a.status === 'APPROVED').length}
          subtitle={t('dashboard.approvedForBenefit', 'Approved for benefit')}
          icon={Award}
        />
        <MetricCard
          title={t('dashboard.deptsConnected', 'Departments Connected')}
          value={4}
          subtitle={t('dashboard.liveInteroperability', 'Live interoperability')}
          icon={Layers}
        />
      </div>

      {/* ── Connected Services Map ── */}
      <div className="gc-surface p-5 sm:p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
              {t('dashboard.connectedServices', 'Connected Government Services')}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {t('dashboard.connectedServicesDesc', 'Your single identity bridges isolated departmental systems')}
            </p>
          </div>
          <Link to="/middleware-hub" className="gc-btn-ghost text-xs">
            <Zap className="w-3.5 h-3.5" style={{ color: 'var(--text)' }} />
            {t('dashboard.viewGateway', 'View Gateway')}
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-around gap-4 py-2">
          {/* Central node */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: 'var(--text)', color: 'var(--surface)', boxShadow: 'var(--shadow-primary)' }}>
              <ShieldCheck className="w-7 h-7" />
            </div>
            <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{t('dashboard.unifiedProfileShort', 'Unified Profile')}</span>
          </div>

          {/* Arrow */}
          <div className="hidden sm:flex items-center gap-1" style={{ color: 'var(--border-2)' }}>
            <div className="w-8 h-px" style={{ background: 'var(--border-2)' }} />
            <ArrowRight className="w-4 h-4" />
            <div className="w-8 h-px" style={{ background: 'var(--border-2)' }} />
          </div>

          {/* Department nodes */}
          {deptNodes.map((node, i) => (
            <ConnectedDeptNode key={i} {...node} />
          ))}
        </div>
      </div>

      {/* ── Recent Applications ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
            {t('dashboard.myRecentApplications', 'Recent Applications')}
          </h3>
          <Link to="/tracking" className="gc-btn-ghost text-xs">
            {t('dashboard.viewAllApplications', 'View all')}
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="gc-surface rounded-2xl overflow-hidden">
          {applications.length === 0 ? (
            <EmptyState
              icon={FilePlus}
              title={t('dashboard.noApps', 'No applications yet')}
              description={t('dashboard.noAppsDesc', 'When you apply for a government service, your applications will appear here.')}
              actionLabel={t('dashboard.findService', 'Find a Service')}
              actionTo="/services/citizen"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="gc-table">
                <thead>
                  <tr>
                    {[t('table.appId','App ID'), t('table.serviceName','Service'), t('table.department','Department'), t('table.status','Status')].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {applications.slice(0, 2).map(app => (
                    <tr key={app.applicationId}>
                      <td className="font-mono font-semibold">{app.applicationId}</td>
                      <td className="font-medium" style={{ color: 'var(--text)' }}>{app.schemeTitle}</td>
                      <td>{app.currentDepartment}</td>
                      <td><StatusBadge status={app.status} /></td>
                    </tr>
                  ))}
                  {/* Cross-department mock rows */}
                  <tr>
                    <td className="font-mono font-semibold">APP-BI-9941</td>
                    <td className="font-medium" style={{ color: 'var(--text)' }}>{t('services.businessReg','Business Registration')}</td>
                    <td>{t('departments.business','Business & Industry')}</td>
                    <td><StatusBadge status="INCOME_VERIFICATION" /></td>
                  </tr>
                  <tr>
                    <td className="font-mono font-semibold">GRV-2201</td>
                    <td className="font-medium" style={{ color: 'var(--text)' }}>{t('services.waterComplaint','Water Supply Complaint')}</td>
                    <td>{t('departments.citizen','Citizen Services')}</td>
                    <td><StatusBadge status="ELIGIBILITY_CHECK" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
