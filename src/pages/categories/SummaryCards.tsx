import React from 'react';
import { Category } from '../../context/CategoriesContext';
import './SummaryCards.css';

interface SummaryCardsProps {
  totalCategories: number;
  totalSpent: number;
  largestCategory: Category | undefined;
  largestCategoryAmount: number;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalCategories,
  totalSpent,
  largestCategory,
  largestCategoryAmount,
}) => {
  const formatAmount = (amount: number) => {
    return `${amount.toLocaleString('ru-RU')} ₽`;
  };

  return (
    <div className="summary-cards">
      <div className="summary-card categories-count">
        <div className="summary-card-content">
          <div className="summary-card-label">Категории расходов</div>
          <div className="summary-card-value">{totalCategories}</div>
        </div>
        <div className="summary-card-icon">🍴</div>
      </div>

      <div className="summary-card total-spent">
        <div className="summary-card-content">
          <div className="summary-card-label">Всего потрачено</div>
          <div className="summary-card-value">{formatAmount(totalSpent)}</div>
        </div>
        <div className="summary-card-icon">💳</div>
      </div>

      <div className="summary-card largest-category">
        <div className="summary-card-content">
          <div className="summary-card-label">Самая крупная категория</div>
          <div className="summary-card-value">
            {largestCategory ? (
              <>
                {largestCategory.icon} {largestCategory.name} —{' '}
                {formatAmount(largestCategoryAmount)}
              </>
            ) : (
              '—'
            )}
          </div>
        </div>
        <div className="summary-card-icon">📊</div>
      </div>
    </div>
  );
};

export default SummaryCards;

