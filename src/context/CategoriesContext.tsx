import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'expense' | 'income' | 'both'; // Тип: расходы, доходы, или оба
}

interface CategoriesContextType {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  getCategoryByName: (name: string) => Category | undefined;
  getExpenseCategories: () => Category[];
  getIncomeCategories: () => Category[];
  getAllCategories: () => Category[];
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(
  undefined
);

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategories must be used within CategoriesProvider');
  }
  return context;
};

interface CategoriesProviderProps {
  children: ReactNode;
}

export const CategoriesProvider: React.FC<CategoriesProviderProps> = ({
  children,
}) => {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'Продукты',
      icon: '🛒',
      color: '#ef4444',
      type: 'expense',
    },
    {
      id: '2',
      name: 'Транспорт',
      icon: '🚗',
      color: '#f59e0b',
      type: 'expense',
    },
    {
      id: '3',
      name: 'Развлечения',
      icon: '🎬',
      color: '#8b5cf6',
      type: 'expense',
    },
    {
      id: '4',
      name: 'Здоровье',
      icon: '🏥',
      color: '#10b981',
      type: 'expense',
    },
    {
      id: '5',
      name: 'Образование',
      icon: '📚',
      color: '#3b82f6',
      type: 'expense',
    },
    {
      id: '6',
      name: 'Зарплата',
      icon: '💼',
      color: '#06b6d4',
      type: 'income',
    },
    {
      id: '7',
      name: 'Другое',
      icon: '📁',
      color: '#6b7280',
      type: 'both',
    },
  ]);

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  const getCategoryByName = (name: string) => {
    return categories.find((cat) => cat.name === name);
  };

  const getExpenseCategories = () => {
    return categories.filter(
      (cat) => cat.type === 'expense' || cat.type === 'both'
    );
  };

  const getIncomeCategories = () => {
    return categories.filter(
      (cat) => cat.type === 'income' || cat.type === 'both'
    );
  };

  const getAllCategories = () => {
    return categories;
  };

  const value: CategoriesContextType = {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryByName,
    getExpenseCategories,
    getIncomeCategories,
    getAllCategories,
  };

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
};

