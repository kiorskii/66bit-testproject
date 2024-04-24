import { useState, useEffect } from 'react';
import Employee from '../Employee/Employee';
import styles from './List.module.css';
import { fetchEmployees } from '../../services/api.tsx';

interface EmployeeData {
  id: string;
  fullName: string;
  position: string;
  phone: string;
  birthDate: string;
}

const List = () => {
  const [employees, setEmployees] = useState<EmployeeData[]>([]);


  useEffect(() => {
    async function loadData() {
      const data = await fetchEmployees();
      setEmployees(data);
    }

    loadData();
  }, []);

  return (
    <>
      <div className={styles.list}>
        <ul className={styles.list__headers}>
          <li className={styles.list__header}><p>ФИО</p></li>
          <li className={styles.list__header}><p>Должность</p></li>
          <li className={styles.list__header}><p>Телефон</p></li>
          <li className={styles.list__header}><p>Дата рождения</p></li>
        </ul>
        {employees && employees.length > 0 ? (
          employees.map(employee => (
            < Employee key={employee.id} data={employee} />
          ))
        ) : (
          <p>Загрузка данных о сотрудниках...</p>
        )}
      </div>
    </>
  );
}

export default List;
