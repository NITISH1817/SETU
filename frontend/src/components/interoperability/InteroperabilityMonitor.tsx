import React, { useState } from 'react';
import api from '../../services/api';
import { StatusBadge } from '../common/StatusBadge';
import { CodeViewer } from '../common/CodeViewer';
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
  name: string;
  department: 'WELFARE' | 'MIDDLEWARE' | 'REVENUE';
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED';
  description: string;
  payload?: any;
}

export const InteroperabilityMonitor: React.FC = () => {
  const [selectedCitizen, setSelectedCitizen] = useState<string>('CIT-1001');
  const [selectedScheme, setSelectedScheme] = useState<string>('SCH-SCHOLARSHIP-01');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeTabStep, setActiveTabStep] = useState<string | null>('step-6');
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [pipelineResult, setPipelineResult] = useState<any>(null);

  const [steps, setSteps] = useState<StepState[]>([
    { id: 'step-1', name: '1. Welfare Application Init', department: 'WELFARE', status: 'PENDING', description: 'Citizen submits scheme application with Welfare ID' },
    { id: 'step-2', name: '2. JWT & RBAC Auth Check', department: 'MIDDLEWARE', status: 'PENDING', description: 'Middleware validates JWT bearer token and role permissions' },
    { id: 'step-3', name: '3. Digital Consent Verification', department: 'MIDDLEWARE', status: 'PENDING', description: 'Middleware checks active unexpired consent record' },
    { id: 'step-4', name: '4. Master ID Mapping', department: 'MIDDLEWARE', status: 'PENDING', description: 'Maps Welfare ID (CIT-1001) to Revenue ID (REV-7845)' },
    { id: 'step-5', name: '5. Revenue API Execution', department: 'REVENUE', status: 'PENDING', description: 'Calls GET /api/revenue/citizen/REV-7845/income' },
    { id: 'step-6', name: '6. Legacy XML Received', department: 'REVENUE', status: 'PENDING', description: 'Revenue system returns raw XML format response' },
    { id: 'step-7', name: '7. XML → JSON Common Model', department: 'MIDDLEWARE', status: 'PENDING', description: 'Transforms legacy XML into standardized JSON payload' },
    { id: 'step-8', name: '8. Data Quality Validation', department: 'MIDDLEWARE', status: 'PENDING', description: 'Executes 6 schema & non-negative income quality checks' },
    { id: 'step-9', name: '9. Deterministic Rules Engine', department: 'WELFARE', status: 'PENDING', description: 'Evaluates scheme income and age thresholds' },
    { id: 'step-10', name: '10. Final Result & Audit Log', department: 'MIDDLEWARE', status: 'PENDING', description: 'Updates status, records immutable audit event, sends notification' }
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
    if (dept === 'WELFARE') return <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800">Social Welfare</span>;
    if (dept === 'MIDDLEWARE') return <span className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-800">Interoperability Middleware</span>;
    return <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800">Revenue Dept (XML)</span>;
  };

  const activeStepObj = steps.find(s => s.id === activeTabStep);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl gov-gradient-header border border-blue-900/60 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            <h2 className="text-xl font-extrabold text-white">Interoperability Pipeline Monitor</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Live Hackathon Demonstration: Watch how our middleware bridges the independent Revenue XML system with the Social Welfare eligibility engine without replacing underlying legacy databases.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedCitizen}
            onChange={(e) => setSelectedCitizen(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-3 py-2 text-white font-semibold focus:outline-none focus:border-blue-500"
          >
            <option value="CIT-1001">Citizen: Ramesh (CIT-1001 → REV-7845)</option>
            <option value="CIT-1002">Citizen: Anita (CIT-1002 → REV-9214)</option>
            <option value="CIT-1003">Citizen: Suresh (CIT-1003 → REV-3312)</option>
          </select>

          <button
            onClick={runPipeline}
            disabled={isRunning}
            className="flex items-center space-x-2 px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg transition-all disabled:opacity-50 pulse-glow"
          >
            {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span>{isRunning ? 'Executing Pipeline...' : 'Run Live Interoperability Flow'}</span>
          </button>
        </div>
      </div>

      {executionTime && (
        <div className="flex items-center justify-between px-4 py-2 bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 rounded-xl text-xs font-semibold">
          <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-emerald-400" /> Pipeline Execution Completed Successfully</span>
          <span className="font-mono text-emerald-400">Total Latency: {executionTime} ms</span>
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
                  ? 'bg-slate-900 border-blue-500 shadow-lg pulse-glow scale-[1.02]'
                  : 'glass-card border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                {getDepartmentBadge(step.department)}
                {step.status === 'SUCCESS' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {step.status === 'PROCESSING' && <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />}
                {step.status === 'PENDING' && <Clock className="w-4 h-4 text-slate-600" />}
              </div>

              <h4 className="text-xs font-bold text-white line-clamp-1">{step.name}</h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{step.description}</p>

              <div className="mt-3 pt-2 border-t border-slate-800 flex justify-between items-center text-[10px]">
                <span className="font-mono text-slate-500">ID: {step.id}</span>
                <span className="text-blue-400 font-semibold flex items-center">
                  Inspect Payload <ArrowRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payload Inspector Drawer */}
      {activeStepObj && (
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-3">
              <FileCode className="w-5 h-5 text-blue-400" />
              <div>
                <h3 className="text-sm font-extrabold text-white">Payload Inspector: {activeStepObj.name}</h3>
                <p className="text-xs text-slate-400">{activeStepObj.description}</p>
              </div>
            </div>
            {getDepartmentBadge(activeStepObj.department)}
          </div>

          <div>
            {activeStepObj.id === 'step-6' && activeStepObj.payload ? (
              <CodeViewer code={String(activeStepObj.payload)} language="xml" title="Revenue Department Raw Legacy XML Output" />
            ) : activeStepObj.payload ? (
              <CodeViewer code={JSON.stringify(activeStepObj.payload, null, 2)} language="json" title={`Step ${activeStepObj.id} Output Payload`} />
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs font-mono">
                Click "Run Live Interoperability Flow" above to populate live payloads for this step.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
