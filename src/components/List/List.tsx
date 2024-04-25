import { useEffect, useRef } from 'react';
import { useEmployee } from '../../contexts/EmployeeContext';
import Employee from '../Employee/Employee';
import styles from './List.module.css';
import { fetchEmployees } from '../../services/api';

const List = () => {
  const { employees, setEmployees, filters, page, setPage, hasMore, setHasMore, loading, setLoading }: any = useEmployee();
  const loadingRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      if (!hasMore || loading) return;

      setLoading(true);
      const data = await fetchEmployees(page, 20, filters.genderFilter, filters.positionFilter, filters.stackFilter, filters.searchQuery);
      if (data.length === 0 || data.length < 20) {
        setHasMore(false);
      } else {
        setEmployees(data);
        setPage(prev => prev + 1);
      }
      setLoading(false);
    }

    loadData();

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadData();
      }
    }, { threshold: 1 });

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [page, filters, hasMore, loading]); // Подписка на изменения этих значений для повторной загрузки


  return (
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
      {hasMore && (
        <div ref={loadingRef} className={styles.loading}>{loading && <p>Загрузка...</p>}</div>
      )}
    </div>
  );
}

export default List;
