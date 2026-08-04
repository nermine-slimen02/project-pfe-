import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { availableRoles } from '../data/mockData';
import { login as loginApi } from '../services/auth';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('access_token'));

  const [selectedRole, setSelectedRole] = useState(() => {
    const saved = localStorage.getItem('selected_role');
    if (saved) return saved;
    if (user?.role) return user.role;
    return availableRoles[0];
  });

  useEffect(() => {
    if (selectedRole) {
      localStorage.setItem('selected_role', selectedRole);
    }
  }, [selectedRole]);

  const login = async (email, password) => {
  const response = await loginApi(email, password);

    const { access_token, user: loggedUser } = response;

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('user', JSON.stringify(loggedUser));
    localStorage.setItem('selected_role', loggedUser.role);

    setUser(loggedUser);
    setToken(access_token);
    setSelectedRole(loggedUser.role);

    return response;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('selected_role');

    setUser(null);
    setToken(null);
    setSelectedRole(availableRoles[0]);
  };

  const switchRole = (role) => {
    if (availableRoles.includes(role)) {
      setSelectedRole(role);
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      selectedRole,
      availableRoles,
      login,
      logout,
      switchRole,
    }),
    [user, token, selectedRole]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}