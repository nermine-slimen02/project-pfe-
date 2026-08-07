import { useEffect, useState } from 'react';
import InterventionForm from '../components/InterventionForm';
import { useAuth } from '../contexts/AuthContext';
import { createIntervention, deleteIntervention, finishIntervention, getInterventions, getTickets, getUsers, startIntervention } from '../services/helpdesk';

function Interventions() {
  const { token } = useAuth();
  const [interventions, setInterventions] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [interventionsData, ticketsData, usersData] = await Promise.all([getInterventions(token), getTickets(token), getUsers(token)]);
      setInterventions(interventionsData);
      setTickets(ticketsData);
      setTechnicians(usersData.filter((user) => user.role === 'TECHNICIAN' || user.role === 'ADMIN' || user.role === 'SUPERVISOR'));
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de charger les interventions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const handleCreate = async (payload) => {
    try {
      setSubmitting(true);
      setError('');
      const created = await createIntervention(token, payload);
      setInterventions((current) => [created, ...current]);
    } catch (err) {
      setError(err.response?.data?.message || 'Création impossible.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      setError('');
      if (action === 'start') {
        const updated = await startIntervention(token, id);
        setInterventions((current) => current.map((item) => (item.id === id ? updated : item)));
      } else if (action === 'finish') {
        const updated = await finishIntervention(token, id);
        setInterventions((current) => current.map((item) => (item.id === id ? updated : item)));
      } else if (action === 'delete') {
        await deleteIntervention(token, id);
        setInterventions((current) => current.filter((item) => item.id !== id));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Action impossible.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-teal-700">Interventions</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Suivi des interventions</h1>
        <p className="mt-2 text-slate-600">Créez et gérez les interventions liées aux tickets.</p>
      </div>

      {error && <div className="rounded-2xl bg-rose-100 p-4 text-sm text-rose-700">{error}</div>}

      <InterventionForm onSubmit={handleCreate} loading={submitting} tickets={tickets} technicians={technicians} />

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600">Chargement…</div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {interventions.map((intervention) => (
            <div key={intervention.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{intervention.ticketId}</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">Intervention #{intervention.id.slice(0, 8)}</h2>
                </div>
                <div className="rounded-3xl bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800">{intervention.statut}</div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">{intervention.rapport || 'Aucun rapport renseigné.'}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button type="button" onClick={() => handleAction(intervention.id, 'start')} className="rounded-2xl bg-amber-600 px-3 py-2 text-sm font-semibold text-white">Démarrer</button>
                <button type="button" onClick={() => handleAction(intervention.id, 'finish')} className="rounded-2xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white">Terminer</button>
                <button type="button" onClick={() => handleAction(intervention.id, 'delete')} className="rounded-2xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white">Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Interventions;
