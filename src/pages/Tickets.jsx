import TicketCard from '../components/TicketCard';
import { tickets } from '../data/mockData';

function Tickets() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-teal-700">Tickets</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Gestion des tickets</h1>
          <p className="mt-2 text-slate-600">Consultez les tickets ouverts, leur priorité et le statut SLA.</p>
        </div>
        <div className="rounded-3xl bg-slate-50 px-5 py-3 text-sm text-slate-700 shadow-sm">
          {tickets.length} tickets actifs
        </div>
      </div>

      <div className="space-y-6">
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
  );
}

export default Tickets;
