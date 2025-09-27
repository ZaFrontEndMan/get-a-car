import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserProfile } from './UserProfileContext';

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
  
  // Route persistence
  preserveCurrentRoute: () => void;
  getPreservedRoute: () => string | null;
  clearPreservedRoute: () => void;
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
  const { profile, isLoading: profileLoading, refetchProfile } = useUserProfile();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [preservedRoute, setPreservedRoute] = useState<string | null>(null);
  const isInitialMount = useRef(true);
  const lastAuthState = useRef<boolean>(false);
  
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
  
  const isLoading = useMemo(() => {
    if (!authUser) return false;
    return authLoading || profileLoading;
  }, [authUser, authLoading, profileLoading]);
  
  const user = useMemo(() => profile, [profile]);
  
  // Route persistence functions
  const preserveCurrentRoute = useCallback(() => {
    const currentPath = location.pathname + location.search;
    // Don't preserve auth routes or root route
    if (!currentPath.startsWith('/signin') && 
        !currentPath.startsWith('/signup') && 
        !currentPath.startsWith('/forgot-password') && 
        !currentPath.startsWith('/reset-password') &&
        currentPath !== '/') {
      setPreservedRoute(currentPath);
      sessionStorage.setItem('preservedRoute', currentPath);
    }
  }, [location.pathname, location.search]);

  const getPreservedRoute = useCallback((): string | null => {
    return preservedRoute || sessionStorage.getItem('preservedRoute');
  }, [preservedRoute]);

  const clearPreservedRoute = useCallback(() => {
    setPreservedRoute(null);
    sessionStorage.removeItem('preservedRoute');
  }, []);

  // Initialize preserved route from sessionStorage on mount
  useEffect(() => {
    if (isInitialMount.current) {
      const stored = sessionStorage.getItem('preservedRoute');
      if (stored) {
        setPreservedRoute(stored);
      }
      isInitialMount.current = false;
    }
  }, []);

  // Track authentication state changes for route restoration
  useEffect(() => {
    const currentAuthState = !!authUser;
    
    // If user just became authenticated (login), try to restore preserved route
    if (!lastAuthState.current && currentAuthState && !authLoading) {
      const preserved = getPreservedRoute();
      if (preserved) {
        // Delay navigation to ensure all contexts are ready
        setTimeout(() => {
          navigate(preserved, { replace: true });
          clearPreservedRoute();
        }, 100);
      }
    }
    
    lastAuthState.current = currentAuthState;
  }, [authUser, authLoading, navigate, getPreservedRoute, clearPreservedRoute]);
  // Unified sign out function to prevent unnecessary re-renders
  const signOut = useCallback(async () => {
    try {
      console.log('Starting unified logout process...');
      
      // 1. Clear preserved route before logout
      clearPreservedRoute();
      
      // 2. Clear auth context (user, token, cookies)
      await authSignOut();
      
      // 3. Clear user role
      setUserRole(null);
      
      console.log('Unified logout successful');
      
      // 4. Redirect to home page with visitor view
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error during unified signOut:', error);
      
      // Force clear local state even if auth signOut fails
      setUserRole(null);
      clearPreservedRoute();
      
      // Even if logout fails, redirect to home
      navigate('/', { replace: true });
    }
  }, [authSignOut, navigate, clearPreservedRoute]);
  
  // Refetch user data
  const refetchUser = useCallback(() => {
    refetchProfile();
  }, [refetchProfile]);
  
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
    preserveCurrentRoute,
    getPreservedRoute,
    clearPreservedRoute,
  }), [isAuthenticated, isLoading, user, userRole, signOut, refetchUser, getDefaultRoute, getDashboardRoute, canAccessRoute, preserveCurrentRoute, getPreservedRoute, clearPreservedRoute]);
  
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};