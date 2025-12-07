import React from 'react';
import './BalanceSummaryCards.css';

interface BalanceSummaryCardsProps {
  totalBalance: number;
  availableFunds: number;
  negativeBalance: number;
}

const BalanceSummaryCards: React.FC<BalanceSummaryCardsProps> = ({
  totalBalance,
  availableFunds,
  negativeBalance,
}) => {
  const formatAmount = (amount: number) => {
    return `${amount.toLocaleString('ru-RU')} Р`;
  };

  return (
    <div className="balance-summary-cards">
      <div className="summary-card total-balance">
        <div className="card-icon">💼</div>
        <div className="card-content">
          <div className="card-label">Общий баланс</div>
          <div className="card-value">{formatAmount(totalBalance)}</div>
        </div>
      </div>

      <div className="summary-card available-funds">
        <div className="card-icon">↓</div>
        <div className="card-content">
          <div className="card-label">Доступно средств</div>
          <div className="card-value">{formatAmount(availableFunds)}</div>
        </div>
      </div>

      <div className="summary-card negative-balance">
        <div className="card-icon">↑</div>
        <div className="card-content">
          <div className="card-label">Отрицательный баланс</div>
          <div className="card-value">{formatAmount(negativeBalance)}</div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSummaryCards;

