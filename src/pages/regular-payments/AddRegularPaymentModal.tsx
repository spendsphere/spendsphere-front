import React, { useState, useEffect } from 'react';
import { useCategories } from '../../context/CategoriesContext';
import { RegularPayment } from './RegularPaymentsPage';
import './AddRegularPaymentModal.css';

interface AddRegularPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payment: Omit<RegularPayment, 'id'>) => void;
}

const AddRegularPaymentModal: React.FC<AddRegularPaymentModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom'>(
    'monthly'
  );
  const [dayOfMonth, setDayOfMonth] = useState<string>('');
  const [dayOfWeek, setDayOfWeek] = useState<string>('1');
  const [monthInQuarter, setMonthInQuarter] = useState<string>('1');
  const [monthOfYear, setMonthOfYear] = useState<string>('1');
  const [customDays, setCustomDays] = useState<string>('');
  const { getExpenseCategories, getCategoryByName } = useCategories();
  const [category, setCategory] = useState<string>('');
  const [categoryColor, setCategoryColor] = useState<string>('#8b5cf6');
  const [icon, setIcon] = useState<string>('💳');

  const categories = getExpenseCategories();

  const icons = ['💳', '🎵', '📺', '☁️', '📱', '💻', '🎮', '📚'];

  useEffect(() => {
    if (isOpen) {
      setName('');
      setAmount('');
      setPeriod('monthly');
      setDayOfMonth('');
      setDayOfWeek('1');
      setMonthInQuarter('1');
      setMonthOfYear('1');
      setCustomDays('');
      setCategory('');
      setCategoryColor('#8b5cf6');
      setIcon('💳');
    }
  }, [isOpen]);

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
      case 'quarterly': {
        const selectedMonthInQuarter = parseInt(monthInQuarter) || 1; // 1-3
        const selectedDay = parseInt(dayOfMonth) || 1;
        const currentMonth = today.getMonth(); // 0-11
        const currentQuarter = Math.floor(currentMonth / 3); // 0-3
        const currentYear = today.getFullYear();
        
        // Месяцы кварталов: 0-2 (янв-март), 3-5 (апр-июнь), 6-8 (июл-сен), 9-11 (окт-дек)
        // selectedMonthInQuarter: 1 = первый месяц квартала, 2 = второй, 3 = третий
        const monthInQuarterIndex = selectedMonthInQuarter - 1; // 0-2
        const quarterStartMonth = currentQuarter * 3; // 0, 3, 6, 9
        const targetMonth = quarterStartMonth + monthInQuarterIndex; // 0-11
        
        nextDate = new Date(currentYear, targetMonth, selectedDay);
        
        if (nextDate < today) {
          // Если день прошел, берем следующий квартал
          const nextQuarter = (currentQuarter + 1) % 4;
          const nextQuarterStartMonth = nextQuarter * 3;
          const nextTargetMonth = nextQuarterStartMonth + monthInQuarterIndex;
          
          if (nextQuarter === 0) {
            // Следующий год
            nextDate = new Date(currentYear + 1, nextTargetMonth, selectedDay);
          } else {
            nextDate = new Date(currentYear, nextTargetMonth, selectedDay);
          }
        }
        break;
      }
      case 'yearly': {
        const selectedMonth = parseInt(monthOfYear) || 1; // 1-12
        const selectedDay = parseInt(dayOfMonth) || 1;
        const monthIndex = selectedMonth - 1; // 0-11
        nextDate = new Date(today.getFullYear(), monthIndex, selectedDay);
        if (nextDate < today) {
          nextDate.setFullYear(today.getFullYear() + 1);
        }
        break;
      }
      case 'custom': {
        const days = parseInt(customDays) || 30;
        nextDate = new Date(today);
        nextDate.setDate(today.getDate() + days);
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
    if (!name || !amount || !category) {
      alert('Заполните все обязательные поля');
      return;
    }

    if (period === 'monthly' && !dayOfMonth) {
      alert('Укажите день месяца');
      return;
    }

    if (period === 'quarterly') {
      if (!monthInQuarter || !dayOfMonth) {
        alert('Укажите месяц в квартале и день месяца');
        return;
      }
    }

    if (period === 'yearly') {
      if (!monthOfYear || !dayOfMonth) {
        alert('Укажите месяц и день месяца');
        return;
      }
    }

    if (period === 'weekly' && !dayOfWeek) {
      alert('Укажите день недели');
      return;
    }

    if (period === 'custom' && !customDays) {
      alert('Укажите количество дней');
      return;
    }

    const selectedCategory = getCategoryByName(category);

    const paymentData: Omit<RegularPayment, 'id'> = {
      name: name.trim(),
      icon,
      amount: parseFloat(amount),
      period,
      category,
      categoryColor: selectedCategory?.color || '#8b5cf6',
      isActive: true,
      nextPayment: calculateNextPayment(),
    };

    if (period === 'monthly') {
      paymentData.dayOfMonth = parseInt(dayOfMonth);
    }

    if (period === 'quarterly') {
      paymentData.monthInQuarter = parseInt(monthInQuarter);
      paymentData.dayOfMonth = parseInt(dayOfMonth);
    }

    if (period === 'yearly') {
      paymentData.monthOfYear = parseInt(monthOfYear);
      paymentData.dayOfMonth = parseInt(dayOfMonth);
    }

    if (period === 'weekly') {
      paymentData.dayOfWeek = parseInt(dayOfWeek);
    }

    if (period === 'custom') {
      paymentData.customDays = parseInt(customDays);
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
                    | 'weekly'
                    | 'monthly'
                    | 'quarterly'
                    | 'yearly'
                    | 'custom'
                )
              }
              required
            >
              <option value="weekly">Еженедельно</option>
              <option value="monthly">Ежемесячно</option>
              <option value="quarterly">Ежеквартально</option>
              <option value="yearly">Ежегодно</option>
              <option value="custom">Кастомный период</option>
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

          {period === 'quarterly' && (
            <>
              <div className="form-group">
                <label htmlFor="monthInQuarter" className="form-label">
                  Месяц в квартале *
                </label>
                <select
                  id="monthInQuarter"
                  className="form-select"
                  value={monthInQuarter}
                  onChange={(e) => setMonthInQuarter(e.target.value)}
                  required
                >
                  <option value="1">1-й месяц квартала (янв/апр/июл/окт)</option>
                  <option value="2">2-й месяц квартала (фев/май/авг/ноя)</option>
                  <option value="3">3-й месяц квартала (мар/июн/сен/дек)</option>
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

          {period === 'custom' && (
            <div className="form-group">
              <label htmlFor="customDays" className="form-label">
                Количество дней *
              </label>
              <input
                type="number"
                id="customDays"
                className="form-input"
                value={customDays}
                onChange={(e) => setCustomDays(e.target.value)}
                placeholder="Например: 14, 45, 90"
                required
                min="1"
              />
            </div>
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
                const selectedCategory = getCategoryByName(e.target.value);
                if (selectedCategory) {
                  setCategoryColor(selectedCategory.color);
                }
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

