import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard, ShieldCheck, UserCheck, Building2,
  Settings, FileText, Clock, Layers, Database, Activity,
  BookOpen, Zap, Users
} from 'lucide-react';

interface NavGroup {
  label: string;
  items: { to: string; icon: React.ElementType; label: string; accent?: string }[];
}

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `gc-sidebar-link${isActive ? ' active' : ''}`;

  const navGroups: NavGroup[] = [
    {
      label: t('sidebar.unifiedPortalTitle', 'Unified Portal'),
      items: [
        { to: '/dashboard',  icon: LayoutDashboard, label: t('sidebar.unifiedDashboard', 'Unified Dashboard') },
        { to: '/tracking',   icon: Clock,            label: t('sidebar.myApplications', 'My Applications') },
        { to: '/consent',    icon: ShieldCheck,      label: t('sidebar.consentManager', 'Consent Manager') },
      ],
    },
    {
      label: t('sidebar.govDepartments', 'Departments'),
      items: [
        { to: '/services/citizen',     icon: UserCheck,  label: t('sidebar.citizenServices', 'Citizen Services') },
        { to: '/services/business',    icon: Building2,  label: t('sidebar.businessServices', 'Business & Industry') },
        { to: '/welfare-department',   icon: ShieldCheck,label: t('sidebar.welfareDeptPortal', 'Social Welfare') },
        { to: '/revenue-department',   icon: Database,   label: t('sidebar.revenueDeptPortal', 'Revenue Dept') },
        { to: '/middleware-hub',       icon: Layers,     label: t('sidebar.interoperability', 'Interoperability Hub') },
      ],
    },
    {
      label: t('sidebar.frameworkServices', 'Framework'),
      items: [
        { to: '/consolidated-view',        icon: Users,     label: t('sidebar.consolidatedView', '360° Beneficiary View') },
        { to: '/mdm-registry',             icon: BookOpen,  label: t('sidebar.mdmRegistry', 'MDM Registry') },
        { to: '/interoperability-monitor', icon: Activity,  label: t('sidebar.systemMonitor', 'System Monitor') },
        { to: '/admin',                    icon: Settings,  label: t('sidebar.adminPanel', 'Admin Panel') },
        { to: '/docs',                     icon: FileText,  label: t('sidebar.apiDocs', 'API Docs') },
      ],
    },
  ];

  return (
    <aside
      className="gc-sidebar w-60 shrink-0 flex flex-col min-h-[calc(100vh-59px)]"
    >
      <div className="flex-1 p-3 space-y-5 overflow-y-auto">

        {/* Middleware Hub Banner */}
        <div
          className="rounded-xl p-3"
          style={{
            border: '1px solid var(--indigo-border)',
            background: 'var(--indigo-bg)'
          }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ background: 'var(--indigo-bg)', border: '1px solid var(--indigo-border)' }}
            >
              <Zap className="w-3.5 h-3.5" style={{ color: 'var(--primary)' }} />
            </div>
            <span className="text-xs font-bold" style={{ color: 'var(--primary)' }}>Live Gateway</span>
          </div>
          <p className="text-[11px] leading-relaxed mb-2.5" style={{ color: 'var(--text-muted)' }}>
            Real-time XML data exchange between Revenue & Welfare departments.
          </p>
          <NavLink
            to="/middleware-hub"
            className="block text-center text-[11px] font-bold py-1.5 px-2 rounded-lg text-white transition-opacity hover:opacity-90"
            style={{ background: 'var(--grad-primary)' }}
          >
            Open Middleware Hub
          </NavLink>
        </div>

        {/* Nav Groups */}
        {navGroups.map(group => (
          <div key={group.label} className="space-y-0.5">
            <div className="gc-section-label px-3 mb-2">{group.label}</div>
            {group.items.map(({ to, icon: Icon, label, accent }) => (
              <NavLink key={to} to={to} className={linkClass}>
                <Icon
                  className="w-4 h-4 shrink-0"
                  style={{ color: accent || 'var(--primary)' }}
                />
                <span className="truncate">{label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between text-[10px]" style={{ color: 'var(--text-dim)' }}>
          <span>GovConnect Suite v1.0</span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--success)' }} />
            Online
          </span>
        </div>
      </div>
    </aside>
  );
};
