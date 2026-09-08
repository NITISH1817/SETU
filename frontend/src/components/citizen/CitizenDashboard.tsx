import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Application, Scheme, Consent } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { MetricCard } from '../common/MetricCard';
import { ApplySchemeModal } from './ApplySchemeModal';
import { useTranslation } from 'react-i18next';
import {
  FilePlus,
  ShieldCheck,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Award,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const CitizenDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [applications, setApplications] = useState<Application[]>([]);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [consents, setConsents] = useState<Consent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [verifyingAppId, setVerifyingAppId] = useState<string | null>(null);

  const citizenId = user?.citizenId || 'CIT-1001';

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appRes, schemeRes, consentRes] = await Promise.all([
        api.get(`/applications?citizenId=${citizenId}`),
        api.get('/applications/schemes'),
        api.get(`/citizen/consents?citizenId=${citizenId}`)
      ]);
      setApplications(appRes.data.applications || []);
      setSchemes(schemeRes.data.schemes || []);
      setConsents(consentRes.data.consents || []);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [citizenId]);

  const handleTriggerIncomeVerification = async (appId: string) => {
    setVerifyingAppId(appId);
    try {
      await api.post('/income/verify', { applicationId: appId, citizenId });
      await fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || t('dashboard.verifyFailed', 'Verification failed. Ensure consent is granted.'));
    } finally {
      setVerifyingAppId(null);
    }
  };

  const hasActiveConsent = consents.some(c => c.status === 'ACTIVE');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 gc-accent-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="gc-badge gc-badge-info mb-2">
            {t('dashboard.header', 'Citizen Dashboard')}
          </span>
          <h2 className="text-2xl font-extrabold" style={{ color: 'var(--text)' }}>
            {t('dashboard.welcome', 'Welcome back')}, {user?.name || 'Citizen'}
          </h2>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {t('dashboard.welfareIdLabel', 'Welfare Citizen ID')}: <span className="font-mono font-bold" style={{ color: 'var(--text)' }}>{citizenId}</span> • {t('dashboard.singleWindow', 'Registered Citizen Single Window')}
          </p>
        </div>

        <button
          onClick={() => setIsApplyModalOpen(true)}
          className="gc-btn-primary"
        >
          <FilePlus className="w-4 h-4" />
          <span>{t('dashboard.applyScheme', 'Apply for New Scheme')}</span>
        </button>
      </div>

      {/* Consent Warning Alert */}
      {!hasActiveConsent && (
        <div className="gc-alert gc-alert-warning flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <div className="text-xs">
              <span className="font-bold">{t('dashboard.consentReq', 'Digital Consent Required')}:</span> {t('dashboard.consentDesc', 'You do not currently have an active consent record for Revenue Department income verification.')}
            </div>
          </div>
          <Link
            to="/consent"
            className="px-3 py-1.5 font-bold text-xs rounded-lg shadow transition-colors flex-shrink-0"
            style={{ background: 'var(--warning)', color: 'var(--bg)' }}
          >
            {t('dashboard.grantConsent', 'Grant Consent Now')}
          </Link>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title={t('dashboard.submittedApps', 'Submitted Applications')}
          value={applications.length}
          subtitle={t('dashboard.totalApps', 'Total scheme applications')}
          icon={FilePlus}
        />
        <MetricCard
          title={t('dashboard.verifiedIncomes', 'Verified Incomes')}
          value={applications.filter(a => a.incomeVerification?.verified).length}
          subtitle={t('dashboard.verifiedByRev', 'Verified by Revenue Dept')}
          icon={CheckCircle}
        />
        <MetricCard
          title={t('dashboard.eligibleSchemes', 'Eligible Schemes')}
          value={applications.filter(a => a.status === 'ELIGIBLE' || a.status === 'APPROVED').length}
          subtitle={t('dashboard.qualifiedBenefits', 'Qualified for benefit payout')}
          icon={Award}
        />
        <MetricCard
          title={t('dashboard.consentStatus', 'Consent Status')}
          value={hasActiveConsent ? t('dashboard.activeCheck', 'ACTIVE ✓') : t('dashboard.none', 'NONE')}
          subtitle={hasActiveConsent ? t('dashboard.revFetchAuth', 'Revenue fetch authorized') : t('dashboard.actionReq', 'Action required')}
          icon={ShieldCheck}
        />
      </div>

      {/* Available Welfare Schemes */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
          {t('dashboard.availableSchemes', 'Available Government Welfare Schemes')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schemes.map((scheme) => (
            <div key={scheme.schemeId} className="gc-card p-5 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <span className="gc-badge gc-badge-primary">
                    {scheme.category}
                  </span>
                  <span className="text-xs font-mono font-bold" style={{ color: 'var(--text-dim)' }}>{scheme.schemeId}</span>
                </div>
                <h4 className="text-base font-bold mt-2" style={{ color: 'var(--text)' }}>{scheme.title}</h4>
                <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{scheme.description}</p>
              </div>

              <div className="pt-3 flex items-center justify-between" style={{ borderTop: '1px solid var(--border)' }}>
                <div>
                  <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{t('dashboard.maxIncome', 'Max Income Limit')}: <span className="font-bold" style={{ color: 'var(--text)' }}>₹{scheme.maxIncomeThreshold.toLocaleString('en-IN')}</span></div>
                  <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{t('dashboard.financialBenefit', 'Financial Benefit')}: <span className="font-bold" style={{ color: 'var(--text)' }}>₹{scheme.benefitsAmount.toLocaleString('en-IN')}</span></div>
                </div>
                <button
                  onClick={() => setIsApplyModalOpen(true)}
                  className="gc-btn-secondary"
                >
                  {t('dashboard.apply', 'Apply')} <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-extrabold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
            {t('dashboard.myApps', 'My Applications & Status Tracking')}
          </h3>
          <Link to="/tracking" className="text-xs font-semibold hover:underline" style={{ color: 'var(--text)' }}>
            {t('dashboard.viewTimeline', 'View Detailed Tracking Timeline')} →
          </Link>
        </div>

        <div className="gc-surface overflow-hidden shadow-sm">
          {applications.length === 0 ? (
            <div className="p-8 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
              {t('dashboard.noApps', 'No applications submitted yet. Click "Apply for New Scheme" above.')}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="gc-table">
                <thead>
                  <tr>
                    <th>{t('dashboard.appId', 'App ID')}</th>
                    <th>{t('dashboard.scheme', 'Scheme')}</th>
                    <th>{t('dashboard.currentDept', 'Current Department')}</th>
                    <th>{t('dashboard.incomeStatus', 'Income Status')}</th>
                    <th>{t('dashboard.appStatus', 'Application Status')}</th>
                    <th className="text-right">{t('dashboard.actions', 'Actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.applicationId}>
                      <td className="font-mono font-bold" style={{ color: 'var(--text)' }}>{app.applicationId}</td>
                      <td className="font-semibold" style={{ color: 'var(--text)' }}>{app.schemeTitle}</td>
                      <td>{app.currentDepartment}</td>
                      <td>
                        {app.incomeVerification?.verified ? (
                          <span className="font-semibold flex items-center" style={{ color: 'var(--success)' }}>
                            <CheckCircle className="w-3.5 h-3.5 mr-1" /> ₹{app.incomeVerification.annualIncome?.toLocaleString('en-IN')} {t('dashboard.verified', 'Verified')}
                          </span>
                        ) : (
                          <span className="font-semibold" style={{ color: 'var(--warning)' }}>{t('dashboard.verifyPending', 'Verification Pending')}</span>
                        )}
                      </td>
                      <td>
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="text-right">
                        {!app.incomeVerification?.verified ? (
                          <button
                            onClick={() => handleTriggerIncomeVerification(app.applicationId)}
                            disabled={verifyingAppId === app.applicationId}
                            className="px-3 py-1 font-bold text-[11px] rounded-lg transition-all shadow disabled:opacity-50 inline-flex items-center"
                            style={{ background: 'var(--text)', color: 'var(--surface)' }}
                          >
                            {verifyingAppId === app.applicationId && <RefreshCw className="w-3 h-3 mr-1 animate-spin" />}
                            {t('dashboard.fetchVerify', 'Fetch & Verify Income')}
                          </button>
                        ) : (
                          <Link
                            to="/interoperability-monitor"
                            className="text-xs hover:underline font-semibold"
                            style={{ color: 'var(--text)' }}
                          >
                            {t('dashboard.viewLog', 'View Interoperability Log')}
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      {isApplyModalOpen && (
        <ApplySchemeModal
          schemes={schemes}
          onClose={() => setIsApplyModalOpen(false)}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
};
