import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import UserPortal from './pages/UserPortal';
import ProviderPortal from './pages/ProviderPortal';
import AdminPortal from './pages/AdminPortal';
import './index.css';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { auth, loading } = useAuth();

  if (loading) return null;
  if (!auth) return <Navigate to="/" />;
  if (allowedRole && auth.role !== allowedRole) return <Navigate to="/" />;

  return children;
};

function AppRoutes() {
  const { auth } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/chat"
        element={
          <ProtectedRoute allowedRole="user">
            <UserPortal />
          </ProtectedRoute>
        }
      />
      <Route
        path="/provider"
        element={
          <ProtectedRoute allowedRole="provider">
            <ProviderPortal />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminPortal />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
