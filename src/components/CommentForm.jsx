import { useState } from 'react';

function CommentForm({ onSubmit, loading, initialValues = {} }) {
  const [form, setForm] = useState({
    content: initialValues.content || '',
    type: initialValues.type || 'PUBLIC',
  });

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
      <label className="block text-sm font-medium text-slate-700">
        <span className="mb-2 block">Commentaire</span>
        <textarea name="content" value={form.content} onChange={handleChange} rows="4" required className="w-full rounded-2xl border border-slate-200 px-3 py-2" />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        <span className="mb-2 block">Type</span>
        <select name="type" value={form.type} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 px-3 py-2">
          <option value="PUBLIC">PUBLIC</option>
          <option value="PRIVATE">PRIVATE</option>
          <option value="INTERNAL">INTERNAL</option>
        </select>
      </label>
      <button type="submit" disabled={loading} className="rounded-2xl bg-[#0E7C86] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
        {loading ? 'Envoi...' : 'Ajouter'}
      </button>
    </form>
  );
}

export default CommentForm;
