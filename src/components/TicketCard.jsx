import Badge from './Badge';
import SLARing from './SLARing';
import { priorities, priorityMap, statusMap, statuses } from '../data/mockData';

function TicketCard({ ticket }) {
  const normalizedPriority = (ticket.priority || '').toUpperCase();
  const normalizedStatus = (ticket.status || '').toUpperCase();
  const priorityLabel = priorityMap[normalizedPriority] || ticket.priority || 'Normale';
  const statusLabel = statusMap[normalizedStatus] || ticket.status || 'Nouveau';
  const priority = priorities[priorityLabel];
  const status = statuses[statusLabel];

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className={`absolute inset-y-0 left-0 w-2 ${priority.border}`} />
      <div className="relative flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{ticket.category}</span>
            <Badge label={priority.label} variant={priority.badge} />
            <Badge label={status.label} variant={status.badge} />
          </div>
          <h3 className="text-xl font-semibold text-slate-900">{ticket.title}</h3>
          <p className="text-sm leading-6 text-slate-600">{ticket.description}</p>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl bg-slate-50 p-3 text-sm text-slate-700">
              <span className="block text-xs uppercase tracking-[0.16em] text-slate-400">Demandeur</span>
              {ticket.user?.email || ticket.requester || 'N/A'}
            </div>
            <div className="rounded-3xl bg-slate-50 p-3 text-sm text-slate-700">
              <span className="block text-xs uppercase tracking-[0.16em] text-slate-400">Assigné à</span>
              {ticket.assignedTo?.email || ticket.assignedTo || 'Non assigné'}
            </div>
            <div className="rounded-3xl bg-slate-50 p-3 text-sm text-slate-700">
              <span className="block text-xs uppercase tracking-[0.16em] text-slate-400">Localisation</span>
              {ticket.location || 'Non renseignée'}</div>
            <div className="rounded-3xl bg-slate-50 p-3 text-sm text-slate-700">
              <span className="block text-xs uppercase tracking-[0.16em] text-slate-400">Créé le</span>
              {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'N/A'}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <SLARing remainingHours={Math.max(0, ticket.slaRemaining ?? 24)} />
        </div>
      </div>
      <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 text-sm text-slate-600">
        <span className="font-semibold">ID : </span>
        <span className="font-mono text-slate-900">{ticket.id}</span>
      </div>
    </article>
  );
}

export default TicketCard;
