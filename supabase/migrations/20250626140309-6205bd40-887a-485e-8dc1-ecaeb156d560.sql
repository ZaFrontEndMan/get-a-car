
-- Enable RLS on vendors table if not already enabled
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to insert their own vendor records
CREATE POLICY "Users can create their own vendor records" 
  ON public.vendors 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to view their own vendor records
CREATE POLICY "Users can view their own vendor records" 
  ON public.vendors 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy to allow users to update their own vendor records
CREATE POLICY "Users can update their own vendor records" 
  ON public.vendors 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own vendor records
CREATE POLICY "Users can delete their own vendor records" 
  ON public.vendors 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Also allow public read access to vendors for the main app functionality
CREATE POLICY "Allow public read access to vendors" 
  ON public.vendors 
  FOR SELECT 
  TO public 
  USING (true);
