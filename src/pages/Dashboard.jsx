import { useEffect, useMemo, useState } from 'react';
import { MdBarChart, MdPeople, MdTrackChanges, MdWarning } from 'react-icons/md';
import TicketCard from '../components/TicketCard';
import StatsCard from '../components/StatsCard';
import KanbanBoard from '../components/KanbanBoard';
import { useAuth } from '../contexts/AuthContext';
import { getInterventions, getNotifications, getTickets, getUsers } from '../services/helpdesk';

function Dashboard() {
  const { token, user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const [ticketsData, notificationsData, interventionsData, usersData] = await Promise.all([
          getTickets(token),
          user?.id ? getNotifications(token, user.id) : Promise.resolve([]),
          getInterventions(token),
          getUsers(token),
        ]);
        setTickets(ticketsData);
        setNotifications(notificationsData);
        setInterventions(interventionsData);
        setUsers(usersData);
      } catch (err) {
        setError(err.response?.data?.message || 'Impossible de charger le tableau de bord.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, user?.id]);

  const stats = useMemo(() => [
    { title: 'Tickets total', value: tickets.length, colorClass: 'bg-teal-100 text-teal-700', icon: <MdBarChart className="h-5 w-5" /> },
    { title: 'Tickets ouverts', value: tickets.filter((ticket) => ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED').length, colorClass: 'bg-red-100 text-red-700', icon: <MdWarning className="h-5 w-5" /> },
    { title: 'Tickets résolus', value: tickets.filter((ticket) => ticket.status === 'RESOLVED' || ticket.status === 'CLOSED').length, colorClass: 'bg-blue-100 text-blue-700', icon: <MdPeople className="h-5 w-5" /> },
    { title: 'Interventions', value: interventions.length, colorClass: 'bg-amber-100 text-amber-700', icon: <MdTrackChanges className="h-5 w-5" /> },
    { title: 'Utilisateurs', value: users.length, colorClass: 'bg-violet-100 text-violet-700', icon: <MdPeople className="h-5 w-5" /> },
  ], [tickets, interventions, users]);

  if (loading) {
    return <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600">Chargement du tableau de bord…</div>;
  }

  return (
    <div className="space-y-10">
      <header className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-teal-700">Tableau de bord</p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-900">Vue de supervision</h1>
            <p className="mt-4 max-w-2xl text-slate-600">Suivez les tickets, interventions et notifications à partir des données backend en temps réel.</p>
          </div>
        </div>
      </header>

      {error && <div className="rounded-2xl bg-rose-100 p-4 text-sm text-rose-700">{error}</div>}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {stats.map((item) => (
          <StatsCard key={item.title} title={item.title} value={item.value} icon={item.icon} colorClass={item.colorClass} />
        ))}
      </div>

      <section className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Tickets récents</h2>
            <p className="text-sm text-slate-500">Les tickets les plus récents récupérés depuis l’API.</p>
          </div>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {tickets.slice(0, 2).map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Vue Kanban</h2>
            <p className="text-sm text-slate-500">Organisation des tickets par statut pour une supervision rapide.</p>
          </div>
        </div>
        <KanbanBoard tickets={tickets} />
      </section>
    </div>
  );
}

export default Dashboard;
