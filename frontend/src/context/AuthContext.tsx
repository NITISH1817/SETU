import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  quickSwitchRole: (role: 'CITIZEN' | 'WELFARE_OFFICER' | 'REVENUE_OFFICER' | 'ADMIN', citizenId?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('govconnect_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('govconnect_token') || null;
  });
  const [loading, setLoading] = useState<boolean>(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      localStorage.setItem('govconnect_token', token);
      localStorage.setItem('govconnect_user', JSON.stringify(user));
      setToken(token);
      setUser(user);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: any) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', data);
      const { token, user } = res.data;
      localStorage.setItem('govconnect_token', token);
      localStorage.setItem('govconnect_user', JSON.stringify(user));
      setToken(token);
      setUser(user);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('govconnect_token');
    localStorage.removeItem('govconnect_user');
    setToken(null);
    setUser(null);
  };

  const quickSwitchRole = async (role: 'CITIZEN' | 'WELFARE_OFFICER' | 'REVENUE_OFFICER' | 'ADMIN', citizenId?: string) => {
    let email = 'citizen@gov.in';
    let password = 'Citizen123!';

    if (role === 'CITIZEN') {
      if (citizenId === 'CIT-1002') email = 'citizen2@gov.in';
      else if (citizenId === 'CIT-1003') email = 'citizen3@gov.in';
      else email = 'citizen@gov.in';
      password = 'Citizen123!';
    } else if (role === 'WELFARE_OFFICER') {
      email = 'welfare@gov.in';
      password = 'Welfare123!';
    } else if (role === 'REVENUE_OFFICER') {
      email = 'revenue@gov.in';
      password = 'Revenue123!';
    } else if (role === 'ADMIN') {
      email = 'admin@gov.in';
      password = 'Admin123!';
    }

    await login(email, password);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, quickSwitchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
