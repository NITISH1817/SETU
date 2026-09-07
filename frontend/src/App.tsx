import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { CitizenDashboard } from './components/citizen/CitizenDashboard';
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
import { Shield, Lock, ArrowRight } from 'lucide-react';

const LoginView: React.FC = () => {
  const { user, login, register, loading } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('citizen@gov.in');
  const [password, setPassword] = useState('Citizen123!');
  const [name, setName] = useState('Ramesh Kumar');

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

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
      alert(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen gov-gradient-header flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md p-8 rounded-3xl border border-slate-700 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold mx-auto shadow-inner">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">GovConnect Suite</h2>
          <p className="text-xs text-slate-300">
            Multi-Department Interoperability Gateway • Single Sign-On
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isRegister && (
            <div>
              <label className="block text-slate-300 font-bold mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-bold mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg pulse-glow transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <span>{isRegister ? 'Create Citizen Account' : 'Sign In to Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-blue-400 font-bold hover:underline"
          >
            {isRegister ? 'Sign In' : 'Register Now'}
          </button>
        </div>

        {/* Demo Credentials Helper */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <div className="font-bold text-slate-200 uppercase tracking-wider text-[10px]">⚡ Demo Hackathon Credentials</div>
          <div>Citizen: <span className="font-mono text-blue-400 font-semibold">citizen@gov.in</span> / <span className="font-mono text-slate-300">Citizen123!</span></div>
          <div>Welfare Officer: <span className="font-mono text-blue-400 font-semibold">welfare@gov.in</span> / <span className="font-mono text-slate-300">Welfare123!</span></div>
          <div>Admin: <span className="font-mono text-blue-400 font-semibold">admin@gov.in</span> / <span className="font-mono text-slate-300">Admin123!</span></div>
        </div>
      </div>
    </div>
  );
};

const ProtectedLayout: React.FC = () => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar onOpenNotifications={() => setShowNotifications(true)} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route path="/dashboard" element={<CitizenDashboard />} />
            <Route path="/apply" element={<CitizenDashboard />} />
            <Route path="/consent" element={<ConsentManager />} />
            <Route path="/tracking" element={<ApplicationTracker />} />
            <Route path="/revenue-department" element={<RevenueDepartmentPortal />} />
            <Route path="/welfare-department" element={<SocialWelfareDepartmentPortal />} />
            <Route path="/middleware-hub" element={<MiddlewareHub />} />
            <Route path="/consolidated-view" element={<ConsolidatedBeneficiaryView />} />
            <Route path="/mdm-registry" element={<MasterDataRegistry />} />
            <Route path="/interoperability-monitor" element={<InteroperabilityMonitor />} />
            <Route path="/welfare" element={<WelfareOfficerDashboard />} />
            <Route path="/revenue" element={<RevenueOfficerDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/docs" element={<SwaggerDocsView />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {showNotifications && (
        <NotificationsList onClose={() => setShowNotifications(false)} />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginView />} />
          <Route path="/*" element={<ProtectedLayout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
