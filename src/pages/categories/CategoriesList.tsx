import React from 'react';
import { Category } from '../../context/CategoriesContext';
import './CategoriesList.css';

interface CategoriesListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onAdd: () => void;
}

const CategoriesList: React.FC<CategoriesListProps> = ({
  categories,
  onEdit,
  onDelete,
  onAdd,
}) => {
  const customCategories = [...categories]
    .filter((c) => !c.isDefault)
    .sort((a, b) => a.name.localeCompare(b.name));
  const defaultCategories = [...categories]
    .filter((c) => !!c.isDefault)
    .sort((a, b) => a.name.localeCompare(b.name));

  const renderCard = (category: Category) => (
    <div
      key={category.id}
      className={`category-card ${category.isDefault ? 'default' : ''}`}
    >
      <div
        className="category-icon"
        style={{ backgroundColor: `${category.color}20` }}
      >
        <span style={{ fontSize: '24px' }}>{category.icon}</span>
      </div>
      <div className="category-content">
        <div className="category-name">{category.name}</div>
      </div>
      <div className="category-actions">
        {!category.isDefault && (
          <>
            <button
              className="btn-action edit"
              onClick={() => onEdit(category)}
              title="Редактировать"
            >
              ✏️
            </button>
            <button
              className="btn-action delete"
              onClick={() => onDelete(category)}
              title="Удалить"
            >
              🗑️
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="categories-list-container">
      {/* Первая строка: дефолтные категории по алфавиту */}
      <div style={{ marginBottom: 8, fontWeight: 600 }}>Системные категории</div>
      <div className="categories-grid">
        {defaultCategories.map(renderCard)}
      </div>
      {/* Вторая строка: кастомные категории по алфавиту + добавление новой */}
      <div style={{ marginTop: 32, marginBottom: 8, fontWeight: 600 }}>Персональные категории</div>
      <div className="categories-grid">
        <div className="add-category-card" onClick={onAdd}>
          <div className="add-icon">+</div>
          <div className="add-text">Добавить категорию</div>
        </div>
        {customCategories.map(renderCard)}
      </div>
    </div>
  );
};

export default CategoriesList;

