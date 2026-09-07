import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { NavLink } from 'react-router-dom';
import { Shield, Bell, LogOut, RefreshCw, Building2, UserCheck, Layers, Settings, User } from 'lucide-react';
import api from '../../services/api';
import { NotificationItem } from '../../types';

export const Navbar: React.FC<{ onOpenNotifications?: () => void }> = ({ onOpenNotifications }) => {
  const { user, logout, quickSwitchRole } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  useEffect(() => {
    if (user && user.role === 'CITIZEN') {
      api.get('/citizen/notifications')
        .then(res => {
          const unread = res.data.notifications?.filter((n: NotificationItem) => !n.read).length || 0;
          setUnreadCount(unread);
        })
        .catch(() => {});
    }
  }, [user]);

  const handleRoleSelect = async (role: 'CITIZEN' | 'WELFARE_OFFICER' | 'REVENUE_OFFICER' | 'ADMIN', citizenId?: string) => {
    setRoleDropdownOpen(false);
    await quickSwitchRole(role, citizenId);
  };

  const navTabClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-1.5 rounded-lg font-bold text-xs flex items-center space-x-1.5 transition-all ${
      isActive
        ? 'bg-blue-600 text-white shadow-md'
        : 'text-slate-300 hover:text-white hover:bg-slate-800'
    }`;

  return (
    <header className="gov-gradient-header border-b border-slate-800 sticky top-0 z-40 px-6 py-2.5 shadow-md flex flex-col md:flex-row items-center justify-between gap-3">
      {/* Brand & Department Switcher Tabs */}
      <div className="flex flex-wrap items-center space-x-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold shadow-inner">
            <Shield className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="text-base font-extrabold tracking-tight text-white">GovConnect</h1>
              <span className="text-[9px] uppercase font-bold tracking-widest bg-blue-900/60 text-blue-300 px-1.5 py-0.5 rounded border border-blue-700/50">
                MVP
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden lg:block">
              Multi-Department Interoperability Suite
            </p>
          </div>
        </div>

        {/* Global Real-Time Department Switcher Tabs */}
        <nav className="flex items-center space-x-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <NavLink to="/dashboard" className={navTabClass}>
            <User className="w-3.5 h-3.5" />
            <span>Citizen Portal</span>
          </NavLink>

          <NavLink to="/revenue-department" className={navTabClass}>
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Revenue Dept</span>
          </NavLink>

          <NavLink to="/welfare-department" className={navTabClass}>
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Social Welfare</span>
          </NavLink>

          <NavLink to="/middleware-hub" className={navTabClass}>
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>Middleware Hub</span>
          </NavLink>

          <NavLink to="/admin" className={navTabClass}>
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <span>Admin</span>
          </NavLink>
        </nav>
      </div>

      <div className="flex items-center space-x-3">
        {/* Persona Quick Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center space-x-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-semibold text-slate-300 hidden sm:inline">Role:</span>
            <span className="font-bold text-blue-400">{user?.role}</span>
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 glass-panel rounded-xl shadow-2xl border border-slate-700 py-2 z-50">
              <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                ⚡ Switch User Persona
              </div>
              <button
                onClick={() => handleRoleSelect('CITIZEN', 'CIT-1001')}
                className="w-full text-left px-3 py-2 text-xs hover:bg-blue-900/40 text-slate-200 flex flex-col"
              >
                <span className="font-semibold text-white">Ramesh Kumar (Citizen)</span>
                <span className="text-[11px] text-slate-400">CIT-1001 (Eligible for Scholarship)</span>
              </button>
              <button
                onClick={() => handleRoleSelect('CITIZEN', 'CIT-1002')}
                className="w-full text-left px-3 py-2 text-xs hover:bg-blue-900/40 text-slate-200 flex flex-col"
              >
                <span className="font-semibold text-white">Anita Sharma (Senior Citizen)</span>
                <span className="text-[11px] text-slate-400">CIT-1002 (Eligible for Pension)</span>
              </button>
              <button
                onClick={() => handleRoleSelect('CITIZEN', 'CIT-1003')}
                className="w-full text-left px-3 py-2 text-xs hover:bg-blue-900/40 text-slate-200 flex flex-col"
              >
                <span className="font-semibold text-white">Suresh Patel (High Income)</span>
                <span className="text-[11px] text-slate-400">CIT-1003 (Ineligible - High Income)</span>
              </button>
              <div className="border-t border-slate-800 my-1"></div>
              <button
                onClick={() => handleRoleSelect('WELFARE_OFFICER')}
                className="w-full text-left px-3 py-2 text-xs hover:bg-blue-900/40 text-slate-200 font-semibold"
              >
                Dr. Sunita Rao (Welfare Officer)
              </button>
              <button
                onClick={() => handleRoleSelect('REVENUE_OFFICER')}
                className="w-full text-left px-3 py-2 text-xs hover:bg-blue-900/40 text-slate-200 font-semibold"
              >
                Rajesh Verma (Revenue Officer)
              </button>
              <button
                onClick={() => handleRoleSelect('ADMIN')}
                className="w-full text-left px-3 py-2 text-xs hover:bg-blue-900/40 text-slate-200 font-semibold"
              >
                System Admin (NIC Monitor)
              </button>
            </div>
          )}
        </div>

        {/* Notifications Icon */}
        {user?.role === 'CITIZEN' && (
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
        )}

        {/* User Profile & Logout */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
          <div className="text-right hidden md:block">
            <div className="text-xs font-bold text-slate-200">{user?.name}</div>
            <div className="text-[10px] text-slate-400 font-mono">{user?.citizenId || user?.email}</div>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-lg bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 border border-rose-800/40 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
