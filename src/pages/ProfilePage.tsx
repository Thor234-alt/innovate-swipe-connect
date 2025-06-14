import { useState } from "react";
import { useAuthUser } from "@/hooks/useAuthUser";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Heart } from "lucide-react";
import { usePosts } from "@/hooks/usePosts";
import { useLikedPosts } from "@/hooks/useLikedPosts";
import PostCard from "@/components/PostCard";
import CreatePostModal from "@/components/CreatePostModal";

// Helper to get display name sensibly
function getDisplayName(user: any) {
  const meta = user?.user_metadata || {};
  return meta.name || meta.full_name || (user.email ? user.email.split("@")[0] : "User");
}

// Helper to get avatar image, prefer user's photo, else fallback
function getAvatarUrl(user: any) {
  const meta = user?.user_metadata || {};
  if (meta.avatar_url) return meta.avatar_url;
  // Unsplash placeholder fallback
  return "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=facearea&w=256&h=256&facepad=2";
}

export default function ProfilePage() {
  const { user } = useAuthUser();
  const { posts, isLoading, createPost, deletePost } = usePosts();
  const { likedPosts, isLoading: likedPostsLoading } = useLikedPosts();
  const [showCreatePost, setShowCreatePost] = useState(false);

  const handleCreatePost = async (data: { title: string; content: string }) => {
    await createPost.mutateAsync(data);
    setShowCreatePost(false);
  };

  const handleDeletePost = async (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await deletePost.mutateAsync(postId);
    }
  };

  if (!user) {
    return <div className="p-8 text-center">No user details found.</div>;
  }

  const displayName = getDisplayName(user);
  const avatarUrl = getAvatarUrl(user);

  return (
    <div className="flex justify-center items-start min-h-[60vh] py-4 px-0 sm:py-12 sm:px-2 bg-gradient-to-br from-white to-blue-50">
      <div className="w-full max-w-md sm:max-w-4xl space-y-4 sm:space-y-6 px-2 sm:px-0">
        {/* Profile Info Card */}
        <Card className="bg-white/90 shadow-2xl border-primary/10 rounded-xl">
          <CardHeader className="flex flex-col sm:flex-row items-center gap-4 pb-0">
            <Avatar className="w-20 h-20 sm:w-16 sm:h-16 mb-2 sm:mb-0">
              <AvatarImage src={avatarUrl} alt={displayName ?? "Profile"} />
              <AvatarFallback>
                {displayName
                  .split(" ")
                  .map((s: string) => s[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <CardTitle className="mb-0 text-lg sm:text-2xl">{displayName}</CardTitle>
              <div className="font-normal text-muted-foreground text-xs sm:text-sm">Your account details</div>
            </div>
            <Button 
              onClick={() => setShowCreatePost(true)}
              className="flex items-center gap-2 mt-2 sm:mt-0 text-sm sm:text-base w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              New Post
            </Button>
          </CardHeader>
          <CardContent className="space-y-6 pt-4 px-2 sm:px-6">
            <div>
              <span className="text-xs text-muted-foreground block">Email</span>
              <div className="font-bold text-sm sm:text-base break-words">{user.email}</div>
            </div>
          </CardContent>
        </Card>

        {/* Posts Section with Tabs */}
        <Card className="bg-white/90 shadow-xl border-primary/10 rounded-xl">
          <CardHeader className="px-2 sm:px-6">
            <CardTitle className="text-base sm:text-xl">Your Posts & Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="posts" className="w-full px-0 sm:px-6">
              <TabsList className="grid w-full grid-cols-2 rounded-none border-b mb-2 sm:mb-4">
                <TabsTrigger value="posts" className="flex items-center gap-2 justify-center text-xs sm:text-base py-2">
                  Your Posts
                  <span className="text-xs sm:text-sm">({posts.length})</span>
                </TabsTrigger>
                <TabsTrigger value="liked" className="flex items-center gap-2 justify-center text-xs sm:text-base py-2">
                  <Heart className="w-4 h-4" />
                  Liked Posts
                  <span className="text-xs sm:text-sm">({likedPosts.length})</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="posts" className="px-2 py-2 sm:px-6 sm:py-4">
                {isLoading ? (
                  <div className="text-center py-6 text-muted-foreground text-base">Loading your posts...</div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <p className="mb-4 text-xs sm:text-base">You haven't created any posts yet.</p>
                    <Button onClick={() => setShowCreatePost(true)} className="w-full sm:w-auto text-sm">
                      Create Your First Post
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <PostCard 
                        key={post.id} 
                        post={post} 
                        onDelete={handleDeletePost}
                        showDeleteButton={true}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="liked" className="px-2 py-2 sm:px-6 sm:py-4">
                {likedPostsLoading ? (
                  <div className="text-center py-6 text-muted-foreground text-base">Loading liked posts...</div>
                ) : likedPosts.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
                    <p className="mb-4 text-xs sm:text-base">You haven't liked any posts yet.</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Start exploring and like posts that interest you!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {likedPosts.map((post) => (
                      <PostCard 
                        key={post.id} 
                        post={post} 
                        showDeleteButton={false}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <CreatePostModal 
          open={showCreatePost} 
          onClose={() => setShowCreatePost(false)} 
          onSubmit={handleCreatePost}
        />
      </div>
    </div>
  );
}
