import React from 'react';
import './BalanceCard.css';

const BalanceCard: React.FC = () => {
  return (
    <div className="balance-card">
      <div className="balance-header">Общий баланс</div>
      <div className="balance-amount">57 320 Р</div>
      <div className="balance-details">
        <div className="balance-item income">
          <span className="balance-label">Доходы</span>
          <span className="balance-value">+120 000 Р</span>
        </div>
        <div className="balance-item expense">
          <span className="balance-label">Расходы</span>
          <span className="balance-value">-62 680 Р</span>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;

