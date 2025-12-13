import React from 'react';
import { TipGroup, Tip } from './AnalyticsPage';
import './TipsDisplay.css';

interface TipsDisplayProps {
  tipGroups: TipGroup[];
  onDeleteGroup?: (_groupId: string) => void;
}

const TipsDisplay: React.FC<TipsDisplayProps> = ({
  tipGroups,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const getPriorityClass = (category: string): string => {
    if (category.includes('Важно')) return 'high';
    if (category.includes('Средний')) return 'medium';
    if (category.includes('Низкий')) return 'low';
    return 'default';
  };

  const getPriorityIcon = (category: string): string => {
    if (category.includes('Важно')) return '🔴';
    if (category.includes('Средний')) return '🟡';
    if (category.includes('Низкий')) return '🟢';
    return '💡';
  };

  const getPriorityValue = (category: string): number => {
    if (category.includes('Важно')) return 1;
    if (category.includes('Средний')) return 2;
    if (category.includes('Низкий')) return 3;
    return 4;
  };

  const sortTips = (tips: Tip[]): Tip[] => {
    return [...tips].sort((a, b) => {
      const priorityA = getPriorityValue(a.category);
      const priorityB = getPriorityValue(b.category);
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      return parseInt(a.id) - parseInt(b.id);
    });
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
      {tipGroups.slice(0, 10).map((group) => (
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
          </div>
          <div className="tips-grid">
            {sortTips(group.tips).map((tip) => (
              <div key={tip.id} className={`tip-card priority-${getPriorityClass(tip.category)}`}>
                <div className="tip-header">
                  <div className="tip-icon">
                    {getPriorityIcon(tip.category)}
                  </div>
                  <span className="tip-priority-badge">{tip.category}</span>
                </div>
                <div className="tip-content">
                  <h4 className="tip-text">{tip.text}</h4>
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

