import { createContext, useContext, useState, useEffect } from 'react';
import { fetchEmployees } from '../services/api';

const EmployeeContext = createContext();

export const useEmployee = () => useContext(EmployeeContext);

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [filters, setFilters] = useState({
    genderFilter: [],
    positionFilter: [],
    stackFilter: [],
    searchQuery: ''
  });

  const loadData = async () => {
    if (!hasMore || loading) return;  // Добавлено условие, чтобы избежать повторных загрузок
    setLoading(true);

    const data = await fetchEmployees(page, 20, filters.genderFilter, filters.positionFilter, filters.stackFilter, filters.searchQuery);
    console.log(data)
    if (data.length < 20) setHasMore(false);
    if (page === 1) {
      if (data.length === 0) {
        setEmployees([{ id: 0, name: 'Мы никого не нашли :(' }]);
        return
      }
      setEmployees(data);
      setPage(2)
    }
    else {
      setEmployees(prev => [...prev, ...data]);
      setPage(prev => prev + 1);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  return (
    <EmployeeContext.Provider value={{
      employees, setEmployees,
      loading, setLoading,
      page, setPage,
      hasMore, setHasMore,
      filters, setFilters,
      loadData
    }}>
      {children}
    </EmployeeContext.Provider>
  );
};
