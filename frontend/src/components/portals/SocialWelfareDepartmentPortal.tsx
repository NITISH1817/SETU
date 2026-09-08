import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Application, Scheme } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { MetricCard } from '../common/MetricCard';
import { CodeViewer } from '../common/CodeViewer';
import { UserCheck, CheckCircle, Award, RefreshCw, FileText, Plus, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const SocialWelfareDepartmentPortal: React.FC = () => {
  const { t } = useTranslation();
  const [applications, setApplications] = useState<Application[]>([]);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [disbursingId, setDisbursingId] = useState<string | null>(null);
  const [showAddScheme, setShowAddScheme] = useState(false);

  const [newScheme, setNewScheme] = useState({
    title: t('welfare.demoSchemeTitle', 'Chief Minister Youth Empowerment Scholarship'),
    category: t('welfare.demoSchemeCategory', 'Scholarship'),
    description: t('welfare.demoSchemeDesc', 'Financial assistance for youth in higher vocational education'),
    maxIncomeThreshold: 350000,
    benefitsAmount: 75000,
    minAgeRequired: 18
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appRes, schemeRes] = await Promise.all([
        api.get('/welfare/applications'),
        api.get('/applications/schemes')
      ]);
      setApplications(appRes.data.applications || []);
      setSchemes(schemeRes.data.schemes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerifyIncome = async (app: Application) => {
    setVerifyingId(app.applicationId);
    try {
      await api.post('/income/verify', { applicationId: app.applicationId, citizenId: app.citizenId });
      await fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || t('welfare.verifyFail', 'Verification failed. Ensure citizen has granted active consent.'));
    } finally {
      setVerifyingId(null);
    }
  };

  const handleDecision = async (appId: string, action: 'APPROVE' | 'REJECT') => {
    try {
      await api.put(`/welfare/applications/${appId}/decision`, { action });
      await fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || t('welfare.decisionFail', 'Failed to update decision.'));
    }
  };

  const handleDisburse = async (appId: string) => {
    setDisbursingId(appId);
    try {
      await api.post(`/welfare/applications/${appId}/disburse`);
      alert(t('welfare.disburseSuccess', 'Direct Benefit Transfer successfully credited!'));
      await fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || t('welfare.payoutFail', 'Payout failed.'));
    } finally {
      setDisbursingId(null);
    }
  };

  const handleCreateScheme = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/welfare/schemes', newScheme);
      alert(t('welfare.createSchemeSuccess', 'Scheme created successfully!'));
      setShowAddScheme(false);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || t('welfare.createSchemeFail', 'Failed to create scheme.'));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 gc-accent-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <UserCheck className="w-6 h-6" style={{ color: 'var(--text)' }} />
            <h2 className="text-xl font-extrabold" style={{ color: 'var(--text)' }}>{t('welfare.title', 'Social Welfare Department Portal')}</h2>
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {t('welfare.subtitle', 'Official Beneficiary Administration & Direct Benefit Transfer (DBT) Payout Portal')}
          </p>
        </div>

        <button
          onClick={() => setShowAddScheme(!showAddScheme)}
          className="gc-btn-primary"
        >
          <Plus className="w-4 h-4" />
          <span>{t('welfare.addScheme', 'Add New Welfare Scheme')}</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title={t('welfare.totalApps', 'Total Applications')}
          value={applications.length}
          subtitle={t('welfare.totalAppsSub', 'Received across schemes')}
          icon={FileText}
        />
        <MetricCard
          title={t('welfare.verifiedIncomes', 'Verified Incomes')}
          value={applications.filter(a => a.incomeVerification?.verified).length}
          subtitle={t('welfare.verifiedIncomesSub', 'Retrieved via Middleware XML Parser')}
          icon={CheckCircle}
        />
        <MetricCard
          title={t('welfare.disbursed', 'Disbursed Benefits')}
          value={applications.filter(a => a.status === 'COMPLETED').length}
          subtitle={t('welfare.disbursedSub', 'Direct Benefit Transfer completed')}
          icon={Award}
        />
      </div>

      {/* Add Scheme Modal Form */}
      {showAddScheme && (
        <div className="gc-glass p-5 rounded-2xl space-y-3">
          <h3 className="text-sm font-extrabold" style={{ color: 'var(--text)' }}>{t('welfare.createNewProgram', 'Create New Welfare Assistance Program')}</h3>
          <form onSubmit={handleCreateScheme} className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="gc-label">{t('welfare.schemeTitle', 'Scheme Title')}</label>
              <input
                type="text"
                value={newScheme.title}
                onChange={(e) => setNewScheme({ ...newScheme, title: e.target.value })}
                required
                className="gc-input"
              />
            </div>
            <div>
              <label className="gc-label">{t('welfare.category', 'Category')}</label>
              <select
                value={newScheme.category}
                onChange={(e) => setNewScheme({ ...newScheme, category: e.target.value })}
                className="gc-input"
              >
                <option value="Scholarship">{t('welfare.catScholarship', 'Scholarship')}</option>
                <option value="Pension">{t('welfare.catPension', 'Pension')}</option>
                <option value="Healthcare">{t('welfare.catHealthcare', 'Healthcare Assistance')}</option>
              </select>
            </div>
            <div>
              <label className="gc-label">{t('welfare.maxIncome', 'Max Income Limit (₹)')}</label>
              <input
                type="number"
                value={newScheme.maxIncomeThreshold}
                onChange={(e) => setNewScheme({ ...newScheme, maxIncomeThreshold: Number(e.target.value) })}
                required
                className="gc-input font-mono"
              />
            </div>
            <div>
              <label className="gc-label">{t('welfare.benefitAmt', 'Benefit Amount (₹)')}</label>
              <input
                type="number"
                value={newScheme.benefitsAmount}
                onChange={(e) => setNewScheme({ ...newScheme, benefitsAmount: Number(e.target.value) })}
                required
                className="gc-input font-mono"
              />
            </div>
            <div className="md:col-span-2 flex justify-end items-end space-x-2">
              <button
                type="button"
                onClick={() => setShowAddScheme(false)}
                className="gc-btn-ghost"
              >
                {t('welfare.cancel', 'Cancel')}
              </button>
              <button
                type="submit"
                className="gc-btn-primary"
              >
                {t('welfare.publishScheme', 'Publish Scheme')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applications Desk */}
        <div className="lg:col-span-2 gc-glass p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold" style={{ color: 'var(--text)' }}>{t('welfare.appsDesk', 'Applications Desk & Verification Triggers')}</h3>
            <button onClick={fetchData} className="p-1" style={{ color: 'var(--text-muted)' }}>
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="gc-table">
              <thead>
                <tr>
                  <th>{t('table.appId', 'App ID')}</th>
                  <th>{t('table.applicant', 'Applicant')}</th>
                  <th>{t('table.scheme', 'Scheme')}</th>
                  <th>{t('table.verifiedIncome', 'Verified Income')}</th>
                  <th>{t('table.status', 'Status')}</th>
                  <th className="text-right">{t('table.actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.applicationId}>
                    <td className="font-mono font-bold" style={{ color: 'var(--text)' }}>{app.applicationId}</td>
                    <td className="font-semibold" style={{ color: 'var(--text)' }}>
                      {app.submissionData?.applicantName} <span className="text-[10px] font-mono" style={{ color: 'var(--text-dim)' }}>({app.citizenId})</span>
                    </td>
                    <td>{app.schemeTitle}</td>
                    <td>
                      {app.incomeVerification?.verified ? (
                        <span className="font-bold" style={{ color: 'var(--success)' }}>₹{app.incomeVerification.annualIncome?.toLocaleString('en-IN')}</span>
                      ) : (
                        <span className="font-semibold" style={{ color: 'var(--warning)' }}>{t('welfare.unverified', 'Unverified')}</span>
                      )}
                    </td>
                    <td><StatusBadge status={app.status} size="sm" /></td>
                    <td className="text-right space-x-2">
                      {!app.incomeVerification?.verified && (
                        <button
                          onClick={() => handleVerifyIncome(app)}
                          disabled={verifyingId === app.applicationId}
                          className="px-2.5 py-1 rounded text-[11px] font-bold shadow disabled:opacity-50"
                          style={{ background: 'var(--text)', color: 'var(--surface)' }}
                        >
                          {verifyingId === app.applicationId ? t('welfare.verifying', 'Verifying...') : t('welfare.fetchIncome', 'Fetch Income')}
                        </button>
                      )}
                      {app.status === 'ELIGIBLE' && (
                        <button
                          onClick={() => handleDecision(app.applicationId, 'APPROVE')}
                          className="px-2.5 py-1 rounded text-[11px] font-bold shadow"
                          style={{ background: 'var(--success)', color: 'var(--surface)' }}
                        >
                          {t('welfare.approve', 'Approve')}
                        </button>
                      )}
                      {app.status === 'APPROVED' && (
                        <button
                          onClick={() => handleDisburse(app.applicationId)}
                          disabled={disbursingId === app.applicationId}
                          className="px-2.5 py-1 rounded text-[11px] font-bold shadow"
                          style={{ background: 'var(--primary)', color: 'var(--surface)' }}
                        >
                          {disbursingId === app.applicationId ? t('welfare.transferring', 'Transferring...') : t('welfare.disbursePayout', 'Disburse Payout')}
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="px-2 py-1 rounded text-[11px]"
                        style={{ background: 'var(--surface-3)', color: 'var(--text)' }}
                      >
                        {t('welfare.inspect', 'Inspect')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Application Inspector */}
        <div className="gc-glass p-5 space-y-4">
          <h3 className="text-sm font-extrabold" style={{ color: 'var(--text)' }}>{t('welfare.inspectorTitle', 'Transformed Common Model Inspector')}</h3>

          {selectedApp ? (
            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl gc-surface">
                <div className="gc-section-label">{t('welfare.applicantDetails', 'Applicant Details')}</div>
                <div className="font-bold text-sm mt-1" style={{ color: 'var(--text)' }}>{selectedApp.submissionData?.applicantName}</div>
                <div className="font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>{t('welfare.welfareId', 'Welfare ID')}: {selectedApp.citizenId}</div>
              </div>

              {selectedApp.incomeVerification?.verified ? (
                <div className="p-3 rounded-xl gc-surface">
                  <div className="gc-section-label">{t('welfare.revToCommon', 'Revenue XML ➔ Common Model')}</div>
                  <div className="text-base font-extrabold" style={{ color: 'var(--text)' }}>
                    {t('welfare.verifiedIncomeLabel', 'Verified Income')}: ₹{selectedApp.incomeVerification.annualIncome?.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{t('welfare.revenueId', 'Revenue ID')}: {selectedApp.incomeVerification.revenueId}</div>
                  <div className="text-[10px]" style={{ color: 'var(--text-dim)' }}>{t('welfare.provenance', 'Provenance')}: {selectedApp.incomeVerification.source}</div>
                </div>
              ) : (
                <div className="gc-alert gc-alert-warning">
                  {t('welfare.pendingWarning', 'Income verification pending. Click "Fetch Income" to trigger the cross-departmental XML middleware.')}
                </div>
              )}

              <div>
                <span className="font-bold block mb-1" style={{ color: 'var(--text-muted)' }}>{t('welfare.detLogic', 'Deterministic Eligibility Logic')}:</span>
                <p className="p-3 rounded-xl gc-surface">
                  {selectedApp.eligibilityResult?.reason || t('welfare.evalReady', 'Evaluation ready')}
                </p>
              </div>

              {selectedApp.incomeVerification?.rawXml && (
                <CodeViewer code={selectedApp.incomeVerification.rawXml} language="xml" title={t('welfare.rawXml', 'Raw Revenue Department XML Response')} />
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              {t('welfare.inspectPrompt', 'Select an application to inspect parsed XML payload and benefit disbursement options.')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
