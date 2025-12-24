import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'visitor' | 'patient' | 'doctor' | 'admin';

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
}

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  address?: string;
  dateOfBirth?: string;
  role?: UserRole; // Added role field
  // Doctor specific
  specialty?: string;
  degrees?: string[];
  region?: string;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<UserRole>('visitor');
  const [user, setUser] = useState<UserProfile | null>(null);

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
