-- Create the avatars bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Set up Row Level Security (RLS) for the avatars bucket
-- Drop existing policies if any to avoid errors during re-runs
DROP POLICY IF EXISTS "Avatar images are publicly accessible." ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload an avatar." ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars." ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatars." ON storage.objects;

-- Policy 1: Anyone can read an avatar image (publicly accessible)
CREATE POLICY "Avatar images are publicly accessible."
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Policy 2: Authenticated users can upload avatars
CREATE POLICY "Anyone can upload an avatar."
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Policy 3: Users can update their own avatars
CREATE POLICY "Users can update their own avatars."
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid() = owner);

-- Policy 4: Users can delete their own avatars
CREATE POLICY "Users can delete their own avatars."
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.uid() = owner);
