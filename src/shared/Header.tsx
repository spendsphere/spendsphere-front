import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import { Link } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
  onOpenModal?: () => void;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ onOpenModal, title = 'Главная' }) => {
  const { user } = useAuth();
  const { toggleMobileSidebar } = useSidebar();
  const displayName = user ? [user.name, user.surname].filter(Boolean).join(' ') : '';
  const avatarUrl =
    (user && user.photoUrl) || 'https://via.placeholder.com/40?text=U';
  return (
    <header className="header">
      <div className="header-left">
        <button 
          className="mobile-menu-btn" 
          onClick={toggleMobileSidebar}
          aria-label="Открыть меню"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
        <h1 className="header-title">{title}</h1>
      </div>
      <div className="header-actions">
        {onOpenModal && (
          <button className="btn-add" onClick={onOpenModal}>
            <span className="btn-icon">+</span>
            <span className="btn-add-text">Добавить запись</span>
          </button>
        )}
        <Link to="/profile" className="user-avatar" title={displayName}>
          <img
            src={avatarUrl}
            alt={displayName || 'User'}
            className="avatar-img"
          />
          <span className="user-name">{displayName}</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;

