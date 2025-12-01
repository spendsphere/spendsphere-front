import React, { useState } from 'react';
import Sidebar from '../../shared/Sidebar';
import Header from '../../shared/Header';
import BalanceSummaryCards from './BalanceSummaryCards';
import FundsSourceList from './FundsSourceList';
import AddSourceModal from './AddSourceModal';
import EditSourceModal from './EditSourceModal';
import DeleteSourceModal from './DeleteSourceModal';
import './SourcesOfFundsPage.css';

export interface FundsSource {
  id: string;
  name: string;
  type: 'Дебетовая' | 'Кредитная' | 'Наличные' | 'Счет';
  balance: number;
}

const SourcesOfFundsPage: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<FundsSource | null>(null);
  const [deletingSource, setDeletingSource] = useState<FundsSource | null>(
    null
  );
  const [sources, setSources] = useState<FundsSource[]>([
    {
      id: '1',
      name: 'Карта Tinkoff',
      type: 'Дебетовая',
      balance: 35000,
    },
    {
      id: '2',
      name: 'Карта Сбербанк',
      type: 'Кредитная',
      balance: -5000,
    },
    {
      id: '3',
      name: 'Наличные',
      type: 'Наличные',
      balance: 27320,
    },
  ]);

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

  const handleSaveAdd = (newSource: Omit<FundsSource, 'id'>) => {
    const source: FundsSource = {
      ...newSource,
      id: Date.now().toString(),
    };
    setSources((prev) => [source, ...prev]);
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (updatedSource: FundsSource) => {
    setSources((prev) =>
      prev.map((s) => (s.id === updatedSource.id ? updatedSource : s))
    );
    setEditingSource(null);
  };

  const handleConfirmDelete = () => {
    if (deletingSource) {
      setSources((prev) =>
        prev.filter((s) => s.id !== deletingSource.id)
      );
      setDeletingSource(null);
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

