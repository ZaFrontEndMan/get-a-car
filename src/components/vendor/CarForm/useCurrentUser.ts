
import { useAuth } from '@/contexts/AuthContext';

export const useCurrentUser = () => {
  const { user, isLoading } = useAuth();
  
  return { 
    currentUser: user, 
    isLoading 
  };
};
