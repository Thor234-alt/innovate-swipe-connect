import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthUser } from "./useAuthUser";
import { toast } from "./use-toast";
import { useDemoData } from "./useDemoData";

export interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  image_url?: string;
  tags?: string[];
  idea_type?: string;
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
  const { demoPostsForUser } = useDemoData();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['user-posts', user?.id],
    queryFn: async () => {
      if (!user?.id) return demoPostsForUser;
      
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
      
      const dbPosts = data.map(post => ({
        ...post,
        analytics: post.post_analytics?.[0] || { views: 0, likes: 0, shares: 0 }
      }));

      // If no posts in DB, return demo posts for better UX
      return dbPosts.length > 0 ? dbPosts : demoPostsForUser;
    },
    enabled: !!user?.id
  });

  const createPost = useMutation({
    mutationFn: async ({ title, content, image_url, tags, idea_type }: { 
      title: string; 
      content: string; 
      image_url?: string;
      tags?: string[];
      idea_type?: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('posts')
        .insert({ 
          title, 
          content, 
          user_id: user.id, 
          image_url,
          tags: tags || [],
          idea_type: idea_type || 'concept'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-posts'] });
      queryClient.invalidateQueries({ queryKey: ['all-posts'] });
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

  const deletePost = useMutation({
    mutationFn: async (postId: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', user.id); // Ensure only the owner can delete

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-posts'] });
      queryClient.invalidateQueries({ queryKey: ['all-posts'] });
      toast({ title: "Post deleted successfully!" });
    },
    onError: (error) => {
      toast({ 
        title: "Error deleting post", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  return {
    posts: posts || [],
    isLoading,
    createPost,
    deletePost
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
      queryClient.invalidateQueries({ queryKey: ['all-posts'] });
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
