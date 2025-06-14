
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthUser } from "./useAuthUser";
import { Post } from "./usePosts";

export function useLikedPosts() {
  const { user } = useAuthUser();

  const { data: likedPosts, isLoading } = useQuery({
    queryKey: ['liked-posts', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('post_likes')
        .select(`
          post_id,
          posts!inner (
            id,
            title,
            content,
            created_at,
            updated_at,
            user_id,
            post_analytics (
              views,
              likes,
              shares
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data.map(like => ({
        id: like.posts.id,
        title: like.posts.title,
        content: like.posts.content,
        created_at: like.posts.created_at,
        updated_at: like.posts.updated_at,
        user_id: like.posts.user_id,
        analytics: like.posts.post_analytics?.[0] || { views: 0, likes: 0, shares: 0 }
      })) as Post[];
    },
    enabled: !!user?.id
  });

  return {
    likedPosts: likedPosts || [],
    isLoading
  };
}
