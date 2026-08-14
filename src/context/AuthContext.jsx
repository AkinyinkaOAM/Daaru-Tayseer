import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await authAPI.getMe();
      setUser(data.data.user);
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [loadUser]);

 const login = async (email, password) => {
  const normalizedEmail = String(email).trim().toLowerCase();

  const response = await authAPI.login({
    email: normalizedEmail,
    password,
  });

  const { token, user } = response.data.data;

  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));

  setUser(user);

  return user;
};

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isSuperSuperAdmin = user?.role === 'super_super_admin';
  const isSuperAdmin = user?.role === 'super_admin' || user?.role === 'super_super_admin';
  const isAdmin = ['admin', 'super_admin', 'super_super_admin'].includes(user?.role);
  const isStudent = user?.role === 'student';
  const isParent = user?.role === 'parent';

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAuthenticated,
        isSuperSuperAdmin,
        isSuperAdmin,
        isAdmin,
        isStudent,
        isParent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

