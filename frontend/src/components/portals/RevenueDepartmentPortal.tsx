import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { CodeViewer } from '../common/CodeViewer';
import { MetricCard } from '../common/MetricCard';
import { Building2, Search, Edit3, Save, CheckCircle, Database, Server, RefreshCw, FileCode } from 'lucide-react';

export const RevenueDepartmentPortal: React.FC = () => {
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
      alert(err.response?.data || 'Failed to fetch XML');
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
      alert(`Income updated to ₹${editingIncome.toLocaleString('en-IN')} for ${selectedRecord.revenueId}!`);
      await fetchRecords();
      await fetchXml(selectedRecord.revenueId);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update record');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Portal Header */}
      <div className="p-6 rounded-2xl gov-gradient-header border border-amber-900/60 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Building2 className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-extrabold text-white">Revenue Department Portal (Legacy System)</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Official Land & Tax Revenue Directorate • Independent Legacy XML Database
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs bg-amber-950 text-amber-300 px-3 py-1 rounded-lg border border-amber-800 font-mono font-bold">
            XML Gateway Active ⚡
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Revenue ID Format"
          value="REV-XXXX"
          subtitle="Independent Revenue Namespace"
          icon={Database}
          variant="amber"
        />
        <MetricCard
          title="Response Protocol"
          value="XML 1.0 API"
          subtitle="Legacy Data Exchange"
          icon={FileCode}
          variant="blue"
        />
        <MetricCard
          title="Service Health"
          value="ONLINE 200 OK"
          subtitle="Revenue Dispatch Engine"
          icon={Server}
          variant="emerald"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Records Table */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold text-white">Revenue Citizen Files</h3>
            <button onClick={fetchRecords} className="p-1 rounded text-slate-400 hover:text-white">
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
                    ? 'bg-amber-950/60 border-amber-500 shadow-md'
                    : 'glass-card border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-xs text-amber-400">{rec.revenueId}</span>
                  <span className="text-xs font-extrabold text-white">₹{rec.income?.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
                  <span>Financial Year: {rec.year}</span>
                  <span className="text-emerald-400 font-semibold">Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Income Editor & XML Output Viewer */}
        <div className="lg:col-span-2 space-y-6">
          {/* Income Editor */}
          {selectedRecord && (
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center space-x-2 text-amber-400">
                <Edit3 className="w-5 h-5" />
                <h3 className="text-sm font-extrabold text-white">
                  Real-Time Income Editor: <span className="font-mono text-amber-400">{selectedRecord.revenueId}</span>
                </h3>
              </div>

              <form onSubmit={handleUpdateIncome} className="flex flex-col sm:flex-row items-end gap-3">
                <div className="flex-1 text-xs">
                  <label className="block text-slate-300 font-bold mb-1">
                    Annual Income (₹ Rupees)
                  </label>
                  <input
                    type="number"
                    value={editingIncome}
                    onChange={(e) => setEditingIncome(Number(e.target.value))}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-mono font-bold text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg transition-all flex items-center space-x-1 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Updating DB...' : 'Save & Re-evaluate Middleware Live'}</span>
                </button>
              </form>
              <p className="text-[11px] text-slate-400">
                💡 <strong>Try this hackathon test:</strong> Change income to ₹4,50,000 and run verification in Welfare Portal. The deterministic rules engine will instantly mark the application as <strong>NOT ELIGIBLE</strong>!
              </p>
            </div>
          )}

          {/* Raw Legacy XML Output */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-extrabold text-white">Legacy XML Output (Dispatched to Middleware)</h3>
            {xmlPayload ? (
              <CodeViewer code={xmlPayload} language="xml" title={`GET /api/revenue/citizen/${selectedRecord?.revenueId}/income Response`} />
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs font-mono">Loading XML output...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
