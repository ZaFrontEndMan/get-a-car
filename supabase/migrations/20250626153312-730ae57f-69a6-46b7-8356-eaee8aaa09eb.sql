
-- Add pickup_locations and dropoff_locations columns to cars table
ALTER TABLE public.cars 
ADD COLUMN pickup_locations text[] DEFAULT '{}',
ADD COLUMN dropoff_locations text[] DEFAULT '{}';

-- Also add paid_features column that the form is trying to use
ALTER TABLE public.cars 
ADD COLUMN paid_features jsonb DEFAULT NULL;
