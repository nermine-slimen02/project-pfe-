import { useEffect, useState } from 'react';
import CommentForm from '../components/CommentForm';
import { useAuth } from '../contexts/AuthContext';
import { createComment, getCommentsByTicket, getTickets } from '../services/helpdesk';

function Comments() {
  const { token, user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [comments, setComments] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const ticketsData = await getTickets(token);
      setTickets(ticketsData);
      if (ticketsData[0]) {
        setSelectedTicketId(ticketsData[0].id);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de charger les tickets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  useEffect(() => {
    const fetchComments = async () => {
      if (!selectedTicketId || !token) return;
      try {
        const data = await getCommentsByTicket(token, selectedTicketId);
        setComments(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Impossible de charger les commentaires.');
      }
    };

    fetchComments();
  }, [selectedTicketId, token]);

  const handleAddComment = async (payload) => {
    try {
      setSubmitting(true);
      setError('');
      const created = await createComment(token, {
        ...payload,
        ticketId: selectedTicketId,
        userId: user.id,
      });
      setComments((current) => [created, ...current]);
    } catch (err) {
      setError(err.response?.data?.message || 'Ajout impossible.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-teal-700">Commentaires</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Échanges publics et notes internes</h1>
        <p className="mt-2 text-slate-600">Consultez et ajoutez des commentaires liés aux tickets.</p>
      </div>

      {error && <div className="rounded-2xl bg-rose-100 p-4 text-sm text-rose-700">{error}</div>}

      <label className="block text-sm font-medium text-slate-700">
        <span className="mb-2 block">Ticket</span>
        <select value={selectedTicketId} onChange={(event) => setSelectedTicketId(event.target.value)} className="w-full rounded-2xl border border-slate-200 px-3 py-2">
          {tickets.map((ticket) => (
            <option key={ticket.id} value={ticket.id}>
              {ticket.title}
            </option>
          ))}
        </select>
      </label>

      <CommentForm onSubmit={handleAddComment} loading={submitting} />

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600">Chargement…</div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{comment.user?.email || 'Utilisateur'}</p>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{comment.type} • Ticket {comment.ticketId}</p>
                </div>
                <span className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Comments;
