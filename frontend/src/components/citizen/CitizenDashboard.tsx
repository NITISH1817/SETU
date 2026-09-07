import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Application, Scheme, Consent } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { MetricCard } from '../common/MetricCard';
import { ApplySchemeModal } from './ApplySchemeModal';
import {
  FilePlus,
  ShieldCheck,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Award,
  DollarSign
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const CitizenDashboard: React.FC = () => {
  const { user } = useAuth();
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
      alert(err.response?.data?.message || 'Verification failed. Ensure consent is granted.');
    } finally {
      setVerifyingAppId(null);
    }
  };

  const hasActiveConsent = consents.some(c => c.status === 'ACTIVE');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl gov-gradient-header border border-blue-900/60 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-blue-400 bg-blue-950/80 px-2.5 py-1 rounded border border-blue-800">
            Citizen Dashboard
          </span>
          <h2 className="text-2xl font-extrabold text-white mt-2">
            Welcome back, {user?.name || 'Citizen'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Welfare Citizen ID: <span className="font-mono font-bold text-blue-400">{citizenId}</span> • Registered Citizen Single Window
          </p>
        </div>

        <button
          onClick={() => setIsApplyModalOpen(true)}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg pulse-glow transition-all"
        >
          <FilePlus className="w-4 h-4" />
          <span>Apply for New Scheme</span>
        </button>
      </div>

      {/* Consent Warning Alert */}
      {!hasActiveConsent && (
        <div className="p-4 rounded-xl bg-amber-950/60 border border-amber-800/60 text-amber-300 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div className="text-xs">
              <span className="font-bold">Digital Consent Required:</span> You do not currently have an active consent record for Revenue Department income verification.
            </div>
          </div>
          <Link
            to="/consent"
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg shadow transition-colors flex-shrink-0"
          >
            Grant Consent Now
          </Link>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Submitted Applications"
          value={applications.length}
          subtitle="Total scheme applications"
          icon={FilePlus}
          variant="blue"
        />
        <MetricCard
          title="Verified Incomes"
          value={applications.filter(a => a.incomeVerification?.verified).length}
          subtitle="Verified by Revenue Dept"
          icon={CheckCircle}
          variant="emerald"
        />
        <MetricCard
          title="Eligible Schemes"
          value={applications.filter(a => a.status === 'ELIGIBLE' || a.status === 'APPROVED').length}
          subtitle="Qualified for benefit payout"
          icon={Award}
          variant="purple"
        />
        <MetricCard
          title="Consent Status"
          value={hasActiveConsent ? 'ACTIVE ✓' : 'NONE'}
          subtitle={hasActiveConsent ? 'Revenue fetch authorized' : 'Action required'}
          icon={ShieldCheck}
          variant={hasActiveConsent ? 'emerald' : 'amber'}
        />
      </div>

      {/* Available Welfare Schemes */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
          Available Government Welfare Schemes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schemes.map((scheme) => (
            <div key={scheme.schemeId} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800">
                    {scheme.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">{scheme.schemeId}</span>
                </div>
                <h4 className="text-base font-bold text-white mt-2">{scheme.title}</h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{scheme.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">Max Income Limit: <span className="font-bold text-white">₹{scheme.maxIncomeThreshold.toLocaleString('en-IN')}</span></div>
                  <div className="text-[11px] text-slate-400">Financial Benefit: <span className="font-bold text-emerald-400">₹{scheme.benefitsAmount.toLocaleString('en-IN')}</span></div>
                </div>
                <button
                  onClick={() => setIsApplyModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white font-bold text-xs border border-blue-500/30 transition-all flex items-center"
                >
                  Apply <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
            My Applications & Status Tracking
          </h3>
          <Link to="/tracking" className="text-xs font-semibold text-blue-400 hover:underline">
            View Detailed Tracking Timeline →
          </Link>
        </div>

        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          {applications.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No applications submitted yet. Click "Apply for New Scheme" above.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-4">App ID</th>
                    <th className="p-4">Scheme</th>
                    <th className="p-4">Current Department</th>
                    <th className="p-4">Income Status</th>
                    <th className="p-4">Application Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {applications.map((app) => (
                    <tr key={app.applicationId} className="hover:bg-slate-900/50 transition-colors">
                      <td className="p-4 font-mono font-bold text-blue-400">{app.applicationId}</td>
                      <td className="p-4 font-semibold text-white">{app.schemeTitle}</td>
                      <td className="p-4 text-slate-400">{app.currentDepartment}</td>
                      <td className="p-4">
                        {app.incomeVerification?.verified ? (
                          <span className="text-emerald-400 font-semibold flex items-center">
                            <CheckCircle className="w-3.5 h-3.5 mr-1" /> ₹{app.incomeVerification.annualIncome?.toLocaleString('en-IN')} Verified
                          </span>
                        ) : (
                          <span className="text-amber-400 font-semibold">Verification Pending</span>
                        )}
                      </td>
                      <td className="p-4">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="p-4 text-right">
                        {!app.incomeVerification?.verified ? (
                          <button
                            onClick={() => handleTriggerIncomeVerification(app.applicationId)}
                            disabled={verifyingAppId === app.applicationId}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-lg transition-all shadow disabled:opacity-50 inline-flex items-center"
                          >
                            {verifyingAppId === app.applicationId && <RefreshCw className="w-3 h-3 mr-1 animate-spin" />}
                            Fetch & Verify Income
                          </button>
                        ) : (
                          <Link
                            to="/interoperability-monitor"
                            className="text-xs text-blue-400 hover:underline font-semibold"
                          >
                            View Interoperability Log
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
