-- Create media storage bucket and policies
-- Run this in Supabase SQL Editor

-- Create the media bucket (if not already created via UI)
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true) ON CONFLICT DO NOTHING;

-- Allow authenticated users to upload files to their own folder
CREATE POLICY "Users can upload media files" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'media' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public access to read files (for portfolio viewing)
CREATE POLICY "Public can view media files" ON storage.objects 
FOR SELECT USING (bucket_id = 'media');

-- Allow users to update their own files
CREATE POLICY "Users can update own media files" ON storage.objects 
FOR UPDATE USING (
  bucket_id = 'media' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own files  
CREATE POLICY "Users can delete own media files" ON storage.objects 
FOR DELETE USING (
  bucket_id = 'media' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);