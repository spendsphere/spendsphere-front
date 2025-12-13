import React from 'react';
import './AnalyticsTabs.css';

interface AnalyticsTabsProps {
  activeTab: 'analytics' | 'tips';
  onTabChange: (_tab: 'analytics' | 'tips') => void;
}

const AnalyticsTabs: React.FC<AnalyticsTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="analytics-tabs">
      <button
        className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
        onClick={() => onTabChange('analytics')}
      >
        Анализ
      </button>
      <button
        className={`tab-button ${activeTab === 'tips' ? 'active' : ''}`}
        onClick={() => onTabChange('tips')}
      >
        Советы
      </button>
    </div>
  );
};

export default AnalyticsTabs;

