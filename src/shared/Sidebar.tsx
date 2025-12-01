import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { icon: '🏠', label: 'Главная', path: '/' },
    { icon: '📊', label: 'Транзакции', path: '/transactions' },
    { icon: '📈', label: 'Аналитика', path: '/analytics' },
    {
      icon: '🔄',
      label: 'Регулярные платежи',
      path: '/regular-payments',
    },
    { icon: '🏦', label: 'Источники средств', path: '/sources-of-funds' },
    { icon: '📁', label: 'Категории', path: '/categories' },
    { icon: '👤', label: 'Профиль', path: '/profile' },
    { icon: '⚙️', label: 'Настройки', path: null },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to="/" className="logo-link">
          <div className="logo">
            <div className="logo-icon">S</div>
            <span className="logo-text">SpendSphere</span>
          </div>
        </Link>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => {
          const isActive = item.path === location.pathname;
          const content = (
            <>
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </>
          );

          return item.path ? (
            <Link
              key={index}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              {content}
            </Link>
          ) : (
            <div key={index} className="nav-item">
              {content}
            </div>
          );
        })}
      </nav>
      <div className="sidebar-premium">
        <div className="premium-content">
          <span className="premium-icon">👑</span>
          <div className="premium-text">
            <div className="premium-title">Premium</div>
            <div className="premium-subtitle">Больше возможностей</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

