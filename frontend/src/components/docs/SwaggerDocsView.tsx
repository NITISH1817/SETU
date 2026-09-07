import React from 'react';
import { FileText, ExternalLink, Code2 } from 'lucide-react';

export const SwaggerDocsView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl gov-gradient-header border border-blue-900/60 shadow-xl flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2 text-blue-400">
            <FileText className="w-5 h-5" />
            <h2 className="text-xl font-extrabold text-white">OpenAPI / Swagger API Documentation</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Complete OpenAPI 3.0 specification for GovConnect Interoperability REST API Gateway.
          </p>
        </div>

        <a
          href="http://localhost:5000/api-docs"
          target="_blank"
          rel="noreferrer"
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors"
        >
          <span>Open Live Swagger UI</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-extrabold text-white">Core Interoperability API Endpoints Summary</h3>

        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 font-mono font-bold rounded border border-emerald-800">POST</span>
              <span className="font-mono text-white font-bold">/api/income/verify</span>
              <span className="text-slate-400 text-[11px]">(Main Interoperability Workflow)</span>
            </div>
            <p className="text-slate-300">
              Triggers end-to-end middleware workflow: JWT check → Consent verification → Master ID Mapping (CIT-1001 → REV-7845) → Revenue Dept XML API fetch → XML-to-JSON parsing → Quality validation → Deterministic Eligibility engine evaluation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 bg-blue-950 text-blue-300 font-mono font-bold rounded border border-blue-800">GET</span>
              <span className="font-mono text-white font-bold">/api/revenue/citizen/:id/income</span>
              <span className="text-slate-400 text-[11px]">(Legacy System Simulator)</span>
            </div>
            <p className="text-slate-300">
              Revenue Department mock service returning annual income payloads formatted strictly in legacy XML (&lt;Citizen&gt;&lt;RevenueId&gt;...&lt;/RevenueId&gt;&lt;AnnualIncome&gt;...&lt;/AnnualIncome&gt;&lt;/Citizen&gt;).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 bg-purple-950 text-purple-300 font-mono font-bold rounded border border-purple-800">POST</span>
              <span className="font-mono text-white font-bold">/api/citizen/consent</span>
              <span className="text-slate-400 text-[11px]">(Digital Consent Enforcement)</span>
            </div>
            <p className="text-slate-300">
              Grants explicit digital consent for cross-departmental data sharing with requested data scope, purpose, and expiration timestamp.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 bg-amber-950 text-amber-300 font-mono font-bold rounded border border-amber-800">GET</span>
              <span className="font-mono text-white font-bold">/api/admin/audit-logs</span>
              <span className="text-slate-400 text-[11px]">(Security & Audit Trail)</span>
            </div>
            <p className="text-slate-300">
              Retrieves immutable audit logs for system operations, consent actions, identity resolutions, and XML transformation steps.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
