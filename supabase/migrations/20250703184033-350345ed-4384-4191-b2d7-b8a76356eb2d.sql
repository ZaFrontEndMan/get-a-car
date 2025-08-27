-- Update the handle_new_user function to use fully qualified enum type
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name, phone, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'phone',
    CASE 
      WHEN NEW.email = 'talalkhomri@gmail.com' THEN 'admin'::public.user_role
      WHEN NEW.raw_user_meta_data->>'user_type' = 'vendor' THEN 'vendor'::public.user_role
      ELSE 'client'::public.user_role
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;