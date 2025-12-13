import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../shared/Sidebar';
import Header from '../../shared/Header';
import AnalyticsTabs from './AnalyticsTabs';
import AnalyticsRequest from './AnalyticsRequest';
import TipsRequest from './TipsRequest';
import StatisticsDisplay from './StatisticsDisplay';
import TipsDisplay from './TipsDisplay';
import AdviceNotificationModal from '../../shared/AdviceNotificationModal';
import { AuthContext } from '../../context/AuthContext';
import {
  fetchTransactionStatistics,
  TransactionStatisticsDTO,
} from '../../api/transactions';
import {
  requestAdvice,
  getRecentAdvices,
  AdviceResponseDTO,
} from '../../api/advices';
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
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'analytics' | 'tips'>(
    (location.state as { activeTab?: 'analytics' | 'tips' })?.activeTab || 'analytics'
  );
  const [isRequestingAnalytics, setIsRequestingAnalytics] = useState(false);
  const [isRequestingTips, setIsRequestingTips] = useState(false);
  const [statisticsData, setStatisticsData] =
    useState<TransactionStatisticsDTO | null>(null);
  const [statisticsPeriod, setStatisticsPeriod] = useState<number>(1);
  const [tipGroups, setTipGroups] = useState<TipGroup[]>([]);
  const [showAdviceNotification, setShowAdviceNotification] = useState(false);
  const [isLoadingAdvices, setIsLoadingAdvices] = useState(false);

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

  // Загрузка всех советов при монтировании компонента и при переключении на вкладку
  useEffect(() => {
    if (activeTab === 'tips' && user?.id) {
      loadAllAdvices();
    }
  }, [activeTab, user?.id]);

  const loadAllAdvices = async () => {
    if (!user?.id) return;

    setIsLoadingAdvices(true);
    try {
      const advices = await getRecentAdvices(user.id);
      const convertedTipGroups = convertAdvicesToTipGroups(advices);
      setTipGroups(convertedTipGroups);
    } catch (error) {
      console.error('Error loading advices:', error);
    } finally {
      setIsLoadingAdvices(false);
    }
  };

  const convertAdvicesToTipGroups = (
    advices: AdviceResponseDTO[],
  ): TipGroup[] => {
    return advices.map((advice) => ({
      id: advice.id.toString(),
      goal: advice.goal,
      targetDate: advice.targetDate || undefined,
      tips: advice.items.map((item) => ({
        id: item.id.toString(),
        text: item.title,
        category: getPriorityCategory(item.priority),
        impact: item.description,
      })),
      createdAt: advice.createdAt,
    }));
  };

  const getPriorityCategory = (priority: string): string => {
    switch (priority) {
      case 'High':
        return 'Важно';
      case 'Medium':
        return 'Средний приоритет';
      case 'Low':
        return 'Низкий приоритет';
      default:
        return 'Совет';
    }
  };

  const handleRequestTips = async (goal: string, targetDate?: string) => {
    if (!user?.id) {
      alert('Ошибка: пользователь не авторизован');
      return;
    }

    setIsRequestingTips(true);
    try {
      await requestAdvice(user.id, {
        goal,
        targetDate: targetDate || null,
      });

      // Показать модальное окно об успешной отправке
      setShowAdviceNotification(true);

      // Автоматически обновить список через 10 секунд
      setTimeout(() => {
        loadAllAdvices();
      }, 10000);
    } catch (error) {
      console.error('Error requesting advice:', error);
      alert('Ошибка при отправке запроса. Попробуйте еще раз.');
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
              {isLoadingAdvices && (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Загрузка советов...</p>
                </div>
              )}
              {!isLoadingAdvices && (
                <TipsDisplay
                  tipGroups={tipGroups}
                  onDeleteGroup={handleDeleteTipGroup}
                />
              )}
            </>
          )}
        </div>
      </div>
      <AdviceNotificationModal
        isOpen={showAdviceNotification}
        onClose={() => setShowAdviceNotification(false)}
      />
    </div>
  );
};

export default AnalyticsPage;

