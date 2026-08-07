import { useMemo, useState } from 'react';

function TicketForm({ onSubmit, loading, initialValues = {}, users = [] }) {
  const [form, setForm] = useState({
    title: initialValues.title || '',
    description: initialValues.description || '',
    status: initialValues.status || 'OPEN',
    priority: initialValues.priority || 'MEDIUM',
    userId: initialValues.userId || users[0]?.id || '',
  });

  const statusOptions = useMemo(() => ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'], []);
  const priorityOptions = useMemo(() => ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          <span className="mb-2 block">Titre</span>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full rounded-2xl border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          <span className="mb-2 block">Demandeur</span>
          <select name="userId" value={form.userId} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 px-3 py-2">
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.email}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        <span className="mb-2 block">Description</span>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          rows="4"
          className="w-full rounded-2xl border border-slate-200 px-3 py-2"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          <span className="mb-2 block">Statut</span>
          <select name="status" value={form.status} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 px-3 py-2">
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-slate-700">
          <span className="mb-2 block">Priorité</span>
          <select name="priority" value={form.priority} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 px-3 py-2">
            {priorityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button type="submit" disabled={loading} className="rounded-2xl bg-[#0E7C86] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
        {loading ? 'Enregistrement...' : 'Enregistrer'}
      </button>
    </form>
  );
}

export default TicketForm;
