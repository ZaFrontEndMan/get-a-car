
import { useAuth } from '@/contexts/AuthContext';
import { useMemo } from 'react';

export const useCurrentUser = () => {
  const { user, isLoading } = useAuth();
  
  return useMemo(() => ({
    currentUser: user,
    isLoading
  }), [user, isLoading]);
};
