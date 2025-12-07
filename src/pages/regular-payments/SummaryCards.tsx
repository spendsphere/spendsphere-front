import React from 'react';
import './SummaryCards.css';

interface SummaryCardsProps {
  monthlyExpenses: number;
  totalPayments: number;
  remainingThisMonth: number;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  monthlyExpenses,
  totalPayments,
  remainingThisMonth,
}) => {
  const formatAmount = (amount: number) => {
    return `${amount.toLocaleString('ru-RU')} Р`;
  };

  return (
    <div className="summary-cards">
      <div className="summary-card monthly-expenses">
        <div className="summary-card-content">
          <div className="summary-card-label">Ежемесячные расходы</div>
          <div className="summary-card-value">{formatAmount(monthlyExpenses)}</div>
        </div>
        <div className="summary-card-icon">💼</div>
      </div>

      <div className="summary-card total-payments">
        <div className="summary-card-content">
          <div className="summary-card-label">Всего платежей</div>
          <div className="summary-card-value">{totalPayments}</div>
        </div>
        <div className="summary-card-icon">📋</div>
      </div>

      <div className="summary-card remaining-month">
        <div className="summary-card-content">
          <div className="summary-card-label">Осталось в этом месяце</div>
          <div className="summary-card-value">{remainingThisMonth}</div>
        </div>
        <div className="summary-card-icon">⏳</div>
      </div>
    </div>
  );
};

export default SummaryCards;

