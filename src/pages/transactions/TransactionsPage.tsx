import React, { useState } from 'react';
import Sidebar from '../../shared/Sidebar';
import Header from '../../shared/Header';
import TransactionList from './TransactionList';
import AddTransactionModal from '../../shared/AddTransactionModal';
import EditTransactionModal from './EditTransactionModal';
import DeleteTransactionModal from './DeleteTransactionModal';
import './TransactionsPage.css';

export interface Transaction {
  id: string;
  date: string;
  category: string;
  categoryIcon: string;
  note: string;
  source: string;
  amount: number;
  type: 'доход' | 'расход';
  status: 'added' | 'pending';
}

const TransactionsPage: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] =
    useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      date: '2025-11-10',
      category: 'Продукты',
      categoryIcon: '🛒',
      note: 'Еда',
      source: 'Tinkoff',
      amount: 1250,
      type: 'расход',
      status: 'added',
    },
    {
      id: '2',
      date: '2025-11-09',
      category: 'Зарплата',
      categoryIcon: '💼',
      note: '',
      source: 'Tinkoff',
      amount: 60000,
      type: 'доход',
      status: 'added',
    },
    {
      id: '3',
      date: '2025-11-08',
      category: 'Транспорт',
      categoryIcon: '🚗',
      note: 'Заправка',
      source: 'Сбербанк',
      amount: 2500,
      type: 'расход',
      status: 'added',
    },
    {
      id: '4',
      date: '2025-11-07',
      category: 'Развлечения',
      categoryIcon: '🎬',
      note: 'Кино',
      source: 'Наличные',
      amount: 800,
      type: 'расход',
      status: 'added',
    },
  ]);

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleDelete = (transaction: Transaction) => {
    setDeletingTransaction(transaction);
  };

  const handleSaveEdit = (updatedTransaction: Transaction) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === updatedTransaction.id ? updatedTransaction : t
      )
    );
    setEditingTransaction(null);
  };

  const handleConfirmDelete = () => {
    if (deletingTransaction) {
      setTransactions((prev) =>
        prev.filter((t) => t.id !== deletingTransaction.id)
      );
      setDeletingTransaction(null);
    }
  };

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: Date.now().toString(),
      note: newTransaction.note || '',
    };
    setTransactions((prev) => [transaction, ...prev]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="transactions-page">
      <Sidebar />
      <div className="transactions-page-main">
        <Header onOpenModal={handleOpenAddModal} title="Транзакции" />
        <div className="transactions-page-content">
          <TransactionList
            transactions={transactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleAddTransaction}
      />
      {editingTransaction && (
        <EditTransactionModal
          isOpen={!!editingTransaction}
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onSave={handleSaveEdit}
        />
      )}
      {deletingTransaction && (
        <DeleteTransactionModal
          isOpen={!!deletingTransaction}
          transaction={deletingTransaction}
          onClose={() => setDeletingTransaction(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default TransactionsPage;

