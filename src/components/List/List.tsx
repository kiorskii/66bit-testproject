import { useState, useEffect, useRef } from 'react';
import Employee from '../Employee/Employee';
import styles from './List.module.css';
import { fetchEmployees } from '../../services/api.tsx';

interface EmployeeData {
  id: number;
  fullName: string;
  position: string;
  phone: string;
  birthDate: string;
}


const List = () => {
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadingRef = useRef(null);

  async function loadData() {
    if (loading || !hasMore) return;

    setLoading(true);
    const newEmployees = await fetchEmployees(page, 20);
    if (newEmployees.length === 0 || newEmployees.length < 20) {
      setHasMore(false);
    }
    setEmployees(prev => [...prev, ...newEmployees]);
    setPage(prev => prev + 1);
    setLoading(false);
  }


  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          loadData();
        }
      },
      { threshold: 1 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [loading, hasMore]);



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
        {hasMore ? (
          <div ref={loadingRef} className={styles.loading}>
            {loading && <p>Загрузка...</p>}
          </div>
        ) : ("")}
      </div>
    </>
  );
}

export default List;
