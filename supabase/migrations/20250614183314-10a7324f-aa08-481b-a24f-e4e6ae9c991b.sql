
-- Backfill profiles for existing users who don't have profile entries
INSERT INTO public.profiles (id, full_name, avatar_url)
SELECT 
  au.id,
  au.raw_user_meta_data ->> 'full_name' as full_name,
  au.raw_user_meta_data ->> 'avatar_url' as avatar_url
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;
