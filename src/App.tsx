import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CategoriesProvider } from './context/CategoriesContext';
import Dashboard from './pages/dashboard/Dashboard';
import TransactionsPage from './pages/transactions/TransactionsPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import RegularPaymentsPage from './pages/regular-payments/RegularPaymentsPage';
import SourcesOfFundsPage from './pages/sources-of-funds/SourcesOfFundsPage';
import CategoriesPage from './pages/categories/CategoriesPage';
import ProfilePage from './pages/profile/ProfilePage';
import LoginPage from './pages/auth/LoginPage';
import { useAuth } from './context/AuthContext';
import './App.css';
import OAuthCallback from './pages/auth/OAuthCallback';

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, token, user } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (token && !user && !isAuthenticated) return <div style={{ padding: 24 }}>Загрузка профиля...</div>;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <CategoriesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route path="/oauth2/callback" element={<OAuthCallback />} />
          <Route
            path="/transactions"
            element={
              <RequireAuth>
                <TransactionsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/analytics"
            element={
              <RequireAuth>
                <AnalyticsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/regular-payments"
            element={
              <RequireAuth>
                <RegularPaymentsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/sources-of-funds"
            element={
              <RequireAuth>
                <SourcesOfFundsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/categories"
            element={
              <RequireAuth>
                <CategoriesPage />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </CategoriesProvider>
  );
}

export default App;

