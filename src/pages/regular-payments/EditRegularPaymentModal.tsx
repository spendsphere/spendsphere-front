import React, { useEffect, useState } from 'react';
import { RegularPayment } from './RegularPaymentsPage';
import './AddRegularPaymentModal.css';

interface EditRegularPaymentModalProps {
  isOpen: boolean;
  payment: RegularPayment;
  onClose: () => void;
  onSave: (updated: RegularPayment) => void;
}

const EditRegularPaymentModal: React.FC<EditRegularPaymentModalProps> = ({
  isOpen,
  payment,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState<string>(payment.name);
  const [amount, setAmount] = useState<string>(String(payment.amount));
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>(payment.period);
  const [dayOfMonth, setDayOfMonth] = useState<string>(payment.dayOfMonth ? String(payment.dayOfMonth) : '');
  const [dayOfWeek, setDayOfWeek] = useState<string>(
    typeof payment.dayOfWeek === 'number' ? String(payment.dayOfWeek) : '1',
  );

  useEffect(() => {
    if (isOpen) {
      setName(payment.name);
      setAmount(String(payment.amount));
      setPeriod(payment.period);
      setDayOfMonth(payment.dayOfMonth ? String(payment.dayOfMonth) : '');
      setDayOfWeek(typeof payment.dayOfWeek === 'number' ? String(payment.dayOfWeek) : '1');
    }
  }, [isOpen, payment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) {
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

    const updated: RegularPayment = {
      ...payment,
      name: name.trim(),
      amount: parseFloat(amount),
      period,
      dayOfMonth: period === 'monthly' ? parseInt(dayOfMonth) : undefined,
      dayOfWeek: period === 'weekly' ? parseInt(dayOfWeek) : undefined,
    };
    onSave(updated);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Редактировать платеж</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
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
              required
            />
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
                setPeriod(e.target.value as 'daily' | 'weekly' | 'monthly')
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

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn-submit">
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRegularPaymentModal;



