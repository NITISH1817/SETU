import React, { useState } from 'react';
import { InteroperabilityMonitor } from '../interoperability/InteroperabilityMonitor';
import { MetricCard } from '../common/MetricCard';
import { Layers, ShieldCheck, Cpu, ArrowRightLeft, Server, Activity } from 'lucide-react';

export const MiddlewareHub: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl gov-gradient-header border border-purple-900/60 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-extrabold text-white">GovConnect Interoperability Middleware Hub</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Central Government Data Exchange Node • Bridging Disparate Portals, XML Schemas & Identity Records
          </p>
        </div>

        <span className="text-xs bg-purple-950 text-purple-300 px-3 py-1 rounded-lg border border-purple-800 font-mono font-bold">
          Syntactic & Semantic Engine Active ⚡
        </span>
      </div>

      {/* Interoperability Gateway Architecture Visualizer */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-extrabold text-white uppercase tracking-wider text-slate-300">
          Cross-Departmental Data Exchange Network Topology
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/60 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-blue-400">
              <span>Social Welfare Dept Portal</span>
              <span className="text-[10px] bg-blue-900 px-2 py-0.5 rounded">JSON / REST</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Submits scheme requests using Welfare IDs (<span className="font-mono text-blue-400">CIT-1001</span>). Evaluates final scheme eligibility.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/60 space-y-2 shadow-lg pulse-glow">
            <div className="flex justify-between items-center text-xs font-bold text-purple-300">
              <span>GovConnect Middleware</span>
              <span className="text-[10px] bg-purple-900 px-2 py-0.5 rounded">Core Gateway</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Handles JWT Auth, Consent Enforcement, ID Resolution (<span className="font-mono text-purple-300">CIT ➔ REV</span>), XML parsing, and Data Quality assertion.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-amber-400">
              <span>Revenue Dept Legacy API</span>
              <span className="text-[10px] bg-amber-900 px-2 py-0.5 rounded">XML / REST</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Queries land & income records using Revenue IDs (<span className="font-mono text-amber-400">REV-7845</span>). Serializes output in XML.
            </p>
          </div>
        </div>
      </div>

      {/* Embedded Live Interoperability Monitor */}
      <InteroperabilityMonitor />
    </div>
  );
};
