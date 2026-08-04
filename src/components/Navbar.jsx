import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { MdMenu, MdLogout, MdDashboard, MdConfirmationNumber, MdBuild, MdComment, MdNotifications, MdHistory } from 'react-icons/md';
import { useAuth } from '../contexts/AuthContext';

const mobileLinks = [
  { name: 'Dashboard', to: '/dashboard', icon: MdDashboard, roles: ['Demandeur', 'Technicien', 'Superviseur', 'Administrateur'] },
  { name: 'Tickets', to: '/tickets', icon: MdConfirmationNumber, roles: ['Demandeur', 'Technicien', 'Superviseur', 'Administrateur'] },
  { name: 'Interventions', to: '/interventions', icon: MdBuild, roles: ['Technicien', 'Superviseur', 'Administrateur'] },
  { name: 'Commentaires', to: '/comments', icon: MdComment, roles: ['Technicien', 'Superviseur', 'Administrateur'] },
  { name: 'Notifications', to: '/notifications', icon: MdNotifications, roles: ['Superviseur', 'Administrateur'] },
  { name: 'Audit Log', to: '/audit-logs', icon: MdHistory, roles: ['Superviseur', 'Administrateur'] },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, selectedRole, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 md:hidden"
            onClick={() => setMenuOpen((value) => !value)}
          >
            <MdMenu className="h-6 w-6" />
          </button>
          <div>
            <p className="text-sm font-semibold text-slate-900">HelpDesk</p>
            <p className="text-xs text-slate-500">Administre votre support et vos interventions</p>
          </div>
        </div>

        <div className="hidden items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 md:flex">
          <div>
            <p className="text-sm font-semibold text-slate-900">{user?.email || 'Utilisateur'}</p>
            <p className="text-xs text-slate-500">{selectedRole || user?.role || 'Rôle indisponible'}</p>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-3xl bg-[#0E7C86] px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
          onClick={handleLogout}
        >
          <MdLogout className="h-5 w-5" />
          Logout
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-4 md:hidden">
          <div className="mb-4 rounded-3xl bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Rôle actif</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">{selectedRole}</p>
          </div>
          <nav className="space-y-2">
            {mobileLinks
              .filter((item) => item.roles.includes(selectedRole))
              .map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                        isActive ? 'bg-[#0E7C86] text-white' : 'text-slate-700 hover:bg-slate-200'
                      }`
                    }
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </NavLink>
                );
              })}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
