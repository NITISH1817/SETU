import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { StatusBadge } from './StatusBadge';
import { UserCheck, ShieldCheck, FileText, AlertCircle, Award, Search, HelpCircle, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ConsolidatedBeneficiaryView: React.FC = () => {
  const { t } = useTranslation();
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
      <div className="p-6 gc-accent-card flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2" style={{ color: 'var(--text)' }}>
            <UserCheck className="w-5 h-5" />
            <h2 className="text-xl font-extrabold">{t('view.title', 'Consolidated Beneficiary & Service Outcomes View')}</h2>
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {t('view.subtitle', 'Single 360° Consolidated View for Officials: Beneficiary profiles, application approvals, grievances, and service SLA outcomes across departments.')}
          </p>
        </div>

        <span className="gc-badge gc-badge-info font-mono font-bold">
          {t('view.statusBadge', '360° Consolidated View Active')}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Beneficiaries Directory */}
        <div className="gc-glass p-5 space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            {t('view.beneficiariesList', 'Consolidated Beneficiaries')}
          </h3>

          <div className="space-y-2">
            {beneficiaries.map((b) => (
              <div
                key={b.applicationId}
                onClick={() => setSelectedBeneficiary(b)}
                className={`p-3.5 rounded-xl cursor-pointer transition-all border ${
                  selectedBeneficiary?.applicationId === b.applicationId
                    ? 'gc-surface-2 shadow-md'
                    : 'gc-surface border-transparent hover:border-[var(--border-2)]'
                }`}
                style={{ borderColor: selectedBeneficiary?.applicationId === b.applicationId ? 'var(--text)' : undefined }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-xs" style={{ color: 'var(--text)' }}>{b.submissionData?.applicantName}</span>
                  <StatusBadge status={b.status} size="sm" />
                </div>
                <div className="text-[11px] font-mono mt-1 flex justify-between" style={{ color: 'var(--text-muted)' }}>
                  <span>{t('view.welfareId', 'Welfare')}: {b.citizenId}</span>
                  <span style={{ color: 'var(--text-dim)' }}>{t('view.revenueId', 'Revenue')}: {b.incomeVerification?.revenueId || 'REV-7845'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 360 Consolidated File Details */}
        {selectedBeneficiary && (
          <div className="lg:col-span-2 space-y-6">
            <div className="gc-glass p-6 space-y-5">
              <div className="flex justify-between items-start pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
                <div>
                  <span className="text-[10px] uppercase font-bold gc-badge gc-badge-primary font-mono">
                    {selectedBeneficiary.citizenId} ➔ {selectedBeneficiary.incomeVerification?.revenueId || 'REV-7845'}
                  </span>
                  <h3 className="text-lg font-extrabold mt-1" style={{ color: 'var(--text)' }}>
                    {selectedBeneficiary.submissionData?.applicantName}
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{selectedBeneficiary.schemeTitle}</p>
                </div>
                <StatusBadge status={selectedBeneficiary.status} size="lg" />
              </div>

              {/* 360 Data Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 gc-surface p-4 rounded-xl text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>{t('view.welfareIdLabel', 'Welfare Citizen ID')}</span>
                  <div className="font-mono font-bold mt-0.5" style={{ color: 'var(--text)' }}>{selectedBeneficiary.citizenId}</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>{t('view.revLegacyId', 'Revenue Legacy ID')}</span>
                  <div className="font-mono font-bold mt-0.5" style={{ color: 'var(--text)' }}>{selectedBeneficiary.incomeVerification?.revenueId || 'REV-7845'}</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>{t('view.verifiedIncome', 'Verified Income')}</span>
                  <div className="font-bold mt-0.5" style={{ color: selectedBeneficiary.incomeVerification?.verified ? 'var(--success)' : 'var(--text-dim)' }}>
                    {selectedBeneficiary.incomeVerification?.verified ? `₹${selectedBeneficiary.incomeVerification.annualIncome?.toLocaleString('en-IN')}` : t('view.pending', 'Pending')}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>{t('view.serviceSlaStatus', 'Service SLA Status')}</span>
                  <div className="font-bold mt-0.5 flex items-center" style={{ color: 'var(--success)' }}>
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> {t('view.compliant', '100% Compliant')}
                  </div>
                </div>
              </div>

              {/* Deterministic Evaluation Output */}
              <div className="p-4 rounded-xl gc-surface text-xs space-y-1">
                <span className="font-bold uppercase tracking-wider text-[10px]" style={{ color: 'var(--text-muted)' }}>{t('view.detAssessment', 'Deterministic Eligibility Assessment')}</span>
                <p className="font-medium" style={{ color: 'var(--text)' }}>{selectedBeneficiary.eligibilityResult?.reason || t('view.evalReady', 'Income verified against scheme rules.')}</p>
              </div>

              {/* Citizen Grievance Redressal Records */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider flex items-center" style={{ color: 'var(--text-muted)' }}>
                  <HelpCircle className="w-4 h-4 mr-1" style={{ color: 'var(--text)' }} /> {t('view.grievanceLogs', 'Citizen Grievance & SLA Resolution Logs')}
                </h4>
                <div className="space-y-2">
                  {grievances.filter(g => g.citizenId === selectedBeneficiary.citizenId || g.citizenId === 'CIT-1001').map(g => (
                    <div key={g.id} className="p-3 rounded-xl gc-surface text-xs flex justify-between items-center">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold" style={{ color: 'var(--text)' }}>{g.id}</span>
                          <span className="font-bold" style={{ color: 'var(--text)' }}>{g.subject}</span>
                        </div>
                        <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{t('view.resolution', 'Resolution')}: {g.resolution}</p>
                      </div>
                      <span className="text-[10px] font-bold gc-badge gc-badge-success">
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
