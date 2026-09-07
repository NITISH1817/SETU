import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Scheme } from '../../types';
import { X, ShieldCheck, FilePlus, Sparkles } from 'lucide-react';

interface ApplySchemeModalProps {
  schemes: Scheme[];
  onClose: () => void;
  onSuccess: () => void;
}

export const ApplySchemeModal: React.FC<ApplySchemeModalProps> = ({ schemes, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(schemes[0]?.schemeId || 'SCH-SCHOLARSHIP-01');
  const [purpose, setPurpose] = useState<string>('Higher Education Scholarship Application');
  const [autoGrantConsent, setAutoGrantConsent] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/applications', {
        schemeId: selectedSchemeId,
        purpose,
        autoGrantConsent,
        citizenId: user?.citizenId || 'CIT-1001'
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit scheme application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-700 p-6 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
            <FilePlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white">Apply for Welfare Scheme</h3>
            <p className="text-xs text-slate-400">GovConnect Interoperable Portal Single Window Application</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1">Select Scheme</label>
            <select
              value={selectedSchemeId}
              onChange={(e) => setSelectedSchemeId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-semibold focus:border-blue-500 focus:outline-none"
            >
              {schemes.map(s => (
                <option key={s.schemeId} value={s.schemeId}>
                  {s.title} ({s.category}) - Max Income ₹{s.maxIncomeThreshold.toLocaleString('en-IN')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Application Purpose / Note</label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none"
              placeholder="e.g. Higher Education Support / Senior Citizen Pension"
            />
          </div>

          {/* Consent Checkbox */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-blue-900/50 space-y-2">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={autoGrantConsent}
                onChange={(e) => setAutoGrantConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-blue-600 rounded bg-slate-800 border-slate-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-bold text-slate-200 flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-1 text-emerald-400" />
                  Authorize Digital Consent for Income Verification
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Instead of uploading paper income certificates, I authorize GovConnect Middleware to securely retrieve and verify my income from the Revenue Department API.
                </p>
              </div>
            </label>
          </div>

          <div className="pt-2 flex justify-end space-x-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg pulse-glow disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Application & Grant Consent'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
