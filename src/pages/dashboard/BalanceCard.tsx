import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { accountsApi } from '../../api/accounts';
import './BalanceCard.css';

const BalanceCard: React.FC = () => {
  const { user } = useAuth();
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    if (!user) return;
    accountsApi
      .balance(user.id)
      .then((data) => {
        const byCurrency = data?.balancesByCurrency || {};
        const sum = Object.values(byCurrency).reduce((s, v) => s + Number(v || 0), 0);
        setTotal(sum);
      })
      .catch(() => setTotal(0));
  }, [user?.id]);

  const formatAmount = (n: number) =>
    n.toLocaleString('ru-RU', { maximumFractionDigits: 2 }) + ' Р';

  return (
    <div className="balance-card">
      <div className="balance-header">Общий баланс</div>
      <div className="balance-amount">{formatAmount(total)}</div>
    </div>
  );
};

export default BalanceCard;

