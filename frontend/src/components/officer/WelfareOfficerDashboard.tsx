import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Application } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { MetricCard } from '../common/MetricCard';
import { CodeViewer } from '../common/CodeViewer';
import { UserCheck, CheckCircle, XCircle, FileText, RefreshCw, Award, Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const WelfareOfficerDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/welfare/applications');
      setApplications(res.data.applications || []);
    } catch (err) {
      console.error('Failed to fetch welfare applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleDecision = async (appId: string, action: 'APPROVE' | 'REJECT') => {
    try {
      await api.put(`/welfare/applications/${appId}/decision`, {
        action,
        note: `Decision executed by Social Welfare Officer.`
      });
      fetchApplications();
      if (selectedApp?.applicationId === appId) setSelectedApp(null);
    } catch (err: any) {
      alert(err.response?.data?.message || t('officer.decisionFail', 'Failed to execute officer decision.'));
    }
  };

  const filteredApps = applications.filter(app => {
    if (filterStatus === 'ALL') return true;
    return app.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 gc-accent-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2" style={{ color: 'var(--text)' }}>
            <UserCheck className="w-5 h-5" />
            <h2 className="text-xl font-extrabold">{t('officer.title', 'Social Welfare Officer Portal')}</h2>
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {t('officer.subtitle', 'Review verified citizen income payloads, inspect deterministic rule evaluations, and disburse scheme benefits.')}
          </p>
        </div>

        <button
          onClick={fetchApplications}
          className="p-2 rounded-lg transition-colors hover:bg-slate-800"
          style={{ color: 'var(--text-muted)' }}
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title={t('officer.totalSubmissions', 'Total Submissions')}
          value={applications.length}
          subtitle={t('officer.receivedApps', 'Received applications')}
          icon={FileText}
        />
        <MetricCard
          title={t('officer.incomeVerified', 'Income Verified')}
          value={applications.filter(a => a.incomeVerification?.verified).length}
          subtitle={t('officer.verifiedFromRev', 'Verified from Revenue XML')}
          icon={CheckCircle}
        />
        <MetricCard
          title={t('officer.approvedBenefits', 'Approved Benefits')}
          value={applications.filter(a => a.status === 'APPROVED' || a.status === 'COMPLETED').length}
          subtitle={t('officer.disbursementAuth', 'Disbursement authorized')}
          icon={Award}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applications List */}
        <div className="lg:col-span-2 gc-glass p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold" style={{ color: 'var(--text)' }}>{t('officer.needsReview', 'Applications Needing Review')}</h3>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="gc-input py-1.5 text-xs w-auto"
            >
              <option value="ALL">{t('officer.allStatuses', 'All Statuses')}</option>
              <option value="ELIGIBLE">{t('officer.eligible', 'Eligible (Pending Approval)')}</option>
              <option value="INCOME_VERIFIED">{t('officer.incomeVerifStatus', 'Income Verified')}</option>
              <option value="APPROVED">{t('officer.approved', 'Approved')}</option>
              <option value="NOT_ELIGIBLE">{t('officer.notEligible', 'Not Eligible')}</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="gc-table">
              <thead>
                <tr>
                  <th>{t('table.appId', 'App ID')}</th>
                  <th>{t('table.citizenId', 'Citizen ID')}</th>
                  <th>{t('table.scheme', 'Scheme')}</th>
                  <th>{t('table.verifiedIncome', 'Verified Income')}</th>
                  <th>{t('table.status', 'Status')}</th>
                  <th className="text-right">{t('table.actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map((app) => (
                  <tr key={app.applicationId} className="cursor-pointer transition-colors hover:bg-[var(--surface-3)]">
                    <td className="font-mono font-bold" style={{ color: 'var(--text)' }}>{app.applicationId}</td>
                    <td className="font-mono" style={{ color: 'var(--text-muted)' }}>{app.citizenId}</td>
                    <td className="font-semibold" style={{ color: 'var(--text)' }}>{app.schemeTitle}</td>
                    <td>
                      {app.incomeVerification?.verified ? (
                        <span className="font-bold" style={{ color: 'var(--success)' }}>₹{app.incomeVerification.annualIncome?.toLocaleString('en-IN')}</span>
                      ) : (
                        <span style={{ color: 'var(--text-dim)' }}>{t('officer.unverified', 'Unverified')}</span>
                      )}
                    </td>
                    <td><StatusBadge status={app.status} size="sm" /></td>
                    <td className="text-right space-x-2">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="px-2.5 py-1 rounded text-[11px] font-semibold transition-colors hover:bg-[var(--surface-3)]"
                        style={{ background: 'var(--surface-2)', color: 'var(--text)' }}
                      >
                        {t('officer.inspect', 'Inspect Payload')}
                      </button>
                      {(app.status === 'ELIGIBLE' || app.status === 'INCOME_VERIFIED') && (
                        <button
                          onClick={() => handleDecision(app.applicationId, 'APPROVE')}
                          className="gc-btn-primary px-2.5 py-1 text-[11px]"
                        >
                          {t('officer.approve', 'Approve')}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Inspector Drawer */}
        <div className="gc-glass p-5 space-y-4">
          <h3 className="text-sm font-extrabold" style={{ color: 'var(--text)' }}>{t('officer.inspector', 'Interoperability Data Inspector')}</h3>
          {selectedApp ? (
            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl gc-surface border" style={{ borderColor: 'var(--border)' }}>
                <div className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>{t('officer.welfareCitizenDetails', 'Welfare Citizen Details')}</div>
                <div className="font-bold mt-1" style={{ color: 'var(--text)' }}>{selectedApp.submissionData?.applicantName}</div>
                <div style={{ color: 'var(--text-muted)' }}>{t('officer.age', 'Age')}: {selectedApp.submissionData?.applicantAge} | {t('officer.phone', 'Phone')}: {selectedApp.submissionData?.phone}</div>
              </div>

              <div className="p-3 rounded-xl gc-surface-2 border" style={{ borderColor: 'var(--border-2)' }}>
                <div className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-dim)' }}>{t('officer.revData', 'Revenue Department Data (XML → Common Model)')}</div>
                <div className="text-sm font-extrabold mt-1" style={{ color: 'var(--text)' }}>
                  {t('officer.annualIncome', 'Annual Income')}: ₹{selectedApp.incomeVerification?.annualIncome?.toLocaleString('en-IN') || 0}
                </div>
                <div className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>{t('officer.source', 'Source')}: {selectedApp.incomeVerification?.source}</div>
              </div>

              <div>
                <span className="font-bold block mb-1" style={{ color: 'var(--text-muted)' }}>{t('officer.detReason', 'Deterministic Eligibility Reason')}:</span>
                <p className="p-3 rounded-xl gc-surface border" style={{ borderColor: 'var(--border)' }}>
                  {selectedApp.eligibilityResult?.reason || t('officer.evalComplete', 'Evaluation complete')}
                </p>
              </div>

              {selectedApp.incomeVerification?.rawXml && (
                <CodeViewer code={selectedApp.incomeVerification.rawXml} language="xml" title={t('officer.rawXmlTitle', 'Raw Legacy XML Received from Revenue')} />
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              {t('officer.selectPrompt', 'Select an application to inspect cross-departmental XML payloads and eligibility logic.')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
