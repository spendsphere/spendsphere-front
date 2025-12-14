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
    const params = new URLSearchParams(location.search);
    const error = params.get('error');

    if (error) {
      return;
    }

    // Функция для проверки cookie
    const checkToken = () => {
      const cookieToken = getCookie('accessToken');
      
      if (cookieToken) {
        setToken(cookieToken);
        navigate('/', { replace: true });
        return true;
      }
      return false;
    };

    // Проверяем сразу
    if (!checkToken()) {
      // Если не нашли сразу, пробуем через небольшую задержку
      setTimeout(() => {
        if (!checkToken()) {
          console.error('Token not found in cookie after OAuth callback');
        }
      }, 100);
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
