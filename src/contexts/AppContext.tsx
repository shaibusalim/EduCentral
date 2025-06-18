
"use client";

import type React from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase'; 
import { onAuthStateChanged, signOut, type User } from 'firebase/auth'; 
import { getUserRole, setUserRole as saveUserRoleToFirestore } from '@/services/userService'; // Import user service

export type UserRole = 'admin' | 'teacher' | 'student' | 'parent' | null;

interface AppContextType {
  authUser: User | null; 
  role: UserRole;
  setRole: (role: UserRole) => void;
  isLoadingUser: boolean; 
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [role, setRoleState] = useState<UserRole>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoadingUser(true);
      if (user) {
        setAuthUser(user);
        // User is signed in, try to load role from Firestore
        const firestoreRole = await getUserRole(user.uid);
        if (firestoreRole) {
          setRoleState(firestoreRole);
        } else {
          setRoleState(null); // No role found in Firestore
        }
      } else {
        // User is signed out
        setAuthUser(null);
        setRoleState(null);
      }
      setIsLoadingUser(false);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const setRoleContext = useCallback(async (newRole: UserRole) => {
    setRoleState(newRole);
    if (authUser && newRole) {
      try {
        await saveUserRoleToFirestore(authUser.uid, authUser.email, newRole);
      } catch (error) {
        console.error("Failed to save role to Firestore:", error);
        // Optionally: display a toast to the user
      }
    }
  }, [authUser]);

  const logoutUser = useCallback(async () => {
    try {
      await signOut(auth);
      // onAuthStateChanged will handle setting authUser and role to null
      router.push('/');
    } catch (error) {
      console.error("Error signing out: ", error);
      // Handle error appropriately
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
