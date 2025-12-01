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
  return (
    <div className="categories-list-container">
      <div className="categories-grid">
        <div className="add-category-card" onClick={onAdd}>
          <div className="add-icon">+</div>
          <div className="add-text">Добавить категорию</div>
        </div>

        {categories.map((category) => {
          return (
            <div key={category.id} className="category-card">
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesList;

