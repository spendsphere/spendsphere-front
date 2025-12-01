import React from 'react';
import { Link } from 'react-router-dom';
import './SourcesOfFunds.css';

const SourcesOfFunds: React.FC = () => {
  const sources = [
    {
      icon: '💳',
      name: 'Tinkoff',
      type: 'Дебетовая карта',
      amount: '35 000 Р',
      color: 'yellow',
    },
    {
      icon: '🏦',
      name: 'Сбербанк',
      type: 'Кредитная карта',
      amount: '-5 000 Р',
      color: 'green',
      negative: true,
    },
    {
      icon: '💵',
      name: 'Наличные',
      type: 'Кошелёк',
      amount: '27 320 Р',
      color: 'grey',
    },
  ];

  return (
    <section className="sources-of-funds">
      <div className="section-header">
        <h2 className="section-title">Источники средств</h2>
        <Link to="/sources-of-funds" className="show-all-link">
          Показать все
        </Link>
      </div>
      <div className="sources-grid">
        {sources.map((source, index) => (
          <div key={index} className="source-card">
            <div className={`source-icon ${source.color}`}>{source.icon}</div>
            <div className="source-info">
              <div className="source-name">{source.name}</div>
              <div className="source-type">{source.type}</div>
            </div>
            <div
              className={`source-amount ${source.negative ? 'negative' : ''}`}
            >
              {source.amount}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SourcesOfFunds;

