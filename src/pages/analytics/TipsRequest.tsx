import React, { useState } from 'react';
import './TipsRequest.css';

interface TipsRequestProps {
  onRequest: (goal: string, targetDate?: string) => void;
  isRequesting: boolean;
}

const TipsRequest: React.FC<TipsRequestProps> = ({
  onRequest,
  isRequesting,
}) => {
  const [goal, setGoal] = useState<string>('');
  const [targetDate, setTargetDate] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) {
      alert('Введите цель');
      return;
    }
    onRequest(goal.trim(), targetDate || undefined);
    setGoal('');
    setTargetDate('');
  };

  return (
    <div className="tips-request">
      <div className="request-card">
        <h2 className="request-title">Запросить советы</h2>
        <p className="request-description">
          Опишите вашу финансовую цель, и мы предложим советы для её достижения
        </p>
        <form onSubmit={handleSubmit} className="tips-form">
          <div className="form-group">
            <label htmlFor="goal" className="form-label">
              Цель *
            </label>
            <input
              type="text"
              id="goal"
              className="form-input"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Например: Накопить на отпуск"
              required
              disabled={isRequesting}
            />
          </div>
          <div className="form-group">
            <label htmlFor="targetDate" className="form-label">
              Желаемая дата достижения (опционально)
            </label>
            <input
              type="date"
              id="targetDate"
              className="form-input"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              disabled={isRequesting}
            />
          </div>
          <button
            type="submit"
            className="btn-request"
            disabled={isRequesting || !goal.trim()}
          >
            {isRequesting ? 'Генерация...' : 'Получить советы'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TipsRequest;

