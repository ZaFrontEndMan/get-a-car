-- Create storage bucket for vendor logos
INSERT INTO storage.buckets (id, name, public) VALUES ('vendor-logos', 'vendor-logos', true);

-- Create storage policies for vendor logo uploads
CREATE POLICY "Vendor logos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'vendor-logos');

CREATE POLICY "Vendors can upload their own logos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'vendor-logos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Vendors can update their own logos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'vendor-logos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Vendors can delete their own logos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'vendor-logos' AND auth.uid() IS NOT NULL);