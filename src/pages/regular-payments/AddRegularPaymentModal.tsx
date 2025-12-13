import React, { useState, useEffect } from 'react';
import { useCategories } from '../../context/CategoriesContext';
import { RegularPayment } from './RegularPaymentsPage';
import './AddRegularPaymentModal.css';
import { useAuth } from '../../context/AuthContext';
import { accountsApi, type AccountDTO } from '../../api/accounts';

interface AddRegularPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (_payment: Omit<RegularPayment, 'id'> & { accountId: number }) => void;
}

const AddRegularPaymentModal: React.FC<AddRegularPaymentModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [dayOfMonth, setDayOfMonth] = useState<string>('');
  const [dayOfWeek, setDayOfWeek] = useState<string>('1');
  const [monthOfYear, setMonthOfYear] = useState<string>('1');
  const { getExpenseCategories, getCategoryByName } = useCategories();
  const [category, setCategory] = useState<string>('');
  const [icon, setIcon] = useState<string>('💳');
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Pick<AccountDTO, 'id' | 'name'>[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');

  const categories = getExpenseCategories();

  const icons = ['💳', '🎵', '📺', '☁️', '📱', '💻', '🎮', '📚'];

  useEffect(() => {
    if (isOpen) {
      setName('');
      setAmount('');
      setPeriod('monthly');
      setDayOfMonth('');
      setDayOfWeek('1');
      setMonthOfYear('1');
      setCategory('');
      setIcon('💳');
      setSelectedAccountId('');
      if (user) {
        accountsApi
          .list(user.id)
          .then((list) => setAccounts(list.map((a) => ({ id: a.id, name: a.name }))))
          .catch(() => setAccounts([]));
      }
    }
  }, [isOpen, user]);

  const calculateNextPayment = (): string => {
    const today = new Date();
    let nextDate: Date;

    switch (period) {
      case 'weekly': {
        const selectedDay = parseInt(dayOfWeek);
        nextDate = new Date(today);
        const daysUntilNext = (selectedDay - today.getDay() + 7) % 7 || 7;
        nextDate.setDate(today.getDate() + daysUntilNext);
        break;
      }
      case 'monthly': {
        const selectedDay = parseInt(dayOfMonth) || 1;
        nextDate = new Date(today.getFullYear(), today.getMonth(), selectedDay);
        if (nextDate < today) {
          nextDate.setMonth(today.getMonth() + 1);
        }
        break;
      }
      case 'daily': {
        nextDate = new Date(today);
        nextDate.setDate(today.getDate() + 1);
        break;
      }
      default:
        nextDate = new Date(today);
        nextDate.setMonth(today.getMonth() + 1);
    }

    return nextDate.toISOString().split('T')[0];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || !category || !selectedAccountId) {
      alert('Заполните все обязательные поля');
      return;
    }

    if (period === 'monthly' && !dayOfMonth) {
      alert('Укажите день месяца');
      return;
    }

    if (period === 'weekly' && !dayOfWeek) {
      alert('Укажите день недели');
      return;
    }

    const selectedCategory = getCategoryByName(category);

    const paymentData: Omit<RegularPayment, 'id'> & { accountId: number } = {
      name: name.trim(),
      icon,
      amount: parseFloat(amount),
      period,
      category,
      categoryColor: selectedCategory?.color || '#8b5cf6',
      isActive: true,
      nextPayment: calculateNextPayment(),
      accountId: Number(selectedAccountId),
    };

    if (period === 'monthly') {
      paymentData.dayOfMonth = parseInt(dayOfMonth);
    }

    if (period === 'yearly') {
      paymentData.monthOfYear = parseInt(monthOfYear);
      paymentData.dayOfMonth = parseInt(dayOfMonth);
    }

    if (period === 'weekly') {
      paymentData.dayOfWeek = parseInt(dayOfWeek);
    }

    onSave(paymentData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Добавить регулярный платеж</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="account" className="form-label">
              Счет *
            </label>
            <select
              id="account"
              className="form-select"
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              required
            >
              <option value="">Выберите счет</option>
              {accounts.map((a) => (
                <option key={a.id} value={String(a.id)}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Название *
            </label>
            <input
              type="text"
              id="name"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Spotify"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="icon" className="form-label">
              Иконка
            </label>
            <div className="icon-selector">
              {icons.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  className={`icon-option ${icon === ic ? 'selected' : ''}`}
                  onClick={() => setIcon(ic)}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="amount" className="form-label">
              Сумма *
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
            <label htmlFor="period" className="form-label">
              Период *
            </label>
            <select
              id="period"
              className="form-select"
              value={period}
              onChange={(e) =>
                setPeriod(
                  e.target.value as
                    | 'daily'
                    | 'weekly'
                    | 'monthly'
                )
              }
              required
            >
              <option value="daily">Ежедневно</option>
              <option value="weekly">Еженедельно</option>
              <option value="monthly">Ежемесячно</option>
            </select>
          </div>

          {period === 'weekly' && (
            <div className="form-group">
              <label htmlFor="dayOfWeek" className="form-label">
                День недели *
              </label>
              <select
                id="dayOfWeek"
                className="form-select"
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value)}
                required
              >
                <option value="0">Воскресенье</option>
                <option value="1">Понедельник</option>
                <option value="2">Вторник</option>
                <option value="3">Среда</option>
                <option value="4">Четверг</option>
                <option value="5">Пятница</option>
                <option value="6">Суббота</option>
              </select>
            </div>
          )}

          {period === 'monthly' && (
            <div className="form-group">
              <label htmlFor="dayOfMonth" className="form-label">
                День месяца *
              </label>
              <input
                type="number"
                id="dayOfMonth"
                className="form-input"
                value={dayOfMonth}
                onChange={(e) => setDayOfMonth(e.target.value)}
                placeholder="1-31"
                required
                min="1"
                max="31"
              />
            </div>
          )}

          {period === 'yearly' && (
            <>
              <div className="form-group">
                <label htmlFor="monthOfYear" className="form-label">
                  Месяц в году *
                </label>
                <select
                  id="monthOfYear"
                  className="form-select"
                  value={monthOfYear}
                  onChange={(e) => setMonthOfYear(e.target.value)}
                  required
                >
                  <option value="1">Январь</option>
                  <option value="2">Февраль</option>
                  <option value="3">Март</option>
                  <option value="4">Апрель</option>
                  <option value="5">Май</option>
                  <option value="6">Июнь</option>
                  <option value="7">Июль</option>
                  <option value="8">Август</option>
                  <option value="9">Сентябрь</option>
                  <option value="10">Октябрь</option>
                  <option value="11">Ноябрь</option>
                  <option value="12">Декабрь</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="dayOfMonth" className="form-label">
                  День месяца *
                </label>
                <input
                  type="number"
                  id="dayOfMonth"
                  className="form-input"
                  value={dayOfMonth}
                  onChange={(e) => setDayOfMonth(e.target.value)}
                  placeholder="1-31"
                  required
                  min="1"
                  max="31"
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Категория *
            </label>
            <select
              id="category"
              className="form-select"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
              required
            >
              <option value="">Выберите категорию</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
            >
              Отмена
            </button>
            <button type="submit" className="btn-submit">
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRegularPaymentModal;

