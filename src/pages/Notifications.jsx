import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getNotifications, markNotificationAsRead } from '../services/helpdesk';

function Notifications() {
  const { token, user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotifications = async () => {
    if (!token || !user?.id) return;
    try {
      setLoading(true);
      const data = await getNotifications(token, user.id);
      setNotifications(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de charger les notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [token, user?.id]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      const updated = await markNotificationAsRead(token, notificationId);
      setNotifications((current) => current.map((item) => (item.id === notificationId ? updated : item)));
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de marquer la notification comme lue.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-teal-700">Notifications</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Flux d’alertes</h1>
        <p className="mt-2 text-slate-600">Consultez vos notifications et marquez-les comme lues.</p>
      </div>

      {error && <div className="rounded-2xl bg-rose-100 p-4 text-sm text-rose-700">{error}</div>}

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600">Chargement…</div>
      ) : (
        <div className="space-y-4">
          {notifications.map((item) => (
            <div key={item.id} className={`rounded-3xl border p-6 shadow-sm ${item.isRead ? 'border-slate-200 bg-white' : 'border-teal-200 bg-teal-50'}`}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-base font-semibold text-slate-900">{item.message}</p>
                  <p className="mt-1 text-sm text-slate-600">Type : {item.type}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                  {!item.isRead && (
                    <button type="button" onClick={() => handleMarkAsRead(item.id)} className="rounded-2xl bg-[#0E7C86] px-3 py-2 text-sm font-semibold text-white">
                      Marquer comme lue
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;
