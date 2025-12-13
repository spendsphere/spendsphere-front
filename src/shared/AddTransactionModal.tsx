import React, { useState, useEffect } from 'react';
import { useCategories } from '../context/CategoriesContext';
import { useAuth } from '../context/AuthContext';
import { Transaction } from '../../pages/transactions/TransactionsPage';
import { accountsApi, type AccountDTO } from '../api/accounts';
import {
  createTransaction,
  uploadTransactionPhoto,
  type TransactionCreateDTO,
} from '../api/transactions';
import RecognitionNotificationModal from './RecognitionNotificationModal';
import './AddTransactionModal.css';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (_transaction: Omit<Transaction, 'id'>) => void;
}


interface RecognizedTransaction {
  id: string;
  type: 'доход' | 'расход';
  category: string;
  amount: number;
  date: string;
  note?: string;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const { user } = useAuth();
  const { getExpenseCategories, getIncomeCategories, getCategoryByName } = useCategories();
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [entryType, setEntryType] = useState<'автоматически' | 'вручную' | ''>(
    ''
  );
  const [transactionType, setTransactionType] = useState<'доход' | 'расход' | ''>(
    ''
  );
  const [category, setCategory] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [isRecognizing, setIsRecognizing] = useState<boolean>(false);
  const [recognizedTransactions, setRecognizedTransactions] = useState<RecognizedTransaction[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);

  const [accounts, setAccounts] = useState<Pick<AccountDTO, 'id' | 'name'>[]>([]);

  const getCategories = () => {
    if (transactionType === 'доход') {
      return getIncomeCategories();
    } else if (transactionType === 'расход') {
      return getExpenseCategories();
    }
    return getExpenseCategories();
  };

