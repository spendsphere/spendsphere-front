import React from 'react';
import './ProfileInfo.css';
import { useTheme } from '../../context/ThemeContext';

interface ProfileInfoProps {
  profile: {
    name: string;
    email: string;
    avatar: string;
    isPremium: boolean;
    balance: number;
  };
  onLogout: () => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  profile,
  onLogout,
}) => {
  const { theme, toggleTheme } = useTheme();

  const formatAmount = (amount: number) => {
    const sign = amount >= 0 ? '+' : '';
    return `${sign}${amount.toLocaleString('ru-RU')} Р`;
  };

  return (
    <div className="profile-info-card">
      <button className="theme-toggle" onClick={toggleTheme} title={theme === 'light' ? 'Переключить на темную тему' : 'Переключить на светлую тему'}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      <div className="profile-avatar-container">
        <img
          src={profile.avatar}
          alt={profile.name}
          className="profile-avatar"
        />
      </div>
      <div className="profile-details">
        <div className="profile-name">{profile.name}</div>
        {profile.isPremium && (
          <div className="profile-premium-badge">Premium</div>
        )}
        <div className="profile-email">{profile.email}</div>
        <div className="profile-balance">
          Баланс: <span className="balance-amount">{formatAmount(profile.balance)}</span>
        </div>
      </div>
      <div className="profile-actions">
        <button className="btn-logout" onClick={onLogout}>
          <span className="btn-icon">🚪</span>
          Выход
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;

