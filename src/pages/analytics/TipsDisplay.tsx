import React from 'react';
import { TipGroup } from './AnalyticsPage';
import './TipsDisplay.css';

interface TipsDisplayProps {
  tipGroups: TipGroup[];
  onDeleteGroup: (groupId: string) => void;
}

const TipsDisplay: React.FC<TipsDisplayProps> = ({
  tipGroups,
  onDeleteGroup,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  if (tipGroups.length === 0) {
    return (
      <div className="tips-empty">
        <p>Советы появятся здесь после запроса</p>
      </div>
    );
  }

  return (
    <div className="tips-display">
      {tipGroups.map((group) => (
        <div key={group.id} className="tip-group-card">
          <div className="tip-group-header">
            <div className="tip-group-info">
              <h3 className="tip-group-goal">{group.goal}</h3>
              {group.targetDate && (
                <p className="tip-group-date">
                  Цель до: {formatDate(group.targetDate)}
                </p>
              )}
              <p className="tip-group-created">
                Создано: {formatDate(group.createdAt)}
              </p>
            </div>
            <button
              className="btn-delete-group"
              onClick={() => onDeleteGroup(group.id)}
              title="Удалить группу советов"
            >
              ×
            </button>
          </div>
          <div className="tips-grid">
            {group.tips.map((tip) => (
              <div key={tip.id} className="tip-card">
                <div className="tip-icon">
                  {tip.category === 'Экономия' && '💰'}
                  {tip.category === 'Оптимизация' && '⚡'}
                  {tip.category === 'Сбережения' && '🎯'}
                </div>
                <div className="tip-content">
                  <p className="tip-text">{tip.text}</p>
                  <p className="tip-impact">{tip.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TipsDisplay;