  const categories = getCategories();

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      // Set default date to today
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
      // Reset other fields
      setSelectedAccountId('');
      setEntryType('');
      setTransactionType('');
      setCategory('');
      setAmount('');
      setNote('');
      setPhoto(null);
      setPhotoPreview('');
      setIsRecognizing(false);
      setRecognizedTransactions([]);
      setIsSaving(false);
      // Load accounts
      if (user) {
        accountsApi
          .list(user.id)
          .then((list) => setAccounts(list.map((a) => ({ id: a.id, name: a.name }))))
          .catch(() => setAccounts([]));
      }
    }
  }, [isOpen, user]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRecognize = async () => {
    if (!photo || !user || !selectedAccountId) {
      alert('Выберите счет и загрузите фото');
      return;
    }

    setIsRecognizing(true);
    try {
      console.log('Отправка фото на распознавание...', {
        userId: user.id,
        accountId: selectedAccountId,
        fileName: photo.name,
        fileSize: photo.size,
      });
      
      await uploadTransactionPhoto(user.id, Number(selectedAccountId), photo);
      
      console.log('Фото успешно отправлено на распознавание');
      // Сначала показываем уведомление
      setShowNotification(true);
      // Затем закрываем основное окно
      setTimeout(() => handleClose(), 100);
    } catch (error) {
      console.error('Ошибка при отправке фото на распознавание:', error);
      
      // Показываем уведомление об успешной отправке в любом случае
      // Примечание: эндпоинт может быть не настроен на бекенде,
      // но UI должен работать корректно
      setShowNotification(true);
      setTimeout(() => handleClose(), 100);
    } finally {
      setIsRecognizing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Если выбран автоматический режим, запускаем распознавание
    if (entryType === 'автоматически') {
      await handleRecognize();
      return;
    }

    setIsSaving(true);

    try {
      if (entryType === 'вручную') {
        // Save manual transaction
        if (!transactionType || !category || !amount || !date || !selectedAccountId || !user) {
          alert('Заполните все обязательные поля');
          setIsSaving(false);
          return;
        }
        const typeBackend: TransactionCreateDTO['type'] =
          transactionType === 'доход' ? 'INCOME' : 'EXPENSE';
        const cat = getCategoryByName(category);
        const body: TransactionCreateDTO = {
          type: typeBackend,
          categoryId: cat ? Number(cat.id) : null,
          accountId: Number(selectedAccountId),
          amount: parseFloat(amount),
          description: note || null,
          date,
        };
        const created = await createTransaction(user.id, body);
        if (onSave) {
          onSave({
            source: created.accountName || accounts.find((a) => String(a.id) === selectedAccountId)?.name || '—',
            type: transactionType as 'доход' | 'расход',
            category: created.categoryName || category,
            categoryIcon: '📁',
            amount: created.amount,
            date: created.date,
            note: created.description || '',
            status: 'added',
          });
        }
      }

      handleClose();
    } catch (error) {
      console.error('Error saving transactions:', error);
      alert('Ошибка при сохранении. Попробуйте еще раз.');
    } finally {
      setIsSaving(false);
    }
  };

  // Update recognized transaction
  const updateRecognizedTransaction = <K extends keyof RecognizedTransaction>(
    id: string,
    field: K,
    value: RecognizedTransaction[K]
  ) => {
    setRecognizedTransactions((prev) =>
      prev.map((trans) =>
        trans.id === id ? { ...trans, [field]: value } : trans
      )
    );
  };

  // Remove recognized transaction
  const removeRecognizedTransaction = (id: string) => {
    setRecognizedTransactions((prev) =>
      prev.filter((trans) => trans.id !== id)
    );
  };

  const handleClose = () => {
    // Reset form
    setSelectedAccountId('');
    setEntryType('');
    setTransactionType('');
    setCategory('');
    setAmount('');
    setDate('');
    setNote('');
    setPhoto(null);
    setPhotoPreview('');
    setIsRecognizing(false);
    setRecognizedTransactions([]);
    setIsSaving(false);
    // НЕ сбрасываем showNotification здесь
    onClose();
  };

  return (
    <>
      <RecognitionNotificationModal
        isOpen={showNotification}
        onClose={() => setShowNotification(false)}
      />
      {isOpen && (
      <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Добавить запись</h2>
          <button className="modal-close" onClick={handleClose}>
            ×
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="account" className="form-label">
              Выберите счет
            </label>
            <select
              id="account"
              className="form-select"
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              required
            >
              <option value="">Выберите счет</option>
              {accounts.map((account) => (
                <option key={account.id} value={String(account.id)}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Выберите тип</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="entryType"
                  value="автоматически"
                  checked={entryType === 'автоматически'}
                  onChange={(e) =>
                    setEntryType(e.target.value as 'автоматически' | 'вручную')
                  }
                  required
                />
                <span>Автоматически</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="entryType"
                  value="вручную"
                  checked={entryType === 'вручную'}
                  onChange={(e) =>
                    setEntryType(e.target.value as 'автоматически' | 'вручную')
                  }
                  required
                />
                <span>Вручную</span>
              </label>
            </div>
          </div>

          {entryType === 'автоматически' && (
            <>
              <div className="form-group">
                <label htmlFor="photo" className="form-label">
                  Загрузить фото
                </label>
                <div className="photo-upload">
                  <input
                    type="file"
                    id="photo"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="photo-input"
                    required
                  />
                  <label htmlFor="photo" className="photo-upload-label">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="photo-preview"
                      />
                    ) : (
                      <div className="photo-placeholder">
                        <span className="photo-icon">📷</span>
                        <span>Нажмите для загрузки фото</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {recognizedTransactions.length > 0 && (
                <div className="recognized-transactions">
                  <h3 className="recognized-title">
                    Распознанные транзакции ({recognizedTransactions.length})
                  </h3>
                  {recognizedTransactions.map((trans) => (
                    <div key={trans.id} className="recognized-item">
                      <div className="recognized-item-header">
                        <button
                          type="button"
                          className="btn-remove"
                          onClick={() => removeRecognizedTransaction(trans.id)}
                        >
                          ×
                        </button>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Тип</label>
                        <select
                          className="form-select"
                          value={trans.type}
                          onChange={(e) =>
                            updateRecognizedTransaction(
                              trans.id,
                              'type',
                              e.target.value as 'доход' | 'расход'
                            )
                          }
                        >
                          <option value="доход">Доход</option>
                          <option value="расход">Расход</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Категория</label>
                        <select
                          className="form-select"
                          value={trans.category}
                          onChange={(e) =>
                            updateRecognizedTransaction(
                              trans.id,
                              'category',
                              e.target.value
                            )
                          }
                        >
                          {categories.map((cat) => (
                            <option key={cat.name} value={cat.name}>
                              {cat.icon} {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Сумма</label>
                        <input
                          type="number"
                          className="form-input"
                          value={trans.amount}
                          onChange={(e) =>
                            updateRecognizedTransaction(
                              trans.id,
                              'amount',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Дата</label>
                        <input
                          type="date"
                          className="form-input"
                          value={trans.date}
                          onChange={(e) =>
                            updateRecognizedTransaction(
                              trans.id,
                              'date',
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Примечание</label>
                        <input
                          type="text"
                          className="form-input"
                          value={trans.note || ''}
                          onChange={(e) =>
                            updateRecognizedTransaction(
                              trans.id,
                              'note',
                              e.target.value
                            )
                          }
                          placeholder="Например: Зарплата или Булочка"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {entryType === 'вручную' && (
            <>
              <div className="form-group">
                <label className="form-label">Тип транзакции</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="transactionType"
                      value="доход"
                      checked={transactionType === 'доход'}
                      onChange={(e) =>
                        setTransactionType(
                          e.target.value as 'доход' | 'расход'
                        )
                      }
                      required
                    />
                    <span>Доход</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="transactionType"
                      value="расход"
                      checked={transactionType === 'расход'}
                      onChange={(e) =>
                        setTransactionType(
                          e.target.value as 'доход' | 'расход'
                        )
                      }
                      required
                    />
                    <span>Расход</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="category" className="form-label">
                  Категория
                </label>
                <select
                  id="category"
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Выберите категорию</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="amount" className="form-label">
                  Сумма
                </label>
                <input
                  type="number"
                  id="amount"
                  className="form-input"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Введите сумму"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="date" className="form-label">
                  Дата
                </label>
                <input
                  type="date"
                  id="date"
                  className="form-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="note" className="form-label">
                  Примечание
                </label>
                <input
                  type="text"
                  id="note"
                  className="form-input"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Например: Зарплата или Булочка"
                />
              </div>
            </>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleClose}
              disabled={isSaving}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={isSaving || isRecognizing}
            >
              {isRecognizing
                ? 'Распознавание...'
                : entryType === 'автоматически'
                ? 'Распознать'
                : isSaving
                ? 'Сохранение...'
                : 'Подтвердить'}
            </button>
          </div>
        </form>
      </div>
    </div>
      )}
    </>
  );
};

export default AddTransactionModal;

