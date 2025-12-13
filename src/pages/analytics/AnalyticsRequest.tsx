import React, { useState } from 'react';
import './AnalyticsRequest.css';

interface AnalyticsRequestProps {
  onRequest: (_period: number) => void;
}

const AnalyticsRequest: React.FC<AnalyticsRequestProps> = ({ onRequest }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<number>(1);

  const periods = [
    { value: 1, label: '1 месяц' },
    { value: 3, label: '3 месяца' },
    { value: 6, label: '6 месяцев' },
    { value: 12, label: '12 месяцев' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRequest(selectedPeriod);
  };

  return (
    <div className="analytics-request">
      <div className="request-card">
        <h2 className="request-title">Запросить аналитику</h2>
        <p className="request-description">
          Выберите период для анализа ваших финансов
        </p>
        <form onSubmit={handleSubmit} className="request-form">
          <div className="period-selector">
            {periods.map((period) => (
              <label key={period.value} className="period-option">
                <input
                  type="radio"
                  name="period"
                  value={period.value}
                  checked={selectedPeriod === period.value}
                  onChange={(e) =>
                    setSelectedPeriod(Number(e.target.value))
                  }
                />
                <span>{period.label}</span>
              </label>
            ))}
          </div>
          <button type="submit" className="btn-request">
            Сгенерировать аналитику
          </button>
        </form>
      </div>
    </div>
  );
};

export default AnalyticsRequest;

