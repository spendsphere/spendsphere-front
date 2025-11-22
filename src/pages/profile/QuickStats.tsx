import React from 'react';
import './QuickStats.css';

interface QuickStatsProps {
  stats: {
    transactions: number;
    regularPayments: number;
    categories: number;
  };
}

const QuickStats: React.FC<QuickStatsProps> = ({ stats }) => {
  return (
    <div className="quick-stats">
      <div className="stat-card stat-transactions">
        <div className="stat-content">
          <div className="stat-label">Транзакции</div>
          <div className="stat-value">{stats.transactions}</div>
        </div>
        <div className="stat-icon">📊</div>
      </div>

      <div className="stat-card stat-regular-payments">
        <div className="stat-content">
          <div className="stat-label">Регулярные платежи</div>
          <div className="stat-value">{stats.regularPayments}</div>
        </div>
        <div className="stat-icon">🔄</div>
      </div>

      <div className="stat-card stat-categories">
        <div className="stat-content">
          <div className="stat-label">Категории</div>
          <div className="stat-value">{stats.categories}</div>
        </div>
        <div className="stat-icon">📁</div>
      </div>
    </div>
  );
};

export default QuickStats;

