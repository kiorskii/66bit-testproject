import React, { useState, useEffect } from 'react';
import { formatPhone } from '../../services/phone_formatter';
import { updateEmployee } from '../../services/api';
import styles from './EditEmployeeModal.module.css';

const convertDateToInputFormat = (dateStr: string) => {
  const [day, month, year] = dateStr.split('.');
  return `${year}-${month}-${day}`;
};

const EditEmployeeModal = ({ isOpen, closeModal, employee, refreshData }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: 'Мужчина',
    position: 'Менеджер',
    stack: ['Word'],
    birthdate: '',
    dateOfEmployment: '',
    photo: ''
  });

  // Открытие и закрытие модального окна
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        phone: formatPhone(employee.phone), // форматируем номер
        gender: employee.gender,
        position: employee.position,
        stack: employee.stack,
        birthdate: convertDateToInputFormat(employee.birthdate), // Преобразуем дату в формат для поля input
        dateOfEmployment: convertDateToInputFormat(employee.dateOfEmployment), // Преобразуем дату в формат для поля input
        photo: employee.photo
      });
    }
  }, [employee, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
  };

  const handleTechChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const updatedStack = checked
        ? [...prev.stack, value]
        : prev.stack.filter((tech) => tech !== value);
      return { ...prev, stack: updatedStack };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Преобразуем даты обратно в строку перед отправкой
    const updatedData = {
      ...formData
    };

    try {
      await updateEmployee(employee.id, updatedData);  // Отправляем обновленные данные
      refreshData();  // Обновляем данные на странице
      closeModal();  // Закрываем модальное окно
    } catch (error) {
      alert('Не удалось обновить информацию');
    }
  };

  return (
    <div className={`${styles.modal} ${isOpen ? styles.open : ''}`}>
      <div className={styles.modalContent}>
        <h2>Редактировать информацию</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">ФИО</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="phone">Телефон</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="gender">Пол</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="Мужчина">Мужчина</option>
              <option value="Женщина">Женщина</option>
            </select>
          </div>
          <div>
            <label htmlFor="position">Должность</label>
            <select
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
            >
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Аналитик">Аналитик</option>
              <option value="Менеджер">Менеджер</option>
              <option value="Дизайнер">Дизайнер</option>
            </select>
          </div>
          <div>
            <label>Технологии</label>
            {['CSharp', 'React', 'Java', 'PHP', 'Figma', 'Word'].map((tech) => (
              <div key={tech}>
                <input
                  type="checkbox"
                  id={tech}
                  name="stack"
                  value={tech}
                  checked={formData.stack.includes(tech)}
                  onChange={handleTechChange}
                />
                <label htmlFor={tech}>{tech}</label>
              </div>
            ))}
          </div>
          <div>
            <label htmlFor="birthdate">Дата рождения</label>
            <input
              type="date"
              id="birthdate"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="dateOfEmployment">Дата устройства на работу</label>
            <input
              type="date"
              id="dateOfEmployment"
              name="dateOfEmployment"
              value={formData.dateOfEmployment}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="photo">Фото</label>
            <input
              type="text"
              id="photo"
              name="photo"
              value={formData.photo}
              onChange={handleChange}
            />
          </div>
          <div className={styles.modalActions}>
            <button type="submit">Сохранить</button>
            <button type="button" onClick={closeModal}>Закрыть</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeeModal;
