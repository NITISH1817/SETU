import React from 'react';
import { Database, Link2, Server, Cpu, CheckCircle2, ShieldCheck, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const MasterDataRegistry: React.FC = () => {
  const { t } = useTranslation();
  const mdmMappings = [
    { welfareId: 'CIT-1001', revenueId: 'REV-7845', citizenName: 'Ramesh Kumar', status: 'ACTIVE', mappedAt: '2026-09-01' },
    { welfareId: 'CIT-1002', revenueId: 'REV-9214', citizenName: 'Anita Sharma', status: 'ACTIVE', mappedAt: '2026-09-02' },
    { welfareId: 'CIT-1003', revenueId: 'REV-3312', citizenName: 'Suresh Patel', status: 'ACTIVE', mappedAt: '2026-09-03' }
  ];

  const reusableConnectors = [
    { name: t('mdm.conn1Name', 'Revenue Dept Legacy XML Connector'), protocol: 'HTTP REST / XML', type: t('mdm.connLegacy', 'Legacy System Interface'), status: 'ONLINE', latency: '120ms' },
    { name: t('mdm.conn2Name', 'Social Welfare Application REST Gateway'), protocol: 'HTTP REST / JSON', type: t('mdm.connModern', 'Modern API Interface'), status: 'ONLINE', latency: '45ms' },
    { name: t('mdm.conn3Name', 'PFMS Treasury Direct Benefit Payout Connector'), protocol: 'SOAP / ISO 20022', type: t('mdm.connTreasury', 'Banking & Treasury Adapter'), status: 'ONLINE', latency: '210ms' },
    { name: t('mdm.conn4Name', 'e-Pramaan Single Sign-On Adapter'), protocol: 'OAuth 2.0 / JWT', type: t('mdm.connFederated', 'Federated Identity Provider'), status: 'ONLINE', latency: '30ms' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 gc-accent-card flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2" style={{ color: 'var(--text)' }}>
            <Database className="w-5 h-5" />
            <h2 className="text-xl font-extrabold">{t('mdm.title', 'Master Data Registry & Reusable Connector Catalog')}</h2>
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {t('mdm.subtitle', 'Master Data Management (MDM) identity mappings and reusable system connectors connecting legacy XML databases to modern REST APIs.')}
          </p>
        </div>

        <span className="gc-badge gc-badge-info font-mono font-bold">
          {t('mdm.syncStatus', 'MDM Index Synced')} ⚡
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MDM ID Mappings Table */}
        <div className="gc-glass p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold flex items-center" style={{ color: 'var(--text)' }}>
              <Link2 className="w-4 h-4 mr-1.5" style={{ color: 'var(--text)' }} /> {t('mdm.indexTitle', 'Master Data Management (MDM) Identity Index')}
            </h3>
            <span className="text-[10px] font-mono" style={{ color: 'var(--text-dim)' }}>3 {t('mdm.mappings', 'Mappings')}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="gc-table font-mono">
              <thead>
                <tr>
                  <th>{t('table.welfareId', 'Welfare ID')}</th>
                  <th>{t('table.revenueId', 'Revenue ID')}</th>
                  <th>{t('table.citizenName', 'Citizen Name')}</th>
                  <th>{t('table.status', 'Status')}</th>
                </tr>
              </thead>
              <tbody>
                {mdmMappings.map((m) => (
                  <tr key={m.welfareId}>
                    <td className="font-bold" style={{ color: 'var(--text)' }}>{m.welfareId}</td>
                    <td className="font-bold" style={{ color: 'var(--text)' }}>{m.revenueId}</td>
                    <td className="font-sans" style={{ color: 'var(--text)' }}>{m.citizenName}</td>
                    <td>
                      <span className="gc-badge gc-badge-success text-[10px]">
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reusable Connectors Catalog */}
        <div className="gc-glass p-5 space-y-4">
          <h3 className="text-sm font-extrabold flex items-center" style={{ color: 'var(--text)' }}>
            <Server className="w-4 h-4 mr-1.5" style={{ color: 'var(--text)' }} /> {t('mdm.connectorsCatalog', 'Reusable Connectors Catalog')}
          </h3>

          <div className="space-y-3">
            {reusableConnectors.map((conn, idx) => (
              <div key={idx} className="p-3.5 rounded-xl gc-surface text-xs flex justify-between items-center">
                <div>
                  <h4 className="font-bold" style={{ color: 'var(--text)' }}>{conn.name}</h4>
                  <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {t('mdm.protocol', 'Protocol')}: <span className="font-mono" style={{ color: 'var(--text)' }}>{conn.protocol}</span> • {t('mdm.type', 'Type')}: {conn.type}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold gc-badge gc-badge-success block">
                    {conn.status}
                  </span>
                  <span className="text-[10px] font-mono mt-1 block" style={{ color: 'var(--text-dim)' }}>{t('mdm.latency', 'Latency')}: {conn.latency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
