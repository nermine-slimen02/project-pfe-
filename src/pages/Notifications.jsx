import { notifications } from '../data/mockData';

function Notifications() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-teal-700">Notifications</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Flux d’alertes</h1>
        <p className="mt-2 text-slate-600">Revue des événements récents et alertes SLA de la plateforme.</p>
      </div>

      <div className="space-y-4">
        {notifications.map((item) => (
          <div key={item.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-base font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm text-slate-600">{item.message}</p>
              </div>
              <span className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
