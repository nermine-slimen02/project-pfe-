import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tickets from './pages/Tickets';
import Interventions from './pages/Interventions';
import Notifications from './pages/Notifications';
import Comments from './pages/Comments';
import Users from './pages/Users';
import AuditLogs from './pages/AuditLogs';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="interventions" element={<Interventions />} />
          <Route path="comments" element={<Comments />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="users" element={<Users />} />
          <Route path="audit-logs" element={<AuditLogs />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
