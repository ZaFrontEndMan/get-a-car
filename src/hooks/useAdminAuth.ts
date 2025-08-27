
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAdminAuth = () => {
  const createAdminUserIfNotExists = async () => {
    try {
      // Try to sign up the admin user with email confirmation
      const { error: signUpError } = await supabase.auth.signUp({
        email: 'talalkhomri@gmail.com',
        password: '786hafez786',
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
          data: {
            first_name: 'Talal',
            last_name: 'Admin',
            user_type: 'admin'
          }
        }
      });

      // If the user already exists, the signup will fail, but that's okay
      if (signUpError && !signUpError.message.includes('already registered')) {
        console.error('Admin user creation error:', signUpError);
      } else {
        console.log('Admin user created successfully or already exists');
      }
    } catch (error) {
      console.error('Admin user setup error:', error);
    }
  };

  const handleAdminLogin = async (email: string, password: string) => {
    // If trying to login as admin, ensure admin user exists
    if (email === 'talalkhomri@gmail.com') {
      await createAdminUserIfNotExists();
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // If login fails for admin due to unconfirmed email, handle it
      if (email === 'talalkhomri@gmail.com') {
        if (error.message.includes('Email not confirmed')) {
          toast.error('Admin account created but email needs confirmation. Please check your email or contact support.');
        } else if (error.message.includes('Invalid login credentials')) {
          toast.error('Creating admin account. Please wait and try again in a moment.');
          await createAdminUserIfNotExists();
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error(error.message);
      }
      return { data: null, error };
    }

    return { data, error: null };
  };

  return { handleAdminLogin };
};
