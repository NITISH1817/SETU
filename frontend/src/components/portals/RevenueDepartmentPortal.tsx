import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { CodeViewer } from '../common/CodeViewer';
import { MetricCard } from '../common/MetricCard';
import { Building2, Search, Edit3, Save, CheckCircle, Database, Server, RefreshCw, FileCode } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const RevenueDepartmentPortal: React.FC = () => {
  const { t } = useTranslation();
  const [records, setRecords] = useState<any[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [editingIncome, setEditingIncome] = useState<number>(75000);
  const [xmlPayload, setXmlPayload] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await api.get('/revenue/records');
      const recs = res.data.records || [];
      setRecords(recs);
      if (recs.length > 0 && !selectedRecord) {
        setSelectedRecord(recs[0]);
        setEditingIncome(recs[0].income);
        fetchXml(recs[0].revenueId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchXml = async (revId: string) => {
    try {
      const res = await api.get(`/revenue/citizen/${revId}/income`, {
        headers: { Accept: 'application/xml' }
      });
      setXmlPayload(typeof res.data === 'string' ? res.data : JSON.stringify(res.data));
    } catch (err: any) {
      alert(err.response?.data || t('revenue.fetchXmlFail', 'Failed to fetch XML'));
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSelectRecord = (rec: any) => {
    setSelectedRecord(rec);
    setEditingIncome(rec.income);
    fetchXml(rec.revenueId);
  };

  const handleUpdateIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;
    setSaving(true);
    try {
      await api.put(`/revenue/citizen/${selectedRecord.revenueId}/income`, {
        annualIncome: editingIncome
      });
      alert(t('revenue.updateSuccess', { income: editingIncome.toLocaleString('en-IN'), revId: selectedRecord.revenueId }, `Income updated to ₹${editingIncome.toLocaleString('en-IN')} for ${selectedRecord.revenueId}!`));
      await fetchRecords();
      await fetchXml(selectedRecord.revenueId);
    } catch (err: any) {
      alert(err.response?.data?.message || t('revenue.updateFail', 'Failed to update record'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Portal Header */}
      <div className="p-6 gc-accent-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2" style={{ color: 'var(--text)' }}>
            <Building2 className="w-6 h-6" />
            <h2 className="text-xl font-extrabold">{t('revenue.title', 'Revenue Department Portal (Legacy System)')}</h2>
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {t('revenue.subtitle', 'Official Land & Tax Revenue Directorate • Independent Legacy XML Database')}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="gc-badge gc-badge-warning font-mono font-bold">
            {t('revenue.gatewayActive', 'XML Gateway Active')} ⚡
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title={t('revenue.idFormat', 'Revenue ID Format')}
          value="REV-XXXX"
          subtitle={t('revenue.idSubtitle', 'Independent Revenue Namespace')}
          icon={Database}
        />
        <MetricCard
          title={t('revenue.protocol', 'Response Protocol')}
          value="XML 1.0 API"
          subtitle={t('revenue.protocolSubtitle', 'Legacy Data Exchange')}
          icon={FileCode}
        />
        <MetricCard
          title={t('revenue.health', 'Service Health')}
          value="ONLINE 200 OK"
          subtitle={t('revenue.healthSubtitle', 'Revenue Dispatch Engine')}
          icon={Server}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Records Table */}
        <div className="gc-glass p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold" style={{ color: 'var(--text)' }}>{t('revenue.recordsTitle', 'Revenue Citizen Files')}</h3>
            <button onClick={fetchRecords} className="p-1 rounded transition-colors hover:bg-slate-800" style={{ color: 'var(--text-muted)' }}>
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            {records.map((rec) => (
              <div
                key={rec.revenueId}
                onClick={() => handleSelectRecord(rec)}
                className={`p-3.5 rounded-xl cursor-pointer transition-all border ${
                  selectedRecord?.revenueId === rec.revenueId
                    ? 'gc-surface-2 shadow-md'
                    : 'gc-surface border-transparent hover:border-[var(--border-2)]'
                }`}
                style={{ borderColor: selectedRecord?.revenueId === rec.revenueId ? 'var(--text)' : undefined }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-xs" style={{ color: 'var(--text)' }}>{rec.revenueId}</span>
                  <span className="text-xs font-extrabold" style={{ color: 'var(--text)' }}>₹{rec.income?.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-[11px] mt-1 flex justify-between" style={{ color: 'var(--text-muted)' }}>
                  <span>{t('revenue.financialYear', 'Financial Year')}: {rec.year}</span>
                  <span className="font-semibold" style={{ color: 'var(--success)' }}>{t('revenue.verified', 'Verified')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Income Editor & XML Output Viewer */}
        <div className="lg:col-span-2 space-y-6">
          {/* Income Editor */}
          {selectedRecord && (
            <div className="gc-glass p-5 space-y-4">
              <div className="flex items-center space-x-2" style={{ color: 'var(--text)' }}>
                <Edit3 className="w-5 h-5" />
                <h3 className="text-sm font-extrabold">
                  {t('revenue.editorTitle', 'Real-Time Income Editor')}: <span className="font-mono">{selectedRecord.revenueId}</span>
                </h3>
              </div>

              <form onSubmit={handleUpdateIncome} className="flex flex-col sm:flex-row items-end gap-3">
                <div className="flex-1 text-xs">
                  <label className="gc-label">
                    {t('revenue.annualIncomeLabel', 'Annual Income (₹ Rupees)')}
                  </label>
                  <input
                    type="number"
                    value={editingIncome}
                    onChange={(e) => setEditingIncome(Number(e.target.value))}
                    required
                    className="gc-input font-mono font-bold text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="gc-btn-primary disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? t('revenue.updating', 'Updating DB...') : t('revenue.saveButton', 'Save & Re-evaluate Middleware Live')}</span>
                </button>
              </form>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                💡 <strong>{t('revenue.hackathonTip', 'Try this hackathon test')}:</strong> {t('revenue.hackathonDesc', 'Change income to ₹4,50,000 and run verification in Welfare Portal. The deterministic rules engine will instantly mark the application as')} <strong>{t('revenue.notEligible', 'NOT ELIGIBLE')}</strong>!
              </p>
            </div>
          )}

          {/* Raw Legacy XML Output */}
          <div className="gc-glass p-5 space-y-3">
            <h3 className="text-sm font-extrabold" style={{ color: 'var(--text)' }}>{t('revenue.xmlTitle', 'Legacy XML Output (Dispatched to Middleware)')}</h3>
            {xmlPayload ? (
              <CodeViewer code={xmlPayload} language="xml" title={`GET /api/revenue/citizen/${selectedRecord?.revenueId}/income Response`} />
            ) : (
              <div className="p-8 text-center text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{t('revenue.loadingXml', 'Loading XML output...')}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
