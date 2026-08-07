function KanbanBoard({ tickets = [] }) {
  const columns = [
    { key: 'OPEN', label: 'Nouveau' },
    { key: 'IN_PROGRESS', label: 'En cours' },
    { key: 'RESOLVED', label: 'Résolu' },
    { key: 'CLOSED', label: 'Fermé' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-4">
        {columns.map((column) => (
          <div key={column.key} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{column.label}</h3>
              <span className="text-xs text-slate-500">{tickets.filter((ticket) => (ticket.status || '').toUpperCase() === column.key).length}</span>
            </div>
            <div className="space-y-4">
              {tickets
                .filter((ticket) => (ticket.status || '').toUpperCase() === column.key)
                .map((ticket) => (
                  <div key={ticket.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <p className="text-sm font-semibold text-slate-900">{ticket.title}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.12em] text-slate-500">{ticket.priority}</p>
                    <p className="mt-3 text-sm text-slate-600">{ticket.description}</p>
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
