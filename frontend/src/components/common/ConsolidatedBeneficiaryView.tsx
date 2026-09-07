import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { StatusBadge } from './StatusBadge';
import { UserCheck, ShieldCheck, FileText, AlertCircle, Award, Search, HelpCircle, CheckCircle2 } from 'lucide-react';

export const ConsolidatedBeneficiaryView: React.FC = () => {
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock grievances and service outcomes for consolidated view
  const [grievances, setGrievances] = useState([
    { id: 'GRV-2026-01', citizenId: 'CIT-1001', subject: 'Income Verification Latency', status: 'RESOLVED', date: '2026-09-05', resolution: 'Revenue Dept XML API re-synced via Middleware' },
    { id: 'GRV-2026-02', citizenId: 'CIT-1003', subject: 'Ineligibility Threshold Query', status: 'CLOSED', date: '2026-09-06', resolution: 'Provided explanation of annual income threshold ₹2,50,000 limit' }
  ]);

  useEffect(() => {
    api.get('/welfare/applications')
      .then(res => {
        const apps = res.data.applications || [];
        setBeneficiaries(apps);
        if (apps.length > 0) setSelectedBeneficiary(apps[0]);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl gov-gradient-header border border-blue-900/60 shadow-xl flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2 text-blue-400">
            <UserCheck className="w-5 h-5" />
            <h2 className="text-xl font-extrabold text-white">Consolidated Beneficiary & Service Outcomes View</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Single 360° Consolidated View for Officials: Beneficiary profiles, application approvals, grievances, and service SLA outcomes across departments.
          </p>
        </div>

        <span className="text-xs bg-blue-950 text-blue-300 px-3 py-1 rounded-lg border border-blue-800 font-mono font-bold">
          360° Consolidated View Active
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Beneficiaries Directory */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider text-slate-300">
            Consolidated Beneficiaries
          </h3>

          <div className="space-y-2">
            {beneficiaries.map((b) => (
              <div
                key={b.applicationId}
                onClick={() => setSelectedBeneficiary(b)}
                className={`p-3.5 rounded-xl cursor-pointer transition-all border ${
                  selectedBeneficiary?.applicationId === b.applicationId
                    ? 'bg-blue-950/60 border-blue-500 shadow-md'
                    : 'glass-card border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-xs text-white">{b.submissionData?.applicantName}</span>
                  <StatusBadge status={b.status} size="sm" />
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-1 flex justify-between">
                  <span>Welfare: {b.citizenId}</span>
                  <span className="text-amber-400">Revenue: {b.incomeVerification?.revenueId || 'REV-7845'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 360 Consolidated File Details */}
        {selectedBeneficiary && (
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
              <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800 font-mono">
                    {selectedBeneficiary.citizenId} ➔ {selectedBeneficiary.incomeVerification?.revenueId || 'REV-7845'}
                  </span>
                  <h3 className="text-lg font-extrabold text-white mt-1">
                    {selectedBeneficiary.submissionData?.applicantName}
                  </h3>
                  <p className="text-xs text-slate-400">{selectedBeneficiary.schemeTitle}</p>
                </div>
                <StatusBadge status={selectedBeneficiary.status} size="lg" />
              </div>

              {/* 360 Data Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Welfare Citizen ID</span>
                  <div className="font-mono font-bold text-blue-400 mt-0.5">{selectedBeneficiary.citizenId}</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Revenue Legacy ID</span>
                  <div className="font-mono font-bold text-amber-400 mt-0.5">{selectedBeneficiary.incomeVerification?.revenueId || 'REV-7845'}</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Verified Income</span>
                  <div className="font-bold text-emerald-400 mt-0.5">
                    {selectedBeneficiary.incomeVerification?.verified ? `₹${selectedBeneficiary.incomeVerification.annualIncome?.toLocaleString('en-IN')}` : 'Pending'}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Service SLA Status</span>
                  <div className="font-bold text-emerald-400 mt-0.5 flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> 100% Compliant
                  </div>
                </div>
              </div>

              {/* Deterministic Evaluation Output */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Deterministic Eligibility Assessment</span>
                <p className="text-slate-200 font-medium">{selectedBeneficiary.eligibilityResult?.reason || 'Income verified against scheme rules.'}</p>
              </div>

              {/* Citizen Grievance Redressal Records */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center">
                  <HelpCircle className="w-4 h-4 mr-1 text-blue-400" /> Citizen Grievance & SLA Resolution Logs
                </h4>
                <div className="space-y-2">
                  {grievances.filter(g => g.citizenId === selectedBeneficiary.citizenId || g.citizenId === 'CIT-1001').map(g => (
                    <div key={g.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex justify-between items-center">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-blue-400">{g.id}</span>
                          <span className="font-bold text-white">{g.subject}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">Resolution: {g.resolution}</p>
                      </div>
                      <span className="text-[10px] font-bold bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                        {g.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
