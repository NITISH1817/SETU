import React, { useState } from 'react';
import api from '../../services/api';
import { StatusBadge } from '../common/StatusBadge';
import { CodeViewer } from '../common/CodeViewer';
import { useTranslation } from 'react-i18next';
import {
  Play,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Layers,
  ArrowRight,
  Database,
  ShieldCheck,
  Cpu,
  FileCode,
  Check,
  Clock,
  Sparkles,
  Server
} from 'lucide-react';

interface StepState {
  id: string;
  nameKey: string;
  department: 'WELFARE' | 'MIDDLEWARE' | 'REVENUE';
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED';
  descriptionKey: string;
  payload?: any;
}

export const InteroperabilityMonitor: React.FC = () => {
  const { t } = useTranslation();
  const [selectedCitizen, setSelectedCitizen] = useState<string>('CIT-1001');
  const [selectedScheme, setSelectedScheme] = useState<string>('SCH-SCHOLARSHIP-01');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeTabStep, setActiveTabStep] = useState<string | null>('step-6');
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [pipelineResult, setPipelineResult] = useState<any>(null);

  const [steps, setSteps] = useState<StepState[]>([
    { id: 'step-1', nameKey: 'steps.step1.name', department: 'WELFARE', status: 'PENDING', descriptionKey: 'steps.step1.description' },
    { id: 'step-2', nameKey: 'steps.step2.name', department: 'MIDDLEWARE', status: 'PENDING', descriptionKey: 'steps.step2.description' },
    { id: 'step-3', nameKey: 'steps.step3.name', department: 'MIDDLEWARE', status: 'PENDING', descriptionKey: 'steps.step3.description' },
    { id: 'step-4', nameKey: 'steps.step4.name', department: 'MIDDLEWARE', status: 'PENDING', descriptionKey: 'steps.step4.description' },
    { id: 'step-5', nameKey: 'steps.step5.name', department: 'REVENUE', status: 'PENDING', descriptionKey: 'steps.step5.description' },
    { id: 'step-6', nameKey: 'steps.step6.name', department: 'REVENUE', status: 'PENDING', descriptionKey: 'steps.step6.description' },
    { id: 'step-7', nameKey: 'steps.step7.name', department: 'MIDDLEWARE', status: 'PENDING', descriptionKey: 'steps.step7.description' },
    { id: 'step-8', nameKey: 'steps.step8.name', department: 'MIDDLEWARE', status: 'PENDING', descriptionKey: 'steps.step8.description' },
    { id: 'step-9', nameKey: 'steps.step9.name', department: 'WELFARE', status: 'PENDING', descriptionKey: 'steps.step9.description' },
    { id: 'step-10', nameKey: 'steps.step10.name', department: 'MIDDLEWARE', status: 'PENDING', descriptionKey: 'steps.step10.description' }
  ]);

  const runPipeline = async () => {
    setIsRunning(true);
    setPipelineResult(null);

    // Reset step status
    setSteps(prev => prev.map(s => ({ ...s, status: 'PENDING', payload: null })));

    const startTime = Date.now();

    // Step by step animation execution
    for (let i = 0; i < 10; i++) {
      const stepId = `step-${i + 1}`;
      setSteps(prev => prev.map(s => s.id === stepId ? { ...s, status: 'PROCESSING' } : s));
      await new Promise(r => setTimeout(r, 220));

      setSteps(prev => prev.map(s => s.id === stepId ? { ...s, status: 'SUCCESS' } : s));
    }

    try {
      const response = await api.get(`/income/demo-flow/${selectedCitizen}`);
      setPipelineResult(response.data);
      setExecutionTime(Date.now() - startTime);

      // Populate detailed payload data into steps
      const res = response.data;
      setSteps(prev => prev.map(s => {
        let payload = null;
        if (s.id === 'step-1') payload = { welfareCitizenId: selectedCitizen, schemeId: selectedScheme };
        if (s.id === 'step-2') payload = { bearerToken: 'Bearer eyJhbGciOiJIUzI1NiIsIn...', userRole: 'CITIZEN' };
        if (s.id === 'step-3') payload = { consentStatus: 'ACTIVE', requestedData: 'INCOME_CERTIFICATE' };
        if (s.id === 'step-4') payload = { welfareId: selectedCitizen, mappedRevenueId: res.revenueId };
        if (s.id === 'step-5') payload = { endpoint: `/api/revenue/citizen/${res.revenueId}/income`, method: 'GET' };
        if (s.id === 'step-6') payload = res.pipelineSteps[5]?.data?.rawXmlPayload;
        if (s.id === 'step-7') payload = res.pipelineSteps[6]?.data?.transformedJson;
        if (s.id === 'step-8') payload = res.pipelineSteps[7]?.data;
        if (s.id === 'step-9') payload = res.pipelineSteps[8]?.data;
        if (s.id === 'step-10') payload = res.pipelineSteps[9]?.data;

        return { ...s, payload };
      }));
    } catch (err) {
      console.error('Pipeline execution error:', err);
    } finally {
      setIsRunning(false);
    }
  };

  const getDepartmentBadge = (dept: string) => {
    if (dept === 'WELFARE') return <span className="gc-badge gc-badge-info">{t('departments.welfare', 'Welfare')}</span>;
    if (dept === 'MIDDLEWARE') return <span className="gc-badge gc-badge-primary">{t('departments.middleware', 'Middleware')}</span>;
    return <span className="gc-badge gc-badge-warning">{t('departments.revenue', 'Revenue')}</span>;
  };

  const activeStepObj = steps.find(s => s.id === activeTabStep);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 gc-accent-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 animate-pulse" style={{ color: 'var(--text)' }} />
            <h2 className="text-xl font-extrabold" style={{ color: 'var(--text)' }}>{t('monitor.title', 'System Monitor')}</h2>
          </div>
          <p className="text-xs mt-1 max-w-2xl" style={{ color: 'var(--text-muted)' }}>
            {t('monitor.subtitle', 'Live tracking of interoperability pipelines')}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedCitizen}
            onChange={(e) => setSelectedCitizen(e.target.value)}
            className="gc-input w-auto"
          >
            <option value="CIT-1001">{t('citizens.cit1001', 'CIT-1001')}</option>
            <option value="CIT-1002">{t('citizens.cit1002', 'CIT-1002')}</option>
            <option value="CIT-1003">{t('citizens.cit1003', 'CIT-1003')}</option>
          </select>

          <button
            onClick={runPipeline}
            disabled={isRunning}
            className="gc-btn-primary"
          >
            {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span>{isRunning ? t('monitor.executing', 'Executing') : t('monitor.runPipeline', 'Run Pipeline')}</span>
          </button>
        </div>
      </div>

      {executionTime && (
        <div className="gc-alert gc-alert-success flex items-center justify-between font-semibold">
          <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2" /> {t('monitor.success', 'Success')}</span>
          <span className="font-mono">{t('monitor.latency', { time: executionTime }, `${executionTime}ms`)}</span>
        </div>
      )}

      {/* Visual Pipeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {steps.map((step) => {
          const isSelected = activeTabStep === step.id;
          return (
            <div
              key={step.id}
              onClick={() => setActiveTabStep(step.id)}
              className={`p-3.5 rounded-xl cursor-pointer transition-all border ${
                isSelected
                  ? 'gc-surface-2 shadow-sm scale-[1.02]'
                  : 'gc-surface border-transparent hover:border-[var(--border-2)]'
              }`}
              style={{ borderColor: isSelected ? 'var(--text)' : undefined }}
            >
              <div className="flex items-center justify-between mb-2">
                {getDepartmentBadge(step.department)}
                {step.status === 'SUCCESS' && <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--success)' }} />}
                {step.status === 'PROCESSING' && <RefreshCw className="w-4 h-4 animate-spin" style={{ color: 'var(--warning)' }} />}
                {step.status === 'PENDING' && <Clock className="w-4 h-4" style={{ color: 'var(--text-dim)' }} />}
              </div>

              <h4 className="text-xs font-bold line-clamp-1" style={{ color: 'var(--text)' }}>{t(step.nameKey)}</h4>
              <p className="text-[11px] mt-1 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{t(step.descriptionKey)}</p>

              <div className="mt-3 pt-2 flex justify-between items-center text-[10px]" style={{ borderTop: '1px solid var(--border)' }}>
                <span className="font-mono" style={{ color: 'var(--text-dim)' }}>{t('monitor.idPrefix', '#')}{step.id.replace('step-', '')}</span>
                <span className="font-semibold flex items-center" style={{ color: 'var(--text)' }}>
                  {t('monitor.inspectPayload', 'Inspect')} <ArrowRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payload Inspector Drawer */}
      {activeStepObj && (
        <div className="gc-glass p-5 rounded-2xl border space-y-4" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center space-x-3">
              <FileCode className="w-5 h-5" style={{ color: 'var(--text)' }} />
              <div>
                <h3 className="text-sm font-extrabold" style={{ color: 'var(--text)' }}>{t('monitor.payloadInspector', 'Payload Inspector')}: {t(activeStepObj.nameKey)}</h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t(activeStepObj.descriptionKey)}</p>
              </div>
            </div>
            {getDepartmentBadge(activeStepObj.department)}
          </div>

          <div>
            {activeStepObj.id === 'step-6' && activeStepObj.payload ? (
              <CodeViewer code={String(activeStepObj.payload)} language="xml" title={t('monitor.rawXmlTitle', 'Raw XML')} />
            ) : activeStepObj.payload ? (
              <CodeViewer code={JSON.stringify(activeStepObj.payload, null, 2)} language="json" title={t('monitor.stepOutputTitle', { id: activeStepObj.id.replace('step-', '') }, `Step Output`)} />
            ) : (
              <div className="p-8 text-center text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                {t('monitor.clickToPopulate', 'Run the pipeline to populate this payload data.')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
