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
      console.log('UserProfile: User is null, clearing profile');
      return;
    }
    if (user.roles?.toLowerCase() === 'client') {
      setProfile(userData);
      console.log('UserProfile: Setting client profile data');
    } else {
      setProfile(user);
      console.log('UserProfile: Setting auth user as profile');
    }
  }, [user, userData]);

  const refetchProfile = useCallback(() => {
    if (user && user.roles?.toLowerCase() === 'client') {
      refetchUserData();
    }
  }, [user, refetchUserData]);

  const value = useMemo(() => ({
    profile,
    isLoading: !!user ? isLoading : false, // Always false if no user
    refetchProfile,
  }), [profile, isLoading, refetchProfile, user]);

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};
