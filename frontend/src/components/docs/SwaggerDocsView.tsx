import React from 'react';
import { FileText, ExternalLink, Code2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const SwaggerDocsView: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 gc-accent-card flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2" style={{ color: 'var(--text)' }}>
            <FileText className="w-5 h-5" />
            <h2 className="text-xl font-extrabold">{t('docs.title', 'OpenAPI / Swagger API Documentation')}</h2>
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {t('docs.subtitle', 'Complete OpenAPI 3.0 specification for GovConnect Interoperability REST API Gateway.')}
          </p>
        </div>

        <a
          href="http://localhost:5000/api-docs"
          target="_blank"
          rel="noreferrer"
          className="gc-btn-primary"
        >
          <span>{t('docs.openLive', 'Open Live Swagger UI')}</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div className="gc-glass p-6 space-y-4">
        <h3 className="text-sm font-extrabold" style={{ color: 'var(--text)' }}>{t('docs.coreEndpoints', 'Core Interoperability API Endpoints Summary')}</h3>

        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-xl gc-surface space-y-2">
            <div className="flex items-center space-x-2">
              <span className="gc-badge gc-badge-success font-mono font-bold">POST</span>
              <span className="font-mono font-bold" style={{ color: 'var(--text)' }}>/api/income/verify</span>
              <span className="text-[11px]" style={{ color: 'var(--text-dim)' }}>({t('docs.workflowMain', 'Main Interoperability Workflow')})</span>
            </div>
            <p style={{ color: 'var(--text-muted)' }}>
              {t('docs.workflowDesc', 'Triggers end-to-end middleware workflow: JWT check → Consent verification → Master ID Mapping (CIT-1001 → REV-7845) → Revenue Dept XML API fetch → XML-to-JSON parsing → Quality validation → Deterministic Eligibility engine evaluation.')}
            </p>
          </div>

          <div className="p-4 rounded-xl gc-surface space-y-2">
            <div className="flex items-center space-x-2">
              <span className="gc-badge gc-badge-info font-mono font-bold">GET</span>
              <span className="font-mono font-bold" style={{ color: 'var(--text)' }}>/api/revenue/citizen/:id/income</span>
              <span className="text-[11px]" style={{ color: 'var(--text-dim)' }}>({t('docs.legacySim', 'Legacy System Simulator')})</span>
            </div>
            <p style={{ color: 'var(--text-muted)' }}>
              {t('docs.legacyDesc', 'Revenue Department mock service returning annual income payloads formatted strictly in legacy XML (<Citizen><RevenueId>...</RevenueId><AnnualIncome>...</AnnualIncome></Citizen>).')}
            </p>
          </div>

          <div className="p-4 rounded-xl gc-surface space-y-2">
            <div className="flex items-center space-x-2">
              <span className="gc-badge gc-badge-primary font-mono font-bold">POST</span>
              <span className="font-mono font-bold" style={{ color: 'var(--text)' }}>/api/citizen/consent</span>
              <span className="text-[11px]" style={{ color: 'var(--text-dim)' }}>({t('docs.consentEnforce', 'Digital Consent Enforcement')})</span>
            </div>
            <p style={{ color: 'var(--text-muted)' }}>
              {t('docs.consentDesc', 'Grants explicit digital consent for cross-departmental data sharing with requested data scope, purpose, and expiration timestamp.')}
            </p>
          </div>

          <div className="p-4 rounded-xl gc-surface space-y-2">
            <div className="flex items-center space-x-2">
              <span className="gc-badge gc-badge-warning font-mono font-bold">GET</span>
              <span className="font-mono font-bold" style={{ color: 'var(--text)' }}>/api/admin/audit-logs</span>
              <span className="text-[11px]" style={{ color: 'var(--text-dim)' }}>({t('docs.securityAudit', 'Security & Audit Trail')})</span>
            </div>
            <p style={{ color: 'var(--text-muted)' }}>
              {t('docs.auditDesc', 'Retrieves immutable audit logs for system operations, consent actions, identity resolutions, and XML transformation steps.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
