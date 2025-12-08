import React from 'react';
import './LoginPage.css';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { loginWithGoogle, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>SpendSphere</h1>
        <p>Войдите, чтобы продолжить</p>
        <button className="google-btn" onClick={loginWithGoogle}>
          Войти с Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
