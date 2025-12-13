import React, { useState, useEffect } from 'react';
import { useCategories } from '../../context/CategoriesContext';
import { CATEGORY_ICONS, DEFAULT_CATEGORY_COLORS } from '../../constants/categoryIcons';
import '../../shared/AddTransactionModal.css';
import './CategoryModal.css';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addCategory } = useCategories();
  const [name, setName] = useState<string>('');
  const [icon, setIcon] = useState<string>('📁');
  const [color, setColor] = useState<string>('#6b7280');
  const [type, setType] = useState<'expense' | 'income' | 'both'>('expense');
  const [selectedCategory, setSelectedCategory] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setIcon('📁');
      setColor('#10b981');
      setType('expense');
      setSelectedCategory(0);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Введите название категории');
      return;
    }

    addCategory({
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
          <h2 className="modal-title">Добавить категорию</h2>
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
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;

