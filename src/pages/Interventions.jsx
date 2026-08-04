import { tickets } from '../data/mockData';

function Interventions() {
  const assignedTickets = tickets.filter((ticket) => ticket.assignedTo !== 'Non assigné');

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-teal-700">Interventions</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Suivi des interventions</h1>
        <p className="mt-2 text-slate-600">Liste des tickets assignés aux techniciens et état d’avancement.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {assignedTickets.map((ticket) => (
          <div key={ticket.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{ticket.id}</p>
                <h2 className="mt-3 text-xl font-semibold text-slate-900">{ticket.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{ticket.location} • {ticket.assignedTo}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800">{ticket.status}</div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">{ticket.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Interventions;
