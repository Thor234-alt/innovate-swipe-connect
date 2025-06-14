
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Post } from "./usePosts";
import { seedIdeas } from "@/data/seedIdeas";

export function useAllPosts() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['all-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          post_analytics (
            views,
            likes,
            shares
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const dbPosts = data.map(post => ({
        ...post,
        analytics: post.post_analytics?.[0] || { views: 0, likes: 0, shares: 0 }
      })) as Post[];

      // If no posts in database, return demo posts for better UX
      if (dbPosts.length === 0) {
        return seedIdeas as Post[];
      }

      // If there are some posts but fewer than 10, mix in some demo posts
      if (dbPosts.length < 10) {
        const additionalDemoPosts = seedIdeas.slice(0, 10 - dbPosts.length);
        return [...dbPosts, ...additionalDemoPosts] as Post[];
      }

      return dbPosts;
    }
  });

  return {
    posts: posts || [],
    isLoading
  };
}
