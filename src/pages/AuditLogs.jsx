import { auditLogs } from '../data/mockData';

function AuditLogs() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-teal-700">Audit Log</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Journal des actions</h1>
        <p className="mt-2 text-slate-600">Historique des opérations et modifications réalisées sur la plateforme.</p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-4 text-left font-semibold uppercase tracking-[0.18em]">Événement</th>
              <th className="px-6 py-4 text-left font-semibold uppercase tracking-[0.18em]">Acteur</th>
              <th className="px-6 py-4 text-left font-semibold uppercase tracking-[0.18em]">Cible</th>
              <th className="px-6 py-4 text-left font-semibold uppercase tracking-[0.18em]">Heure</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">{log.event}</td>
                <td className="px-6 py-4">{log.actor}</td>
                <td className="px-6 py-4">{log.target}</td>
                <td className="px-6 py-4">{log.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AuditLogs;
