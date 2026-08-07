import { useEffect, useState } from 'react';

function InterventionForm({
  onSubmit,
  loading,
  tickets = [],
  technicians = [],
  initialValues = {},
}) {
  const [form, setForm] = useState({
    ticketId: initialValues.ticketId || tickets[0]?.id || '',
    technicianId: initialValues.technicianId || technicians[0]?.id || '',
    dateDebut: initialValues.dateDebut || new Date().toISOString(),
    rapport: initialValues.rapport || '',
    statut: initialValues.statut || 'EN_ATTENTE',
    tempsPasse: initialValues.tempsPasse || 0,
    actionsRealisees: initialValues.actionsRealisees || '',
  });

  useEffect(() => {
    setForm((current) => ({
      ...current,
      ticketId:
        initialValues.ticketId ||
        tickets[0]?.id ||
        current.ticketId ||
        '',

      technicianId:
        initialValues.technicianId ||
        technicians[0]?.id ||
        current.technicianId ||
        '',
    }));
  }, [
    tickets,
    technicians,
    initialValues.ticketId,
    initialValues.technicianId,
  ]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.ticketId) {
      alert('Veuillez sélectionner un ticket');
      return;
    }

    if (!form.technicianId) {
      alert('Veuillez sélectionner un technicien');
      return;
    }

    const payload = {
      ticketId: form.ticketId,
      technicianId: form.technicianId,
      dateDebut: form.dateDebut || new Date().toISOString(),
      rapport: form.rapport.trim() || undefined,
      statut: form.statut,
      tempsPasse: Number(form.tempsPasse) || 0,
      actionsRealisees: form.actionsRealisees.trim() || undefined,
    };

    console.log('Payload envoyé :', payload);

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Ticket */}
      <label className="block text-sm font-medium text-slate-700">
        <span className="mb-2 block">Ticket</span>

        <select
          name="ticketId"
          value={form.ticketId}
          onChange={handleChange}
          className="w-full rounded-2xl border border-slate-200 px-3 py-2"
        >
          <option value="">Choisir un ticket</option>

          {tickets.map((ticket) => (
            <option key={ticket.id} value={ticket.id}>
              {ticket.title}
            </option>
          ))}

        </select>
      </label>


      {/* Technicien */}
      <label className="block text-sm font-medium text-slate-700">
        <span className="mb-2 block">Technicien</span>

        <select
          name="technicianId"
          value={form.technicianId}
          onChange={handleChange}
          className="w-full rounded-2xl border border-slate-200 px-3 py-2"
        >
          <option value="">Choisir un technicien</option>

          {technicians.map((tech) => (
            <option key={tech.id} value={tech.id}>
              {tech.email}
            </option>
          ))}

        </select>
      </label>


      {/* Rapport */}
      <label className="block text-sm font-medium text-slate-700">
        <span className="mb-2 block">Rapport</span>

        <textarea
          name="rapport"
          value={form.rapport}
          onChange={handleChange}
          rows="3"
          className="w-full rounded-2xl border border-slate-200 px-3 py-2"
        />
      </label>


      {/* Statut + Temps */}
      <div className="grid gap-4 md:grid-cols-2">

        <label className="block text-sm font-medium text-slate-700">
          <span className="mb-2 block">Statut</span>

          <select
            name="statut"
            value={form.statut}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-3 py-2"
          >
            <option value="EN_ATTENTE">EN_ATTENTE</option>
            <option value="EN_COURS">EN_COURS</option>
            <option value="TERMINEE">TERMINEE</option>
          </select>

        </label>


        <label className="block text-sm font-medium text-slate-700">
          <span className="mb-2 block">
            Temps passé (minutes)
          </span>

          <input
            type="number"
            name="tempsPasse"
            min="0"
            value={form.tempsPasse}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-3 py-2"
          />

        </label>

      </div>


      {/* Actions */}
      <label className="block text-sm font-medium text-slate-700">
        <span className="mb-2 block">
          Actions réalisées
        </span>

        <textarea
          name="actionsRealisees"
          value={form.actionsRealisees}
          onChange={handleChange}
          rows="3"
          className="w-full rounded-2xl border border-slate-200 px-3 py-2"
        />

      </label>


      <button
        type="submit"
        disabled={loading}
        className="rounded-2xl bg-[#0E7C86] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading ? 'Enregistrement...' : 'Enregistrer'}
      </button>

    </form>
  );
}

export default InterventionForm;