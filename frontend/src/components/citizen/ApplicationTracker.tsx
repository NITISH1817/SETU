import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Application } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Clock, CheckCircle2, Building, ArrowRight, Activity, Calendar } from 'lucide-react';

export const ApplicationTracker: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  const citizenId = user?.citizenId || 'CIT-1001';

  useEffect(() => {
    api.get(`/applications?citizenId=${citizenId}`)
      .then(res => {
        const apps = res.data.applications || [];
        setApplications(apps);
        if (apps.length > 0) setSelectedApp(apps[0]);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [citizenId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl gov-gradient-header border border-blue-900/60 shadow-xl">
        <div className="flex items-center space-x-2 text-blue-400 mb-1">
          <Clock className="w-5 h-5" />
          <h2 className="text-xl font-extrabold text-white">Unified Application Tracker</h2>
        </div>
        <p className="text-xs text-slate-300">
          Track end-to-end status, current department routing, and next step instructions across all government schemes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applications List Side panel */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">My Applications</h3>
          <div className="space-y-2">
            {applications.map((app) => (
              <div
                key={app.applicationId}
                onClick={() => setSelectedApp(app)}
                className={`p-3.5 rounded-xl cursor-pointer transition-all border ${
                  selectedApp?.applicationId === app.applicationId
                    ? 'bg-blue-950/60 border-blue-500 shadow-md'
                    : 'glass-card border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono font-bold text-xs text-blue-400">{app.applicationId}</span>
                  <StatusBadge status={app.status} size="sm" />
                </div>
                <h4 className="text-xs font-bold text-white line-clamp-1">{app.schemeTitle}</h4>
                <div className="text-[11px] text-slate-400 mt-2 flex justify-between">
                  <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                  <span className="text-slate-300 font-semibold">{app.currentDepartment}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application Details & Workflow Pipeline View */}
        {selectedApp && (
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold font-mono text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                  {selectedApp.applicationId}
                </span>
                <h3 className="text-lg font-extrabold text-white mt-1">{selectedApp.schemeTitle}</h3>
              </div>
              <StatusBadge status={selectedApp.status} size="lg" />
            </div>

            {/* Quick Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Current Department</span>
                <div className="font-bold text-white mt-0.5">{selectedApp.currentDepartment}</div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Submitted Date</span>
                <div className="font-bold text-white mt-0.5">{new Date(selectedApp.createdAt).toLocaleDateString()}</div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Last Updated</span>
                <div className="font-bold text-white mt-0.5">{new Date(selectedApp.updatedAt).toLocaleTimeString()}</div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Income Verified</span>
                <div className="font-bold text-emerald-400 mt-0.5">
                  {selectedApp.incomeVerification?.verified ? `₹${selectedApp.incomeVerification.annualIncome?.toLocaleString('en-IN')}` : 'Pending'}
                </div>
              </div>
            </div>

            {/* Next Step Box */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/80 to-indigo-950/80 border border-blue-800/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Next Step Required:</span>
                <div className="text-xs font-bold text-white mt-0.5">{selectedApp.nextStep}</div>
              </div>
              <ArrowRight className="w-5 h-5 text-blue-400 animate-pulse" />
            </div>

            {/* Status History Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                Application History & Workflow Audit Trail
              </h4>
              <div className="relative pl-6 border-l-2 border-slate-800 space-y-4">
                {selectedApp.statusHistory?.map((hist, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-600 border-2 border-slate-950 flex items-center justify-center">
                      <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-white">{hist.status}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(hist.changedAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{hist.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
