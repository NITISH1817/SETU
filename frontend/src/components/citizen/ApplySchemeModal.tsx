import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Scheme } from '../../types';
import { X, ShieldCheck, FilePlus, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ApplySchemeModalProps {
  schemes: Scheme[];
  onClose: () => void;
  onSuccess: () => void;
}

export const ApplySchemeModal: React.FC<ApplySchemeModalProps> = ({ schemes, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(schemes[0]?.schemeId || 'SCH-SCHOLARSHIP-01');
  const [purpose, setPurpose] = useState<string>(t('apply.defaultPurpose', 'Higher Education Scholarship Application'));
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
      alert(err.response?.data?.message || t('apply.submitFail', 'Failed to submit scheme application.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm" style={{ background: 'rgba(0,0,0,0.8)' }}>
      <div className="gc-glass w-full max-w-lg rounded-2xl p-6 space-y-5 shadow-2xl relative border" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl border flex items-center justify-center" style={{ background: 'var(--surface-3)', borderColor: 'var(--border-2)', color: 'var(--text)' }}>
            <FilePlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold" style={{ color: 'var(--text)' }}>{t('apply.title', 'Apply for Welfare Scheme')}</h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('apply.subtitle', 'GovConnect Interoperable Portal Single Window Application')}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="gc-label">{t('apply.selectScheme', 'Select Scheme')}</label>
            <select
              value={selectedSchemeId}
              onChange={(e) => setSelectedSchemeId(e.target.value)}
              className="gc-input"
            >
              {schemes.map(s => (
                <option key={s.schemeId} value={s.schemeId}>
                  {s.title} ({s.category}) - {t('apply.maxIncome', 'Max Income')} ₹{s.maxIncomeThreshold.toLocaleString('en-IN')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="gc-label">{t('apply.purposeLabel', 'Application Purpose / Note')}</label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              required
              className="gc-input"
              placeholder={t('apply.purposePlaceholder', 'e.g. Higher Education Support / Senior Citizen Pension')}
            />
          </div>

          {/* Consent Checkbox */}
          <div className="p-4 rounded-xl border space-y-2" style={{ background: 'var(--surface-2)', borderColor: 'var(--border-2)' }}>
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={autoGrantConsent}
                onChange={(e) => setAutoGrantConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded"
                style={{ accentColor: 'var(--text)' }}
              />
              <div>
                <span className="font-bold flex items-center" style={{ color: 'var(--text)' }}>
                  <ShieldCheck className="w-4 h-4 mr-1" style={{ color: 'var(--success)' }} />
                  {t('apply.authConsent', 'Authorize Digital Consent for Income Verification')}
                </span>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {t('apply.consentDesc', 'Instead of uploading paper income certificates, I authorize GovConnect Middleware to securely retrieve and verify my income from the Revenue Department API.')}
                </p>
              </div>
            </label>
          </div>

          <div className="pt-2 flex justify-end space-x-3" style={{ borderTop: '1px solid var(--border)' }}>
            <button
              type="button"
              onClick={onClose}
              className="gc-btn-ghost"
            >
              {t('apply.cancel', 'Cancel')}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="gc-btn-primary disabled:opacity-50"
            >
              {submitting ? t('apply.submitting', 'Submitting...') : t('apply.submitApp', 'Submit Application & Grant Consent')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
