
-- Add new columns to the posts table for tags and idea type
ALTER TABLE public.posts 
ADD COLUMN tags TEXT[] DEFAULT '{}',
ADD COLUMN idea_type TEXT DEFAULT 'concept';

-- Add a check constraint to ensure idea_type has valid values
ALTER TABLE public.posts 
ADD CONSTRAINT posts_idea_type_check 
CHECK (idea_type IN ('concept', 'mvp', 'imaginable', 'futuristic'));
