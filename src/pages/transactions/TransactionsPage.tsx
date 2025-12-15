import React, { useEffect, useState } from 'react';
import Sidebar from '../../shared/Sidebar';
import Header from '../../shared/Header';
import TransactionList from './TransactionList';
import AddTransactionModal from '../../shared/AddTransactionModal';
import EditTransactionModal from './EditTransactionModal';
import DeleteTransactionModal from './DeleteTransactionModal';
import './TransactionsPage.css';
import { useAuth } from '../../context/AuthContext';
import { fetchTransactions, BackendTransactionDTO } from '../../api/transactions';
import { updateTransaction as updateTx } from '../../api/transactions';
import { accountsApi } from '../../api/accounts';
import { useCategories } from '../../context/CategoriesContext';

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
  const { user } = useAuth();
  const { getCategoryByName } = useCategories();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] =
    useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const mapType = (t: BackendTransactionDTO['type']): Transaction['type'] =>
    t === 'INCOME' ? 'доход' : 'расход';

  const load = async () => {
    if (!user) return;
    const data = await fetchTransactions(user.id);
    const mapped: Transaction[] = data.map((dto) => ({
      id: String(dto.id),
      date: dto.date,
      category: dto.categoryName || 'Без категории',
      categoryIcon: dto.categoryIcon || '📁',
      note: dto.description || '',
      source: dto.accountName || '—',
      amount: dto.amount,
      type: mapType(dto.type),
      status: 'added',
    }));
    setTransactions(mapped);
  };

  useEffect(() => {
    load().catch(() => {});
  }, [user?.id]);

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

  const handleSaveEdit = async (updatedTransaction: Transaction) => {
    if (user) {
      try {
        const accounts = await accountsApi.list(user.id);
        const account = accounts.find((a) => a.name === updatedTransaction.source);
        const cat = getCategoryByName(updatedTransaction.category);
        const body = {
          type: updatedTransaction.type === 'доход' ? 'INCOME' as const : 'EXPENSE' as const,
          accountId: account?.id,
          categoryId: cat ? Number(cat.id) : undefined,
          amount: updatedTransaction.amount,
          description: updatedTransaction.note || undefined,
          date: updatedTransaction.date,
        };
        const saved = await updateTx(user.id, Number(updatedTransaction.id), body);
        const mapped: Transaction = {
          id: String(saved.id),
          date: saved.date,
          category: saved.categoryName || 'Без категории',
          categoryIcon: saved.categoryIcon || '📁',
          note: saved.description || '',
          source: saved.accountName || updatedTransaction.source,
          amount: saved.amount,
          type: saved.type === 'INCOME' ? 'доход' : 'расход',
          status: 'added',
        };
        setTransactions((prev) =>
          prev.map((t) => (t.id === mapped.id ? mapped : t))
        );
        setEditingTransaction(null);
        return;
      } catch {
        // fallback на локальное обновление, если API не сработал
      }
    }
    setTransactions((prev) =>
      prev.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t))
    );
    setEditingTransaction(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingTransaction || !user) return;
    try {
      const { deleteTransaction: remove } = await import('../../api/transactions');
      await remove(user.id, Number(deletingTransaction.id));
      setTransactions((prev) => prev.filter((t) => t.id !== deletingTransaction.id));
      setDeletingTransaction(null);
    } catch {
      // noop: можно показать уведомление об ошибке
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

