import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
  onOpenModal?: () => void;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ onOpenModal, title = 'Главная' }) => {
  const { user } = useAuth();
  const displayName = user ? [user.name, user.surname].filter(Boolean).join(' ') : '';
  const avatarUrl =
    (user && user.photoUrl) || 'https://via.placeholder.com/40?text=U';
  return (
    <header className="header">
      <h1 className="header-title">{title}</h1>
      <div className="header-actions">
        {onOpenModal && (
          <button className="btn-add" onClick={onOpenModal}>
            <span className="btn-icon">+</span>
            Добавить запись
          </button>
        )}
        <Link to="/profile" className="user-avatar" title={displayName}>
          <img
            src={avatarUrl}
            alt={displayName || 'User'}
            className="avatar-img"
          />
          {displayName && (
            <span style={{ marginLeft: 8, fontSize: 14 }}>{displayName}</span>
          )}
        </Link>
      </div>
    </header>
  );
};

export default Header;

