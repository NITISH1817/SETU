import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { UnifiedDashboard } from './components/citizen/UnifiedDashboard';
import { CitizenServicesPortal } from './components/portals/CitizenServicesPortal';
import { BusinessIndustryPortal } from './components/portals/BusinessIndustryPortal';
import { ConsentManager } from './components/citizen/ConsentManager';
import { ApplicationTracker } from './components/citizen/ApplicationTracker';
import { InteroperabilityMonitor } from './components/interoperability/InteroperabilityMonitor';
import { WelfareOfficerDashboard } from './components/officer/WelfareOfficerDashboard';
import { RevenueOfficerDashboard } from './components/officer/RevenueOfficerDashboard';
import { RevenueDepartmentPortal } from './components/portals/RevenueDepartmentPortal';
import { SocialWelfareDepartmentPortal } from './components/portals/SocialWelfareDepartmentPortal';
import { MiddlewareHub } from './components/portals/MiddlewareHub';
import { ConsolidatedBeneficiaryView } from './components/common/ConsolidatedBeneficiaryView';
import { MasterDataRegistry } from './components/common/MasterDataRegistry';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { SwaggerDocsView } from './components/docs/SwaggerDocsView';
import { NotificationsList } from './components/citizen/NotificationsList';
import { useTranslation } from 'react-i18next';
import { Shield, ArrowRight, Loader2, CheckCircle, Users, Layers, Zap } from 'lucide-react';

// ─── Initialize theme on app load ────────────────────────────────────────────
function initTheme() {
  const stored = localStorage.getItem('govconnect_theme') as 'light' | 'dark' | null;
  const theme = stored || 'light';
  document.documentElement.setAttribute('data-theme', theme);
}
initTheme();

