
-- Add Arabic translation columns to offers table
ALTER TABLE public.offers 
ADD COLUMN title_ar TEXT,
ADD COLUMN description_ar TEXT;
