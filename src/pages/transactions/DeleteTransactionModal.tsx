import React, { useState } from 'react';
import { Transaction } from './TransactionsPage';
import './DeleteTransactionModal.css';

interface DeleteTransactionModalProps {
  isOpen: boolean;
  transaction: Transaction;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteTransactionModal: React.FC<DeleteTransactionModalProps> = ({
  isOpen,
  transaction,
  onClose,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const formatAmount = (amount: number, type: 'доход' | 'расход') => {
    const sign = type === 'доход' ? '+' : '-';
    return `${sign} ${amount.toLocaleString('ru-RU')} Р`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      onConfirm();
      onClose();
    } catch (error) {
      console.error('Error deleting transaction:', error);
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
        <div className="delete-modal-header">
          <h2 className="delete-modal-title">Удалить транзакцию?</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="delete-modal-body">
          <p className="delete-modal-text">
            Вы уверены, что хотите удалить эту транзакцию?
          </p>
          <div className="transaction-preview">
            <div className="preview-item">
              <span className="preview-label">Дата:</span>
              <span className="preview-value">{formatDate(transaction.date)}</span>
            </div>
            <div className="preview-item">
              <span className="preview-label">Категория:</span>
              <span className="preview-value">
                {transaction.categoryIcon} {transaction.category}
              </span>
            </div>
            {transaction.note && (
              <div className="preview-item">
                <span className="preview-label">Примечание:</span>
                <span className="preview-value">{transaction.note}</span>
              </div>
            )}
            <div className="preview-item">
              <span className="preview-label">Сумма:</span>
              <span
                className={`preview-value amount ${transaction.type}`}
              >
                {formatAmount(transaction.amount, transaction.type)}
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

export default DeleteTransactionModal;

