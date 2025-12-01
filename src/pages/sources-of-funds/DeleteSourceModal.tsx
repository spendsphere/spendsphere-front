import React, { useState } from 'react';
import { FundsSource } from './SourcesOfFundsPage';
import './SourceModal.css';

interface DeleteSourceModalProps {
  isOpen: boolean;
  source: FundsSource;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteSourceModal: React.FC<DeleteSourceModalProps> = ({
  isOpen,
  source,
  onClose,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const formatAmount = (amount: number) => {
    return `${amount.toLocaleString('ru-RU')} Р`;
  };

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      onConfirm();
      onClose();
    } catch (error) {
      console.error('Error deleting source:', error);
      alert('Ошибка при удалении. Попробуйте еще раз.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="delete-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">Удалить источник?</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="delete-modal-body">
          <p className="delete-modal-text">
            Вы уверены, что хотите удалить этот источник средств?
          </p>
          <div className="source-preview">
            <div className="preview-item">
              <span className="preview-label">Название:</span>
              <span className="preview-value">{source.name}</span>
            </div>
            <div className="preview-item">
              <span className="preview-label">Тип:</span>
              <span className="preview-value">{source.type}</span>
            </div>
            <div className="preview-item">
              <span className="preview-label">Баланс:</span>
              <span
                className={`preview-value ${
                  source.balance >= 0 ? 'positive' : 'negative'
                }`}
              >
                {formatAmount(source.balance)}
              </span>
            </div>
          </div>
          <p className="delete-modal-warning">
            Это действие нельзя отменить.
          </p>
        </div>

        <div className="delete-modal-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={onClose}
            disabled={isDeleting}
          >
            Отмена
          </button>
          <button
            type="button"
            className="btn-delete-confirm"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Удаление...' : 'Удалить'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteSourceModal;

