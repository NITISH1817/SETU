import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Application } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { MetricCard } from '../common/MetricCard';
import { CodeViewer } from '../common/CodeViewer';
import { UserCheck, CheckCircle, XCircle, FileText, RefreshCw, Award, Filter } from 'lucide-react';

export const WelfareOfficerDashboard: React.FC = () => {
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
      alert(err.response?.data?.message || 'Failed to execute officer decision.');
    }
  };

  const filteredApps = applications.filter(app => {
    if (filterStatus === 'ALL') return true;
    return app.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl gov-gradient-header border border-blue-900/60 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-extrabold text-white">Social Welfare Officer Portal</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Review verified citizen income payloads, inspect deterministic rule evaluations, and disburse scheme benefits.
          </p>
        </div>

        <button
          onClick={fetchApplications}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Total Submissions"
          value={applications.length}
          subtitle="Received applications"
          icon={FileText}
          variant="blue"
        />
        <MetricCard
          title="Income Verified"
          value={applications.filter(a => a.incomeVerification?.verified).length}
          subtitle="Verified from Revenue XML"
          icon={CheckCircle}
          variant="emerald"
        />
        <MetricCard
          title="Approved Benefits"
          value={applications.filter(a => a.status === 'APPROVED' || a.status === 'COMPLETED').length}
          subtitle="Disbursement authorized"
          icon={Award}
          variant="purple"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applications List */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold text-white">Applications Needing Review</h3>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-3 py-1.5 text-white font-semibold focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="ELIGIBLE">Eligible (Pending Approval)</option>
              <option value="INCOME_VERIFIED">Income Verified</option>
              <option value="APPROVED">Approved</option>
              <option value="NOT_ELIGIBLE">Not Eligible</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">App ID</th>
                  <th className="p-3">Citizen ID</th>
                  <th className="p-3">Scheme</th>
                  <th className="p-3">Verified Income</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredApps.map((app) => (
                  <tr key={app.applicationId} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-3 font-mono font-bold text-blue-400">{app.applicationId}</td>
                    <td className="p-3 font-mono text-slate-300">{app.citizenId}</td>
                    <td className="p-3 font-semibold text-white">{app.schemeTitle}</td>
                    <td className="p-3">
                      {app.incomeVerification?.verified ? (
                        <span className="font-bold text-emerald-400">₹{app.incomeVerification.annualIncome?.toLocaleString('en-IN')}</span>
                      ) : (
                        <span className="text-slate-500">Unverified</span>
                      )}
                    </td>
                    <td className="p-3"><StatusBadge status={app.status} size="sm" /></td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-semibold"
                      >
                        Inspect Payload
                      </button>
                      {(app.status === 'ELIGIBLE' || app.status === 'INCOME_VERIFIED') && (
                        <button
                          onClick={() => handleDecision(app.applicationId, 'APPROVE')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold shadow"
                        >
                          Approve
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
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-extrabold text-white">Interoperability Data Inspector</h3>
          {selectedApp ? (
            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Welfare Citizen Details</div>
                <div className="font-bold text-white mt-1">{selectedApp.submissionData?.applicantName}</div>
                <div className="text-slate-400">Age: {selectedApp.submissionData?.applicantAge} | Phone: {selectedApp.submissionData?.phone}</div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50">
                <div className="text-[10px] text-emerald-400 uppercase font-bold">Revenue Department Data (XML → Common Model)</div>
                <div className="text-sm font-extrabold text-white mt-1">
                  Annual Income: ₹{selectedApp.incomeVerification?.annualIncome?.toLocaleString('en-IN') || 0}
                </div>
                <div className="text-[11px] text-slate-300 mt-1">Source: {selectedApp.incomeVerification?.source}</div>
              </div>

              <div>
                <span className="text-slate-400 font-bold block mb-1">Deterministic Eligibility Reason:</span>
                <p className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                  {selectedApp.eligibilityResult?.reason || 'Evaluation complete'}
                </p>
              </div>

              {selectedApp.incomeVerification?.rawXml && (
                <CodeViewer code={selectedApp.incomeVerification.rawXml} language="xml" title="Raw Legacy XML Received from Revenue" />
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs font-mono">
              Select an application to inspect cross-departmental XML payloads and eligibility logic.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
