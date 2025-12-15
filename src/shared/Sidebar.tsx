import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { isCollapsed, isMobileOpen, toggleSidebar, closeMobileSidebar } = useSidebar();

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
  ];

  const handleNavClick = () => {
    // Close mobile sidebar when navigation item is clicked
    if (window.innerWidth <= 768) {
      closeMobileSidebar();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div className="sidebar-overlay" onClick={closeMobileSidebar} />
      )}
      
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="logo-link" onClick={handleNavClick}>
            <div className="logo">
              <div className="logo-icon">S</div>
              <span className={`logo-text ${isCollapsed ? 'collapsed' : ''}`}>SpendSphere</span>
            </div>
          </Link>
          <button 
            className="sidebar-toggle desktop-only" 
            onClick={toggleSidebar}
            title={isCollapsed ? 'Развернуть' : 'Свернуть'}
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item, index) => {
            const isActive = item.path === location.pathname;
            const content = (
              <>
                <span className="nav-icon">{item.icon}</span>
                <span className={`nav-label ${isCollapsed ? 'collapsed' : ''}`}>{item.label}</span>
              </>
            );

            return item.path ? (
              <Link
                key={index}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                title={isCollapsed ? item.label : ''}
                onClick={handleNavClick}
              >
                {content}
              </Link>
            ) : (
              <div key={index} className="nav-item" title={isCollapsed ? item.label : ''}>
                {content}
              </div>
            );
          })}
        </nav>
        <div className={`sidebar-premium ${isCollapsed ? 'collapsed' : ''}`}>
          <div className="premium-content">
            <span className="premium-icon">👑</span>
            <div className="premium-text">
              <div className="premium-title">Premium</div>
              <div className="premium-subtitle">Больше возможностей</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

