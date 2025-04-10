import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import UserSettings from './components/UserSettings';
import Register from './components/Register';
import DashboardAdmin from './components/DashboardAdmin';
import UserDashboard from './components/UserDashboard';
import Teams from './components/Teams';

// Rota protegida
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const userEmail = localStorage.getItem("userEmail");
  const accessLevel = localStorage.getItem("accessLevel");

  if (!userEmail) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && accessLevel !== "Admin") {
    return <Navigate to="/user-dashboard" replace />;
  }

  return children;
};

// Rota que impede acesso se estiver logado
const AuthRoute = ({ children }) => {
  const userEmail = localStorage.getItem("userEmail");
  return userEmail ? <Navigate to="/user-dashboard" replace /> : children;
};

function App() {
  const isLoggedIn = !!localStorage.getItem("userEmail");

  return (
    <Router>
      <Routes>

        <Route path="/" element={
          isLoggedIn ?
            <Navigate to="/user-dashboard" replace /> :
            <Navigate to="/login" replace />
        } />

        <Route path="/login" element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        } />

        <Route path="/register" element={
          <AuthRoute>
            <Register />
          </AuthRoute>
        } />

        <Route path="/user-settings" element={
          <ProtectedRoute adminOnly>
            <UserSettings />
          </ProtectedRoute>
        } />

        <Route path="/dashboard-admin" element={
          <ProtectedRoute adminOnly>
            <DashboardAdmin />
          </ProtectedRoute>
        } />

        <Route path="/teams" element={
          <ProtectedRoute adminOnly>
            <Teams />
          </ProtectedRoute>
        } />

        <Route path="/user-dashboard" element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        } />

        <Route path="*" element={
          isLoggedIn ? <Navigate to="/user-dashboard" replace /> : <Navigate to="/login" replace />
        } />
      </Routes>
    </Router>
  );
}

export default App;
