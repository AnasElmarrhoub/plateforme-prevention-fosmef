'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('fosmef_token');
    const storedUser = localStorage.getItem('fosmef_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authApi.login(email, password);
    localStorage.setItem('fosmef_token', data.token);
    localStorage.setItem('fosmef_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    // Redirect based on role
    if (data.user.role === 'GESTIONNAIRE') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  }, [router]);

  const register = useCallback(async (formData) => {
    const data = await authApi.register(formData);
    localStorage.setItem('fosmef_token', data.token);
    localStorage.setItem('fosmef_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    router.push('/dashboard');
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem('fosmef_token');
    localStorage.removeItem('fosmef_user');
    setToken(null);
    setUser(null);
    router.push('/');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
