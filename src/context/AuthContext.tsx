import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiClient } from '../api/client';

export interface UserProfileDTO {
  id: number;
  email: string;
  surname: string;
  name: string;
  birthday: string | null;
  photoUrl: string | null;
  createdAt: string;
  isPremium: boolean;
}

interface AuthContextValue {
  user: UserProfileDTO | null;
  token: string | null;
  isAuthenticated: boolean;
  loginWithGoogle: () => void;
  logout: () => void;
  setToken: (_t: string | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem('accessToken'));
  const [user, setUser] = useState<UserProfileDTO | null>(null);

  const setToken = (t: string | null) => {
    setTokenState(t);
    if (t) localStorage.setItem('accessToken', t);
    else localStorage.removeItem('accessToken');
  };

  const fetchMe = async () => {
    try {
      const me = await apiClient.get<UserProfileDTO>('/v1/users/me');
      setUser(me);
    } catch {
      // Если не удалось получить профиль (401/redirect и т.п.) — сбрасываем токен, чтобы показать логин
      setUser(null);
      setToken(null);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMe();
    } else {
      setUser(null);
    }
  }, [token]);

  const loginWithGoogle = () => {
    const popup = window.open('/oauth2/authorization/google', 'oauth2-login', 'width=500,height=700');
    if (!popup) return;
    
    const pollIntervalMs = 500;
    const maxAttempts = 240; // ~2 минуты
    let attempts = 0;
    
    const timer = setInterval(() => {
      attempts += 1;
      
      if (popup.closed) {
        clearInterval(timer);
        // После закрытия popup проверяем cookie
        checkAuthFromCookie();
        return;
      }
      
      try {
        // Проверяем, вернулись ли на callback URL
        const popupUrl = popup.location.href;
        if (popupUrl.includes('/oauth2/callback')) {
          clearInterval(timer);
          // Даём время установиться cookie
          setTimeout(() => {
            popup.close();
            checkAuthFromCookie();
          }, 500);
        }
      } catch {
        // Cross-origin ошибка - это нормально, пока идет OAuth
      }
      
      if (attempts >= maxAttempts) {
        clearInterval(timer);
        try { popup.close(); } catch { /* noop */ }
      }
    }, pollIntervalMs);
  };

  const checkAuthFromCookie = () => {
    const cookieToken = getCookie('accessToken');
    if (cookieToken) {
      setToken(cookieToken);
    }
  };

  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    // опционально дернуть бек для logout
    fetch('/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
  };

  const value = useMemo(
    () => ({ user, token, isAuthenticated: !!(token && user), loginWithGoogle, logout, setToken }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export { AuthContext };

