import React from 'react';
import './Header.css';

interface HeaderProps {
  onOpenModal?: () => void;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ onOpenModal, title = 'Главная' }) => {
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
        <div className="user-avatar">
          <img
            src="https://via.placeholder.com/40?text=U"
            alt="User"
            className="avatar-img"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;

