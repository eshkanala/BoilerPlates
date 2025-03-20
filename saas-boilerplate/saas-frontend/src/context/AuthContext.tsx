import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { create } from 'zustand';
import axios from 'axios';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null; // Define user type more specifically later
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem('authToken'), // Load token from localStorage on init
  login: (token) => {
    localStorage.setItem('authToken', token);
    set({ isAuthenticated: true, token });
  },
  logout: () => {
    localStorage.removeItem('authToken');
    set({ isAuthenticated: false, user: null, token: null });
  },
  checkAuthStatus: async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const response = await axios.get('/api/auth/me', { // Backend endpoint
          headers: { Authorization: `Bearer ${token}` },
        });
        set({ isAuthenticated: true, user: response.data.user, token });
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('authToken'); // Clear invalid token
        set({ isAuthenticated: false, user: null, token: null });
      }
    } else {
      set({ isAuthenticated: false, user: null, token: null });
    }
  },
}));

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const authStore = useAuthStore();

  useEffect(() => {
    authStore.checkAuthStatus(); // Check auth status on app load
  }, [authStore.checkAuthStatus]); // Run only once on mount

  return (
    <AuthContext.Provider value={authStore}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};