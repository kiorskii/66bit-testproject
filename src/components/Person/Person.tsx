import { useState } from 'react';
import styles from './Person.module.css';
import { useNavigate } from 'react-router-dom';
import EditEmployeeModal from '../EditEmployeeModal/EditEmployeeModal';


const Person = ({ employee }) => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false); // Состояние для отображения модального окна
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);


  const MainInfo = [
    { label: "Контактный телефон:", value: employee?.phone },
    { label: "День рождения:", value: employee?.birthdate },
    { label: "Дата устройства:", value: employee?.dateOfEmployment }
  ];

  // Функция для удаления сотрудника
  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3001/api/Employee/${employee?.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      navigate('/employees');

      if (!response.ok) {
        throw new Error('Failed to delete employee');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error: ", error);
      throw error;
    }
  };

  return (
    <div className={styles.person}>
      <div className={styles.top}>
        <div className={styles.person__imgContainer}>
          <img className={styles.person__image} src={employee?.photo} alt="avatar" />
        </div>
        <div>
          <h2 className={styles.person__name}>{employee?.name}</h2>
          <p className={styles.person__position}>{employee?.position}</p>
          <div className={styles.person__stack}>
            {employee?.stack.map((item, index) => (
              <p key={index} className={styles.person__stackItem}>{item}</p>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.person__mainInfo}>
        <h3 className={styles.person__title}>Основная информация</h3>

        <button className={styles.person__editButton} onClick={openModal}>
        Редактировать
      </button>
      {/* Кнопка удаления */}
      <button className={styles.deleteButton} onClick={() => setShowConfirm(true)}>
        Удалить
      </button>


        <ul className={styles.person__infoList}>
          {MainInfo.map((item, index) => (
            <li key={index} className={styles.person__infoItem}>
              <p className={styles.person__infoLabel}>{item.label}</p>
              <p className={styles.person__infoValue}>{item.value}</p>
            </li>
          ))}
        </ul>
      </div>

      <EditEmployeeModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        employee={employee}
        refreshData={() => {}}  // Здесь можно передать функцию обновления данных
      />

      {/* Модальное окно подтверждения */}
      {showConfirm && (
        <div className={styles.confirmModal}>
          <div className={styles.confirmModalContent}>
            <h3>Вы уверены, что хотите удалить этого сотрудника?</h3>
            <button onClick={handleDelete}>Да</button>
            <button onClick={() => setShowConfirm(false)}>Отмена</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Person;
