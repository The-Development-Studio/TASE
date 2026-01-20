import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    username: 'ppc',
    name: 'PPC User',
    role: 'PPC',
    email: 'ppc@company.com',
    active: true,
  },
  {
    id: '2',
    username: 'admin',
    name: 'Admin User',
    role: 'ADMIN',
    email: 'admin@company.com',
    active: true,
  },
  {
    id: '3',
    username: 'npd',
    name: 'NPD Engineer',
    role: 'NPD_ENGINEER',
    email: 'npd@company.com',
    active: true,
  },
  {
    id: '4',
    username: 'toolcrib',
    name: 'Tool Crib Person',
    role: 'TOOL_CRIB',
    email: 'toolcrib@company.com',
    active: true,
  },
  {
    id: '5',
    username: 'qa',
    name: 'QA Engineer',
    role: 'QA_ENGINEER',
    email: 'qa@company.com',
    active: true,
  },
  {
    id: '6',
    username: 'store',
    name: 'Store Executive',
    role: 'STORE_EXECUTIVE',
    email: 'store@company.com',
    active: true,
  },
  {
    id: '7',
    username: 'production',
    name: 'Production Supervisor',
    role: 'PRODUCTION_SUPERVISOR',
    email: 'production@company.com',
    active: true,
  },
  {
    id: '8',
    username: 'manager',
    name: 'Assistant Manager',
    role: 'ASSISTANT_MANAGER',
    email: 'manager@company.com',
    active: true,
  },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string): boolean => {
    // Simple mock authentication
    const foundUser = mockUsers.find(u => u.username === username && password === 'password');
    
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
