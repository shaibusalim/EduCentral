"use client";

import type React from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export type UserRole = 'admin' | 'teacher' | 'student' | 'parent' | null;

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isLoadingRole: boolean;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>(null);
  const [isLoadingRole, setIsLoadingRole] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedRole = localStorage.getItem('userRole') as UserRole;
      if (storedRole) {
        setRoleState(storedRole);
      }
    } catch (error) {
      console.warn("Could not access localStorage for user role.");
    }
    setIsLoadingRole(false);
  }, []);

  const setRole = useCallback((newRole: UserRole) => {
    setRoleState(newRole);
    setIsLoadingRole(false);
    if (newRole) {
      try {
        localStorage.setItem('userRole', newRole);
      } catch (error) {
        console.warn("Could not access localStorage to set user role.");
      }
    } else {
      try {
        localStorage.removeItem('userRole');
      } catch (error) {
        console.warn("Could not access localStorage to remove user role.");
      }
    }
  }, []);

  const logout = useCallback(() => {
    setRole(null);
    router.push('/');
  }, [setRole, router]);

  return (
    <AppContext.Provider value={{ role, setRole, isLoadingRole, logout }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
