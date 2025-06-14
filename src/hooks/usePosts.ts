
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthUser } from "./useAuthUser";
import { toast } from "./use-toast";

export interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  analytics?: {
    views: number;
    likes: number;
    shares: number;
  };
}

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  parent_comment_id: string | null;
}

export function usePosts() {
  const { user } = useAuthUser();
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['user-posts', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
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
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data.map(post => ({
        ...post,
        analytics: post.post_analytics?.[0] || { views: 0, likes: 0, shares: 0 }
      }));
    },
    enabled: !!user?.id
  });

  const createPost = useMutation({
    mutationFn: async ({ title, content }: { title: string; content: string }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('posts')
        .insert({ title, content, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-posts'] });
      toast({ title: "Post created successfully!" });
    },
    onError: (error) => {
      toast({ 
        title: "Error creating post", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  return {
    posts: posts || [],
    isLoading,
    createPost
  };
}

export function useComments(postId: string) {
  const { user } = useAuthUser();
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!postId
  });

  const addComment = useMutation({
    mutationFn: async ({ content, parentId }: { content: string; parentId?: string }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('comments')
        .insert({ 
          content, 
          post_id: postId, 
          user_id: user.id,
          parent_comment_id: parentId || null
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      toast({ title: "Comment added!" });
    },
    onError: (error) => {
      toast({ 
        title: "Error adding comment", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  return {
    comments: comments || [],
    isLoading,
    addComment
  };
}

export function usePostLikes() {
  const { user } = useAuthUser();
  const queryClient = useQueryClient();

  const toggleLike = useMutation({
    mutationFn: async (postId: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Remove like
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
        
        if (error) throw error;
        return { action: 'unliked' };
      } else {
        // Add like
        const { error } = await supabase
          .from('post_likes')
          .insert({ post_id: postId, user_id: user.id });
        
        if (error) throw error;
        return { action: 'liked' };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-posts'] });
    },
    onError: (error) => {
      toast({ 
        title: "Error updating like", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  return { toggleLike };
}
