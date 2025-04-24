import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, initAuthHeader, User } from '../services/auth';
import API from '../services/auth'; 


interface AuthCtx {
  user: User | null;
  login: (e: string, p: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthCtx>(null!);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const [user, setUser] = useState<User | null>(
    () => JSON.parse(localStorage.getItem('user') || 'null')   
  );

  useEffect(() => initAuthHeader(), []);

  const login = async (email: string, password: string) => {
    const u = await loginApi(email, password);
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete API.defaults.headers.common['Authorization'];   
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
