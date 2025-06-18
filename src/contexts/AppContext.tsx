
"use client";

import type React from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase'; // Import auth
import { onAuthStateChanged, signOut, type User } from 'firebase/auth'; // Import Firebase Auth types and functions

export type UserRole = 'admin' | 'teacher' | 'student' | 'parent' | null;

interface AppContextType {
  authUser: User | null; // Firebase user object
  role: UserRole;
  setRole: (role: UserRole) => void;
  isLoadingUser: boolean; // Combined loading state for auth and role
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [role, setRoleState] = useState<UserRole>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoadingUser(true);
      if (user) {
        setAuthUser(user);
        // User is signed in, try to load role from localStorage
        try {
          const storedRole = localStorage.getItem('userRole') as UserRole;
          if (storedRole) {
            setRoleState(storedRole);
          } else {
            setRoleState(null); // Explicitly set to null if no role found for the authenticated user
          }
        } catch (error) {
          console.warn("Could not access localStorage for user role.");
          setRoleState(null);
        }
      } else {
        // User is signed out
        setAuthUser(null);
        setRoleState(null);
        try {
          localStorage.removeItem('userRole');
        } catch (error) {
          console.warn("Could not access localStorage to remove user role.");
        }
      }
      setIsLoadingUser(false);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const setRoleContext = useCallback((newRole: UserRole) => {
    setRoleState(newRole);
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

  const logoutUser = useCallback(async () => {
    try {
      await signOut(auth);
      // onAuthStateChanged will handle setting authUser and role to null
      // and clearing localStorage.
      router.push('/');
    } catch (error) {
      console.error("Error signing out: ", error);
      // Handle error appropriately, maybe show a toast
    }
  }, [router]);

  return (
    <AppContext.Provider value={{ authUser, role, setRole: setRoleContext, isLoadingUser, logout: logoutUser }}>
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
