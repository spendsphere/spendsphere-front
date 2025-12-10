import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchTransactions, type BackendTransactionDTO } from '../../api/transactions';
import './LatestTransactions.css';

const LatestTransactions: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<BackendTransactionDTO[]>([]);

  useEffect(() => {
    if (!user) return;
    fetchTransactions(user.id)
      .then((list) => setItems(list.slice(0, 3)))
      .catch(() => setItems([]));
  }, [user?.id]);

  const formatDate = (isoDate: string) => {
    try {
      const d = new Date(isoDate);
      return d.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: 'long',
      });
    } catch {
      return isoDate;
    }
  };

  const formatAmount = (amount: number, type: BackendTransactionDTO['type']) => {
    const sign = type === 'INCOME' ? '+' : '-';
    return `${sign}${amount.toLocaleString('ru-RU')} Р`;
  };

  return (
    <section className="latest-transactions">
      <div className="section-header">
        <h2 className="section-title">Последние транзакции</h2>
        <Link to="/transactions" className="show-all-link">
          Показать все
        </Link>
      </div>
      <div className="transactions-list">
        {items.map((t) => (
          <div key={t.id} className="transaction-item">
            <div className="transaction-icon">{'📁'}</div>
            <div className="transaction-info">
              <div className="transaction-category">{t.categoryName || 'Без категории'}</div>
              <div className="transaction-meta">
                <span className="transaction-date">{formatDate(t.date)}</span>
                <span className="transaction-source">{t.accountName || '—'}</span>
              </div>
            </div>
            <div
              className={`transaction-amount ${t.type === 'INCOME' ? 'income' : 'expense'}`}
            >
              {formatAmount(t.amount, t.type)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LatestTransactions;

