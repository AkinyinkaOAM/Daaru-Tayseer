import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser);
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const { data } = await authAPI.getMe();
      const nextUser = data?.data?.user ?? null;
      setUser(nextUser);
      if (nextUser) {
        localStorage.setItem('user', JSON.stringify(nextUser));
      } else {
        localStorage.removeItem('user');
      }
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      if (!localStorage.getItem('token')) {
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      await loadUser();
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
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

  const changePassword = async (currentPassword, newPassword) => {
    const { data } = await authAPI.updatePassword({ currentPassword, newPassword });
    if (data?.data?.token) localStorage.setItem('token', data.data.token);
    const nextUser = { ...user, mustChangePassword: false };
    setUser(nextUser);
    localStorage.setItem('user', JSON.stringify(nextUser));
    return nextUser;
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

  return React.createElement(
    AuthContext.Provider,
    {
      value: {
        user,
        login,
        changePassword,
        logout,
        loading,
        isAuthenticated,
        isSuperSuperAdmin,
        isSuperAdmin,
        isAdmin,
        isStudent,
        isParent,
      },
    },
    children
  );
}
