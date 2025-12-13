import React from 'react';
import { RegularPayment } from './RegularPaymentsPage';
import './PaymentsList.css';

interface PaymentsListProps {
  payments: RegularPayment[];
  onAdd: () => void;
  onToggle: (_id: string) => void;
  onDelete: (_id: string) => void;
  onEdit?: (_payment: RegularPayment) => void;
}

const PaymentsList: React.FC<PaymentsListProps> = ({
  payments,
  onAdd,
  onToggle,
  onDelete,
  onEdit,
}) => {
  const formatAmount = (amount: number) => {
    return `${amount.toLocaleString('ru-RU')} Р`;
  };

  const getPeriodLabel = (payment: RegularPayment): string => {
    switch (payment.period) {
      case 'daily':
        return 'Ежедневно';
      case 'weekly': {
        const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        const dayName = dayNames[payment.dayOfWeek || 1];
        return `Еженедельно (${dayName})`;
      }
      case 'monthly':
        return `Ежемесячно (${payment.dayOfMonth} число)`;
      default:
        return 'Регулярно';
    }
  };

  const getPaymentStatus = (payment: RegularPayment): 'paid' | 'overdue' | 'upcoming' => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Для неактивных считаем отдельной группой "Архив", статус не важен
    if (!payment.isActive) {
      return 'upcoming';
    }

    if (payment.lastPaid) {
      const lastPaidDate = new Date(payment.lastPaid);
      lastPaidDate.setHours(0, 0, 0, 0);

      if (payment.nextPayment) {
        const nextPaymentDate = new Date(payment.nextPayment);
        nextPaymentDate.setHours(0, 0, 0, 0);

        // Если оплачено и дата оплаты >= даты следующего платежа
        if (lastPaidDate >= nextPaymentDate) {
          return 'paid';
        }
      } else {
        // Если есть дата оплаты, но нет следующего платежа
        return 'paid';
      }
    }

    if (payment.nextPayment) {
      const nextPaymentDate = new Date(payment.nextPayment);
      nextPaymentDate.setHours(0, 0, 0, 0);

      // Если дата следующего платежа в прошлом
      if (nextPaymentDate < today) {
        return 'overdue';
      }
    }

    return 'upcoming';
  };

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = [
      'января',
      'февраля',
      'марта',
      'апреля',
      'мая',
      'июня',
      'июля',
      'августа',
      'сентября',
      'октября',
      'ноября',
      'декабря',
    ];
    return `${day} ${monthNames[date.getMonth()]}`;
  };

  const computeNextDate = (payment: RegularPayment): Date | null => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!payment.isActive) return null;
    if (payment.period === 'daily') {
      return today;
    }
    if (payment.period === 'weekly' && typeof payment.dayOfWeek === 'number') {
      const d = new Date(today);
      const delta = (payment.dayOfWeek - d.getDay() + 7) % 7;
      if (delta === 0) {
        return d;
      }
      d.setDate(d.getDate() + delta);
      return d;
    }
    if (payment.period === 'monthly' && typeof payment.dayOfMonth === 'number') {
      const current = new Date(today.getFullYear(), today.getMonth(), payment.dayOfMonth);
      if (current >= today) return current;
      // следующий месяц
      return new Date(today.getFullYear(), today.getMonth() + 1, payment.dayOfMonth);
    }
    return null;
  };

  // Группируем платежи по статусам
  const paymentsByStatus = {
    overdue: [] as RegularPayment[],
    upcoming: [] as RegularPayment[],
    paid: [] as RegularPayment[],
  };

  payments.forEach((payment) => {
    if (!payment.isActive) return;
    const status = getPaymentStatus(payment);
    paymentsByStatus[status].push(payment);
  });

  const archived = payments.filter((p) => !p.isActive);

  // Сортируем внутри каждой группы по дате
  // Для upcoming сортируем по ближайшей дате выплат (чем ближе, тем раньше)
  paymentsByStatus.upcoming.sort((a, b) => {
    const ad = computeNextDate(a)?.getTime() ?? Infinity;
    const bd = computeNextDate(b)?.getTime() ?? Infinity;
    return ad - bd;
  });
  // Остальные группы оставляем как есть или сортируем по lastPaid/nextPayment если есть
  paymentsByStatus.overdue.sort((a, b) => {
    const aDate = a.nextPayment || a.lastPaid || '';
    const bDate = b.nextPayment || b.lastPaid || '';
    if (!aDate || !bDate) return 0;
    return new Date(aDate).getTime() - new Date(bDate).getTime();
  });
  paymentsByStatus.paid.sort((a, b) => {
    const aDate = a.lastPaid || a.nextPayment || '';
    const bDate = b.lastPaid || b.nextPayment || '';
    if (!aDate || !bDate) return 0;
    return new Date(aDate).getTime() - new Date(bDate).getTime();
  });

  const renderPaymentCard = (payment: RegularPayment) => {
    const status = getPaymentStatus(payment);
    const nextDate = computeNextDate(payment);
    const hasNextPayment = !!nextDate;
    const displayDate = nextDate
      ? formatFullDate(nextDate.toISOString())
      : payment.lastPaid
        ? formatFullDate(payment.lastPaid)
        : '';

    return (
      <div
        key={payment.id}
        className={`payment-card payment-card-${status}`}
      >
        <div className={`payment-icon-wrapper payment-icon-wrapper-${status}`}>
          <div className={`payment-icon payment-icon-${status}`}>{payment.icon}</div>
        </div>
        <div className="payment-content">
          <div className="payment-main-info">
            <div className="payment-name">{payment.name}</div>
            <div className={`payment-amount payment-amount-${status}`}>
              {formatAmount(payment.amount)}
            </div>
          </div>
          {displayDate && (
            <div className={`payment-date-badge payment-date-badge-${status}`}>
              <span className="payment-date-label">
                {hasNextPayment ? 'Следующий платеж' : 'Оплачено'}
              </span>
              <span className="payment-date-value">{displayDate}</span>
            </div>
          )}
          <div className="payment-footer">
            <span className="payment-period">{getPeriodLabel(payment)}</span>
            <span className="separator">•</span>
            <span
              className="payment-category"
              style={{ color: payment.categoryColor }}
            >
              {payment.category}
            </span>
          </div>
        </div>
        <div className="payment-actions">
          <button
            className="btn-action"
            onClick={() => onToggle(payment.id)}
            title={payment.isActive ? 'В архив' : 'Вернуть из архива'}
          >
            {payment.isActive ? '📦' : '📤'}
          </button>
          {onEdit && (
            <button
              className="btn-action"
              onClick={() => onEdit(payment)}
              title="Редактировать"
            >
              ✏️
            </button>
          )}
          <button
            className="btn-action delete"
            onClick={() => onDelete(payment.id)}
            title="Удалить"
          >
            🗑️
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="payments-list-container">
      <div className="payments-grid">
        <div className="add-payment-card" onClick={onAdd}>
          <div className="add-icon">+</div>
          <div className="add-text">Добавить платеж</div>
        </div>

        {/* Просроченные платежи */}
        {paymentsByStatus.overdue.length > 0 && (
          <>
            <div className="payment-group-header payment-group-overdue">
              <span className="group-icon">⚠️</span>
              <span className="group-title">Просроченные платежи</span>
              <span className="group-count">({paymentsByStatus.overdue.length})</span>
            </div>
            {paymentsByStatus.overdue.map(renderPaymentCard)}
          </>
        )}

        {/* Предстоящие платежи */}
        {paymentsByStatus.upcoming.length > 0 && (
          <>
            <div className="payment-group-header payment-group-upcoming">
              <span className="group-icon">📅</span>
              <span className="group-title">Предстоящие платежи</span>
              <span className="group-count">({paymentsByStatus.upcoming.length})</span>
            </div>
            {paymentsByStatus.upcoming.map(renderPaymentCard)}
          </>
        )}

        {/* Оплаченные платежи */}
        {paymentsByStatus.paid.length > 0 && (
          <>
            <div className="payment-group-header payment-group-paid">
              <span className="group-icon">✓</span>
              <span className="group-title">Оплаченные платежи</span>
              <span className="group-count">({paymentsByStatus.paid.length})</span>
            </div>
            {paymentsByStatus.paid.map(renderPaymentCard)}
          </>
        )}

        {/* Архив (неактивные) */}
        {archived.length > 0 && (
          <>
            <div className="payment-group-header payment-group-archived">
              <span className="group-icon">📦</span>
              <span className="group-title">Архив</span>
              <span className="group-count">({archived.length})</span>
            </div>
            {archived.map(renderPaymentCard)}
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentsList;

