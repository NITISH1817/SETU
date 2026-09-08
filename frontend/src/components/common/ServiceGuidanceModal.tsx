import React, { useState } from 'react';
import { GovernmentService } from '../../data/serviceRegistry';
import { X, CheckCircle, FileText, ArrowRight, ShieldAlert, Clock, Loader2, CheckSquare, Square } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  service: GovernmentService;
  onClose: () => void;
}

export const ServiceGuidanceModal: React.FC<Props> = ({ service, onClose }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [checkedDocs, setCheckedDocs] = useState<boolean[]>(service.documents.map(() => false));
  const [mockAppId] = useState(`APP-${(Math.random() * 90000 + 10000).toFixed(0)}`);
  const navigate = useNavigate();

  const toggleDoc = (i: number) => {
    setCheckedDocs(prev => prev.map((v, idx) => idx === i ? !v : v));
  };

  const handleApply = () => {
    setStep(2);
    setTimeout(() => setStep(3), 2200);
  };

  const handleGoToTracker = () => {
    onClose();
    navigate('/tracking');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(6,11,20,0.85)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-2xl"
        style={{ background: 'var(--color-surface)' }}>

        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-[var(--color-border)] shrink-0">
          <div className="min-w-0 flex-1 pr-4">
            <span className="gc-badge gc-badge-primary text-[10px] mb-1.5">{service.departmentName}</span>
            <h2 className="text-lg font-bold text-white mt-1">{service.name}</h2>
          </div>
          <button onClick={onClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-colors shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="px-5 py-3 border-b border-[var(--color-border)] shrink-0">
          <div className="flex items-center gap-2">
            {(['Review', 'Submitting', 'Done'] as const).map((label, i) => (
              <React.Fragment key={label}>
                <div className={`flex items-center gap-1.5 text-xs font-medium ${step === i + 1 ? 'text-indigo-400' : step > i + 1 ? 'text-emerald-400' : 'text-slate-600'}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                    step > i + 1 ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' :
                    step === i + 1 ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-400' :
                    'border-slate-700 text-slate-600'
                  }`}>{step > i + 1 ? '✓' : i + 1}</div>
                  {label}
                </div>
                {i < 2 && <div className="flex-1 h-px bg-[var(--color-border)]" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {step === 1 && (
            <>
              {/* Description */}
              <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 text-sm text-slate-300">
                {service.description}
              </div>

              {/* Eligibility */}
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-semibold text-white">Eligibility</h3>
                </div>
                <div className="p-3 rounded-lg border border-[var(--color-border)] text-sm text-slate-400"
                  style={{ background: 'var(--color-surface-2)' }}>
                  {service.eligibility}
                </div>
              </div>

              {/* Documents Checklist */}
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-semibold text-white">Required Documents</h3>
                </div>
                <div className="space-y-2">
                  {service.documents.map((doc, i) => (
                    <button key={i} onClick={() => toggleDoc(i)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors"
                      style={{
                        background: checkedDocs[i] ? 'rgba(16,185,129,0.05)' : 'var(--color-surface-2)',
                        borderColor: checkedDocs[i] ? 'rgba(16,185,129,0.25)' : 'var(--color-border)'
                      }}>
                      {checkedDocs[i]
                        ? <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                        : <Square className="w-4 h-4 text-slate-600 shrink-0" />}
                      <span className={`text-xs ${checkedDocs[i] ? 'text-emerald-300' : 'text-slate-400'}`}>{doc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Processing time */}
              <div className="flex items-center gap-2 p-3 rounded-lg border border-[var(--color-border)] text-xs text-slate-500"
                style={{ background: 'var(--color-surface-2)' }}>
                <Clock className="w-4 h-4 shrink-0 text-slate-600" />
                Estimated processing time: <strong className="text-slate-300 ml-1">{service.processingTime}</strong>
              </div>
            </>
          )}

          {step === 2 && (
            <div className="py-12 flex flex-col items-center justify-center gap-4 text-center">
              <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
              <div>
                <h3 className="text-base font-semibold text-white mb-1">Routing to Interoperability Gateway...</h3>
                <p className="text-sm text-slate-500">Connecting to {service.departmentName}</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="py-8 flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Application Submitted!</h3>
                <p className="text-sm text-slate-400 mb-3">Routed to {service.departmentName} successfully.</p>
                <div className="inline-block px-4 py-2 rounded-lg border border-indigo-500/30 bg-indigo-500/10 font-mono text-sm text-indigo-300 font-bold">
                  {mockAppId}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[var(--color-border)] flex justify-end gap-3 shrink-0">
          {step === 1 && (
            <>
              <button onClick={onClose} className="gc-btn-ghost text-sm">Cancel</button>
              <button onClick={handleApply} className="gc-btn-primary text-sm">
                Proceed & Apply
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
          {step === 3 && (
            <button onClick={handleGoToTracker} className="gc-btn-primary text-sm w-full justify-center">
              Track Application Status
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
