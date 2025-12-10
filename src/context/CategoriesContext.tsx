import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { categoriesApi, type CategoryDTO, type CategoryInputDTO, type BackendCategoryType } from '../api/categories';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'expense' | 'income' | 'both'; // Тип: расходы, доходы, или оба
  isDefault?: boolean;
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
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const mapBackendType = (t?: BackendCategoryType): Category['type'] =>
    t === 'INCOME' ? 'income' : t === 'EXPENSE' ? 'expense' : 'both';
  const toBackendType = (t: Category['type']): BackendCategoryType =>
    t === 'income' ? 'INCOME' : t === 'expense' ? 'EXPENSE' : 'BOTH';

  const mapDto = (dto: CategoryDTO): Category => ({
    id: String(dto.id),
    name: dto.name,
    icon: '📁',
    color: '#6b7280',
    type: mapBackendType(dto.categoryType),
    isDefault: !!dto.isDefault,
  });

  useEffect(() => {
    if (!user) return;
    categoriesApi
      .allForUser(user.id)
      .then(async (list) => {
        if (list && list.length > 0) {
          setCategories(list.map(mapDto));
        } else {
          // fallback: если бэк не вернул категории пользователя,
          // подставим дефолтные как read-only
          try {
            const defs = await categoriesApi.defaults();
            setCategories(defs.map(mapDto));
          } catch {
            setCategories([]);
          }
        }
      })
      .catch(async () => {
        try {
          const defs = await categoriesApi.defaults();
          setCategories(defs.map(mapDto));
        } catch {
          setCategories([]);
        }
      });
  }, [user?.id]);

  const addCategory = async (category: Omit<Category, 'id'>) => {
    if (!user) return;
    const input: CategoryInputDTO = {
      name: category.name,
      iconUrl: null,
      categoryType: toBackendType(category.type),
    };
    try {
      const created = await categoriesApi.createForUser(user.id, input);
      setCategories((prev) => [...prev, mapDto(created)]);
    } catch {
      // noop
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    if (!user) return;
    const input: CategoryInputDTO = {
      name: updates.name || categories.find((c) => c.id === id)?.name || '',
      iconUrl: null,
      categoryType: updates.type ? toBackendType(updates.type) : undefined,
    };
    try {
      const updated = await categoriesApi.updateForUser(user.id, Number(id), input);
      setCategories((prev) => prev.map((cat) => (cat.id === id ? mapDto(updated) : cat)));
    } catch {
      // noop
    }
  };

  const deleteCategory = async (id: string) => {
    if (!user) return;
    try {
      await categoriesApi.deleteForUser(user.id, Number(id));
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch {
      // noop
    }
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

