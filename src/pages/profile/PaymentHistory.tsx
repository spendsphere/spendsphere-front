import React from 'react';
import './PaymentHistory.css';

interface Payment {
  id: string;
  icon: string;
  iconColor: string;
  title: string;
  date: string;
  type: string;
  amount: number;
}

interface PaymentHistoryProps {
  payments: Payment[];
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ payments }) => {
  const formatAmount = (amount: number) => {
    return `${amount.toLocaleString('ru-RU')} Р`;
  };

  return (
    <div className="payment-history">
      <h2 className="payment-history-title">История платежей</h2>
      <div className="payment-history-list">
        {payments.map((payment) => (
          <div key={payment.id} className="payment-item">
            <div
              className="payment-icon"
              style={{ backgroundColor: `${payment.iconColor}20` }}
            >
              <span style={{ color: payment.iconColor, fontSize: '24px' }}>
                {payment.icon}
              </span>
            </div>
            <div className="payment-info">
              <div className="payment-title">{payment.title}</div>
              <div className="payment-meta">
                {payment.date} • {payment.type}
              </div>
            </div>
            <div className="payment-amount">{formatAmount(payment.amount)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentHistory;

