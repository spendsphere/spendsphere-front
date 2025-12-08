import React, { useEffect, useState } from 'react';
import Header from '../../shared/Header';
import Sidebar from '../../shared/Sidebar';
import ProfileInfo from './ProfileInfo';
import QuickStats from './QuickStats';
import PaymentHistory from './PaymentHistory';
import EditProfileModal from './EditProfileModal';
import './ProfilePage.css';
import { useAuth } from '../../context/AuthContext';
import { userApi } from '../../api/user';
import { fetchTransactions } from '../../api/transactions';
import { remindersApi } from '../../api/reminders';
import { categoriesApi } from '../../api/categories';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Данные профиля
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    avatar: '',
    isPremium: false,
    balance: 0,
  });
  const [stats, setStats] = useState({ transactions: 0, regularPayments: 0, categories: 0 });

  useEffect(() => {
    if (!user) return;
    // наполняем из бекенда
    userApi
      .getProfile(user.id)
      .then((u) =>
        setProfile({
          name: `${u.name || ''} ${u.surname || ''}`.trim(),
          email: u.email,
          avatar: u.photoUrl || '',
          isPremium: !!u.isPremium,
          balance: 0,
        }),
      )
      .catch(() => {
        setProfile((p) => ({
          ...p,
          name: user.name + ' ' + user.surname,
          email: user.email,
        }));
      });
    // считаем быструю статистику
    Promise.allSettled([
      fetchTransactions(user.id),
      remindersApi.list(user.id),
      categoriesApi.allForUser(user.id),
    ]).then(([tx, rem, cat]) => {
      const transactions =
        tx.status === 'fulfilled' ? (Array.isArray(tx.value) ? tx.value.length : 0) : 0;
      const regularPayments =
        rem.status === 'fulfilled' ? (Array.isArray(rem.value) ? rem.value.length : 0) : 0;
      const categories =
        cat.status === 'fulfilled' ? (Array.isArray(cat.value) ? cat.value.length : 0) : 0;
      setStats({ transactions, regularPayments, categories });
    });
  }, [user?.id]);

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

