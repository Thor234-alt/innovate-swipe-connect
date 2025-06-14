
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { useAllPosts } from "@/hooks/useAllPosts";
import SwipeablePostStack from "@/components/SwipeablePostStack";
import CreatePostModal from "@/components/CreatePostModal";
import { usePosts } from "@/hooks/usePosts";
import { toast } from "@/hooks/use-toast";

const AppHome = () => {
  const { posts: allPosts, isLoading } = useAllPosts();
  const { createPost } = usePosts();
  const [showCreatePost, setShowCreatePost] = useState(false);

  const handleCreatePost = async (data: { title: string; content: string }) => {
    await createPost.mutateAsync(data);
    setShowCreatePost(false);
  };

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 min-h-screen">
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Discover Posts</h1>
          <p className="text-lg text-gray-600 mb-6">
            Swipe through posts from the community
          </p>
          <Button 
            onClick={() => setShowCreatePost(true)}
            className="flex items-center gap-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            Create New Post
          </Button>
        </div>

        {/* Swipeable Posts */}
        <div className="max-w-2xl mx-auto">
          {isLoading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading posts...</p>
            </div>
          ) : allPosts.length === 0 ? (
            <Card className="bg-white/90 shadow-xl border-primary/10">
              <CardContent className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                <p className="text-muted-foreground mb-4">
                  Be the first to share something with the community!
                </p>
                <Button onClick={() => setShowCreatePost(true)}>
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
