import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Consent } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { ShieldCheck, ShieldAlert, Key, RefreshCw, Lock, Trash2, Plus } from 'lucide-react';

export const ConsentManager: React.FC = () => {
  const { user } = useAuth();
  const [consents, setConsents] = useState<Consent[]>([]);
  const [loading, setLoading] = useState(true);
  const [purpose, setPurpose] = useState('Income verification for Social Welfare Schemes');
  const [expiresInDays, setExpiresInDays] = useState(30);

  const citizenId = user?.citizenId || 'CIT-1001';

  const fetchConsents = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/citizen/consents?citizenId=${citizenId}`);
      setConsents(res.data.consents || []);
    } catch (err) {
      console.error('Failed to fetch consents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsents();
  }, [citizenId]);

  const handleGrantConsent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/citizen/consent', {
        citizenId,
        purpose,
        expiresInDays,
        requestedData: 'INCOME_CERTIFICATE'
      });
      fetchConsents();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to grant consent.');
    }
  };

  const handleRevokeConsent = async (consentId: string) => {
    if (!confirm('Are you sure you want to revoke consent? Revenue Department income data access will be instantly blocked.')) return;
    try {
      await api.delete(`/citizen/consent/${consentId}`);
      fetchConsents();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to revoke consent.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl gov-gradient-header border border-blue-900/60 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-extrabold text-white">Citizen Digital Consent Management</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Control cross-departmental data access. Social Welfare cannot access Revenue Department income data without your active consent.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grant New Consent Card */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-blue-400">
            <Plus className="w-5 h-5" />
            <h3 className="text-sm font-extrabold text-white">Grant New Digital Consent</h3>
          </div>

          <form onSubmit={handleGrantConsent} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Citizen Welfare ID</label>
              <input
                type="text"
                value={citizenId}
                disabled
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Requested Data Scope</label>
              <input
                type="text"
                value="INCOME_CERTIFICATE (Revenue Department XML)"
                disabled
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-400 font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Purpose of Access</label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Consent Validity Duration</label>
              <select
                value={expiresInDays}
                onChange={(e) => setExpiresInDays(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none font-semibold"
              >
                <option value={7}>7 Days</option>
                <option value={30}>30 Days (Recommended)</option>
                <option value={90}>90 Days</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all pulse-glow"
            >
              Grant Digital Consent
            </button>
          </form>
        </div>

        {/* Consents History Table */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-extrabold text-white">Active & Past Consent Records</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Scope</th>
                  <th className="p-3">Purpose</th>
                  <th className="p-3">Granted Date</th>
                  <th className="p-3">Expires Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {consents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-500">
                      No consent records found.
                    </td>
                  </tr>
                ) : (
                  consents.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3 font-mono text-blue-400 font-bold">{c.requestedData}</td>
                      <td className="p-3 text-slate-200">{c.purpose}</td>
                      <td className="p-3 font-mono text-slate-400">{new Date(c.grantedAt).toLocaleDateString()}</td>
                      <td className="p-3 font-mono text-slate-400">{new Date(c.expiresAt).toLocaleDateString()}</td>
                      <td className="p-3"><StatusBadge status={c.status} size="sm" /></td>
                      <td className="p-3 text-right">
                        {c.status === 'ACTIVE' && (
                          <button
                            onClick={() => handleRevokeConsent(c._id)}
                            className="px-2.5 py-1 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800/60 rounded text-[11px] font-bold flex items-center inline-flex"
                          >
                            <Trash2 className="w-3 h-3 mr-1" /> Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
