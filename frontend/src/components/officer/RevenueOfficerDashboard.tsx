import React, { useState } from 'react';
import api from '../../services/api';
import { CodeViewer } from '../common/CodeViewer';
import { MetricCard } from '../common/MetricCard';
import { Building2, Search, FileCode, CheckCircle, Database, Server } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const RevenueOfficerDashboard: React.FC = () => {
  const { t } = useTranslation();
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
      alert(err.response?.data || t('officer.fetchXmlFail', 'Failed to fetch Revenue XML.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 gc-accent-card">
        <div className="flex items-center space-x-2 mb-1" style={{ color: 'var(--text)' }}>
          <Building2 className="w-5 h-5" />
          <h2 className="text-xl font-extrabold">{t('officer.revSimTitle', 'Revenue Department Legacy System Simulator')}</h2>
        </div>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {t('officer.revSimDesc', 'Independent Revenue Database Service. Returns citizen annual income records strictly in legacy XML format using Revenue Department IDs (e.g. REV-7845).')}
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title={t('revenue.idFormat', 'Revenue ID Format')}
          value="REV-XXXX"
          subtitle={t('revenue.idSubtitle', 'Independent ID namespace')}
          icon={Database}
        />
        <MetricCard
          title={t('officer.dataProtocol', 'Data Protocol')}
          value="REST / XML"
          subtitle={t('officer.legacyXmlPayload', 'Legacy XML Payload Interface')}
          icon={FileCode}
        />
        <MetricCard
          title={t('revenue.health', 'Service Health')}
          value="ONLINE 200 OK"
          subtitle={t('officer.revApiActive', 'Revenue API Gateway Active')}
          icon={Server}
        />
      </div>

      {/* Search & Inspect Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="gc-glass p-5 space-y-4">
          <h3 className="text-sm font-extrabold" style={{ color: 'var(--text)' }}>{t('officer.testEndpoint', 'Test Revenue XML Endpoint')}</h3>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {t('officer.selectRevId', 'Select or enter a Revenue Citizen ID to execute GET')} <span className="font-mono font-bold" style={{ color: 'var(--text)' }}>/api/revenue/citizen/:id/income</span>
          </p>

          <div className="space-y-3">
            <div>
              <label className="gc-label">{t('table.revenueId', 'Revenue Citizen ID')}</label>
              <select
                value={revenueId}
                onChange={(e) => setRevenueId(e.target.value)}
                className="gc-input font-mono text-xs"
              >
                <option value="REV-7845">REV-7845 ({t('officer.income', 'Income')}: ₹75,000 - {t('officer.eligible', 'Eligible')})</option>
                <option value="REV-9214">REV-9214 ({t('officer.income', 'Income')}: ₹2,10,000 - {t('officer.seniorPension', 'Senior Pension Eligible')})</option>
                <option value="REV-3312">REV-3312 ({t('officer.income', 'Income')}: ₹4,50,000 - {t('officer.highIncome', 'High Income')})</option>
              </select>
            </div>

            <button
              onClick={fetchRevenueXml}
              disabled={loading}
              className="gc-btn-primary w-full disabled:opacity-50"
            >
              {loading ? t('officer.fetchingXml', 'Fetching XML...') : t('officer.execXmlReq', 'Execute GET Legacy XML Request')}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 gc-glass p-5 space-y-4">
          <h3 className="text-sm font-extrabold" style={{ color: 'var(--text)' }}>{t('officer.revXmlPayload', 'Revenue Department XML Output Payload')}</h3>

          {xmlOutput ? (
            <CodeViewer code={xmlOutput} language="xml" title={`GET /api/revenue/citizen/${revenueId}/income Output`} />
          ) : (
            <div className="p-8 text-center text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              {t('officer.clickExec', 'Click "Execute GET Legacy XML Request" to view raw Revenue XML response.')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
