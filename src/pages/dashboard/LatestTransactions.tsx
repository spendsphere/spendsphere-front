import React from 'react';
import { Link } from 'react-router-dom';
import './LatestTransactions.css';

const LatestTransactions: React.FC = () => {
  const transactions = [
    {
      icon: '🛒',
      category: 'Продукты',
      date: '10 ноября, 14:30',
      amount: '-1 250 Р',
      source: 'Карта Tinkoff',
      type: 'expense',
    },
    {
      icon: '💼',
      category: 'Зарплата',
      date: '9 ноября, 10:00',
      amount: '+60 000 Р',
      source: 'Карта Tinkoff',
      type: 'income',
    },
    {
      icon: '🚗',
      category: 'Заправка',
      date: '8 ноября, 18:45',
      amount: '-2 500 Р',
      source: 'Карта Tinkoff',
      type: 'expense',
    },
  ];

  return (
    <section className="latest-transactions">
      <div className="section-header">
        <h2 className="section-title">Последние транзакции</h2>
        <Link to="/transactions" className="show-all-link">
          Показать все
        </Link>
      </div>
      <div className="transactions-list">
        {transactions.map((transaction, index) => (
          <div key={index} className="transaction-item">
            <div className="transaction-icon">{transaction.icon}</div>
            <div className="transaction-info">
              <div className="transaction-category">{transaction.category}</div>
              <div className="transaction-meta">
                <span className="transaction-date">{transaction.date}</span>
                <span className="transaction-source">{transaction.source}</span>
              </div>
            </div>
            <div
              className={`transaction-amount ${transaction.type}`}
            >
              {transaction.amount}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LatestTransactions;

