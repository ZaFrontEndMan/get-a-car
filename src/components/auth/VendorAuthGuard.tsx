
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface VendorAuthGuardProps {
  children: React.ReactNode;
}

const VendorAuthGuard = ({ children }: VendorAuthGuardProps) => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      console.log('VendorAuthGuard: Fetching profile for user:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('VendorAuthGuard: Profile fetch error:', error);
        throw error;
      }
      
      console.log('VendorAuthGuard: Profile data:', data);
      return data;
    },
    enabled: !!user?.id,
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: vendorData, isLoading: vendorLoading } = useQuery({
    queryKey: ['vendor-data', user?.id],
    queryFn: async () => {
      if (!user?.id || profile?.role !== 'vendor') return null;
      
      console.log('VendorAuthGuard: Fetching vendor data for user:', user.id);
      
      const { data, error } = await supabase
        .from('vendors')
        .select('id, name, verified, is_active')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('VendorAuthGuard: Vendor fetch error:', error);
        throw error;
      }
      
      console.log('VendorAuthGuard: Vendor data:', data);
      return data;
    },
    enabled: !!user?.id && profile?.role === 'vendor',
    retry: 3,
  });

  useEffect(() => {
    // Don't redirect while any loading is in progress
    if (authLoading || profileLoading || vendorLoading) {
      console.log('VendorAuthGuard: Still loading...', { authLoading, profileLoading, vendorLoading });
      return;
    }

    if (!user) {
      console.log('VendorAuthGuard: No user found, redirecting to signin');
      navigate('/signin', { replace: true });
      return;
    }

    if (profile && profile.role !== 'vendor') {
      console.log('VendorAuthGuard: User role is not vendor:', profile.role);
      // Redirect to appropriate dashboard based on role
      switch (profile.role) {
        case 'admin':
          navigate('/admin', { replace: true });
          break;
        case 'client':
          navigate('/dashboard', { replace: true });
          break;
        default:
          navigate('/signin', { replace: true });
      }
      return;
    }

    // If user is vendor but vendor data doesn't exist or is inactive
    if (profile?.role === 'vendor') {
      if (!vendorData) {
        console.log('VendorAuthGuard: Vendor data not found, redirecting to signin');
        navigate('/signin', { replace: true });
        return;
      }

      if (!vendorData.is_active) {
        console.log('VendorAuthGuard: Vendor account is inactive, redirecting to signin');
        navigate('/signin', { replace: true });
        return;
      }
    }
  }, [user, profile, vendorData, authLoading, profileLoading, vendorLoading, navigate]);

  // Show loading while any data is loading
  if (authLoading || profileLoading || vendorLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  // Don't render if user is not authenticated or not a valid vendor
  if (!user || !profile || profile.role !== 'vendor' || !vendorData || !vendorData.is_active) {
    return null;
  }

  console.log('VendorAuthGuard: All checks passed, rendering vendor dashboard');
  return <>{children}</>;
};

export default VendorAuthGuard;
