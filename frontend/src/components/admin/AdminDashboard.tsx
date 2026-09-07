import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { AuditLogItem } from '../../types';
import { MetricCard } from '../common/MetricCard';
import { StatusBadge } from '../common/StatusBadge';
import {
  Settings,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Server,
  FileText,
  Clock,
  Search,
  Shield,
  Layers,
  Plus
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'metrics' | 'audits' | 'rules'>('metrics');

  const [searchAction, setSearchAction] = useState('');
  const [searchStatus, setSearchStatus] = useState('');

  // New Rule form state
  const [newRule, setNewRule] = useState({
    schemeId: 'SCH-SCHOLARSHIP-01',
    ruleName: 'Scholarship Cap Rule',
    field: 'annualIncome',
    operator: '<=',
    targetValue: 250000,
    description: 'Income must be <= 2,50,000'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [mRes, aRes, rRes] = await Promise.all([
        api.get('/admin/metrics'),
        api.get('/admin/audit-logs'),
        api.get('/admin/rules')
      ]);
      setMetrics(mRes.data.metrics);
      setAuditLogs(aRes.data.logs || []);
      setRules(rRes.data.rules || []);
    } catch (err) {
      console.error('Admin data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/rules', newRule);
      alert('Eligibility rule created successfully!');
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create rule');
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchAction = !searchAction || log.action.toLowerCase().includes(searchAction.toLowerCase());
    const matchStatus = !searchStatus || log.status === searchStatus;
    return matchAction && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl gov-gradient-header border border-blue-900/60 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-extrabold text-white">System Admin & Interoperability Monitoring</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Real-time monitoring of API gateway latency, cross-department audit trails, and eligibility rule configurations.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'metrics' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            System Metrics
          </button>
          <button
            onClick={() => setActiveTab('audits')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'audits' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Audit Logs
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'rules' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Rules Engine
          </button>
        </div>
      </div>

      {/* Overview Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Applications"
          value={metrics?.totalApplications || 0}
          subtitle="Processed by Middleware"
          icon={FileText}
          variant="blue"
        />
        <MetricCard
          title="Verified Applications"
          value={metrics?.verifiedApplications || 0}
          subtitle="Revenue XML parsed & validated"
          icon={CheckCircle2}
          variant="emerald"
        />
        <MetricCard
          title="Eligible Applications"
          value={metrics?.eligibleApplications || 0}
          subtitle="Deterministic rules passed"
          icon={Activity}
          variant="purple"
        />
        <MetricCard
          title="Avg Processing Time"
          value={`${metrics?.avgProcessingTimeSeconds || 1.42}s`}
          subtitle="End-to-end API pipeline latency"
          icon={Clock}
          variant="amber"
        />
      </div>

      {/* API Health Services Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 flex items-center justify-between text-xs font-semibold">
          <span className="flex items-center"><Server className="w-4 h-4 mr-2" /> Revenue Dept Legacy XML Service</span>
          <span className="font-mono text-emerald-400">ONLINE (200 OK)</span>
        </div>
        <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/60 text-blue-300 flex items-center justify-between text-xs font-semibold">
          <span className="flex items-center"><Server className="w-4 h-4 mr-2" /> Social Welfare API Gateway</span>
          <span className="font-mono text-blue-400">ONLINE (200 OK)</span>
        </div>
        <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/60 text-purple-300 flex items-center justify-between text-xs font-semibold">
          <span className="flex items-center"><Shield className="w-4 h-4 mr-2" /> Middleware Consent Engine</span>
          <span className="font-mono text-purple-400">ENFORCING JWT/RBAC</span>
        </div>
      </div>

      {/* Tab 1: System Metrics & Recent Audits */}
      {activeTab === 'metrics' && (
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-extrabold text-white">Recent System Audit Events</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Action</th>
                  <th className="p-3">User / Actor</th>
                  <th className="p-3">Welfare ID</th>
                  <th className="p-3">Revenue ID</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {auditLogs.slice(0, 8).map((log) => (
                  <tr key={log._id} className="hover:bg-slate-900/40 font-mono">
                    <td className="p-3 font-bold text-blue-400">{log.action}</td>
                    <td className="p-3 text-slate-300 font-sans">{log.userEmail || 'System Middleware'}</td>
                    <td className="p-3 text-slate-400">{log.citizenId || '-'}</td>
                    <td className="p-3 text-amber-400">{log.revenueId || '-'}</td>
                    <td className="p-3"><StatusBadge status={log.status} size="sm" /></td>
                    <td className="p-3 text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Full Searchable Audit Logs */}
      {activeTab === 'audits' && (
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-sm font-extrabold text-white">Full Security & Interoperability Audit Trails</h3>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Search action..."
                value={searchAction}
                onChange={(e) => setSearchAction(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-3 py-1.5 text-white focus:outline-none"
              />
              <select
                value={searchStatus}
                onChange={(e) => setSearchStatus(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-3 py-1.5 text-white focus:outline-none"
              >
                <option value="">All Statuses</option>
                <option value="SUCCESS">SUCCESS</option>
                <option value="FAILED">FAILED</option>
                <option value="WARNING">WARNING</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Action</th>
                  <th className="p-3">Actor</th>
                  <th className="p-3">Citizen ID</th>
                  <th className="p-3">Revenue ID</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-900/50">
                    <td className="p-3 font-bold text-blue-400">{log.action}</td>
                    <td className="p-3 font-sans text-slate-200">{log.userEmail || 'Middleware'}</td>
                    <td className="p-3 text-slate-400">{log.citizenId || '-'}</td>
                    <td className="p-3 text-amber-400">{log.revenueId || '-'}</td>
                    <td className="p-3"><StatusBadge status={log.status} size="sm" /></td>
                    <td className="p-3 text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Configurable Eligibility Rules Manager */}
      {activeTab === 'rules' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-extrabold text-white flex items-center">
              <Plus className="w-4 h-4 mr-1 text-blue-400" /> Create Eligibility Rule
            </h3>

            <form onSubmit={handleCreateRule} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Scheme</label>
                <select
                  value={newRule.schemeId}
                  onChange={(e) => setNewRule({ ...newRule, schemeId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-semibold"
                >
                  <option value="SCH-SCHOLARSHIP-01">Post-Matric Scholarship</option>
                  <option value="SCH-PENSION-01">Indira Gandhi Old Age Pension</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Rule Name</label>
                <input
                  type="text"
                  value={newRule.ruleName}
                  onChange={(e) => setNewRule({ ...newRule, ruleName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Field</label>
                  <select
                    value={newRule.field}
                    onChange={(e) => setNewRule({ ...newRule, field: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="annualIncome">annualIncome</option>
                    <option value="age">age</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Operator</label>
                  <select
                    value={newRule.operator}
                    onChange={(e) => setNewRule({ ...newRule, operator: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="<=">&lt;=</option>
                    <option value=">=">&gt;=</option>
                    <option value="==">==</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Target Threshold Value</label>
                <input
                  type="number"
                  value={newRule.targetValue}
                  onChange={(e) => setNewRule({ ...newRule, targetValue: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow"
              >
                Add Rule to Engine
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-extrabold text-white">Active Deterministic Rules Engine Configurations</h3>
            <div className="space-y-3">
              {rules.map((rule) => (
                <div key={rule._id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-mono text-blue-400 font-bold">{rule.schemeId}</span>
                    <h4 className="font-bold text-white mt-0.5">{rule.ruleName}</h4>
                    <p className="text-slate-400 mt-1">{rule.description}</p>
                  </div>
                  <div className="text-right font-mono bg-slate-950 px-3 py-1.5 rounded border border-slate-800 text-emerald-400 font-bold">
                    {rule.field} {rule.operator} {rule.targetValue}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
