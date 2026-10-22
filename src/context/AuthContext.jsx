import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getStoredToken } from '../services/api.js';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [promptReason, setPromptReason] = useState(undefined);

  useEffect(() => {
    async function loadUser() {
      const token = getStoredToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.getMe();
        if (res.user) {
          setUser(res.user);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (credentials) => {
    const res = await api.login(credentials);
    setUser(res.user);
    setAuthModalOpen(false);
  };

  const register = async (payload) => {
    const res = await api.register(payload);
    setUser(res.user);
    setAuthModalOpen(false);
  };

  const logout = async () => {
    try {
      await api.logout();
    } finally {
      setUser(null);
    }
  };

  const openAuthModal = (mode = 'login', reason) => {
    setAuthModalMode(mode);
    setPromptReason(reason);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    setPromptReason(undefined);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        authModalOpen,
        authModalMode,
        promptReason,
        openAuthModal,
        closeAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
