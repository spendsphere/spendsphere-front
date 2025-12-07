import React, { useState, useEffect, useRef } from 'react';
import '../../shared/AddTransactionModal.css';
import './EditProfileModal.css';

interface EditProfileModalProps {
  isOpen: boolean;
  profile: {
    name: string;
    email: string;
    avatar: string;
    isPremium: boolean;
    balance: number;
  };
  onClose: () => void;
  onSave: (profile: Partial<typeof profile>) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  profile,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [currentAvatar, setCurrentAvatar] = useState(profile.avatar);
  const [newAvatar, setNewAvatar] = useState<string | null>(null);
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName(profile.name);
      setEmail(profile.email);
      setCurrentAvatar(profile.avatar);
      setNewAvatar(null);
      setNewAvatarFile(null);
    }
  }, [isOpen, profile]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setNewAvatarFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewAvatar(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Пожалуйста, выберите изображение');
      }
    }
  };

  const handleConfirmAvatar = () => {
    if (newAvatar) {
      setCurrentAvatar(newAvatar);
      setNewAvatar(null);
      setNewAvatarFile(null);
    }
  };

  const handleCancelAvatar = () => {
    setNewAvatar(null);
    setNewAvatarFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert('Заполните все обязательные поля');
      return;
    }

    const updatedProfile: any = {
      name: name.trim(),
      email: email.trim(),
    };

    // Если был выбран новый аватар, сохраняем его
    if (newAvatar && newAvatarFile) {
      // В реальном приложении здесь будет загрузка файла на сервер
      // Пока просто сохраняем data URL
      updatedProfile.avatar = newAvatar;
    } else {
      updatedProfile.avatar = currentAvatar;
    }

    onSave(updatedProfile);
  };

  if (!isOpen) return null;

  const displayAvatar = newAvatar || currentAvatar;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Редактировать профиль</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group avatar-group">
            <label className="form-label">Аватар</label>
            <div className="avatar-upload-container">
              <div className="avatar-preview" onClick={handleAvatarClick}>
                <img
                  src={displayAvatar}
                  alt="Avatar preview"
                  className="avatar-preview-image"
                />
                <div className="avatar-overlay">
                  <span className="avatar-upload-icon">📷</span>
                  <span className="avatar-upload-text">Изменить фото</span>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              {newAvatar && (
                <div className="avatar-actions">
                  <button
                    type="button"
                    className="btn-confirm-avatar"
                    onClick={handleConfirmAvatar}
                  >
                    ✓ Подтвердить
                  </button>
                  <button
                    type="button"
                    className="btn-cancel-avatar"
                    onClick={handleCancelAvatar}
                  >
                    ✕ Отменить
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Имя *
            </label>
            <input
              type="text"
              id="name"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите имя"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email *
            </label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Введите email"
              required
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
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;

