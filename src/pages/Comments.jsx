import { comments } from '../data/mockData';

function Comments() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-teal-700">Commentaires</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Échanges publics et notes internes</h1>
        <p className="mt-2 text-slate-600">Revoyez les derniers commentaires liés aux tickets de support.</p>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">{comment.author}</p>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{comment.role} • Ticket {comment.ticketId}</p>
              </div>
              <span className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{comment.date}</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Comments;
