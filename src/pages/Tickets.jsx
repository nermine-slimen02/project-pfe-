import { useEffect, useState } from 'react';
import TicketCard from '../components/TicketCard';
import TicketForm from '../components/TicketForm';
import { useAuth } from '../contexts/AuthContext';
import { createTicket, deleteTicket, getTickets, updateTicket, getUsers } from '../services/helpdesk';

function Tickets() {
  const { token } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ticketsData, usersData] = await Promise.all([getTickets(token), getUsers(token)]);
      setTickets(ticketsData);
      setUsers(usersData);
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de charger les tickets.');
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
      const created = await createTicket(token, payload);
      setTickets((current) => [created, ...current]);
      setSelectedTicketId(created.id);
    } catch (err) {
      setError(err.response?.data?.message || 'Création impossible.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (ticketId, payload) => {
    try {
      setSubmitting(true);
      setError('');
      const updated = await updateTicket(token, ticketId, payload);
      setTickets((current) => current.map((ticket) => (ticket.id === ticketId ? updated : ticket)));
      setSelectedTicketId(ticketId);
    } catch (err) {
      setError(err.response?.data?.message || 'Mise à jour impossible.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (ticketId) => {
    try {
      await deleteTicket(token, ticketId);
      setTickets((current) => current.filter((ticket) => ticket.id !== ticketId));
      if (selectedTicketId === ticketId) {
        setSelectedTicketId(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Suppression impossible.');
    }
  };

  const selectedTicket = tickets.find((ticket) => ticket.id === selectedTicketId) || null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-teal-700">Tickets</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Gestion des tickets</h1>
          <p className="mt-2 text-slate-600">Consultez, créez et gérez les tickets depuis l’API backend.</p>
        </div>
        <div className="rounded-3xl bg-slate-50 px-5 py-3 text-sm text-slate-700 shadow-sm">
          {tickets.length} tickets actifs
        </div>
      </div>

      {error && <div className="rounded-2xl bg-rose-100 p-4 text-sm text-rose-700">{error}</div>}

      <TicketForm onSubmit={handleCreate} loading={submitting} users={users} />

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600">Chargement…</div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <button type="button" onClick={() => setSelectedTicketId(ticket.id)} className="w-full text-left">
                  <TicketCard ticket={ticket} />
                </button>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button type="button" onClick={() => handleUpdate(ticket.id, { status: 'IN_PROGRESS' })} className="rounded-2xl bg-amber-500 px-3 py-2 text-sm font-semibold text-white">Marquer en cours</button>
                  <button type="button" onClick={() => handleUpdate(ticket.id, { status: 'RESOLVED' })} className="rounded-2xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white">Résoudre</button>
                  <button type="button" onClick={() => handleDelete(ticket.id)} className="rounded-2xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white">Supprimer</button>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Détail du ticket</h2>
            {selectedTicket ? (
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p><span className="font-semibold text-slate-900">Titre :</span> {selectedTicket.title}</p>
                <p><span className="font-semibold text-slate-900">Description :</span> {selectedTicket.description}</p>
                <p><span className="font-semibold text-slate-900">Statut :</span> {selectedTicket.status}</p>
                <p><span className="font-semibold text-slate-900">Priorité :</span> {selectedTicket.priority}</p>
                <p><span className="font-semibold text-slate-900">Créé le :</span> {new Date(selectedTicket.createdAt).toLocaleString()}</p>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">Sélectionnez un ticket pour voir ses détails.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Tickets;
