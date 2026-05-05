import { createContext, useContext, useState, useEffect } from 'react';
import { getProfile, logoutUser } from '../api/authAPI';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('thesease-token');
    if (!token) { setLoading(false); return; }
    try {
      const res = await getProfile();
      setUser(res.data.user);
    } catch {
      localStorage.removeItem('thesease-token');
      localStorage.removeItem('thesease-user');
    } finally {
      setLoading(false);
    }
  };

  const login = (token, userData) => {
    localStorage.setItem('thesease-token', token);
    localStorage.setItem('thesease-user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      // Even if API call fails, clear locally
    } finally {
      localStorage.removeItem('thesease-token');
      localStorage.removeItem('thesease-user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;