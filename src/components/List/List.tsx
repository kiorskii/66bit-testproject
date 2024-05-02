import { useRef, useEffect } from 'react';
import { useEmployee } from '../../contexts/EmployeeContext';
import Employee from '../Employee/Employee';
import styles from './List.module.css';

const List = () => {
  const { employees, loadData, loading, hasMore } = useEmployee();
  const observerRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadData();
      }
    }, {
      threshold: 0.7
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);

    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loading, hasMore]);

  return (
    <div className={styles.list__container}>
      <div className={styles.list}>
        <ul className={styles.list__headers}>
          <li className={styles.list__header}><p>ФИО</p></li>
          <li className={styles.list__header}><p>Должность</p></li>
          <li className={styles.list__header}><p>Телефон</p></li>
          <li className={styles.list__header}><p>Дата рождения</p></li>
        </ul>
        {employees.map(employee => (
          <Employee key={employee.id} data={employee} />
        ))}
        {hasMore && <div ref={observerRef} className={styles.loading}>Загрузка...</div>}
      </div>
    </div>
  );
};

export default List;
