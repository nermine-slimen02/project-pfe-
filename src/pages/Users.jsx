import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUsers } from '../services/helpdesk';

function Users() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getUsers(token);
        setUsers(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Impossible de charger les utilisateurs.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [token]);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-teal-700">Utilisateurs</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Gestion des comptes</h1>
        <p className="mt-2 text-slate-600">Consultez les comptes utilisateurs disponibles depuis l’API backend.</p>
      </div>

      {error && <div className="rounded-2xl bg-rose-100 p-4 text-sm text-rose-700">{error}</div>}

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600">Chargement…</div>
      ) : (
        <div className="grid gap-4">
          {users.map((user) => (
            <div key={user.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-semibold text-slate-900">{user.email}</p>
                  <p className="mt-1 text-sm text-slate-600">Rôle : {user.role}</p>
                </div>
                <span className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
                  {user.id}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Users;
