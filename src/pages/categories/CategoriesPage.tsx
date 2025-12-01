import React, { useState } from 'react';
import { useCategories, Category } from '../../context/CategoriesContext';
import Header from '../../shared/Header';
import Sidebar from '../../shared/Sidebar';
import SummaryCards from './SummaryCards';
import CategoriesList from './CategoriesList';
import AddCategoryModal from './AddCategoryModal';
import EditCategoryModal from './EditCategoryModal';
import DeleteCategoryModal from './DeleteCategoryModal';
import './CategoriesPage.css';

const CategoriesPage: React.FC = () => {
  const { categories, getExpenseCategories } = useCategories();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null
  );

  // Подсчет статистики
  const expenseCategories = getExpenseCategories();
  const totalExpenseCategories = expenseCategories.length;

  // TODO: Подсчет потраченного и самой крупной категории нужно будет брать из транзакций
  const totalSpent = 75430; // Мок данные
  const largestCategory = categories.find((cat) => cat.name === 'Продукты');
  const largestCategoryAmount = largestCategory ? 32000 : 0;

  return (
    <div className="categories-page">
      <Sidebar />
      <div className="categories-page-main">
        <Header title="Категории" />
        <div className="categories-page-content">
          <SummaryCards
            totalCategories={totalExpenseCategories}
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

