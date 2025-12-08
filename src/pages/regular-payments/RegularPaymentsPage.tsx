import React, { useEffect, useState } from 'react';
import Sidebar from '../../shared/Sidebar';
import Header from '../../shared/Header';
import SummaryCards from './SummaryCards';
import PaymentsList from './PaymentsList';
import AddRegularPaymentModal from './AddRegularPaymentModal';
import './RegularPaymentsPage.css';
import { useAuth } from '../../context/AuthContext';
import { remindersApi, type ReminderDTO, type ReminderCreateDTO, type ReminderUpdateDTO } from '../../api/reminders';

export interface RegularPayment {
  id: string;
  name: string;
  icon: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  dayOfMonth?: number; // Для monthly - день месяца (1-31)
  dayOfWeek?: number; // Для weekly (0-6, где 0 = воскресенье)
  monthInQuarter?: number; // Для quarterly - номер месяца в квартале (1-3)
  monthOfYear?: number; // Для yearly - номер месяца в году (1-12)
  customDays?: number; // Для custom периода (количество дней)
  category: string;
  categoryColor: string;
  isActive: boolean;
  lastPaid?: string;
  nextPayment?: string;
}

const RegularPaymentsPage: React.FC = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payments, setPayments] = useState<RegularPayment[]>([]);

  const mapDto = (r: ReminderDTO): RegularPayment => ({
    id: String(r.id),
    name: r.title,
    icon: '🔔',
    amount: Number(r.amount),
    period:
      r.recurrenceType === 'WEEKLY'
        ? 'weekly'
        : r.recurrenceType === 'MONTHLY'
        ? 'monthly'
        : r.recurrenceType === 'YEARLY'
        ? 'yearly'
        : 'custom',
    dayOfMonth: r.monthlyDayOfMonth ?? undefined,
    dayOfWeek:
      r.weeklyDayOfWeek != null
        ? ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'].indexOf(
            r.weeklyDayOfWeek,
          )
        : undefined,
    category: r.accountName || 'Счет',
    categoryColor: '#8b5cf6',
    isActive: !!r.isActive,
    lastPaid: undefined,
    nextPayment: undefined,
  });

  const load = async () => {
    if (!user) return;
    try {
      const list = await remindersApi.list(user.id);
      setPayments(list.map(mapDto));
    } catch {
      setPayments([]);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddPayment = async (newPayment: Omit<RegularPayment, 'id'>) => {
    if (!user) return;
    try {
      const dowMap = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'] as const;
      const body: ReminderCreateDTO = {
        title: newPayment.name,
        description: null,
        amount: newPayment.amount,
        recurrenceType:
          newPayment.period === 'weekly'
            ? 'WEEKLY'
            : newPayment.period === 'monthly'
            ? 'MONTHLY'
            : newPayment.period === 'yearly'
            ? 'YEARLY'
            : 'MONTHLY',
        weeklyDayOfWeek:
          newPayment.period === 'weekly' && typeof newPayment.dayOfWeek === 'number'
            ? dowMap[newPayment.dayOfWeek] || null
            : null,
        monthlyDayOfMonth:
          newPayment.period === 'monthly' || newPayment.period === 'quarterly' || newPayment.period === 'yearly'
            ? newPayment.dayOfMonth ?? null
            : null,
        monthlyUseLastDay: null,
        isActive: newPayment.isActive,
        accountId: 1, // TODO: выбрать счет из UI
      };
      const created = await remindersApi.create(user.id, body);
      setPayments((prev) => [mapDto(created), ...prev]);
      setIsModalOpen(false);
    } catch {
      // noop
    }
  };

  const handleTogglePayment = async (id: string) => {
    if (!user) return;
    const target = payments.find((p) => p.id === id);
    if (!target) return;
    try {
      const body: ReminderUpdateDTO = { isActive: !target.isActive };
      const updated = await remindersApi.update(user.id, Number(id), body);
      setPayments((prev) => prev.map((p) => (p.id === id ? mapDto(updated) : p)));
    } catch {
      // noop
    }
  };

  const handleDeletePayment = async (id: string) => {
    if (!user) return;
    try {
      await remindersApi.remove(user.id, Number(id));
      setPayments((prev) => prev.filter((payment) => payment.id !== id));
    } catch {
      // noop
    }
  };

  // Точное планирование на текущий месяц для weekly/monthly
  const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const lastDay = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
  const today = new Date();
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const listWeeklyDatesInMonth = (dow: number): Date[] => {
    const res: Date[] = [];
    // Найти первую дату этого дня недели в текущем месяце
    const first = new Date(firstDay);
    const delta = (dow - first.getDay() + 7) % 7;
    first.setDate(first.getDate() + delta);
    for (let d = new Date(first); d <= lastDay; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7)) {
      res.push(d);
    }
    return res;
  };

  const getMonthlyDateInMonth = (dom?: number): Date | null => {
    if (!dom) return null;
    const d = new Date(firstDay.getFullYear(), firstDay.getMonth(), dom);
    if (d.getMonth() !== firstDay.getMonth()) return null; // некорректный день (например 31 в коротком месяце)
    return d;
  };

  const monthlyExpenses = Math.round(
    payments.reduce((sum, p) => {
      if (!p.isActive) return sum;
      if (p.period === 'weekly' && typeof p.dayOfWeek === 'number') {
        const dates = listWeeklyDatesInMonth(p.dayOfWeek);
        return sum + dates.length * p.amount;
      }
      if (p.period === 'monthly') {
        const d = getMonthlyDateInMonth(p.dayOfMonth);
        return sum + (d ? p.amount : 0);
      }
      // Для yearly/custom без точной даты в месяце не учитываем в ежемесячных расходах
      return sum;
    }, 0)
  );

  const totalPayments = payments.length;

  const remainingThisMonth = payments.reduce((cnt, p) => {
    if (!p.isActive) return cnt;
    if (p.period === 'weekly' && typeof p.dayOfWeek === 'number') {
      const dates = listWeeklyDatesInMonth(p.dayOfWeek);
      return cnt + dates.filter((d) => d >= today || sameDay(d, today)).length;
    }
    if (p.period === 'monthly') {
      const d = getMonthlyDateInMonth(p.dayOfMonth);
      if (d && (d >= today || sameDay(d, today))) return cnt + 1;
    }
    return cnt;
  }, 0);

  return (
    <div className="regular-payments-page">
      <Sidebar />
      <div className="regular-payments-page-main">
        <Header title="Регулярные платежи" />
        <div className="regular-payments-page-content">
          <div className="summary-section">
            <SummaryCards
              monthlyExpenses={monthlyExpenses}
              totalPayments={totalPayments}
              remainingThisMonth={remainingThisMonth}
            />
          </div>

          <PaymentsList
            payments={payments}
            onAdd={handleOpenModal}
            onToggle={handleTogglePayment}
            onDelete={handleDeletePayment}
          />
        </div>
      </div>
      <AddRegularPaymentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleAddPayment}
      />
    </div>
  );
};

export default RegularPaymentsPage;

