
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { useAllPosts } from "@/hooks/useAllPosts";
import SwipeablePostStack from "@/components/SwipeablePostStack";
import CreatePostModal from "@/components/CreatePostModal";
import { usePosts } from "@/hooks/usePosts";
import { useQueryClient } from "@tanstack/react-query";

const AppHome = () => {
  const { posts: allPosts, isLoading } = useAllPosts();
  const { createPost } = usePosts();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const queryClient = useQueryClient();

  const handleCreatePost = async (data: { 
    title: string; 
    content: string; 
    image_url?: string;
    tags?: string[];
    idea_type?: string;
  }) => {
    await createPost.mutateAsync(data);
    setShowCreatePost(false);
    // Invalidate all posts to refresh the list
    queryClient.invalidateQueries({ queryKey: ['all-posts'] });
  };

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 min-h-screen">
      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Header Section - mobile optimized */}
        <div className="text-center mb-4 sm:mb-8 max-w-2xl mx-auto px-2">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">Discover Posts</h1>
          <p className="text-sm sm:text-lg text-gray-600 mb-4 sm:mb-6">
            Swipe through posts from the community
          </p>
          <Button 
            onClick={() => setShowCreatePost(true)}
            className="flex items-center gap-2 mx-auto text-sm sm:text-base px-4 py-2"
          >
            <Plus className="w-4 h-4" />
            Create New Post
          </Button>
        </div>

        {/* Swipeable Posts - mobile optimized container */}
        <div className="flex justify-center px-2">
          {isLoading ? (
            <div className="text-center py-8 sm:py-12">
              <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground text-sm sm:text-base">Loading posts...</p>
            </div>
          ) : allPosts.length === 0 ? (
            <Card className="bg-white/90 shadow-xl border-primary/10 max-w-sm sm:max-w-md mx-2">
              <CardContent className="text-center py-8 sm:py-12 px-4">
                <h3 className="text-lg sm:text-xl font-semibold mb-2">No posts yet</h3>
                <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                  Be the first to share something with the community!
                </p>
                <Button onClick={() => setShowCreatePost(true)} className="text-sm">
                  Create the First Post
                </Button>
              </CardContent>
            </Card>
          ) : (
            <SwipeablePostStack posts={allPosts} />
          )}
        </div>

        <CreatePostModal 
          open={showCreatePost} 
          onClose={() => setShowCreatePost(false)}
          onSubmit={handleCreatePost}
        />
      </main>
    </div>
  );
};

export default AppHome;
