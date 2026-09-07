import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FilePlus,
  ShieldCheck,
  Activity,
  UserCheck,
  Building2,
  Settings,
  FileText,
  Clock,
  Layers,
  Database,
  HelpCircle
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role || 'CITIZEN';

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-3 px-4 py-2.5 rounded-xl font-medium text-xs transition-all ${
      isActive
        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-md font-semibold'
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
    }`;

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 min-h-[calc(100vh-61px)] p-4 flex flex-col justify-between">
      <div className="space-y-6">
        {/* Hackathon Demo Pipeline Banner */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-950/80 to-blue-950/80 border border-purple-700/50 shadow-lg">
          <div className="flex items-center space-x-2 text-purple-400 mb-1">
            <Activity className="w-4 h-4 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">Interoperability Hub</span>
          </div>
          <p className="text-[11px] text-slate-300 mb-2">
            Watch real-time XML data exchange between Revenue & Welfare departments.
          </p>
          <NavLink
            to="/middleware-hub"
            className="block text-center text-xs font-bold py-1.5 px-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors shadow-md"
          >
            🚀 Open Middleware Hub
          </NavLink>
        </div>

        {/* Citizen Portal Nav */}
        <div className="space-y-1">
          <div className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
            Citizen Portal
          </div>
          <NavLink to="/dashboard" className={linkClass}>
            <LayoutDashboard className="w-4 h-4" />
            <span>Citizen Dashboard</span>
          </NavLink>

          <NavLink to="/apply" className={linkClass}>
            <FilePlus className="w-4 h-4" />
            <span>Apply for Scheme</span>
          </NavLink>

          <NavLink to="/consent" className={linkClass}>
            <ShieldCheck className="w-4 h-4" />
            <span>Consent Manager</span>
          </NavLink>

          <NavLink to="/tracking" className={linkClass}>
            <Clock className="w-4 h-4" />
            <span>Track Application</span>
          </NavLink>
        </div>

        {/* Department Portals */}
        <div className="space-y-1 pt-2 border-t border-slate-800">
          <div className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
            Government Portals
          </div>
          <NavLink to="/welfare-department" className={linkClass}>
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Social Welfare Dept Portal</span>
          </NavLink>

          <NavLink to="/revenue-department" className={linkClass}>
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>Revenue Dept Portal (XML)</span>
          </NavLink>

          <NavLink to="/middleware-hub" className={linkClass}>
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Interoperability Gateway</span>
          </NavLink>
        </div>

        {/* Official Consolidated Views & MDM */}
        <div className="space-y-1 pt-2 border-t border-slate-800">
          <div className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
            Framework Services
          </div>
          <NavLink to="/consolidated-view" className={linkClass}>
            <UserCheck className="w-4 h-4 text-blue-400" />
            <span>360° Beneficiary View</span>
          </NavLink>

          <NavLink to="/mdm-registry" className={linkClass}>
            <Database className="w-4 h-4 text-purple-400" />
            <span>Master Data Index (MDM)</span>
          </NavLink>

          <NavLink to="/admin" className={linkClass}>
            <Settings className="w-4 h-4" />
            <span>Admin Monitoring</span>
          </NavLink>

          <NavLink to="/docs" className={linkClass}>
            <FileText className="w-4 h-4" />
            <span>OpenAPI / Swagger Specs</span>
          </NavLink>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex justify-between items-center">
        <span>GovConnect Suite v1.0</span>
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
      </div>
    </aside>
  );
};
