import React, { useState } from 'react';
import api from '../../services/api';
import { CodeViewer } from '../common/CodeViewer';
import { MetricCard } from '../common/MetricCard';
import { Building2, Search, FileCode, CheckCircle, Database, Server } from 'lucide-react';

export const RevenueOfficerDashboard: React.FC = () => {
  const [revenueId, setRevenueId] = useState('REV-7845');
  const [xmlOutput, setXmlOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchRevenueXml = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/revenue/citizen/${revenueId}/income`, {
        headers: { Accept: 'application/xml' }
      });
      setXmlOutput(typeof res.data === 'string' ? res.data : JSON.stringify(res.data));
    } catch (err: any) {
      alert(err.response?.data || 'Failed to fetch Revenue XML.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl gov-gradient-header border border-blue-900/60 shadow-xl">
        <div className="flex items-center space-x-2 text-amber-400 mb-1">
          <Building2 className="w-5 h-5" />
          <h2 className="text-xl font-extrabold text-white">Revenue Department Legacy System Simulator</h2>
        </div>
        <p className="text-xs text-slate-300">
          Independent Revenue Database Service. Returns citizen annual income records strictly in legacy XML format using Revenue Department IDs (e.g. REV-7845).
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Revenue ID Format"
          value="REV-XXXX"
          subtitle="Independent ID namespace"
          icon={Database}
          variant="amber"
        />
        <MetricCard
          title="Data Protocol"
          value="REST / XML"
          subtitle="Legacy XML Payload Interface"
          icon={FileCode}
          variant="blue"
        />
        <MetricCard
          title="Service Health"
          value="ONLINE 200 OK"
          subtitle="Revenue API Gateway Active"
          icon={Server}
          variant="emerald"
        />
      </div>

      {/* Search & Inspect Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-extrabold text-white">Test Revenue XML Endpoint</h3>
          <p className="text-xs text-slate-400">
            Select or enter a Revenue Citizen ID to execute GET <span className="font-mono text-amber-400">/api/revenue/citizen/:id/income</span>
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-slate-300 font-bold text-xs mb-1">Revenue Citizen ID</label>
              <select
                value={revenueId}
                onChange={(e) => setRevenueId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-mono text-xs focus:border-amber-500 focus:outline-none"
              >
                <option value="REV-7845">REV-7845 (Income: ₹75,000 - Eligible)</option>
                <option value="REV-9214">REV-9214 (Income: ₹2,10,000 - Senior Pension Eligible)</option>
                <option value="REV-3312">REV-3312 (Income: ₹4,50,000 - High Income)</option>
              </select>
            </div>

            <button
              onClick={fetchRevenueXml}
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg transition-all"
            >
              {loading ? 'Fetching XML...' : 'Execute GET Legacy XML Request'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-extrabold text-white">Revenue Department XML Output Payload</h3>

          {xmlOutput ? (
            <CodeViewer code={xmlOutput} language="xml" title={`GET /api/revenue/citizen/${revenueId}/income Output`} />
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs font-mono">
              Click "Execute GET Legacy XML Request" to view raw Revenue XML response.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
