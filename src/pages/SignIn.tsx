
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LanguageProvider } from '../contexts/LanguageContext';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';
import AuthHeader from '../components/auth/AuthHeader';
import AdminQuickLogin from '../components/auth/AdminQuickLogin';
import UserTypeSwitcher from '../components/auth/UserTypeSwitcher';
import SignInForm from '../components/auth/SignInForm';
import { useAdminAuth } from '../hooks/useAdminAuth';

const SignIn = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'client' | 'vendor'>('client');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { handleAdminLogin } = useAdminAuth();

  const handleAdminQuickLogin = () => {
    setFormData({
      email: 'talalkhomri@gmail.com',
      password: '786hafez786'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Starting login process for:', formData.email);
      
      // Regular user login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        console.error('Login error:', error);
        toast.error(error.message);
        return;
      }

      if (data.user) {
        console.log('User authenticated successfully:', data.user.email);
        
        // Get user role from profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', data.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          toast.error('Error fetching user profile');
          return;
        }

        const userRole = profile?.role;
        console.log('User role from profile:', userRole);

        // Route based on actual user role from database
        switch (userRole) {
          case 'admin':
            console.log('Redirecting admin to admin dashboard');
            navigate('/admin');
            toast.success('Admin login successful!');
            break;
          case 'vendor':
            console.log('User is vendor, checking vendor record...');
            // Verify vendor record exists and is accessible
            const { data: vendorData, error: vendorError } = await supabase
              .from('vendors')
              .select('id, name, verified, is_active')
              .eq('user_id', data.user.id)
              .maybeSingle();

            if (vendorError) {
              console.error('Vendor lookup error:', vendorError);
              toast.error('Error checking vendor account. Please contact support.');
              await supabase.auth.signOut();
              return;
            }

            if (!vendorData) {
              console.error('No vendor record found for user');
              toast.error('Vendor account not found. Please contact support.');
              await supabase.auth.signOut();
              return;
            }

            // Check if vendor is active
            if (!vendorData.is_active) {
              console.log('Vendor account is deactivated');
              toast.error('Your vendor account has been deactivated. Please contact support.');
              await supabase.auth.signOut();
              return;
            }

            console.log('Vendor login successful, redirecting to vendor dashboard');
            navigate('/vendor-dashboard');
            toast.success(`Welcome ${vendorData.name}! Vendor login successful!`);
            break;
          case 'client':
          default:
            console.log('Client login successful, redirecting to client dashboard');
            navigate('/dashboard');
            toast.success('Successfully signed in!');
            break;
        }
      }
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gradient-to-br from-primary to-secondary">
        <Navbar />
        
        <div className="pt-20 flex items-center justify-center px-4 min-h-screen">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
            <AuthHeader 
              title={t('signIn')}
              subtitle={t('signInSubtitle')}
            />
            <AdminQuickLogin onAdminLogin={handleAdminQuickLogin} />
            <UserTypeSwitcher userType={userType} onUserTypeChange={setUserType} />
            <SignInForm 
              formData={formData}
              onFormDataChange={setFormData}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {t('dontHaveAccount')}{' '}
                <Link to="/signup" className="text-primary hover:text-primary/80 font-medium">
                  {t('signUpHere')}
                </Link>
              </p>
            </div>
          </div>
        </div>
        
        <MobileNav />
      </div>
    </LanguageProvider>
  );
};

export default SignIn;
