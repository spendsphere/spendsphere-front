import React, { useEffect, useMemo, useState } from 'react';
import { Transaction } from './TransactionsPage';
import { useCategories } from '../../context/CategoriesContext';
import { useAuth } from '../../context/AuthContext';
import { accountsApi } from '../../api/accounts';
import './TransactionList.css';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onEdit,
  onDelete,
}) => {
  const { getAllCategories } = useCategories();
  const { user } = useAuth();
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [dateTo, setDateTo] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [accountFilter, setAccountFilter] = useState<string>('all');
  const [accountNames, setAccountNames] = useState<string[]>([]);

  const categories = useMemo(() => getAllCategories().map((c) => c.name), [getAllCategories]);

  useEffect(() => {
    if (!user) return;
    accountsApi
      .list(user.id)
      .then((list) => setAccountNames(list.map((a) => a.name)))
      .catch(() => setAccountNames([]));
  }, [user?.id]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      if (
        categoryFilter !== 'all' &&
        transaction.category !== categoryFilter
      ) {
        return false;
      }
      if (accountFilter !== 'all' && transaction.source !== accountFilter) {
        return false;
      }
      if (dateFrom && transaction.date < dateFrom) {
        return false;
      }
      if (dateTo && transaction.date > dateTo) {
        return false;
      }
      return true;
    });
  }, [transactions, categoryFilter, accountFilter, dateFrom, dateTo]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const formatAmount = (amount: number, type: 'доход' | 'расход') => {
    const sign = type === 'доход' ? '+' : '-';
    return `${sign} ${amount.toLocaleString('ru-RU')} Р`;
  };

  const handleApplyFilters = () => {
    // Filters are applied automatically via useMemo
  };

  return (
    <div className="transaction-list">
      <div className="filters-bar">
        <select
          className="filter-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">Все категории</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="filter-date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
        />

        <input
          type="date"
          className="filter-date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
        />

        <select
          className="filter-select"
          value={accountFilter}
          onChange={(e) => setAccountFilter(e.target.value)}
        >
          <option value="all">Все счета</option>
          {accountNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <button className="btn-apply" onClick={handleApplyFilters}>
          Применить
        </button>
      </div>

      <div className="transactions-container">
        {filteredTransactions.length === 0 ? (
          <div className="no-transactions">
            <p>Транзакции не найдены</p>
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="transaction-card">
              <div className="transaction-main">
                <div className="transaction-date">
                  {formatDate(transaction.date)}
                </div>
                <div className="transaction-details">
                  <div className="transaction-category-row">
                    <span className="transaction-category-icon">
                      {transaction.categoryIcon}
                    </span>
                    <span className="transaction-category-name">
                      {transaction.category}
                    </span>
                  </div>
                  <div className="transaction-meta-info">
                    {transaction.note && (
                      <span className="transaction-note">
                        {transaction.note}
                      </span>
                    )}
                    {transaction.note && <span className="separator">•</span>}
                    <span className="transaction-source">
                      {transaction.source === 'Tinkoff' ? 'Карта Tinkoff' : transaction.source === 'Сбербанк' ? 'Карта Сбербанк' : transaction.source}
                    </span>
                  </div>
                </div>
                <div className="transaction-amount-col">
                  <div
                    className={`transaction-amount ${transaction.type}`}
                  >
                    {formatAmount(transaction.amount, transaction.type)}
                  </div>
                  <div className="transaction-status">
                    <span className="status-icon">✓</span>
                    <span className="status-text">Добавлено</span>
                  </div>
                </div>
              </div>
              <div className="transaction-actions">
                <button
                  className="btn-edit"
                  onClick={() => onEdit(transaction)}
                  title="Редактировать"
                >
                  ✏️
                </button>
                <button
                  className="btn-delete"
                  onClick={() => onDelete(transaction)}
                  title="Удалить"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionList;

