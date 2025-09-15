import React, { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useUserData } from '@/hooks/useUserData';

interface UserProfileContextType {
  profile: any;
  isLoading: boolean;
  refetchProfile: () => void;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};

export const UserProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { user: userData, isLoading, refetchUserData } = useUserData();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      // If user is null, we are not loading any profile
      return;
    }
    if (user.roles?.toLowerCase() === 'client') {
      setProfile(userData);
    } else {
      setProfile(user);
    }
  }, [user, userData]);

  const refetchProfile = useCallback(() => {
    if (user && user.roles?.toLowerCase() === 'client') {
      refetchUserData();
    }
  }, [user, refetchUserData]);

  const value = useMemo(() => ({
    profile,
    isLoading: !!user && isLoading, // Only loading if user exists and profile is loading
    refetchProfile,
  }), [profile, isLoading, refetchProfile, user]);

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};
