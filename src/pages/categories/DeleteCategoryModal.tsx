import React from 'react';
import { useCategories, Category } from '../../context/CategoriesContext';
import '../../shared/AddTransactionModal.css';
import './CategoryModal.css';

interface DeleteCategoryModalProps {
  isOpen: boolean;
  category: Category;
  onClose: () => void;
}

const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({
  isOpen,
  category,
  onClose,
}) => {
  const { deleteCategory } = useCategories();

  const handleDelete = () => {
    deleteCategory(category.id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Удалить категорию</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <p>
            Вы уверены, что хотите удалить категорию{' '}
            <strong>
              {category.icon} {category.name}
            </strong>
            ?
          </p>
          <p className="warning-text">
            Все транзакции с этой категорией останутся, но категория будет
            удалена.
          </p>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={onClose}
          >
            Отмена
          </button>
          <button
            type="button"
            className="btn-submit btn-danger"
            onClick={handleDelete}
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCategoryModal;

