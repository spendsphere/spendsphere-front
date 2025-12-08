import React, { useEffect, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken } = useAuth();

  const { token, error } = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return {
      token: params.get('token'),
      error: params.get('error'),
    };
  }, [location.search]);

  useEffect(() => {
    if (token) {
      setToken(token);
      navigate('/', { replace: true });
    }
  }, [token, setToken, navigate]);

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Не удалось авторизоваться</h2>
        <p>Код ошибки: {error}</p>
        <Link to="/login">Вернуться к входу</Link>
      </div>
    );
  }

  if (!token) {
    return (
      <div style={{ padding: 24 }}>
        <div>Не получен токен авторизации.</div>
        <Link to="/login">Вернуться к входу</Link>
      </div>
    );
  }

  return <div>Авторизация...</div>;
};

export default OAuthCallback;
