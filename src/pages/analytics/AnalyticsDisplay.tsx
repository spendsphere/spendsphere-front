import React from 'react';
import { AnalyticsData } from './AnalyticsPage';
import './AnalyticsDisplay.css';

interface AnalyticsDisplayProps {
  data: AnalyticsData;
  onNewRequest: () => void;
}

const AnalyticsDisplay: React.FC<AnalyticsDisplayProps> = ({
  data,
  onNewRequest,
}) => {
  const formatAmount = (amount: number) => {
    return `${amount.toLocaleString('ru-RU')} Р`;
  };

  const categoryColors: Record<string, string> = {
    Еда: '#10b981',
    Транспорт: '#8b5cf6',
    Развлечения: '#14b8a6',
    Прочее: '#f97316',
  };

  return (
    <div className="analytics-display">
      <div className="analytics-header">
        <h2 className="analytics-title">
          Аналитика за {data.period}{' '}
          {data.period === 1
            ? 'месяц'
            : data.period < 5
              ? 'месяца'
              : 'месяцев'}
        </h2>
        <button className="btn-new-request" onClick={onNewRequest}>
          Новый запрос
        </button>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3 className="card-title">Расходы по категориям</h3>
          <div className="chart-container">
            <div className="chart-legend">
              {data.data.expensesByCategory.map((item) => (
                <div key={item.category} className="legend-item">
                  <span
                    className="legend-color"
                    style={{ backgroundColor: categoryColors[item.category] }}
                  ></span>
                  <span className="legend-label">{item.category}</span>
                </div>
              ))}
            </div>
            <div className="pie-chart-placeholder">
              <div className="chart-note">График расходов по категориям</div>
              {data.data.expensesByCategory.map((item) => (
                <div key={item.category} className="category-item">
                  <span
                    className="category-color"
                    style={{ backgroundColor: categoryColors[item.category] }}
                  ></span>
                  <span className="category-name">{item.category}</span>
                  <span className="category-amount">
                    {formatAmount(item.amount)} ({item.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="analytics-card">
          <h3 className="card-title">Доходы и расходы</h3>
          <div className="chart-container">
            <div className="line-chart-placeholder">
              <div className="chart-note">Тренд доходов и расходов</div>
              <div className="chart-data">
                {data.data.incomeExpenseTrend.slice(0, 10).map((item) => (
                  <div key={item.date} className="chart-bar">
                    <div
                      className="bar-income"
                      style={{
                        height: `${(item.income / 60000) * 100}%`,
                      }}
                    ></div>
                    <div
                      className="bar-expense"
                      style={{
                        height: `${(item.expense / 10000) * 100}%`,
                      }}
                    ></div>
                  </div>
                ))}
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-color income"></span>
                  <span className="legend-label">Доходы</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color expense"></span>
                  <span className="legend-label">Расходы</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="analytics-card">
          <h3 className="card-title">Тренд сбережений</h3>
          <div className="chart-container">
            <div className="savings-chart-placeholder">
              <div className="chart-note">Динамика сбережений</div>
              <div className="chart-data">
                {data.data.savingsTrend.slice(0, 10).map((item) => (
                  <div key={item.date} className="savings-bar">
                    <div
                      className="bar-savings"
                      style={{
                        height: `${(item.savings / 12000) * 100}%`,
                        backgroundColor: '#14b8a6',
                      }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="analytics-card">
          <h3 className="card-title">Топ расходов</h3>
          <div className="top-expenses-list">
            {data.data.topExpenses.map((item) => (
              <div key={item.category} className="expense-item">
                <div className="expense-info">
                  <span
                    className="expense-color"
                    style={{ backgroundColor: categoryColors[item.category] }}
                  ></span>
                  <span className="expense-name">{item.category}</span>
                </div>
                <div className="expense-bar-container">
                  <div
                    className="expense-bar"
                    style={{
                      width: `${
                        (item.amount /
                          Math.max(...data.data.topExpenses.map((e) => e.amount))) *
                        100
                      }%`,
                      backgroundColor: categoryColors[item.category],
                    }}
                  ></div>
                </div>
                <span className="expense-amount">{formatAmount(item.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDisplay;

