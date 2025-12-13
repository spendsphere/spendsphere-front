import React from 'react';
import './RecognitionNotificationModal.css';

interface RecognitionNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RecognitionNotificationModal: React.FC<RecognitionNotificationModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="notification-overlay" onClick={onClose}>
      <div className="notification-content" onClick={(e) => e.stopPropagation()}>
        <div className="notification-icon">
          <div className="icon-circle">
            <span className="icon-check">✓</span>
          </div>
        </div>
        <h2 className="notification-title">Фото отправлено на распознавание</h2>
        <p className="notification-message">
          Ваша транзакция обрабатывается с помощью искусственного интеллекта.
          Распознанные данные автоматически появятся в общем списке транзакций
          в течение нескольких минут.
        </p>
        <button className="btn-notification-close" onClick={onClose}>
          Понятно
        </button>
      </div>
    </div>
  );
};

export default RecognitionNotificationModal;


