import React from 'react';
import { Database, Link2, Server, Cpu, CheckCircle2, ShieldCheck, Layers } from 'lucide-react';

export const MasterDataRegistry: React.FC = () => {
  const mdmMappings = [
    { welfareId: 'CIT-1001', revenueId: 'REV-7845', citizenName: 'Ramesh Kumar', status: 'ACTIVE', mappedAt: '2026-09-01' },
    { welfareId: 'CIT-1002', revenueId: 'REV-9214', citizenName: 'Anita Sharma', status: 'ACTIVE', mappedAt: '2026-09-02' },
    { welfareId: 'CIT-1003', revenueId: 'REV-3312', citizenName: 'Suresh Patel', status: 'ACTIVE', mappedAt: '2026-09-03' }
  ];

  const reusableConnectors = [
    { name: 'Revenue Dept Legacy XML Connector', protocol: 'HTTP REST / XML', type: 'Legacy System Interface', status: 'ONLINE', latency: '120ms' },
    { name: 'Social Welfare Application REST Gateway', protocol: 'HTTP REST / JSON', type: 'Modern API Interface', status: 'ONLINE', latency: '45ms' },
    { name: 'PFMS Treasury Direct Benefit Payout Connector', protocol: 'SOAP / ISO 20022', type: 'Banking & Treasury Adapter', status: 'ONLINE', latency: '210ms' },
    { name: 'e-Pramaan Single Sign-On Adapter', protocol: 'OAuth 2.0 / JWT', type: 'Federated Identity Provider', status: 'ONLINE', latency: '30ms' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl gov-gradient-header border border-blue-900/60 shadow-xl flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2 text-purple-400">
            <Database className="w-5 h-5" />
            <h2 className="text-xl font-extrabold text-white">Master Data Registry & Reusable Connector Catalog</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Master Data Management (MDM) identity mappings and reusable system connectors connecting legacy XML databases to modern REST APIs.
          </p>
        </div>

        <span className="text-xs bg-purple-950 text-purple-300 px-3 py-1 rounded-lg border border-purple-800 font-mono font-bold">
          MDM Index Synced ⚡
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MDM ID Mappings Table */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold text-white flex items-center">
              <Link2 className="w-4 h-4 mr-1.5 text-blue-400" /> Master Data Management (MDM) Identity Index
            </h3>
            <span className="text-[10px] font-mono text-slate-400">3 Mappings</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Welfare ID</th>
                  <th className="p-3">Revenue ID</th>
                  <th className="p-3">Citizen Name</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {mdmMappings.map((m) => (
                  <tr key={m.welfareId} className="hover:bg-slate-900/40">
                    <td className="p-3 font-bold text-blue-400">{m.welfareId}</td>
                    <td className="p-3 font-bold text-amber-400">{m.revenueId}</td>
                    <td className="p-3 font-sans text-white">{m.citizenName}</td>
                    <td className="p-3">
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
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
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-extrabold text-white flex items-center">
            <Server className="w-4 h-4 mr-1.5 text-purple-400" /> Reusable Connectors Catalog
          </h3>

          <div className="space-y-3">
            {reusableConnectors.map((conn, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-white">{conn.name}</h4>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Protocol: <span className="font-mono text-purple-300">{conn.protocol}</span> • Type: {conn.type}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 block">
                    {conn.status}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 mt-1 block">Latency: {conn.latency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
