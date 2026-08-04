import { NavLink, useNavigate } from 'react-router-dom';
import {
  MdDashboard,
  MdConfirmationNumber,
  MdBuild,
  MdComment,
  MdNotifications,
  MdHistory,
  MdLogout,
} from 'react-icons/md';
import { useAuth } from '../contexts/AuthContext';

const links = [
  { name: 'Dashboard', to: '/dashboard', icon: MdDashboard, roles: ['Demandeur', 'Technicien', 'Superviseur', 'Administrateur'] },
  { name: 'Tickets', to: '/tickets', icon: MdConfirmationNumber, roles: ['Demandeur', 'Technicien', 'Superviseur', 'Administrateur'] },
  { name: 'Interventions', to: '/interventions', icon: MdBuild, roles: ['Technicien', 'Superviseur', 'Administrateur'] },
  { name: 'Commentaires', to: '/comments', icon: MdComment, roles: ['Technicien', 'Superviseur', 'Administrateur'] },
  { name: 'Notifications', to: '/notifications', icon: MdNotifications, roles: ['Superviseur', 'Administrateur'] },
  { name: 'Audit Log', to: '/audit-logs', icon: MdHistory, roles: ['Superviseur', 'Administrateur'] },
];

function Sidebar() {
  const navigate = useNavigate();
  const { user, selectedRole, switchRole, availableRoles, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="hidden md:flex md:w-80 flex-col bg-[#10151C] text-slate-100 shadow-xl">
      <div className="px-6 py-8 border-b border-slate-800">
        <h1 className="text-3xl font-semibold tracking-tight text-white">HelpDesk</h1>
        <p className="mt-2 text-sm text-slate-400">Gestion des tickets & interventions</p>
        <div className="mt-6 rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-300">
          <p className="font-semibold text-slate-200">Rôle actif</p>
          <select
            className="mt-3 w-full rounded-2xl border border-slate-700 bg-[#10151C] px-3 py-2 text-sm text-slate-200 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            value={selectedRole}
            onChange={(event) => switchRole(event.target.value)}
          >
            {availableRoles.map((role) => (
              <option className="bg-slate-950 text-slate-100" key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      <nav className="flex-1 px-6 py-6 space-y-2">
        {links
          .filter((item) => item.roles.includes(selectedRole))
          .map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                    isActive ? 'bg-[#0E7C86] text-white shadow-lg' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </NavLink>
            );
          })}
      </nav>

      <div className="px-6 py-5 border-t border-slate-800">
        <div className="mb-4 rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-300">
          <p className="font-semibold text-slate-200">Connecté en tant que</p>
          <p className="mt-1 text-sm text-slate-400">{user?.name || 'Invité'}</p>
          <p className="text-xs text-slate-500">{user?.role || 'Rôle inconnu'}</p>
        </div>
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-3xl bg-[#0E7C86] px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
          onClick={handleLogout}
        >
          <MdLogout className="h-5 w-5" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
