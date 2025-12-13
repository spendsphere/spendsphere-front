import React, { useState, useEffect } from 'react';
import { FundsSource } from './SourcesOfFundsPage';
import './SourceModal.css';

interface AddSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (_source: Omit<FundsSource, 'id'>) => void;
}

const AddSourceModal: React.FC<AddSourceModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState<string>('');
  const [type, setType] = useState<'Дебетовая' | 'Кредитная' | 'Наличные' | 'Счет'>(
    'Дебетовая'
  );
  const [balance, setBalance] = useState<string>('0');

  useEffect(() => {
    if (isOpen) {
      setName('');
      setType('Дебетовая');
      setBalance('0');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Введите название источника');
      return;
    }

    onSave({
      name: name.trim(),
      type,
      balance: parseFloat(balance) || 0,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Добавить источник</h2>
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
              placeholder="Например: Карта Tinkoff"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="type" className="form-label">
              Тип *
            </label>
            <select
              id="type"
              className="form-select"
              value={type}
              onChange={(e) =>
                setType(
                  e.target.value as
                    | 'Дебетовая'
                    | 'Кредитная'
                    | 'Наличные'
                    | 'Счет'
                )
              }
              required
            >
              <option value="Дебетовая">Дебетовая</option>
              <option value="Кредитная">Кредитная</option>
              <option value="Наличные">Наличные</option>
              <option value="Счет">Счет</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="balance" className="form-label">
              Баланс *
            </label>
            <input
              type="number"
              id="balance"
              className="form-input"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              placeholder="Введите баланс"
              required
              step="0.01"
            />
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

export default AddSourceModal;

