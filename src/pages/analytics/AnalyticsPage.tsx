import React, { useState, useContext } from 'react';
import Sidebar from '../../shared/Sidebar';
import Header from '../../shared/Header';
import AnalyticsTabs from './AnalyticsTabs';
import AnalyticsRequest from './AnalyticsRequest';
import TipsRequest from './TipsRequest';
import AnalyticsDisplay from './AnalyticsDisplay';
import StatisticsDisplay from './StatisticsDisplay';
import TipsDisplay from './TipsDisplay';
import { AuthContext } from '../../context/AuthContext';
import {
  fetchTransactionStatistics,
  TransactionStatisticsDTO,
} from '../../api/transactions';
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
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const [activeTab, setActiveTab] = useState<'analytics' | 'tips'>('analytics');
  const [isRequestingAnalytics, setIsRequestingAnalytics] = useState(false);
  const [isRequestingTips, setIsRequestingTips] = useState(false);
  const [statisticsData, setStatisticsData] =
    useState<TransactionStatisticsDTO | null>(null);
  const [statisticsPeriod, setStatisticsPeriod] = useState<number>(1);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [tipGroups, setTipGroups] = useState<TipGroup[]>([]);

  const handleRequestStatistics = async (period: number) => {
    if (!user?.id) {
      alert('Ошибка: пользователь не авторизован');
      return;
    }

    setIsRequestingAnalytics(true);
    try {
      const data = await fetchTransactionStatistics(
        user.id,
        period as 1 | 3 | 6 | 12,
      );
      setStatisticsData(data);
      setStatisticsPeriod(period);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      alert('Ошибка при получении статистики. Попробуйте еще раз.');
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
              {!statisticsData && !isRequestingAnalytics && (
                <AnalyticsRequest onRequest={handleRequestStatistics} />
              )}
              {isRequestingAnalytics && (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Загрузка статистики...</p>
                </div>
              )}
              {statisticsData && !isRequestingAnalytics && (
                <StatisticsDisplay
                  data={statisticsData}
                  period={statisticsPeriod}
                  onNewRequest={() => setStatisticsData(null)}
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

