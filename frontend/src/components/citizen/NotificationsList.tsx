import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { NotificationItem } from '../../types';
import { Bell, Check, X, CheckCircle2, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

const typeConfig = {
  SUCCESS: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/5 border-emerald-500/20' },
  INFO:    { icon: Info,          color: 'text-sky-400',     bg: 'bg-sky-500/5 border-sky-500/20' },
  WARNING: { icon: AlertTriangle, color: 'text-amber-400',   bg: 'bg-amber-500/5 border-amber-500/20' },
  ERROR:   { icon: AlertCircle,   color: 'text-rose-400',    bg: 'bg-rose-500/5 border-rose-500/20' },
};

export const NotificationsList: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/citizen/notifications');
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markRead = async (id: string) => {
    try {
      await api.put(`/citizen/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end"
      style={{ background: 'rgba(6,11,20,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="h-full w-full max-w-sm border-l border-[var(--color-border)] flex flex-col shadow-2xl"
        style={{ background: 'var(--color-surface)', marginTop: '56px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)] shrink-0">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="gc-badge gc-badge-primary">
                {notifications.filter(n => !n.read).length} new
              </span>
            )}
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {loading ? (
            <div className="space-y-2 p-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="gc-skeleton h-16 rounded-xl" />
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <EmptyState icon={Bell} title="All clear!" description="No notifications at the moment." />
          ) : (
            notifications.map(n => {
              const cfg = typeConfig[n.type] || typeConfig.INFO;
              const TypeIcon = cfg.icon;
              return (
                <div key={n._id}
                  className={`p-3.5 rounded-xl border transition-opacity ${n.read ? 'opacity-60' : ''} ${cfg.bg}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <TypeIcon className={`w-4 h-4 mt-0.5 shrink-0 ${cfg.color}`} />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white truncate">{n.title}</div>
                        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                        <div className="text-[10px] text-slate-600 mt-1.5 font-mono">
                          {new Date(n.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    {!n.read && (
                      <button onClick={() => markRead(n._id)}
                        className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                        title="Mark as read">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
