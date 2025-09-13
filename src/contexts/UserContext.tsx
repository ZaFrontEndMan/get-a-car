import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useUserData } from '@/hooks/useUserData';
import { useNavigate } from 'react-router-dom';

export type UserRole = 'admin' | 'vendor' | 'client' | null;

// Map API roles to internal roles
const mapApiRoleToUserRole = (apiRole: string): UserRole => {
  switch (apiRole?.toLowerCase()) {
    case 'admin':
      return 'admin';
    case 'vendor':
      return 'vendor';
    case 'client':
      return 'client';
    default:
      return null;
  }
};

interface UserContextType {
  // Auth state
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // User data
  user: any;
  userRole: UserRole;
  
  // Actions
  signOut: () => Promise<void>;
  refetchUser: () => void;
  
  // Navigation helpers
  getDefaultRoute: () => string;
  getDashboardRoute: () => string;
  canAccessRoute: (requiredRoles?: UserRole[]) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const { user: authUser, isLoading: authLoading, signOut: authSignOut } = useAuth();
  const { user: userData, isLoading: clientLoading, signOut: clientSignOut, refetchUserData } = useUserData();
  const navigate = useNavigate();
  
  const [userRole, setUserRole] = useState<UserRole>(null);
  
  // Update user role when auth user roles change (optimized dependency)
  useEffect(() => {
    if (authUser?.roles) {
      const mappedRole = mapApiRoleToUserRole(authUser.roles);
      setUserRole(mappedRole);
      console.log('User role updated:', mappedRole, 'from API role:', authUser.roles);
    } else {
      setUserRole(null);
    }
  }, [authUser?.roles]); // Only depend on roles, not entire authUser object
  
  // Memoize computed values to prevent unnecessary re-renders
  const isAuthenticated = useMemo(() => !!authUser, [authUser]);
  
  const isLoading = useMemo(() => authLoading || clientLoading, [authLoading, clientLoading]);
  
  const user = useMemo(() => {
    return userRole === 'client' ? userData : authUser;
  }, [userRole, userData, authUser]);
  
  // Memoize sign out function to prevent unnecessary re-renders
  const signOut = useCallback(async () => {
    try {
      await authSignOut();
      clientSignOut();
      setUserRole(null);
      // Redirect to home page with visitor view
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error signing out:', error);
      // Even if logout fails, redirect to home
      navigate('/', { replace: true });
    }
  }, [authSignOut, clientSignOut, navigate]);
  
  // Refetch user data
  const refetchUser = () => {
    if (userRole === 'client') {
      refetchUserData();
    }
  };
  
  // Memoize navigation helper functions to prevent unnecessary re-renders
  const getDefaultRoute = useCallback((): string => {
    if (!isAuthenticated) return '/';
    
    switch (userRole) {
      case 'admin':
        return '/admin';
      case 'vendor':
        return '/vendor-dashboard';
      case 'client':
        return '/dashboard';
      default:
        return '/';
    }
  }, [isAuthenticated, userRole]);

  const getDashboardRoute = useCallback((): string => {
    switch (userRole) {
      case 'admin':
        return '/admin';
      case 'vendor':
        return '/vendor-dashboard';
      case 'client':
        return '/dashboard';
      default:
        return '/';
    }
  }, [userRole]);
  
  const canAccessRoute = useCallback((requiredRoles?: UserRole[]): boolean => {
    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // Public route
    }
    
    if (!isAuthenticated || !userRole) {
      return false;
    }
    
    return requiredRoles.includes(userRole);
  }, [isAuthenticated, userRole]);
  
  // Memoize context value to prevent unnecessary re-renders
  const value: UserContextType = useMemo(() => ({
    isAuthenticated,
    isLoading,
    user,
    userRole,
    signOut,
    refetchUser,
    getDefaultRoute,
    getDashboardRoute,
    canAccessRoute,
  }), [isAuthenticated, isLoading, user, userRole, signOut, refetchUser, getDefaultRoute, getDashboardRoute, canAccessRoute]);
  
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};