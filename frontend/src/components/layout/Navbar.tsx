import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { NavLink, Link } from 'react-router-dom';
import {
  Shield, Bell, LogOut, RefreshCw, Building2, UserCheck,
  Layers, Settings, User, Globe, ChevronDown, Menu, X,
  LayoutDashboard, Briefcase, MessageSquare, Clock,
  Sun, Moon
} from 'lucide-react';
import api from '../../services/api';
import { NotificationItem } from '../../types';
import { useTranslation } from 'react-i18next';

// ── Theme Hook ────────────────────────────────────────────────────────────────
function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem('govconnect_theme') as 'light' | 'dark' | null;
    return stored || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('govconnect_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');
  return { theme, toggleTheme };
}

export const Navbar: React.FC<{ onOpenNotifications?: () => void }> = ({ onOpenNotifications }) => {
  const { user, logout, quickSwitchRole } = useAuth();
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [unreadCount, setUnreadCount] = useState(0);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const roleRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

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

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) setRoleDropdownOpen(false);
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleRoleSelect = async (role: 'CITIZEN' | 'WELFARE_OFFICER' | 'REVENUE_OFFICER' | 'ADMIN', citizenId?: string) => {
    setRoleDropdownOpen(false);
    await quickSwitchRole(role, citizenId);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLangDropdownOpen(false);
  };

  const navLinks = [
    { to: '/dashboard',            label: t('navbar.unifiedGateway', 'Home'),             icon: LayoutDashboard },
    { to: '/services/citizen',     label: t('navbar.citizenServices', 'Citizen Services'), icon: UserCheck },
    { to: '/services/business',    label: t('navbar.business', 'Business'),                icon: Briefcase },
    { to: '/tracking',             label: 'Applications',                                  icon: Clock },
    { to: '/middleware-hub',       label: t('navbar.middleware', 'Middleware'),             icon: Layers },
    { to: '/admin',                label: t('sidebar.adminPanel', 'Admin'),                icon: Settings },
  ];

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
      isActive
        ? 'font-semibold'
        : ''
    }`;

  const navLinkStyle = (isActive: boolean): React.CSSProperties => isActive
    ? { color: 'var(--text)', background: 'var(--surface-3)', border: '1px solid var(--border-2)' }
    : { color: 'var(--text-muted)', background: 'transparent', border: '1px solid transparent' };

  const dropdownBase =
    'absolute right-0 top-full mt-2 gc-glass rounded-xl border border-[var(--border)] shadow-[var(--shadow-lg)] py-1 z-50 overflow-hidden';

  return (
    <>
      {/* Thin top border */}
      <div className="h-px" style={{ background: 'var(--border-2)' }} />

      <header className="gc-navbar sticky top-0 z-40" style={{ borderRadius: 0 }}>
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

          {/* Brand */}
          <Link to="/dashboard" className="flex items-center gap-2.5 shrink-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm"
              style={{ background: 'var(--text)' }}
            >
              <Shield className="" style={{ width: 17, height: 17, color: 'var(--surface)' }} />
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-bold tracking-tight" style={{ color: 'var(--text)' }}>
                GovConnect
              </span>
              <span
                className="ml-2 text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
                style={{
                  color: 'var(--text-muted)',
                  background: 'var(--surface-3)',
                  border: '1px solid var(--border-2)'
                }}
              >
                SIH 2026
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${isActive ? 'font-semibold' : ''}`}
                style={({ isActive }) => navLinkStyle(isActive)}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: 'inherit' }} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-1.5">

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              className="h-8 w-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => { (e.target as HTMLElement).closest('button')!.style.background = 'var(--surface-3)'; (e.target as HTMLElement).closest('button')!.style.color = 'var(--text)'; }}
              onMouseLeave={e => { (e.target as HTMLElement).closest('button')!.style.background = 'transparent'; (e.target as HTMLElement).closest('button')!.style.color = 'var(--text-muted)'; }}
            >
              {theme === 'light'
                ? <Moon className="w-4 h-4" />
                : <Sun className="w-4 h-4" />
              }
            </button>

            {/* Language Switcher */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium transition-colors border border-transparent"
                style={{ color: 'var(--text-muted)' }}
              >
                <Globe className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                <span className="hidden sm:inline uppercase font-bold" style={{ color: 'var(--text)' }}>
                  {i18n.language.slice(0, 2)}
                </span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {langDropdownOpen && (
                <div className={`${dropdownBase} w-52`}>
                  <div className="px-3 py-1.5 gc-section-label border-b border-[var(--border)] mb-1">Language / भाषा</div>
                  {[
                    { code: 'en', name: 'English' },
                    { code: 'hi', name: 'हिंदी (Hindi)' },
                    { code: 'mr', name: 'मराठी (Marathi)' },
                    { code: 'ta', name: 'தமிழ் (Tamil)' },
                    { code: 'te', name: 'తెలుగు (Telugu)' },
                    { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
                    { code: 'ml', name: 'മലയാളം (Malayalam)' },
                  ].map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className="w-full text-left px-3 py-2 text-xs transition-colors"
                      style={{
                        color: i18n.language === lang.code ? 'var(--primary)' : 'var(--text-muted)',
                        fontWeight: i18n.language === lang.code ? '600' : '400',
                        background: i18n.language === lang.code ? 'var(--indigo-bg)' : 'transparent'
                      }}
                      onMouseEnter={e => { if (i18n.language !== lang.code) (e.currentTarget as HTMLElement).style.background = 'var(--surface-3)'; }}
                      onMouseLeave={e => { if (i18n.language !== lang.code) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Role Switcher */}
            <div className="relative" ref={roleRef}>
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >
                <RefreshCw className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                <span className="hidden sm:inline font-bold" style={{ color: 'var(--text)' }}>{user?.role}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {roleDropdownOpen && (
                <div className={`${dropdownBase} w-72`}>
                  <div className="px-3 py-1.5 gc-section-label border-b border-[var(--border)] mb-1">⚡ Switch User Persona</div>
                  {[
                    { role: 'CITIZEN' as const, citizenId: 'CIT-1001', name: 'Ramesh Kumar', desc: 'CIT-1001 · Eligible for Scholarship' },
                    { role: 'CITIZEN' as const, citizenId: 'CIT-1002', name: 'Anita Sharma', desc: 'CIT-1002 · Senior Citizen Pension' },
                    { role: 'CITIZEN' as const, citizenId: 'CIT-1003', name: 'Suresh Patel', desc: 'CIT-1003 · High Income' },
                  ].map(({ role, citizenId, name, desc }) => (
                    <button
                      key={citizenId}
                      onClick={() => handleRoleSelect(role, citizenId)}
                      className="w-full text-left px-3 py-2 transition-colors"
                      style={{ color: 'var(--text)' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--indigo-bg)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                    >
                      <div className="text-xs font-semibold">{name}</div>
                      <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-dim)' }}>{desc}</div>
                    </button>
                  ))}
                  <div className="gc-divider my-1" />
                  {[
                    { role: 'WELFARE_OFFICER' as const, label: 'Dr. Sunita Rao · Welfare Officer' },
                    { role: 'REVENUE_OFFICER' as const, label: 'Rajesh Verma · Revenue Officer' },
                    { role: 'ADMIN' as const, label: 'System Admin · NIC Monitor' },
                  ].map(({ role, label }) => (
                    <button
                      key={role}
                      onClick={() => handleRoleSelect(role)}
                      className="w-full text-left px-3 py-2 text-xs font-medium transition-colors"
                      style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--indigo-bg)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications */}
            {user?.role === 'CITIZEN' && (
              <button
                onClick={onOpenNotifications}
                className="relative h-8 w-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--surface-3)'; (e.currentTarget as HTMLElement).style.color = 'var(--text)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 text-[9px] font-bold rounded-full flex items-center justify-center px-1"
                    style={{ background: 'var(--text)', color: 'var(--surface)' }}>
                    {unreadCount}
                  </span>
                )}
              </button>
            )}

            {/* User + Logout */}
            <div
              className="flex items-center gap-2 pl-2 ml-1"
              style={{ borderLeft: '1px solid var(--border)' }}
            >
              <div className="hidden md:block text-right">
                <div className="text-xs font-semibold leading-tight" style={{ color: 'var(--text)' }}>{user?.name}</div>
                <div className="text-[10px] font-mono" style={{ color: 'var(--text-dim)' }}>{user?.citizenId || user?.email}</div>
              </div>
              <button
                onClick={logout}
                title="Sign out"
                className="h-8 w-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--surface-3)'; (e.currentTarget as HTMLElement).style.color = 'var(--text)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden h-8 w-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--surface-3)'; (e.currentTarget as HTMLElement).style.color = 'var(--text)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden px-4 py-3 space-y-1"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            {navLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'font-semibold' : ''
                  }`
                }
                style={({ isActive }) => ({
                  color: isActive ? 'var(--text)' : 'var(--text-muted)',
                  background: isActive ? 'var(--surface-3)' : 'transparent',
                  border: isActive ? '1px solid var(--border-2)' : '1px solid transparent',
                })}
              >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </header>
    </>
  );
};
