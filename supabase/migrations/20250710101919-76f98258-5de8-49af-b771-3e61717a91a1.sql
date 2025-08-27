
-- Add Arabic fields to the blogs table
ALTER TABLE public.blogs 
ADD COLUMN title_ar TEXT,
ADD COLUMN content_ar TEXT,
ADD COLUMN excerpt_ar TEXT;

-- Create index for Arabic title for better search performance
CREATE INDEX idx_blogs_title_ar ON public.blogs(title_ar) WHERE title_ar IS NOT NULL;
