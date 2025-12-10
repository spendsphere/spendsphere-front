import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '../../shared/Sidebar';
import Header from '../../shared/Header';
import BalanceSummaryCards from './BalanceSummaryCards';
import FundsSourceList from './FundsSourceList';
import AddSourceModal from './AddSourceModal';
import EditSourceModal from './EditSourceModal';
import DeleteSourceModal from './DeleteSourceModal';
import './SourcesOfFundsPage.css';
import { useAuth } from '../../context/AuthContext';
import { accountsApi, type AccountDTO, type AccountCreateDTO, type AccountUpdateDTO } from '../../api/accounts';

export interface FundsSource {
  id: string;
  name: string;
  type: 'Дебетовая' | 'Кредитная' | 'Наличные' | 'Счет';
  balance: number;
}

const SourcesOfFundsPage: React.FC = () => {
  const { user } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<FundsSource | null>(null);
  const [deletingSource, setDeletingSource] = useState<FundsSource | null>(
    null
  );
  const [sources, setSources] = useState<FundsSource[]>([]);

  const toUiType = (t: AccountDTO['accountType']): FundsSource['type'] => {
    switch (t) {
      case 'CREDIT':
        return 'Кредитная';
      case 'CASH':
        return 'Наличные';
      case 'CARD':
        return 'Дебетовая';
      default:
        return 'Счет';
    }
  };

  const fromUiType = (t: FundsSource['type']): AccountCreateDTO['accountType'] => {
    switch (t) {
      case 'Кредитная':
        return 'CREDIT';
      case 'Наличные':
        return 'CASH';
      case 'Дебетовая':
        return 'CARD';
      default:
        return 'OTHER';
    }
  };

  const load = async () => {
    if (!user) return;
    try {
      const list = await accountsApi.list(user.id);
      const mapped = list.map((a) => ({
        id: String(a.id),
        name: a.name,
        type: toUiType(a.accountType),
        balance: Number(a.balance),
      }));
      mapped.sort((a, b) => a.name.localeCompare(b.name));
      setSources(mapped);
    } catch {
      setSources([]);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleEdit = (source: FundsSource) => {
    setEditingSource(source);
  };

  const handleDelete = (source: FundsSource) => {
    setDeletingSource(source);
  };

  const handleSaveAdd = async (newSource: Omit<FundsSource, 'id'>) => {
    if (!user) return;
    try {
      const body: AccountCreateDTO = {
        accountType: fromUiType(newSource.type),
        balance: newSource.balance,
        currency: 'RUB',
        name: newSource.name,
        iconUrl: null,
        creditLimit: null,
        isActive: true,
        includeInTotal: true,
      };
      const created = await accountsApi.create(user.id, body);
      setSources((prev) => {
        const next = [
          ...prev,
          {
            id: String(created.id),
            name: created.name,
            type: toUiType(created.accountType),
            balance: Number(created.balance),
          },
        ];
        next.sort((a, b) => a.name.localeCompare(b.name));
        return next;
      });
      setIsAddModalOpen(false);
    } catch {
      // noop
    }
  };

  const handleSaveEdit = async (updatedSource: FundsSource) => {
    if (!user) return;
    try {
      const body: AccountUpdateDTO = {
        accountType: fromUiType(updatedSource.type),
        balance: updatedSource.balance,
        currency: 'RUB',
        name: updatedSource.name,
        iconUrl: null,
        creditLimit: null,
        isActive: true,
        includeInTotal: true,
      };
      const updated = await accountsApi.update(user.id, Number(updatedSource.id), body);
      setSources((prev) => {
        const next = prev.map((s) =>
          s.id === updatedSource.id
            ? {
                id: String(updated.id),
                name: updated.name,
                type: toUiType(updated.accountType),
                balance: Number(updated.balance),
              }
            : s,
        );
        next.sort((a, b) => a.name.localeCompare(b.name));
        return next;
      });
      setEditingSource(null);
    } catch {
      // noop
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingSource || !user) return;
    try {
      await accountsApi.remove(user.id, Number(deletingSource.id));
      setSources((prev) => prev.filter((s) => s.id !== deletingSource.id));
      setDeletingSource(null);
    } catch {
      // noop
    }
  };

  const totalBalance = sources.reduce((sum, source) => sum + source.balance, 0);
  const availableFunds = sources
    .filter((s) => s.balance > 0)
    .reduce((sum, s) => sum + s.balance, 0);
  const negativeBalance = sources
    .filter((s) => s.balance < 0)
    .reduce((sum, s) => sum + s.balance, 0);

  return (
    <div className="sources-of-funds-page">
      <Sidebar />
      <div className="sources-of-funds-page-main">
        <Header title="Источники средств" />
        <div className="sources-of-funds-page-content">
          <BalanceSummaryCards
            totalBalance={totalBalance}
            availableFunds={availableFunds}
            negativeBalance={negativeBalance}
          />
          <FundsSourceList
            sources={sources}
            onAdd={handleOpenAddModal}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
      <AddSourceModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveAdd}
      />
      {editingSource && (
        <EditSourceModal
          isOpen={!!editingSource}
          source={editingSource}
          onClose={() => setEditingSource(null)}
          onSave={handleSaveEdit}
        />
      )}
      {deletingSource && (
        <DeleteSourceModal
          isOpen={!!deletingSource}
          source={deletingSource}
          onClose={() => setDeletingSource(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default SourcesOfFundsPage;

