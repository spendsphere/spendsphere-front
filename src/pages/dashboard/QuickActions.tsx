import React from 'react';
import { Link } from 'react-router-dom';
import './QuickActions.css';

interface QuickActionsProps {
  onOpenModal: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onOpenModal }) => {
  const actions = [
    {
      icon: '➕',
      title: 'Добавить запись',
      description: 'Быстрое добавление транзакции',
      color: 'green',
      onClick: onOpenModal,
      link: null,
    },
    {
      icon: '📈',
      title: 'Аналитика',
      description: 'Подробный анализ расходов',
      color: 'purple',
      onClick: null,
      link: '/analytics',
    },
    {
      icon: '🔄',
      title: 'Регулярные платежи',
      description: 'Управление подписками',
      color: 'blue',
      onClick: null,
      link: '/regular-payments',
    },
  ];

  return (
    <section className="quick-actions">
      <h2 className="section-title">Быстрые действия</h2>
      <div className="actions-grid">
        {actions.map((action, index) => {
          const content = (
            <>
              <div className="action-icon">{action.icon}</div>
              <div className="action-title">{action.title}</div>
              <div className="action-description">{action.description}</div>
            </>
          );

          if (action.link) {
            return (
              <Link
                key={index}
                to={action.link}
                className={`action-card ${action.color}`}
              >
                {content}
              </Link>
            );
          }

          return (
            <div
              key={index}
              className={`action-card ${action.color}`}
              onClick={action.onClick}
            >
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default QuickActions;

