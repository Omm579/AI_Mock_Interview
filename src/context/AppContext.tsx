import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, InterviewDomain, Interview, InterviewSession } from '../types';
import { mockDomains, mockUser } from '../data/mockData';

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loginWithGoogle: () => Promise<void>;
  domains: InterviewDomain[];
  interviews: Interview[];
  currentSession: InterviewSession | null;
  setCurrentSession: React.Dispatch<React.SetStateAction<InterviewSession | null>>;
}

const defaultContext: AppContextType = {
  user: null,
  isAuthenticated: false,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  loginWithGoogle: async () => {},
  domains: [],
  interviews: [],
  currentSession: null,
  setCurrentSession: () => {},
};

const AppContext = createContext<AppContextType>(defaultContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [domains] = useState<InterviewDomain[]>(mockDomains);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null);

  // Simulate loading user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call for login
    try {
      console.log('Logging in with', email, password);
      // For demo purposes, we'll just set the user
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid credentials');
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    // Simulate API call for signup
    try {
      console.log('Signing up with', email, password, name);
      const newUser = { ...mockUser, email, name };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Signup failed:', error);
      throw new Error('Signup failed');
    }
  };

  const loginWithGoogle = async () => {
    // Simulate Google login
    try {
      console.log('Logging in with Google');
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Google login failed:', error);
      throw new Error('Google login failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        loginWithGoogle,
        domains,
        interviews,
        currentSession,
        setCurrentSession,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};