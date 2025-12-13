import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecentAdvices, AdviceResponseDTO } from '../../api/advices';
import { AuthContext } from '../../context/AuthContext';
import './RecentAdvices.css';

const RecentAdvices: React.FC = () => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const navigate = useNavigate();
  const [recentAdvices, setRecentAdvices] = useState<AdviceResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadRecentAdvices();
    }
  }, [user?.id]);

  const loadRecentAdvices = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const advices = await getRecentAdvices(user.id);
      setRecentAdvices(advices);
    } catch (error) {
      console.error('Error loading recent advices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'High':
        return '#ef4444';
      case 'Medium':
        return '#f59e0b';
      case 'Low':
        return '#10b981';
      default:
        return '#8b5cf6';
    }
  };

  const getPriorityIcon = (priority: string): string => {
    switch (priority) {
      case 'High':
        return '🔴';
      case 'Medium':
        return '🟡';
      case 'Low':
        return '🟢';
      default:
        return '💡';
    }
  };

  const getPriorityValue = (priority: string): number => {
    switch (priority) {
      case 'High':
        return 1;
      case 'Medium':
        return 2;
      case 'Low':
        return 3;
      default:
        return 4;
    }
  };

  const handleViewAllAdvices = () => {
    navigate('/analytics', { state: { activeTab: 'tips' } });
  };

  if (isLoading) {
    return (
      <div className="recent-advices-card">
        <h2 className="recent-advices-title">Недавние советы</h2>
        <div className="recent-advices-loading">
          <div className="loading-spinner-small"></div>
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  if (recentAdvices.length === 0) {
    return (
      <div className="recent-advices-card">
        <h2 className="recent-advices-title">Недавние советы</h2>
        <div className="recent-advices-empty">
          <p>За последний месяц советов нет</p>
          <button className="btn-get-advice" onClick={handleViewAllAdvices}>
            Получить советы
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="recent-advices-card">
      <div className="recent-advices-header">
        <h2 className="recent-advices-title">Недавние советы</h2>
        <button className="btn-view-all" onClick={handleViewAllAdvices}>
          Смотреть все
        </button>
      </div>
      <div className="recent-advices-list">
        {recentAdvices.slice(0, 3).map((advice) => (
          <div key={advice.id} className="advice-preview">
            <div className="advice-preview-header">
              <h3 className="advice-preview-goal">🎯 {advice.goal}</h3>
            </div>
            <div className="advice-preview-items">
              {[...advice.items]
                .sort((a, b) => {
                  const priorityA = getPriorityValue(a.priority);
                  const priorityB = getPriorityValue(b.priority);
                  if (priorityA !== priorityB) {
                    return priorityA - priorityB;
                  }
                  return a.id - b.id;
                })
                .slice(0, 2)
                .map((item) => (
                <div key={item.id} className="advice-preview-item">
                  <span
                    className="advice-preview-icon"
                    style={{ color: getPriorityColor(item.priority) }}
                  >
                    {getPriorityIcon(item.priority)}
                  </span>
                  <span className="advice-preview-text">{item.title}</span>
                </div>
              ))}
              {advice.items.length > 2 && (
                <span className="advice-preview-more">
                  +{advice.items.length - 2} {advice.items.length - 2 === 1 ? 'совет' : 'советов'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentAdvices;