// ─── Login View ─────────────────────────────────────────────────────────────
const LoginView: React.FC = () => {
  const { user, login, register, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('citizen@gov.in');
  const [password, setPassword] = useState('Citizen123!');
  const [name, setName] = useState('Ramesh Kumar');

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await register({ email, password, name });
      } else {
        await login(email, password);
      }
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      alert(err.response?.data?.message || t('login.authFailed'));
    }
  };

  const features = [
    { icon: Users,       text: 'One profile connects all departments' },
    { icon: Zap,         text: 'Intelligent service navigator' },
    { icon: Layers,      text: 'Unified application tracking' },
    { icon: CheckCircle, text: 'Real-time interoperability gateway' },
  ];

  const demoCreds = [
    { role: t('login.citizen', 'Citizen'),             email: 'citizen@gov.in',  pass: 'Citizen123!' },
    { role: t('login.welfareOfficer', 'Welfare Officer'), email: 'welfare@gov.in',  pass: 'Welfare123!' },
    { role: t('login.admin', 'Admin'),                 email: 'admin@gov.in',    pass: 'Admin123!' },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      {/* Left Panel — Brand / Hero (always black) */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] gc-hero flex-col justify-between p-12">

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-bold text-white">GovConnect</span>
              <span className="ml-2 text-[10px] font-bold uppercase tracking-widest text-blue-200 bg-white/10 border border-white/20 px-1.5 py-0.5 rounded">
                SIH 2026
              </span>
            </div>
          </div>

          <div className="max-w-md">
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4" style={{ letterSpacing: '-0.02em' }}>
              One Portal for All Government Services
            </h1>
            <p className="text-base leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Discover services, apply, track applications, and manage all your government interactions from a single unified platform.
            </p>
            <div className="space-y-4">
              {features.map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                  >
                    <Icon className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.65)' }} />
                  </div>
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="relative z-10">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Smart India Hackathon 2026 · Problem SIH26129</p>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div
        className="flex-1 flex items-center justify-center p-6 sm:p-10"
        style={{ background: 'var(--surface)', borderLeft: '1px solid var(--border)' }}
      >
        <div className="w-full max-w-sm space-y-7">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--grad-primary)' }}
            >
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>GovConnect</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>
              {isRegister ? 'Create Account' : 'Sign In to Portal'}
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {t('login.subtitle', 'Multi-Department Interoperability Gateway • Single Sign-On')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="gc-label">{t('login.fullName', 'Full Name')}</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  required className="gc-input" placeholder="Your full name" />
              </div>
            )}
            <div>
              <label className="gc-label">{t('login.email', 'Email Address')}</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                required className="gc-input" placeholder="you@gov.in" />
            </div>
            <div>
              <label className="gc-label">{t('login.password', 'Password')}</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                required className="gc-input" placeholder="••••••••" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="gc-btn-primary w-full justify-center py-3 text-sm"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{isRegister ? t('login.createAccount', 'Create Account') : t('login.signInPortal', 'Sign In to Portal')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
            {isRegister ? t('login.alreadyAccount', 'Already have an account?') : t('login.noAccount', "Don't have an account?")}{' '}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="font-semibold transition-colors"
              style={{ color: 'var(--primary)' }}
            >
              {isRegister ? t('login.signIn', 'Sign In') : t('login.registerNow', 'Register Now')}
            </button>
          </div>

          {/* Demo Credentials */}
          <div
            className="rounded-xl p-4 space-y-1"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
          >
            <div className="gc-section-label mb-2.5">{t('login.demoCreds', '⚡ DEMO HACKATHON CREDENTIALS')}</div>
            {demoCreds.map(({ role, email: e, pass }) => (
              <button
                key={e}
                onClick={() => { setEmail(e); setPassword(pass); setIsRegister(false); }}
                className="w-full text-left flex items-center justify-between px-2.5 py-2 rounded-lg transition-colors text-xs group"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={ev => (ev.currentTarget as HTMLElement).style.background = 'var(--indigo-bg)'}
                onMouseLeave={ev => (ev.currentTarget as HTMLElement).style.background = 'transparent'}
              >
                <span className="font-medium">{role}</span>
                <span className="font-mono" style={{ color: 'var(--primary)' }}>{e} / {pass}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Protected Layout ────────────────────────────────────────────────────────
const ProtectedLayout: React.FC = () => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <Navbar onOpenNotifications={() => setShowNotifications(true)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6" style={{ background: 'var(--bg)' }}>
          <Routes>
            <Route path="/dashboard"                element={<UnifiedDashboard />} />
            <Route path="/services/citizen"         element={<CitizenServicesPortal />} />
            <Route path="/services/business"        element={<BusinessIndustryPortal />} />
            <Route path="/apply"                    element={<UnifiedDashboard />} />
            <Route path="/consent"                  element={<ConsentManager />} />
            <Route path="/tracking"                 element={<ApplicationTracker />} />
            <Route path="/revenue-department"       element={<RevenueDepartmentPortal />} />
            <Route path="/welfare-department"       element={<SocialWelfareDepartmentPortal />} />
            <Route path="/middleware-hub"           element={<MiddlewareHub />} />
            <Route path="/consolidated-view"        element={<ConsolidatedBeneficiaryView />} />
            <Route path="/mdm-registry"             element={<MasterDataRegistry />} />
            <Route path="/interoperability-monitor" element={<InteroperabilityMonitor />} />
            <Route path="/welfare"                  element={<WelfareOfficerDashboard />} />
            <Route path="/revenue"                  element={<RevenueOfficerDashboard />} />
            <Route path="/admin"                    element={<AdminDashboard />} />
            <Route path="/docs"                     element={<SwaggerDocsView />} />
            <Route path="*"                         element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
      {showNotifications && (
        <NotificationsList onClose={() => setShowNotifications(false)} />
      )}
    </div>
  );
};

// ─── App Root ────────────────────────────────────────────────────────────────
export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginView />} />
          <Route path="/*"     element={<ProtectedLayout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
