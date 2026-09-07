import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { NotificationItem } from '../../types';
import { Bell, Check, X, Info, CheckCircle2, AlertTriangle } from 'lucide-react';

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

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markRead = async (id: string) => {
    try {
      await api.put(`/citizen/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/70 backdrop-blur-xs p-4">
      <div className="glass-panel w-full max-w-md h-full max-h-[600px] rounded-2xl border border-slate-700 p-5 space-y-4 shadow-2xl flex flex-col justify-between">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2 text-blue-400">
            <Bell className="w-5 h-5" />
            <h3 className="text-sm font-extrabold text-white">Notifications & Alerts</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs font-mono">
              No notifications yet.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                  n.read
                    ? 'bg-slate-900/40 border-slate-800 text-slate-400'
                    : 'bg-blue-950/40 border-blue-800/60 text-slate-200 shadow'
                }`}
              >
                <div className="flex justify-between items-center font-bold">
                  <span className="text-white flex items-center">
                    {n.type === 'SUCCESS' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />}
                    {n.title}
                  </span>
                  {!n.read && (
                    <button
                      onClick={() => markRead(n._id)}
                      className="text-[10px] text-blue-400 hover:underline flex items-center"
                    >
                      <Check className="w-3 h-3 mr-0.5" /> Mark Read
                    </button>
                  )}
                </div>
                <p className="text-[11px] leading-relaxed">{n.message}</p>
                <div className="text-[10px] text-slate-500 text-right font-mono">
                  {new Date(n.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
