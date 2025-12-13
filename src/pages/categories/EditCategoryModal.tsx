import React, { useState, useEffect } from 'react';
import { useCategories, Category } from '../../context/CategoriesContext';
import { CATEGORY_ICONS, DEFAULT_CATEGORY_COLORS } from '../../constants/categoryIcons';
import '../../shared/AddTransactionModal.css';
import './CategoryModal.css';

interface EditCategoryModalProps {
  isOpen: boolean;
  category: Category;
  onClose: () => void;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  isOpen,
  category,
  onClose,
}) => {
  const { updateCategory } = useCategories();
  const [name, setName] = useState<string>(category.name);
  const [icon, setIcon] = useState<string>(category.icon);
  const [color, setColor] = useState<string>(category.color);
  const [type, setType] = useState<'expense' | 'income' | 'both'>(
    category.type
  );
  const [selectedCategory, setSelectedCategory] = useState<number>(0);

  useEffect(() => {
    if (isOpen && category) {
      setName(category.name);
      setIcon(category.icon);
      setColor(category.color);
      setType(category.type);
    }
  }, [isOpen, category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Введите название категории');
      return;
    }

    updateCategory(category.id, {
      name: name.trim(),
      icon,
      color,
      type,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Редактировать категорию</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Название *
            </label>
            <input
              type="text"
              id="name"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Еда"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="type" className="form-label">
              Тип категории *
            </label>
            <select
              id="type"
              className="form-select"
              value={type}
              onChange={(e) =>
                setType(e.target.value as 'expense' | 'income' | 'both')
              }
              required
            >
              <option value="expense">Расходы</option>
              <option value="income">Доходы</option>
              <option value="both">Доходы и расходы</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="icon" className="form-label">
              Иконка *
            </label>
            <div className="icon-category-tabs">
              {CATEGORY_ICONS.map((cat, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`category-tab ${selectedCategory === idx ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(idx)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="icon-selector">
              {CATEGORY_ICONS[selectedCategory].icons.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  className={`icon-option ${icon === ic ? 'selected' : ''}`}
                  onClick={() => setIcon(ic)}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="color" className="form-label">
              Цвет *
            </label>
            <div className="color-selector">
              {DEFAULT_CATEGORY_COLORS.map((col) => (
                <button
                  key={col}
                  type="button"
                  className={`color-option ${color === col ? 'selected' : ''}`}
                  style={{ backgroundColor: col }}
                  onClick={() => setColor(col)}
                  title={col}
                />
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
            >
              Отмена
            </button>
            <button type="submit" className="btn-submit">
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategoryModal;

