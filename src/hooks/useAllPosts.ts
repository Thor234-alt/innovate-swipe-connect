
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Post } from "./usePosts";

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
      
      return data.map(post => ({
        ...post,
        analytics: post.post_analytics?.[0] || { views: 0, likes: 0, shares: 0 }
      })) as Post[];
    }
  });

  return {
    posts: posts || [],
    isLoading
  };
}
