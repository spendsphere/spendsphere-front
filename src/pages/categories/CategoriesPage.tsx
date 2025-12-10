import React, { useEffect, useMemo, useState } from 'react';
import { useCategories, Category } from '../../context/CategoriesContext';
import Header from '../../shared/Header';
import Sidebar from '../../shared/Sidebar';
import SummaryCards from './SummaryCards';
import CategoriesList from './CategoriesList';
import AddCategoryModal from './AddCategoryModal';
import EditCategoryModal from './EditCategoryModal';
import DeleteCategoryModal from './DeleteCategoryModal';
import './CategoriesPage.css';
import { useAuth } from '../../context/AuthContext';
import { fetchTransactions } from '../../api/transactions';

const CategoriesPage: React.FC = () => {
  const { categories, getExpenseCategories } = useCategories();
  const { user } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null
  );

  // Подсчет статистики
  const [totalExpenseCategories, setTotalExpenseCategories] = useState<number>(0);

  const [totalSpent, setTotalSpent] = useState<number>(0);
  const [largestCategoryId, setLargestCategoryId] = useState<string | null>(null);
  const [largestCategoryAmount, setLargestCategoryAmount] = useState<number>(0);

  const largestCategory = useMemo(
    () => categories.find((c) => c.id === largestCategoryId),
    [categories, largestCategoryId]
  );

  useEffect(() => {
    if (!user) return;
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    fetchTransactions(user.id)
      .then((all) => {
        // фильтруем по месяцу и типу EXPENSE на клиенте, чтобы не падать на /filter
        const inMonth = all.filter((t) => {
          const d = new Date(t.date);
          return d >= first && d <= last && t.type === 'EXPENSE';
        });

        const byCategory = new Map<number | null, number>();
        let sum = 0;
        for (const t of inMonth) {
          const amt = Number(t.amount || 0);
          sum += amt;
          const key = t.categoryId ?? -1;
          byCategory.set(key, (byCategory.get(key) || 0) + amt);
        }
        setTotalSpent(sum);
        // count of expense categories used this month (excluding null category)
        const usedCount = Array.from(byCategory.keys()).filter((k) => k != null && k !== -1).length;
        setTotalExpenseCategories(usedCount);
        // find max
        let maxKey: number | null = null;
        let maxVal = 0;
        for (const [k, v] of byCategory.entries()) {
          if (v > maxVal) {
            maxVal = v;
            maxKey = k === -1 ? null : k;
          }
        }
        setLargestCategoryAmount(maxVal);
        if (maxKey != null) {
          const found = categories.find((c) => Number(c.id) === maxKey);
          setLargestCategoryId(found ? found.id : null);
        } else {
          setLargestCategoryId(null);
        }
      })
      .catch(() => {
        setTotalSpent(0);
        setLargestCategoryId(null);
        setLargestCategoryAmount(0);
        setTotalExpenseCategories(0);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, categories.length]);

  return (
    <div className="categories-page">
      <Sidebar />
      <div className="categories-page-main">
        <Header title="Категории" />
        <div className="categories-page-content">
          <SummaryCards
            totalCategories={categories.length}
            totalSpent={totalSpent}
            largestCategory={largestCategory}
            largestCategoryAmount={largestCategoryAmount}
          />
          <CategoriesList
            categories={categories}
            onEdit={setEditingCategory}
            onDelete={setDeletingCategory}
            onAdd={() => setIsAddModalOpen(true)}
          />
        </div>
      </div>
      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      {editingCategory && (
        <EditCategoryModal
          isOpen={!!editingCategory}
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
        />
      )}
      {deletingCategory && (
        <DeleteCategoryModal
          isOpen={!!deletingCategory}
          category={deletingCategory}
          onClose={() => setDeletingCategory(null)}
        />
      )}
    </div>
  );
};

export default CategoriesPage;

