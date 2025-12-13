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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-main">
        <Header onOpenModal={handleOpenModal} title="Главная" />
        <div className="dashboard-content">
          <BalanceCard />
          <QuickActions onOpenModal={handleOpenModal} />
          <LatestTransactions />
          <SourcesOfFunds />
          <RecentAdvices />
        </div>
      </div>
      <AddTransactionModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default Dashboard;

