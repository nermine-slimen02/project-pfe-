import { statuses, tickets } from '../data/mockData';

function KanbanBoard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-3">
        {Object.keys(statuses).map((statusKey) => (
          <div key={statusKey} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{statusKey}</h3>
              <span className="text-xs text-slate-500">{tickets.filter((ticket) => ticket.status === statusKey).length}</span>
            </div>
            <div className="space-y-4">
              {tickets
                .filter((ticket) => ticket.status === statusKey)
                .map((ticket) => (
                  <div key={ticket.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <p className="text-sm font-semibold text-slate-900">{ticket.title}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.12em] text-slate-500">{ticket.priority}</p>
                    <p className="mt-3 text-sm text-slate-600">{ticket.requester}</p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default KanbanBoard;
