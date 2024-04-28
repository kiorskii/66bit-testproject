import { useParams } from 'react-router-dom';
import styles from './Person.module.css'
import { useEffect, useState } from 'react';
import { fetchEmployee } from '../../services/api';


const Person = () => {

  const { id } = useParams();

  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    async function fetchEmployeeDetails(id) {
      const data = await fetchEmployee(id);
      setEmployee(data);
    }
    fetchEmployeeDetails(id);
  }, [id]);

  const MainInfo = [
    { label: "Контактный телефон", value: employee?.phone },
    { label: "День рождения", value: employee?.birthdate },
    { label: "Дата устройства", value: employee?.dateOfEmployment }
  ];

  return (

    <div className={styles.person}>
      <div className="top">

        <div className={styles.person__image}>
          <img src={employee?.photo} alt="avatar" />
        </div>
        <h2 className="person__name">{employee?.name}</h2>
        <p className={styles.person__position}>{employee?.position}</p>
        <div className={styles.person__stack}>
          {employee?.stack.map((item, index) => (
            <p key={index} className={styles.person__stackItem}>{item}</p>
          ))}
        </div>
      </div>

      <div className={styles.person__mainInfo}>
        <h3 className={styles.person__title}>Основная информация</h3>

        <ul className={styles.person__infoList}>
          {MainInfo.map((item, index) => (
            <li key={index} className={styles.person__infoItem}>
              <p>{item.label}</p>
              <p>{item.value}</p>
            </li>
          ))}
        </ul>

      </div>
    </div>

  )
}


export default Person