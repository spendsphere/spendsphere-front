import React, { useState, useEffect } from 'react';
import { useCategories } from '../context/CategoriesContext';
import { Transaction } from '../../pages/transactions/TransactionsPage';
import './AddTransactionModal.css';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (transaction: Omit<Transaction, 'id'>) => void;
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
  const { getExpenseCategories, getIncomeCategories, getCategoryByName } = useCategories();
  const [selectedAccount, setSelectedAccount] = useState<string>('');
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
  const [recognizedTransactions, setRecognizedTransactions] = useState<
    RecognizedTransaction[]
  >([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const accounts = ['Tinkoff', 'Сбербанк', 'Наличные'];

  const getCategories = () => {
    if (transactionType === 'доход') {
      return getIncomeCategories();
    } else if (transactionType === 'расход') {
      return getExpenseCategories();
    }
    return getExpenseCategories();
  };

  const categories = getCategories();

  const getCategoryIcon = (categoryName: string): string => {
    const category = getCategoryByName(categoryName);
    return category ? category.icon : '📁';
  };

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      // Set default date to today
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
      // Reset other fields
      setSelectedAccount('');
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
    }
  }, [isOpen]);

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

  // Mock API: Recognize photo
  const handleRecognize = async () => {
    if (!photo) return;

    setIsRecognizing(true);
    try {
      // Mock API call - simulate delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock recognized transactions (can be 1 or more)
      const mockTransactions: RecognizedTransaction[] = [
        {
          id: '1',
          type: 'расход',
          category: categories[0].name,
          amount: 1250,
          date: date || new Date().toISOString().split('T')[0],
          note: 'Магазин "Пятёрочка"',
        },
        {
          id: '2',
          type: 'расход',
          category: categories[1].name,
          amount: 500,
          date: date || new Date().toISOString().split('T')[0],
          note: 'Метро',
        },
      ];

      setRecognizedTransactions(mockTransactions);
    } catch (error) {
      console.error('Error recognizing photo:', error);
      alert('Ошибка при распознавании фото. Попробуйте еще раз.');
    } finally {
      setIsRecognizing(false);
    }
  };

  // Mock API: Save transactions
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let transactionsToSave: RecognizedTransaction[];

      if (entryType === 'автоматически') {
        // Save recognized transactions
        if (recognizedTransactions.length === 0) {
          alert('Сначала распознайте фото');
          setIsSaving(false);
          return;
        }
        transactionsToSave = recognizedTransactions;
      } else {
        // Save manual transaction
        if (!transactionType || !category || !amount || !date) {
          alert('Заполните все обязательные поля');
          setIsSaving(false);
          return;
        }
        transactionsToSave = [
          {
            id: Date.now().toString(),
            type: transactionType as 'доход' | 'расход',
            category,
            amount: parseFloat(amount),
            date,
            note: note || undefined,
          },
        ];
      }

      // Mock API call - simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock successful save
      console.log('Saving transactions:', {
        account: selectedAccount,
        transactions: transactionsToSave,
      });

      // Call onSave callback if provided (for TransactionsPage)
      if (onSave) {
        transactionsToSave.forEach((trans) => {
          onSave({
            source: selectedAccount,
            type: trans.type,
            category: trans.category,
            categoryIcon: getCategoryIcon(trans.category),
            amount: trans.amount,
            date: trans.date,
            note: trans.note,
            status: 'added' as const,
          });
        });
      } else {
        alert(`Успешно сохранено ${transactionsToSave.length} транзакция(ий)`);
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
    setSelectedAccount('');
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
    onClose();
  };

  if (!isOpen) return null;

  return (
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
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              required
            >
              <option value="">Выберите счет</option>
              {accounts.map((account) => (
                <option key={account} value={account}>
                  {account}
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
                {photoPreview && recognizedTransactions.length === 0 && (
                  <button
                    type="button"
                    className="btn-recognize"
                    onClick={handleRecognize}
                    disabled={isRecognizing}
                  >
                    {isRecognizing ? 'Распознавание...' : 'Распознать'}
                  </button>
                )}
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
              {isSaving ? 'Сохранение...' : 'Подтвердить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;

