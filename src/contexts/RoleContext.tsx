import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'visitor' | 'patient' | 'doctor' | 'admin' | 'superadmin';

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
}

export interface UserProfile {
  id: string; // MongoDB _id
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  address?: string;
  dateOfBirth?: string;
  role?: UserRole; // Frontend role
  rôle?: string;   // Backend role
  // Doctor specific
  specialty?: string;
  degrees?: string[];
  region?: string;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<UserRole>(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      let role = user.rôle || user.role;
      if (role === 'medecin') role = 'doctor';
      return (role as UserRole) || 'visitor';
    }
    return 'visitor';
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      return {
        id: user._id,
        name: user.email,
        email: user.email,
        role: user.role === 'medecin' ? 'doctor' : user.role || user.rôle,
        rôle: user.rôle
      } as UserProfile;
    }
    return null;
  });

  // Synchronize state with localStorage
  useEffect(() => {
    if (user) {
      // Just ensure context is synced, the api service already uses localStorage
    }
  }, [user, role]);

  return (
    <RoleContext.Provider value={{ role, setRole, user, setUser }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
