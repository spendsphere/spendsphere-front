import React, { useState } from 'react';
import Sidebar from '../../shared/Sidebar';
import Header from '../../shared/Header';
import AnalyticsTabs from './AnalyticsTabs';
import AnalyticsRequest from './AnalyticsRequest';
import TipsRequest from './TipsRequest';
import AnalyticsDisplay from './AnalyticsDisplay';
import TipsDisplay from './TipsDisplay';
import './AnalyticsPage.css';

export interface AnalyticsData {
  id: string;
  period: number; // months
  data: {
    expensesByCategory: Array<{ category: string; amount: number; percentage: number }>;
    incomeExpenseTrend: Array<{ date: string; income: number; expense: number }>;
    savingsTrend: Array<{ date: string; savings: number }>;
    topExpenses: Array<{ category: string; amount: number }>;
  };
  generatedAt: string;
}

export interface Tip {
  id: string;
  text: string;
  category: string;
  impact: string;
}

export interface TipGroup {
  id: string;
  goal: string;
  targetDate?: string;
  tips: Tip[];
  createdAt: string;
}

const AnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'tips'>('analytics');
  const [isRequestingAnalytics, setIsRequestingAnalytics] = useState(false);
  const [isRequestingTips, setIsRequestingTips] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [tipGroups, setTipGroups] = useState<TipGroup[]>([]);

  const handleRequestAnalytics = async (period: number) => {
    setIsRequestingAnalytics(true);
    try {
      // Mock API call - simulate delay
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Mock analytics data
      const mockData: AnalyticsData = {
        id: Date.now().toString(),
        period,
        data: {
          expensesByCategory: [
            { category: 'Еда', amount: 4800, percentage: 40 },
            { category: 'Развлечения', amount: 3500, percentage: 29 },
            { category: 'Транспорт', amount: 2500, percentage: 21 },
            { category: 'Прочее', amount: 1200, percentage: 10 },
          ],
          incomeExpenseTrend: Array.from({ length: 25 }, (_, i) => ({
            date: `2025-11-${String(i + 1).padStart(2, '0')}`,
            income: Math.random() * 50000 + 30000,
            expense: Math.random() * 10000 + 5000,
          })),
          savingsTrend: Array.from({ length: 25 }, (_, i) => ({
            date: `2025-11-${String(i + 1).padStart(2, '0')}`,
            savings: 5000 + i * 200,
          })),
          topExpenses: [
            { category: 'Еда', amount: 4800 },
            { category: 'Развлечения', amount: 3500 },
            { category: 'Транспорт', amount: 2500 },
            { category: 'Прочее', amount: 1200 },
          ],
        },
        generatedAt: new Date().toISOString(),
      };

      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error generating analytics:', error);
      alert('Ошибка при генерации аналитики. Попробуйте еще раз.');
    } finally {
      setIsRequestingAnalytics(false);
    }
  };

  const handleRequestTips = async (goal: string, targetDate?: string) => {
    setIsRequestingTips(true);
    try {
      // Mock API call - simulate delay
      await new Promise((resolve) => setTimeout(resolve, 2500));

      // Mock tips
      const mockTips: Tip[] = [
        {
          id: '1',
          text: 'Сократи расходы на подписки',
          category: 'Экономия',
          impact: 'До 1500 Р в месяц',
        },
        {
          id: '2',
          text: 'Перенеси оплату интернета на дебетовую карту для кэшбэка',
          category: 'Оптимизация',
          impact: 'До 200 Р в месяц',
        },
        {
          id: '3',
          text: 'Ставь цель сбережений',
          category: 'Сбережения',
          impact: 'Отложить 15% дохода ежемесячно',
        },
        {
          id: '4',
          text: 'Используй быстрые платежи для регулярных расходов',
          category: 'Оптимизация',
          impact: 'Экономия времени',
        },
      ];

      const newGroup: TipGroup = {
        id: Date.now().toString(),
        goal,
        targetDate,
        tips: mockTips,
        createdAt: new Date().toISOString(),
      };

      setTipGroups((prev) => [newGroup, ...prev]);
    } catch (error) {
      console.error('Error generating tips:', error);
      alert('Ошибка при генерации советов. Попробуйте еще раз.');
    } finally {
      setIsRequestingTips(false);
    }
  };

  const handleDeleteTipGroup = (groupId: string) => {
    setTipGroups((prev) => prev.filter((group) => group.id !== groupId));
  };

  return (
    <div className="analytics-page">
      <Sidebar />
      <div className="analytics-page-main">
        <Header title="Аналитика" />
        <div className="analytics-page-content">
          <AnalyticsTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          {activeTab === 'analytics' ? (
            <>
              {!analyticsData && !isRequestingAnalytics && (
                <AnalyticsRequest onRequest={handleRequestAnalytics} />
              )}
              {isRequestingAnalytics && (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Генерация аналитики...</p>
                </div>
              )}
              {analyticsData && !isRequestingAnalytics && (
                <AnalyticsDisplay
                  data={analyticsData}
                  onNewRequest={() => setAnalyticsData(null)}
                />
              )}
            </>
          ) : (
            <>
              <TipsRequest
                onRequest={handleRequestTips}
                isRequesting={isRequestingTips}
              />
              {isRequestingTips && (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Генерация советов...</p>
                </div>
              )}
              <TipsDisplay
                tipGroups={tipGroups}
                onDeleteGroup={handleDeleteTipGroup}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;

