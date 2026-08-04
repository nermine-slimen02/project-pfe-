import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-10 shadow">

        <div className="mb-8 text-center">
          <p className="text-base font-semibold uppercase tracking-[0.4em] text-teal-700">
            HelpDesk
          </p>

          <h1 className="mt-6 text-3xl font-semibold text-slate-900">
            Connexion à votre espace
          </h1>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl bg-rose-100 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Email
            </span>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-2xl border px-4 py-3"
              placeholder="adresse@email.com"
              required
            />
          </label>


          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Mot de passe
            </span>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl border px-4 py-3"
              placeholder="••••••••"
              required
            />
          </label>


          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#0E7C86] px-4 py-3 font-semibold text-white"
          >
            {loading ? 'Connexion...' : 'Connexion'}
          </button>

        </form>


        <div className="mt-7 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-semibold text-slate-900">
            Compte administrateur
          </p>

          <ul className="mt-3">
            <li>
              Administrateur : nermineslimen02@gmail.com / nounou@22
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}

export default Login;