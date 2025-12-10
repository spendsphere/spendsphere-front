import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { accountsApi, type AccountDTO } from '../../api/accounts';
import './SourcesOfFunds.css';

const SourcesOfFunds: React.FC = () => {
  const { user } = useAuth();
  const [sources, setSources] = useState<AccountDTO[]>([]);

  useEffect(() => {
    if (!user) return;
    accountsApi
      .list(user.id)
      .then((list) => {
        const sorted = [...list].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        setSources(sorted.slice(0, 3));
      })
      .catch(() => setSources([]));
  }, [user?.id]);

  const iconFor = (t: AccountDTO['accountType']) => {
    switch (t) {
      case 'CREDIT':
        return '🏦';
      case 'CASH':
        return '💵';
      case 'CARD':
        return '💳';
      default:
        return '💼';
    }
  };

  return (
    <section className="sources-of-funds">
      <div className="section-header">
        <h2 className="section-title">Источники средств</h2>
        <Link to="/sources-of-funds" className="show-all-link">
          Показать все
        </Link>
      </div>
      <div className="sources-grid">
        {sources.map((s) => {
          const negative = Number(s.balance) < 0;
          return (
            <div key={s.id} className="source-card">
              <div className={`source-icon ${negative ? 'green' : 'yellow'}`}>{iconFor(s.accountType)}</div>
            <div className="source-info">
              <div className="source-name">{s.name}</div>
              <div className="source-type">{s.accountType}</div>
            </div>
            <div
              className={`source-amount ${negative ? 'negative' : ''}`}
            >
              {Number(s.balance).toLocaleString('ru-RU')} Р
            </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SourcesOfFunds;

