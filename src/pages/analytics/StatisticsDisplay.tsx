import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TransactionStatisticsDTO } from '../../api/transactions';
import './StatisticsDisplay.css';

interface StatisticsDisplayProps {
  data: TransactionStatisticsDTO;
  period: number;
  onNewRequest: () => void;
}

const COLORS = [
  '#10b981',
  '#8b5cf6',
  '#14b8a6',
  '#f97316',
  '#06b6d4',
  '#ec4899',
  '#f59e0b',
  '#3b82f6',
  '#ef4444',
  '#22c55e',
];

const StatisticsDisplay: React.FC<StatisticsDisplayProps> = ({
  data,
  period,
  onNewRequest,
}) => {
  const formatAmount = (amount: number) => {
    return `${amount.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽`;
  };

  // Подготовка данных для круговой диаграммы расходов
  const expensesChartData = Object.entries(data.expensesByCategory).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
    }),
  );

  // Подготовка данных для круговой диаграммы доходов
  const incomeChartData = Object.entries(data.incomeByCategory).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
    }),
  );

  // Подготовка данных для столбчатой диаграммы по месяцам
  const monthlyData = (() => {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const months: Array<{ month: string; expenses: number; income: number }> = [];

    const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

    while (current <= end) {
      const monthKey = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
      months.push({
        month: monthKey,
        expenses: data.monthlyExpenses[monthKey] || 0,
        income: data.monthlyIncome[monthKey] || 0,
      });
      current.setMonth(current.getMonth() + 1);
    }

    return months;
  })();

  // Подготовка данных для линейной диаграммы средних расходов по категориям
  const avgExpensesLineData = (() => {
    if (data.avgExpensesByCategory.length === 0) return [];

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const result: Array<Record<string, string | number>> = [];

    const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

    while (current <= end) {
      const monthKey = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
      const dataPoint: Record<string, string | number> = { month: monthKey };
      
      data.avgExpensesByCategory.forEach((cat) => {
        dataPoint[cat.categoryName] = cat.timeSeries[monthKey] || 0;
      });
      
      result.push(dataPoint);
      current.setMonth(current.getMonth() + 1);
    }

    return result;
  })();

  // Подготовка данных для линейной диаграммы средних доходов по категориям
  const avgIncomeLineData = (() => {
    if (data.avgIncomeByCategory.length === 0) return [];

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const result: Array<Record<string, string | number>> = [];

    const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

    while (current <= end) {
      const monthKey = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
      const dataPoint: Record<string, string | number> = { month: monthKey };
      
      data.avgIncomeByCategory.forEach((cat) => {
        dataPoint[cat.categoryName] = cat.timeSeries[monthKey] || 0;
      });
      
      result.push(dataPoint);
      current.setMonth(current.getMonth() + 1);
    }

    return result;
  })();

  return (
    <div className="statistics-display">
      <div className="statistics-header">
        <h2 className="statistics-title">
          Статистика за {period}{' '}
          {period === 1 ? 'месяц' : period < 5 ? 'месяца' : 'месяцев'}
        </h2>
        <button className="btn-new-request" onClick={onNewRequest}>
          Новый запрос
        </button>
      </div>

      {/* Ключевые метрики */}
      <div className="key-metrics">
        <div className="metric-card">
          <div className="metric-label">Средний расход</div>
          <div className="metric-value">{formatAmount(data.averageExpense)}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Средний доход</div>
          <div className="metric-value">{formatAmount(data.averageIncome)}</div>
        </div>
        {data.maxExpensePerDay && (
          <div className="metric-card">
            <div className="metric-label">Макс. расход за день</div>
            <div className="metric-value">
              {formatAmount(data.maxExpensePerDay.amount)}
            </div>
            <div className="metric-date">{data.maxExpensePerDay.date}</div>
          </div>
        )}
        {data.maxExpensePerCategory && (
          <div className="metric-card">
            <div className="metric-label">Топ категория расходов</div>
            <div className="metric-value">
              {formatAmount(data.maxExpensePerCategory.amount)}
            </div>
            <div className="metric-date">
              {data.maxExpensePerCategory.categoryName}
            </div>
          </div>
        )}
      </div>

      {/* Графики */}
      <div className="charts-grid">
        {/* Круговая диаграмма расходов */}
        {expensesChartData.length > 0 && (
          <div className="chart-card">
            <h3 className="chart-title">Расходы по категориям</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expensesChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expensesChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [
                    formatAmount(value),
                    name,
                  ]}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value, entry: any) => {
                    const percent = entry.payload
                      ? ((entry.payload.value /
                          expensesChartData.reduce(
                            (sum, item) => sum + item.value,
                            0,
                          )) *
                          100
                        ).toFixed(0)
                      : 0;
                    return `${value} (${percent}%)`;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Круговая диаграмма доходов */}
        {incomeChartData.length > 0 && (
          <div className="chart-card">
            <h3 className="chart-title">Доходы по источникам</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incomeChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {incomeChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [
                    formatAmount(value),
                    name,
                  ]}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value, entry: any) => {
                    const percent = entry.payload
                      ? ((entry.payload.value /
                          incomeChartData.reduce(
                            (sum, item) => sum + item.value,
                            0,
                          )) *
                          100
                        ).toFixed(0)
                      : 0;
                    return `${value} (${percent}%)`;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Столбчатая диаграмма расходов по месяцам */}
        {monthlyData.length > 0 && (
          <div className="chart-card">
            <h3 className="chart-title">Расходы по месяцам</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatAmount(value)} />
                <Legend />
                <Bar dataKey="expenses" fill="#ef4444" name="Расходы" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Столбчатая диаграмма доходов по месяцам */}
        {monthlyData.length > 0 && (
          <div className="chart-card">
            <h3 className="chart-title">Доходы по месяцам</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatAmount(value)} />
                <Legend />
                <Bar dataKey="income" fill="#10b981" name="Доходы" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Линейная диаграмма средних расходов по категориям */}
        {avgExpensesLineData.length > 0 &&
          data.avgExpensesByCategory.length > 0 && (
            <div className="chart-card chart-card-wide">
              <h3 className="chart-title">
                Средние расходы по категориям во времени
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={avgExpensesLineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => formatAmount(value)} />
                  <Legend />
                  {data.avgExpensesByCategory.map((cat, index) => (
                    <Line
                      key={cat.categoryName}
                      type="monotone"
                      dataKey={cat.categoryName}
                      stroke={COLORS[index % COLORS.length]}
                      strokeWidth={2}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

        {/* Линейная диаграмма средних доходов по категориям */}
        {avgIncomeLineData.length > 0 &&
          data.avgIncomeByCategory.length > 0 && (
            <div className="chart-card chart-card-wide">
              <h3 className="chart-title">
                Средние доходы по категориям во времени
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={avgIncomeLineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => formatAmount(value)} />
                  <Legend />
                  {data.avgIncomeByCategory.map((cat, index) => (
                    <Line
                      key={cat.categoryName}
                      type="monotone"
                      dataKey={cat.categoryName}
                      stroke={COLORS[index % COLORS.length]}
                      strokeWidth={2}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
      </div>
    </div>
  );
};

export default StatisticsDisplay;

