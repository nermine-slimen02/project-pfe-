import { MdBarChart, MdPeople, MdTrackChanges, MdWarning } from 'react-icons/md';
import { tickets, notifications } from '../data/mockData';
import TicketCard from '../components/TicketCard';
import StatsCard from '../components/StatsCard';
import KanbanBoard from '../components/KanbanBoard';

const stats = [
  { title: 'Tickets ouverts', value: tickets.length, colorClass: 'bg-teal-100 text-teal-700', icon: <MdBarChart className="h-5 w-5" /> },
  { title: 'Critiques', value: tickets.filter((ticket) => ticket.priority === 'Critique').length, colorClass: 'bg-red-100 text-red-700', icon: <MdWarning className="h-5 w-5" /> },
  { title: 'Techniciens actifs', value: 3, colorClass: 'bg-blue-100 text-blue-700', icon: <MdPeople className="h-5 w-5" /> },
  { title: 'Alertes SLA', value: notifications.length, colorClass: 'bg-amber-100 text-amber-700', icon: <MdTrackChanges className="h-5 w-5" /> },
];

function Dashboard() {
  return (
    <div className="space-y-10">
      <header className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-teal-700">Tableau de bord</p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-900">Vue de supervision</h1>
            <p className="mt-4 max-w-2xl text-slate-600">Suivez les tickets, les SLA et l’activité de votre équipe à partir d’une interface claire et responsive.</p>
          </div>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatsCard key={item.title} title={item.title} value={item.value} icon={item.icon} colorClass={item.colorClass} />
        ))}
      </div>

      <section className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Tickets récents</h2>
            <p className="text-sm text-slate-500">Les tickets les plus urgents et leur statut actuel.</p>
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
        <KanbanBoard />
      </section>
    </div>
  );
}

export default Dashboard;
