
-- Create a function to handle vendor creation after email confirmation
CREATE OR REPLACE FUNCTION public.handle_vendor_creation()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the user has vendor metadata and email is confirmed
  IF NEW.email_confirmed_at IS NOT NULL 
     AND OLD.email_confirmed_at IS NULL 
     AND NEW.raw_user_meta_data->>'user_type' = 'vendor' THEN
    
    -- Insert vendor record
    INSERT INTO public.vendors (
      user_id,
      name,
      email,
      phone,
      description,
      verified
    ) VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'first_name', '') || ' ' || COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
      NEW.email,
      NEW.raw_user_meta_data->>'phone',
      'Vendor profile created automatically',
      false
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create vendor records after email confirmation
CREATE TRIGGER on_user_email_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_vendor_creation();
