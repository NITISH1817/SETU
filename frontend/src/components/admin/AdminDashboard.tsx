import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { AuditLogItem } from '../../types';
import { MetricCard } from '../common/MetricCard';
import { StatusBadge } from '../common/StatusBadge';
import { EmptyState } from '../common/EmptyState';
import { PageSkeleton } from '../common/LoadingSkeleton';
import {
  Settings, Activity, CheckCircle2, Server,
  FileText, Clock, Search, Shield, Plus, AlertTriangle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// ── All API calls, state management, and business logic are PRESERVED ────────

export const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'metrics' | 'audits' | 'rules'>('metrics');
  const [searchAction, setSearchAction] = useState('');
  const [searchStatus, setSearchStatus] = useState('');

  // New Rule form state — PRESERVED
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

  useEffect(() => { fetchData(); }, []);

  // PRESERVED — form submit
  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/rules', newRule);
      alert(t('admin.ruleCreated', 'Eligibility rule created successfully!'));
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || t('admin.ruleCreateFailed', 'Failed to create rule'));
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchAction = !searchAction || log.action.toLowerCase().includes(searchAction.toLowerCase());
    const matchStatus = !searchStatus || log.status === searchStatus;
    return matchAction && matchStatus;
  });

  if (loading) return <PageSkeleton />;

  const tabs: { id: typeof activeTab; label: string }[] = [
    { id: 'metrics', label: t('admin.tabMetrics', 'System Metrics') },
    { id: 'audits',  label: t('admin.tabAudits', 'Audit Logs') },
    { id: 'rules',   label: t('admin.tabRules', 'Rules Engine') },
  ];

  const serviceHealth = [
    { label: t('admin.healthRev', 'Revenue Dept Legacy XML'), status: 'ONLINE (200 OK)' },
    { label: t('admin.healthWelfare', 'Social Welfare API Gateway'), status: 'ONLINE (200 OK)' },
    { label: t('admin.healthMiddleware', 'Middleware Consent Engine'), status: 'ENFORCING JWT/RBAC' },
  ];

  const auditTableCols = [t('table.action','Action'), t('table.actor','Actor'), t('table.citizenId','Citizen ID'), t('table.revenueId','Revenue ID'), t('table.status','Status'), t('table.timestamp','Timestamp')];

  return (
    <div className="space-y-6 max-w-screen-xl mx-auto">

      {/* ── Page Header ── */}
      <div className="gc-glass rounded-2xl overflow-hidden">
        <div className="h-1 w-full" style={{ background: 'var(--gradient-primary)' }} />
        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center gc-surface-2" style={{ borderColor: 'var(--border-2)' }}>
              <Settings className="w-5 h-5" style={{ color: 'var(--text)' }} />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
                {t('admin.title', 'System Admin & Interoperability Monitoring')}
              </h2>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {t('admin.subtitle', 'API gateway, audit trails, and eligibility rule configurations.')}
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center p-1 rounded-xl border gap-0.5"
            style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? 'shadow-sm'
                    : 'hover:bg-[var(--surface-3)]'
                }`}
                style={activeTab === tab.id ? { background: 'var(--gradient-primary)', color: 'var(--surface)' } : { color: 'var(--text-muted)' }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title={t('admin.metricApps', 'Total Applications')} value={metrics?.totalApplications || 0}
          subtitle={t('admin.subApps', 'Processed by Middleware')} icon={FileText} />
        <MetricCard title={t('admin.metricVerified', 'Verified')} value={metrics?.verifiedApplications || 0}
          subtitle={t('admin.subVerified', 'Revenue XML parsed')} icon={CheckCircle2} />
        <MetricCard title={t('admin.metricEligible', 'Eligible')} value={metrics?.eligibleApplications || 0}
          subtitle={t('admin.subEligible', 'Rules engine passed')} icon={Activity} />
        <MetricCard title={t('admin.metricTime', 'Avg Latency')}
          value={`${metrics?.avgProcessingTimeSeconds || '1.4'}s`}
          subtitle={t('admin.subTime', 'End-to-end pipeline')} icon={Clock} />
      </div>

      {/* ── Service Health Bar ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {serviceHealth.map(({ label, status }) => (
          <div key={label} className="p-3.5 rounded-xl border gc-surface flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4" style={{ color: 'var(--text)' }} />
              <span className="text-xs font-medium" style={{ color: 'var(--text)' }}>{label}</span>
            </div>
            <span className="text-[10px] font-bold font-mono" style={{ color: 'var(--success)' }}>{status}</span>
          </div>
        ))}
      </div>

      {/* ── Tab: Metrics ── */}
      {activeTab === 'metrics' && (
        <div className="gc-surface rounded-2xl overflow-hidden">
          <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{t('admin.recentEvents', 'Recent System Audit Events')}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="gc-table">
              <thead>
                <tr>
                  {auditTableCols.map(col => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {auditLogs.slice(0, 8).map(log => (
                  <tr key={log._id}>
                    <td className="font-mono font-semibold" style={{ color: 'var(--text)' }}>{log.action}</td>
                    <td style={{ color: 'var(--text)' }}>{log.userEmail || 'System Middleware'}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{log.citizenId || '—'}</td>
                    <td className="font-mono" style={{ color: 'var(--text)' }}>{log.revenueId || '—'}</td>
                    <td><StatusBadge status={log.status} size="sm" /></td>
                    <td className="font-mono text-[10px]" style={{ color: 'var(--text-dim)' }}>{new Date(log.timestamp).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {auditLogs.length === 0 && (
              <EmptyState icon={Activity} title={t('admin.noEvents', 'No audit events')} description={t('admin.noEventsDesc', 'No system activity recorded yet.')} />
            )}
          </div>
        </div>
      )}

      {/* ── Tab: Audits ── */}
      {activeTab === 'audits' && (
        <div className="gc-surface rounded-2xl overflow-hidden">
          <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{t('admin.fullTrail', 'Full Audit Trail')}</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder={t('admin.searchAction', 'Search action...')}
                  value={searchAction}
                  onChange={e => setSearchAction(e.target.value)}
                  className="gc-input pl-8 py-1.5 text-xs w-44"
                />
              </div>
              <select
                value={searchStatus}
                onChange={e => setSearchStatus(e.target.value)}
                className="gc-input py-1.5 text-xs"
                style={{ width: 'auto' }}
              >
                <option value="">{t('admin.allStatuses', 'All Statuses')}</option>
                <option value="SUCCESS">SUCCESS</option>
                <option value="FAILED">FAILED</option>
                <option value="WARNING">WARNING</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="gc-table">
              <thead>
                <tr>
                  {auditTableCols.map(col => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(log => (
                  <tr key={log._id}>
                    <td className="font-mono font-semibold" style={{ color: 'var(--text)' }}>{log.action}</td>
                    <td style={{ color: 'var(--text)' }}>{log.userEmail || 'Middleware'}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{log.citizenId || '—'}</td>
                    <td className="font-mono" style={{ color: 'var(--text)' }}>{log.revenueId || '—'}</td>
                    <td><StatusBadge status={log.status} size="sm" /></td>
                    <td className="font-mono text-[10px]" style={{ color: 'var(--text-dim)' }}>{new Date(log.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredLogs.length === 0 && (
              <EmptyState icon={Search} title={t('admin.noMatch', 'No matching logs')} description={t('admin.adjustFilters', 'Adjust your search filters.')} />
            )}
          </div>
        </div>
      )}

      {/* ── Tab: Rules ── */}
      {activeTab === 'rules' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Create Rule Form — logic PRESERVED */}
          <div className="gc-surface rounded-2xl overflow-hidden">
            <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border)' }}>
              <Plus className="w-4 h-4" style={{ color: 'var(--text)' }} />
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{t('admin.createRule', 'Create Eligibility Rule')}</h3>
            </div>
            <form onSubmit={handleCreateRule} className="p-5 space-y-4">
              <div>
                <label className="gc-label">{t('admin.scheme', 'Scheme')}</label>
                <select value={newRule.schemeId}
                  onChange={e => setNewRule({ ...newRule, schemeId: e.target.value })}
                  className="gc-input text-sm">
                  <option value="SCH-SCHOLARSHIP-01">Post-Matric Scholarship</option>
                  <option value="SCH-PENSION-01">Indira Gandhi Old Age Pension</option>
                </select>
              </div>
              <div>
                <label className="gc-label">{t('admin.ruleName', 'Rule Name')}</label>
                <input type="text" value={newRule.ruleName}
                  onChange={e => setNewRule({ ...newRule, ruleName: e.target.value })}
                  className="gc-input text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="gc-label">{t('admin.field', 'Field')}</label>
                  <select value={newRule.field}
                    onChange={e => setNewRule({ ...newRule, field: e.target.value })}
                    className="gc-input text-sm">
                    <option value="annualIncome">annualIncome</option>
                    <option value="age">age</option>
                  </select>
                </div>
                <div>
                  <label className="gc-label">{t('admin.operator', 'Operator')}</label>
                  <select value={newRule.operator}
                    onChange={e => setNewRule({ ...newRule, operator: e.target.value })}
                    className="gc-input text-sm">
                    <option value="<=">{'<='}</option>
                    <option value=">=">{'>='}</option>
                    <option value="==">{'=='}</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="gc-label">{t('admin.thresholdValue', 'Threshold Value')}</label>
                <input type="number" value={newRule.targetValue}
                  onChange={e => setNewRule({ ...newRule, targetValue: Number(e.target.value) })}
                  className="gc-input font-mono text-sm" />
              </div>
              <button type="submit" className="gc-btn-primary w-full justify-center text-sm">
                <Plus className="w-4 h-4" />
                {t('admin.addRuleBtn', 'Add Rule to Engine')}
              </button>
            </form>
          </div>

          {/* Active Rules — logic PRESERVED */}
          <div className="lg:col-span-2 gc-surface rounded-2xl overflow-hidden">
            <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{t('admin.activeRules', 'Active Rules Engine Configurations')}</h3>
            </div>
            <div className="p-5 space-y-3">
              {rules.length === 0 ? (
                <EmptyState icon={AlertTriangle} title={t('admin.noRules', 'No rules configured')} description={t('admin.noRulesDesc', 'Create a rule using the form on the left.')} />
              ) : (
                rules.map(rule => (
                  <div key={rule._id}
                    className="p-4 rounded-xl border flex items-center justify-between gap-4 gc-surface-2"
                    style={{ borderColor: 'var(--border)' }}>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-mono font-semibold" style={{ color: 'var(--text-muted)' }}>{rule.schemeId}</span>
                      <h4 className="text-sm font-semibold mt-0.5" style={{ color: 'var(--text)' }}>{rule.ruleName}</h4>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{rule.description}</p>
                    </div>
                    <div className="shrink-0 px-3 py-1.5 rounded-lg font-mono text-xs font-bold gc-badge gc-badge-info">
                      {rule.field} {rule.operator} {rule.targetValue?.toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
