import { useEffect, useRef } from 'react';
import { Button, Space } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useEmployee } from '../../contexts/EmployeeContext';
import Employee from '../Employee/Employee';
import styles from './List.module.css';

const List = () => {
  const { employees, loadData, loading, hasMore, filters } = useEmployee();
  const observerRef = useRef<HTMLDivElement | null>(null);

  /* ────────────── infinite-scroll ────────────── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) loadData();
      },
      { threshold: 0.7 }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () =>
      observerRef.current && observer.unobserve(observerRef.current);
  }, [loading, hasMore, loadData]);

  /* ─────────────── экспорт CSV ──────────────── */
  const exportCsv = () => {
    if (!employees.length) return;

    /* 1) строка с фильтрами */
    const f = filters ?? {};
  
    const labelMap: Record<string, string> = {
    name: 'поиск',
    gender: 'пол',
    position: 'должность',
    stack: 'стек',
    };
  
    const filtText = Object.entries(f)
    .filter(([, v]) =>
      Array.isArray(v) ? v.length : v && String(v).trim() !== '')
    .map(([k, v]) => {
      const value = Array.isArray(v) ? v.join('|') : v;
      return `${labelMap[k] || k}=${value}`;
    })
    .join('; ');

    const headerFilters = [`# Применённые фильтры: ${filtText || 'нет'}`];

    /* 2) данные сотрудников */
    const header = ['ФИО', 'Должность', 'Телефон', 'Дата рождения'];
    const rows = employees.map(e => [
      `"${e.name}"`,
      `"${e.position}"`,
      `"${e.phone}"`,
      `"${e.birthdate}"`,
    ]);

    const csvText = [
      ...headerFilters,
      header.join(','),
      ...rows.map(r => r.join(',')),
    ].join('\n');

    const blob = new Blob([csvText], {
      type: 'text/csv;charset=utf-8;',
    });

    /* 3) имя файла с суффиксом фильтров */
    const date = new Date().toISOString().slice(0, 10);
    const suffix =
      (filtText
        .replace(/[^a-zA-ZА-Яа-я0-9]+/g, '_')
        .slice(0, 40) || 'all') + '_' + date;

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `employees_${suffix}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  /* ─────────────── рендер ──────────────── */
  return (
    <div className={styles.list__container}>

      <div className={styles.list}>
        <div className={styles.buttonContainer}>
        <Button
          icon={<DownloadOutlined />}
          type="primary"
          onClick={exportCsv}
          className={styles.button__export}
        >
          Экспорт CSV
        </Button>
        </div>

        <ul className={styles.list__headers}>
          <li className={styles.list__header}>
            <p>ФИО</p>
          </li>
          <li className={styles.list__header}>
            <p>Должность</p>
          </li>
          <li className={styles.list__header}>
            <p>Телефон</p>
          </li>
          <li className={styles.list__header}>
            <p>Дата устройства</p>
          </li>
        </ul>

        {employees.map(emp => (
          <Employee key={emp.id} data={emp} />
        ))}

        {hasMore && (
          <div ref={observerRef} className={styles.loading}>
            Загрузка…
          </div>
        )}
      </div>
    </div>
  );
};

export default List;
