import React, { useState } from 'react';
import Sidebar from '../../shared/Sidebar';
import Header from '../../shared/Header';
import BalanceCard from './BalanceCard';
import QuickActions from './QuickActions';
import LatestTransactions from './LatestTransactions';
import RecentAdvices from './RecentAdvices';
import SourcesOfFunds from './SourcesOfFunds';
import AddTransactionModal from '../../shared/AddTransactionModal';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleTransactionAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-main">
        <Header onOpenModal={handleOpenModal} title="Главная" />
        <div className="dashboard-content">
          <BalanceCard key={`balance-${refreshKey}`} />
          <QuickActions onOpenModal={handleOpenModal} />
          <LatestTransactions key={`transactions-${refreshKey}`} />
          <SourcesOfFunds key={`sources-${refreshKey}`} />
          <RecentAdvices key={`advices-${refreshKey}`} />
        </div>
      </div>
      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        onSave={handleTransactionAdded}
      />
    </div>
  );
};

export default Dashboard;

