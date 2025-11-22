import React, { useState } from 'react';
import Header from '../../shared/Header';
import Sidebar from '../../shared/Sidebar';
import ProfileInfo from './ProfileInfo';
import QuickStats from './QuickStats';
import PaymentHistory from './PaymentHistory';
import EditProfileModal from './EditProfileModal';
import './ProfilePage.css';

const ProfilePage: React.FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Мок данные профиля
  const [profile, setProfile] = useState({
    name: 'Анна Иванова',
    email: 'anna.ivanova@example.com',
    avatar: 'https://via.placeholder.com/120?text=AI',
    isPremium: true,
    balance: 42560,
  });

  // Мок статистики
  const stats = {
    transactions: 120,
    regularPayments: 8,
    categories: 12,
  };

  // Мок истории платежей (только Premium)
  const [paymentHistory] = useState([
    {
      id: '1',
      icon: '👑',
      iconColor: '#8b5cf6',
      title: 'Оплата Premium',
      date: '10 ноября 2025',
      type: 'Подписка',
      amount: 199,
    },
    {
      id: '2',
      icon: '👑',
      iconColor: '#8b5cf6',
      title: 'Оплата Premium',
      date: '10 октября 2025',
      type: 'Подписка',
      amount: 199,
    },
    {
      id: '3',
      icon: '👑',
      iconColor: '#8b5cf6',
      title: 'Оплата Premium',
      date: '10 сентября 2025',
      type: 'Подписка',
      amount: 199,
    },
  ]);

  const handleSaveProfile = (updatedProfile: Partial<typeof profile>) => {
    setProfile((prev) => ({ ...prev, ...updatedProfile }));
    setIsEditModalOpen(false);
  };

  const handleAvatarUpdate = (newAvatar: string) => {
    setProfile((prev) => ({ ...prev, avatar: newAvatar }));
  };

  return (
    <div className="profile-page">
      <Sidebar />
      <div className="profile-page-main">
        <Header title="Профиль" />
        <div className="profile-page-content">
          <ProfileInfo
            profile={profile}
            onEdit={() => setIsEditModalOpen(true)}
            onResetPassword={() => {
              // TODO: Реализовать сброс пароля
              alert('Функция сброса пароля будет реализована');
            }}
          />
          <QuickStats stats={stats} />
          <PaymentHistory payments={paymentHistory} />
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        profile={profile}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default ProfilePage;

