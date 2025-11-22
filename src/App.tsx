import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CategoriesProvider } from './context/CategoriesContext';
import Dashboard from './pages/dashboard/Dashboard';
import TransactionsPage from './pages/transactions/TransactionsPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import RegularPaymentsPage from './pages/regular-payments/RegularPaymentsPage';
import SourcesOfFundsPage from './pages/sources-of-funds/SourcesOfFundsPage';
import CategoriesPage from './pages/categories/CategoriesPage';
import ProfilePage from './pages/profile/ProfilePage';
import './App.css';

function App() {
  return (
    <CategoriesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route
            path="/regular-payments"
            element={<RegularPaymentsPage />}
          />
          <Route
            path="/sources-of-funds"
            element={<SourcesOfFundsPage />}
          />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </CategoriesProvider>
  );
}

export default App;

