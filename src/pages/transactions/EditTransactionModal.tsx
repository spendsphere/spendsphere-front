import React, { useState, useEffect } from 'react';
import { useCategories } from '../../context/CategoriesContext';
import { useAuth } from '../../context/AuthContext';
import { accountsApi, type AccountDTO } from '../../api/accounts';
import { Transaction } from './TransactionsPage';
import '../../shared/AddTransactionModal.css';
import './EditTransactionModal.css';

interface EditTransactionModalProps {
  isOpen: boolean;
  transaction: Transaction;
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  isOpen,
  transaction,
  onClose,
  onSave,
}) => {
  const [selectedAccount, setSelectedAccount] = useState<string>(
    transaction.source || ''
  );
  const [transactionType, setTransactionType] = useState<'доход' | 'расход'>(
    transaction.type
  );
  const [category, setCategory] = useState<string>(transaction.category);
  const [amount, setAmount] = useState<string>(transaction.amount.toString());
  const [date, setDate] = useState<string>(transaction.date);
  const [note, setNote] = useState<string>(transaction.note || '');
  const [categoryIcon, setCategoryIcon] = useState<string>(
    transaction.categoryIcon
  );
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const { getExpenseCategories, getIncomeCategories, getCategoryByName } = useCategories();
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Pick<AccountDTO, 'id' | 'name'>[]>([]);

  const getCategories = () => {
    if (transactionType === 'доход') {
      return getIncomeCategories();
    } else if (transactionType === 'расход') {
      return getExpenseCategories();
    }
    return getExpenseCategories();
  };

  const categories = getCategories();

  useEffect(() => {
    if (isOpen) {
      setSelectedAccount(transaction.source || '');
      setTransactionType(transaction.type);
      setCategory(transaction.category);
      setAmount(transaction.amount.toString());
      setDate(transaction.date);
      setNote(transaction.note || '');
      setCategoryIcon(transaction.categoryIcon);
      if (user) {
        accountsApi
          .list(user.id)
          .then((list) => setAccounts(list.map((a) => ({ id: a.id, name: a.name }))))
          .catch(() => setAccounts([]));
      }
    }
  }, [isOpen, transaction, user]);

  const handleCategoryChange = (categoryName: string) => {
    setCategory(categoryName);
    const selectedCategory = getCategoryByName(categoryName);
    if (selectedCategory) {
      setCategoryIcon(selectedCategory.icon);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedTransaction: Transaction = {
        ...transaction,
        source: selectedAccount,
        type: transactionType,
        category,
        categoryIcon,
        amount: parseFloat(amount),
        date,
        note: note.trim() || undefined,
      };

      onSave(updatedTransaction);
      handleClose();
    } catch (error) {
      console.error('Error saving transaction:', error);
      alert('Ошибка при сохранении. Попробуйте еще раз.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setSelectedAccount(transaction.source || '');
    setTransactionType(transaction.type);
    setCategory(transaction.category);
    setAmount(transaction.amount.toString());
    setDate(transaction.date);
    setNote(transaction.note || '');
    setCategoryIcon(transaction.categoryIcon);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Редактировать транзакцию</h2>
          <button className="modal-close" onClick={handleClose}>
            ×
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="account" className="form-label">
              Счет
            </label>
            <select
              id="account"
              className="form-select"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              required
            >
              <option value="">Выберите счет</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.name}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Тип транзакции</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="transactionType"
                  value="доход"
                  checked={transactionType === 'доход'}
                  onChange={(e) =>
                    setTransactionType(e.target.value as 'доход' | 'расход')
                  }
                  required
                />
                <span>Доход</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="transactionType"
                  value="расход"
                  checked={transactionType === 'расход'}
                  onChange={(e) =>
                    setTransactionType(e.target.value as 'доход' | 'расход')
                  }
                  required
                />
                <span>Расход</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Категория
            </label>
            <select
              id="category"
              className="form-select"
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              required
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="amount" className="form-label">
              Сумма
            </label>
            <input
              type="number"
              id="amount"
              className="form-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Введите сумму"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="date" className="form-label">
              Дата
            </label>
            <input
              type="date"
              id="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="note" className="form-label">
              Примечание
            </label>
            <input
              type="text"
              id="note"
              className="form-input"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Например: Зарплата или Булочка"
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleClose}
              disabled={isSaving}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={isSaving}
            >
              {isSaving ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTransactionModal;

