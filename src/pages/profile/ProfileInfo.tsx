import React from 'react';
import './ProfileInfo.css';

interface ProfileInfoProps {
  profile: {
    name: string;
    email: string;
    avatar: string;
    isPremium: boolean;
    balance: number;
  };
  onEdit: () => void;
  onResetPassword: () => void;
  onLogout: () => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  profile,
  onEdit,
  onResetPassword,
  onLogout,
}) => {
  const formatAmount = (amount: number) => {
    const sign = amount >= 0 ? '+' : '';
    return `${sign}${amount.toLocaleString('ru-RU')} Р`;
  };

  return (
    <div className="profile-info-card">
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
        <button className="btn-edit-profile" onClick={onEdit}>
          <span className="btn-icon">✏️</span>
          Редактировать профиль
        </button>
        <button className="btn-reset-password" onClick={onResetPassword}>
          <span className="btn-icon">🔒</span>
          Сбросить пароль
        </button>
        <button className="btn-reset-password" onClick={onLogout}>
          <span className="btn-icon">🚪</span>
          Выйти
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;

