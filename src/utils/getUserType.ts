
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const getUserType = async (user: User | null): Promise<'client' | 'vendor' | 'admin' | null> => {
  if (!user) return null;
  
  try {
    // Get user role from profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (error || !profile) {
      console.error('Error fetching user role:', error);
      return 'client'; // Default fallback
    }

    return profile.role as 'client' | 'vendor' | 'admin';
  } catch (error) {
    console.error('Error in getUserType:', error);
    return 'client'; // Default fallback
  }
};

// Synchronous version for when you already have the profile data
export const getUserTypeFromProfile = (profile: any): 'client' | 'vendor' | 'admin' => {
  return profile?.role || 'client';
};

// Helper functions
export const isAdmin = async (user: User | null): Promise<boolean> => {
  const userType = await getUserType(user);
  return userType === 'admin';
};

export const isVendor = async (user: User | null): Promise<boolean> => {
  const userType = await getUserType(user);
  return userType === 'vendor';
};

export const isClient = async (user: User | null): Promise<boolean> => {
  const userType = await getUserType(user);
  return userType === 'client';
};
