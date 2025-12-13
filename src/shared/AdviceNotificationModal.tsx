import React from 'react';
import './RecognitionNotificationModal.css';

interface AdviceNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdviceNotificationModal: React.FC<AdviceNotificationModalProps> = ({
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
        <h2 className="notification-title">Запрос отправлен на обработку</h2>
        <p className="notification-message">
          Ваш запрос обрабатывается с помощью искусственного интеллекта.
          Персональные финансовые советы автоматически появятся в течение нескольких минут.
        </p>
        <button className="btn-notification-close" onClick={onClose}>
          Понятно
        </button>
      </div>
    </div>
  );
};

export default AdviceNotificationModal;

