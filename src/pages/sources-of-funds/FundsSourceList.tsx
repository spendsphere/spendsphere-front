import React from 'react';
import { FundsSource } from './SourcesOfFundsPage';
import './FundsSourceList.css';

interface FundsSourceListProps {
  sources: FundsSource[];
  onAdd: () => void;
  onEdit: (_source: FundsSource) => void;
  onDelete: (_source: FundsSource) => void;
}

const FundsSourceList: React.FC<FundsSourceListProps> = ({
  sources,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const formatAmount = (amount: number) => {
    return `${amount.toLocaleString('ru-RU')} Р`;
  };

  return (
    <div className="funds-source-list">
      <div className="sources-grid">
        <div className="add-source-card" onClick={onAdd}>
          <div className="add-icon">+</div>
          <div className="add-text">Добавить источник</div>
        </div>

        {sources.map((source) => (
          <div key={source.id} className="source-card">
            <div className="source-content">
              <div className="source-header">
                <h3 className="source-name">{source.name}</h3>
              </div>
              {source.type !== 'Наличные' && (
                <div className="source-type">Тип: {source.type}</div>
              )}
              <div
                className={`source-balance ${
                  source.balance >= 0 ? 'positive' : 'negative'
                }`}
              >
                Баланс: {formatAmount(source.balance)}
              </div>
            </div>
            <div className="source-actions">
              <button
                className="btn-edit"
                onClick={() => onEdit(source)}
                title="Редактировать"
              >
                ✏️
              </button>
              <button
                className="btn-delete"
                onClick={() => onDelete(source)}
                title="Удалить"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FundsSourceList;

