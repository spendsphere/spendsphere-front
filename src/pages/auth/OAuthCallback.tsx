import React, { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Функция для получения cookie по имени
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken } = useAuth();

  useEffect(() => {
    // Проверяем наличие ошибки в URL
    const params = new URLSearchParams(location.search);
    const error = params.get('error');

    if (error) {
      return;
    }

    // Читаем токен из cookie
    const cookieToken = getCookie('accessToken');
    
    if (cookieToken) {
      setToken(cookieToken);
      navigate('/', { replace: true });
    } else {
      console.error('Token not found in cookie after OAuth callback');
    }
  }, [location.search, setToken, navigate]);

  const params = new URLSearchParams(location.search);
  const error = params.get('error');

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Не удалось авторизоваться</h2>
        <p>Код ошибки: {error}</p>
        <Link to="/login">Вернуться к входу</Link>
      </div>
    );
  }

  return <div style={{ padding: 24 }}>Авторизация...</div>;
};

export default OAuthCallback;
