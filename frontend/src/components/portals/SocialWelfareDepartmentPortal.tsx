import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Application, Scheme } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { MetricCard } from '../common/MetricCard';
import { CodeViewer } from '../common/CodeViewer';
import { UserCheck, CheckCircle, Award, RefreshCw, FileText, Plus, DollarSign, ArrowRight } from 'lucide-react';

export const SocialWelfareDepartmentPortal: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [disbursingId, setDisbursingId] = useState<string | null>(null);
  const [showAddScheme, setShowAddScheme] = useState(false);

  const [newScheme, setNewScheme] = useState({
    title: 'Chief Minister Youth Empowerment Scholarship',
    category: 'Scholarship',
    description: 'Financial assistance for youth in higher vocational education',
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
      alert(err.response?.data?.message || 'Verification failed. Ensure citizen has granted active consent.');
    } finally {
      setVerifyingId(null);
    }
  };

  const handleDecision = async (appId: string, action: 'APPROVE' | 'REJECT') => {
    try {
      await api.put(`/welfare/applications/${appId}/decision`, { action });
      await fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update decision.');
    }
  };

  const handleDisburse = async (appId: string) => {
    setDisbursingId(appId);
    try {
      await api.post(`/welfare/applications/${appId}/disburse`);
      alert('Direct Benefit Transfer successfully credited!');
      await fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Payout failed.');
    } finally {
      setDisbursingId(null);
    }
  };

  const handleCreateScheme = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/welfare/schemes', newScheme);
      alert('Scheme created successfully!');
      setShowAddScheme(false);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create scheme.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl gov-gradient-header border border-blue-900/60 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <UserCheck className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-extrabold text-white">Social Welfare Department Portal</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Official Beneficiary Administration & Direct Benefit Transfer (DBT) Payout Portal
          </p>
        </div>

        <button
          onClick={() => setShowAddScheme(!showAddScheme)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Welfare Scheme</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Total Applications"
          value={applications.length}
          subtitle="Received across schemes"
          icon={FileText}
          variant="blue"
        />
        <MetricCard
          title="Verified Incomes"
          value={applications.filter(a => a.incomeVerification?.verified).length}
          subtitle="Retrieved via Middleware XML Parser"
          icon={CheckCircle}
          variant="emerald"
        />
        <MetricCard
          title="Disbursed Benefits"
          value={applications.filter(a => a.status === 'COMPLETED').length}
          subtitle="Direct Benefit Transfer completed"
          icon={Award}
          variant="purple"
        />
      </div>

      {/* Add Scheme Modal Form */}
      {showAddScheme && (
        <div className="glass-panel p-5 rounded-2xl border border-blue-800 space-y-3">
          <h3 className="text-sm font-extrabold text-white">Create New Welfare Assistance Program</h3>
          <form onSubmit={handleCreateScheme} className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Scheme Title</label>
              <input
                type="text"
                value={newScheme.title}
                onChange={(e) => setNewScheme({ ...newScheme, title: e.target.value })}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">Category</label>
              <select
                value={newScheme.category}
                onChange={(e) => setNewScheme({ ...newScheme, category: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-semibold"
              >
                <option value="Scholarship">Scholarship</option>
                <option value="Pension">Pension</option>
                <option value="Healthcare">Healthcare Assistance</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">Max Income Limit (₹)</label>
              <input
                type="number"
                value={newScheme.maxIncomeThreshold}
                onChange={(e) => setNewScheme({ ...newScheme, maxIncomeThreshold: Number(e.target.value) })}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">Benefit Amount (₹)</label>
              <input
                type="number"
                value={newScheme.benefitsAmount}
                onChange={(e) => setNewScheme({ ...newScheme, benefitsAmount: Number(e.target.value) })}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono"
              />
            </div>
            <div className="md:col-span-2 flex justify-end items-end space-x-2">
              <button
                type="button"
                onClick={() => setShowAddScheme(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow"
              >
                Publish Scheme
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applications Desk */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold text-white">Applications Desk & Verification Triggers</h3>
            <button onClick={fetchData} className="p-1 text-slate-400 hover:text-white">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">App ID</th>
                  <th className="p-3">Applicant</th>
                  <th className="p-3">Scheme</th>
                  <th className="p-3">Verified Income</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {applications.map((app) => (
                  <tr key={app.applicationId} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-3 font-mono font-bold text-blue-400">{app.applicationId}</td>
                    <td className="p-3 font-semibold text-white">
                      {app.submissionData?.applicantName} <span className="text-[10px] text-slate-400 font-mono">({app.citizenId})</span>
                    </td>
                    <td className="p-3 text-slate-300">{app.schemeTitle}</td>
                    <td className="p-3">
                      {app.incomeVerification?.verified ? (
                        <span className="font-bold text-emerald-400">₹{app.incomeVerification.annualIncome?.toLocaleString('en-IN')}</span>
                      ) : (
                        <span className="text-amber-400 font-semibold">Unverified</span>
                      )}
                    </td>
                    <td className="p-3"><StatusBadge status={app.status} size="sm" /></td>
                    <td className="p-3 text-right space-x-2">
                      {!app.incomeVerification?.verified && (
                        <button
                          onClick={() => handleVerifyIncome(app)}
                          disabled={verifyingId === app.applicationId}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold shadow disabled:opacity-50"
                        >
                          {verifyingId === app.applicationId ? 'Verifying...' : 'Fetch Income'}
                        </button>
                      )}
                      {app.status === 'ELIGIBLE' && (
                        <button
                          onClick={() => handleDecision(app.applicationId, 'APPROVE')}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] font-bold shadow"
                        >
                          Approve
                        </button>
                      )}
                      {app.status === 'APPROVED' && (
                        <button
                          onClick={() => handleDisburse(app.applicationId)}
                          disabled={disbursingId === app.applicationId}
                          className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded text-[11px] font-bold shadow pulse-glow"
                        >
                          {disbursingId === app.applicationId ? 'Transferring...' : 'Disburse Payout'}
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px]"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Application Inspector */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-extrabold text-white">Transformed Common Model Inspector</h3>

          {selectedApp ? (
            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Applicant Details</div>
                <div className="font-bold text-white text-sm mt-1">{selectedApp.submissionData?.applicantName}</div>
                <div className="text-slate-400 font-mono mt-0.5">Welfare ID: {selectedApp.citizenId}</div>
              </div>

              {selectedApp.incomeVerification?.verified ? (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 space-y-1">
                  <div className="text-[10px] text-emerald-400 uppercase font-bold">Revenue XML ➔ Common Model</div>
                  <div className="text-base font-extrabold text-white">
                    Verified Income: ₹{selectedApp.incomeVerification.annualIncome?.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-slate-300">Revenue ID: {selectedApp.incomeVerification.revenueId}</div>
                  <div className="text-[10px] text-slate-400">Provenance: {selectedApp.incomeVerification.source}</div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/50 text-amber-300">
                  Income verification pending. Click "Fetch Income" to trigger the cross-departmental XML middleware.
                </div>
              )}

              <div>
                <span className="text-slate-400 font-bold block mb-1">Deterministic Eligibility Logic:</span>
                <p className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                  {selectedApp.eligibilityResult?.reason || 'Evaluation ready'}
                </p>
              </div>

              {selectedApp.incomeVerification?.rawXml && (
                <CodeViewer code={selectedApp.incomeVerification.rawXml} language="xml" title="Raw Revenue Department XML Response" />
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs font-mono">
              Select an application to inspect parsed XML payload and benefit disbursement options.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
