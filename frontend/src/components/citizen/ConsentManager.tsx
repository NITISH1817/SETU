import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Consent } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { ShieldCheck, ShieldAlert, Key, RefreshCw, Lock, Trash2, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ConsentManager: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [consents, setConsents] = useState<Consent[]>([]);
  const [loading, setLoading] = useState(true);
  const [purpose, setPurpose] = useState(t('consent.defaultPurpose', 'Income verification for Social Welfare Schemes'));
  const [expiresInDays, setExpiresInDays] = useState(30);

  const citizenId = user?.citizenId || 'CIT-1001';

  const fetchConsents = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/citizen/consents?citizenId=${citizenId}`);
      setConsents(res.data.consents || []);
    } catch (err) {
      console.error('Failed to fetch consents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsents();
  }, [citizenId]);

  const handleGrantConsent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/citizen/consent', {
        citizenId,
        purpose,
        expiresInDays,
        requestedData: 'INCOME_CERTIFICATE'
      });
      fetchConsents();
    } catch (err: any) {
      alert(err.response?.data?.message || t('consent.grantFail', 'Failed to grant consent.'));
    }
  };

  const handleRevokeConsent = async (consentId: string) => {
    if (!confirm(t('consent.revokeConfirm', 'Are you sure you want to revoke consent? Revenue Department income data access will be instantly blocked.'))) return;
    try {
      await api.delete(`/citizen/consent/${consentId}`);
      fetchConsents();
    } catch (err: any) {
      alert(err.response?.data?.message || t('consent.revokeFail', 'Failed to revoke consent.'));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 gc-accent-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2" style={{ color: 'var(--text)' }}>
            <ShieldCheck className="w-5 h-5" />
            <h2 className="text-xl font-extrabold">{t('consent.title', 'Citizen Digital Consent Management')}</h2>
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {t('consent.subtitle', 'Control cross-departmental data access. Social Welfare cannot access Revenue Department income data without your active consent.')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grant New Consent Card */}
        <div className="gc-glass p-5 space-y-4">
          <div className="flex items-center space-x-2" style={{ color: 'var(--text)' }}>
            <Plus className="w-5 h-5" />
            <h3 className="text-sm font-extrabold">{t('consent.grantNew', 'Grant New Digital Consent')}</h3>
          </div>

          <form onSubmit={handleGrantConsent} className="space-y-3 text-xs">
            <div>
              <label className="gc-label">{t('consent.citizenId', 'Citizen Welfare ID')}</label>
              <input
                type="text"
                value={citizenId}
                disabled
                className="gc-input font-mono"
              />
            </div>

            <div>
              <label className="gc-label">{t('consent.reqDataScope', 'Requested Data Scope')}</label>
              <input
                type="text"
                value="INCOME_CERTIFICATE (Revenue Department XML)"
                disabled
                className="gc-input font-semibold"
              />
            </div>

            <div>
              <label className="gc-label">{t('consent.purposeAccess', 'Purpose of Access')}</label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                required
                className="gc-input"
              />
            </div>

            <div>
              <label className="gc-label">{t('consent.validityDur', 'Consent Validity Duration')}</label>
              <select
                value={expiresInDays}
                onChange={(e) => setExpiresInDays(Number(e.target.value))}
                className="gc-input font-semibold"
              >
                <option value={7}>{t('consent.7days', '7 Days')}</option>
                <option value={30}>{t('consent.30days', '30 Days (Recommended)')}</option>
                <option value={90}>{t('consent.90days', '90 Days')}</option>
              </select>
            </div>

            <button
              type="submit"
              className="gc-btn-primary w-full"
            >
              {t('consent.grantBtn', 'Grant Digital Consent')}
            </button>
          </form>
        </div>

        {/* Consents History Table */}
        <div className="lg:col-span-2 gc-glass p-5 space-y-4">
          <h3 className="text-sm font-extrabold" style={{ color: 'var(--text)' }}>{t('consent.historyTitle', 'Active & Past Consent Records')}</h3>

          <div className="overflow-x-auto">
            <table className="gc-table">
              <thead>
                <tr>
                  <th>{t('table.scope', 'Scope')}</th>
                  <th>{t('table.purpose', 'Purpose')}</th>
                  <th>{t('table.grantedDate', 'Granted Date')}</th>
                  <th>{t('table.expiresDate', 'Expires Date')}</th>
                  <th>{t('table.status', 'Status')}</th>
                  <th className="text-right">{t('table.actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {consents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center" style={{ color: 'var(--text-muted)' }}>
                      {t('consent.noRecords', 'No consent records found.')}
                    </td>
                  </tr>
                ) : (
                  consents.map((c) => (
                    <tr key={c._id} className="transition-colors hover:bg-[var(--surface-3)]">
                      <td className="font-mono font-bold" style={{ color: 'var(--text)' }}>{c.requestedData}</td>
                      <td style={{ color: 'var(--text)' }}>{c.purpose}</td>
                      <td className="font-mono" style={{ color: 'var(--text-muted)' }}>{new Date(c.grantedAt).toLocaleDateString()}</td>
                      <td className="font-mono" style={{ color: 'var(--text-muted)' }}>{new Date(c.expiresAt).toLocaleDateString()}</td>
                      <td><StatusBadge status={c.status} size="sm" /></td>
                      <td className="text-right">
                        {c.status === 'ACTIVE' && (
                          <button
                            onClick={() => handleRevokeConsent(c._id)}
                            className="px-2.5 py-1 rounded text-[11px] font-bold flex items-center inline-flex"
                            style={{ background: 'var(--surface-2)', color: 'var(--text)' }}
                          >
                            <Trash2 className="w-3 h-3 mr-1" /> {t('consent.revokeBtn', 'Revoke')}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
