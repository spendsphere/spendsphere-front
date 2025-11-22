import React, { useState } from 'react';
import Sidebar from '../../shared/Sidebar';
import Header from '../../shared/Header';
import SummaryCards from './SummaryCards';
import PaymentsList from './PaymentsList';
import AddRegularPaymentModal from './AddRegularPaymentModal';
import './RegularPaymentsPage.css';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payments, setPayments] = useState<RegularPayment[]>([
    {
      id: '1',
      name: 'Spotify',
      icon: '🎵',
      amount: 169,
      period: 'monthly',
      dayOfMonth: 15,
      category: 'Развлечения',
      categoryColor: '#8b5cf6',
      isActive: true,
      nextPayment: '2025-11-15',
    },
    {
      id: '2',
      name: 'Netflix',
      icon: '📺',
      amount: 499,
      period: 'monthly',
      dayOfMonth: 7,
      category: 'Видео',
      categoryColor: '#10b981',
      isActive: true,
      nextPayment: '2025-12-07',
    },
    {
      id: '3',
      name: 'iCloud',
      icon: '☁️',
      amount: 99,
      period: 'monthly',
      dayOfMonth: 1,
      category: 'Облако',
      categoryColor: '#3b82f6',
      isActive: true,
      lastPaid: '2025-11-01',
    },
  ]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddPayment = (newPayment: Omit<RegularPayment, 'id'>) => {
    const payment: RegularPayment = {
      ...newPayment,
      id: Date.now().toString(),
    };
    setPayments((prev) => [payment, ...prev]);
    setIsModalOpen(false);
  };

  const handleTogglePayment = (id: string) => {
    setPayments((prev) =>
      prev.map((payment) =>
        payment.id === id ? { ...payment, isActive: !payment.isActive } : payment
      )
    );
  };

  const handleDeletePayment = (id: string) => {
    setPayments((prev) => prev.filter((payment) => payment.id !== id));
  };

  // Calculate monthly expenses (convert all periods to monthly equivalent)
  const calculateMonthlyExpense = (payment: RegularPayment): number => {
    if (!payment.isActive) return 0;

    switch (payment.period) {
      case 'weekly':
        return payment.amount * 4.33; // Average weeks per month
      case 'monthly':
        return payment.amount;
      case 'quarterly':
        return payment.amount / 3;
      case 'yearly':
        return payment.amount / 12;
      case 'custom':
        if (payment.customDays) {
          return (payment.amount / payment.customDays) * 30; // Approximate monthly
        }
        return payment.amount;
      default:
        return payment.amount;
    }
  };

  const monthlyExpenses = Math.round(
    payments.reduce((sum, p) => sum + calculateMonthlyExpense(p), 0)
  );
  const totalPayments = payments.length;
  const remainingThisMonth = payments.filter((p) => {
    if (!p.isActive || !p.nextPayment) return false;
    const nextDate = new Date(p.nextPayment);
    const today = new Date();
    return nextDate.getMonth() === today.getMonth();
  }).length;

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

