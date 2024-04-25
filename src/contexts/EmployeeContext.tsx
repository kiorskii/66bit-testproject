import { createContext, useContext, useState } from 'react';

const EmployeeContext = createContext();

export const useEmployee = () => useContext(EmployeeContext);

export const EmployeeProvider = ({ children }: { children: any }) => {
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

  return (
    <EmployeeContext.Provider value={{
      employees, setEmployees,
      loading, setLoading,
      page, setPage,
      hasMore, setHasMore,
      filters, setFilters
    }}>
      {children}
    </EmployeeContext.Provider>
  );
};
