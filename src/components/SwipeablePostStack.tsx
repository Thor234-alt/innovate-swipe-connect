
import React, { useState, useEffect } from "react";
import SwipeablePostCard from "./SwipeablePostCard";
import SwipeActions from "./SwipeActions";
import { Post } from "@/hooks/usePosts";
import { toast } from "@/hooks/use-toast";
import { usePostLikes } from "@/hooks/usePosts";

interface SwipeablePostStackProps {
  posts: Post[];
}

const SwipeablePostStack: React.FC<SwipeablePostStackProps> = ({ posts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [superLikesUsed, setSuperLikesUsed] = useState(0);
  const maxSuperLikes = 3;
  const { toggleLike } = usePostLikes();

  const handleSwipeLeft = () => {
    toast({
      title: "Passed",
      description: "You passed on this post",
      duration: 1500,
    });
    nextPost();
  };

  const handleSwipeRight = async () => {
    const currentPost = posts[currentIndex];
    if (currentPost) {
      try {
        await toggleLike.mutateAsync(currentPost.id);
        toast({
          title: "Liked!",
          description: "You liked this post and it's saved to your profile",
          duration: 1500,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to like the post",
          variant: "destructive",
          duration: 1500,
        });
      }
    }
    nextPost();
  };

  const handleSuperLike = async () => {
    if (superLikesUsed >= maxSuperLikes) {
      toast({
        title: "No more super likes",
        description: `You've used all ${maxSuperLikes} super likes for today`,
        variant: "destructive",
        duration: 2000,
      });
      return;
    }
    
    const currentPost = posts[currentIndex];
    if (currentPost) {
      try {
        await toggleLike.mutateAsync(currentPost.id);
        setSuperLikesUsed(prev => prev + 1);
        toast({
          title: "Super Liked! ⭐",
          description: "You super liked this post and it's saved to your profile",
          duration: 1500,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to super like the post",
          variant: "destructive",
          duration: 1500,
        });
      }
    }
    nextPost();
  };

  const nextPost = () => {
    if (currentIndex < posts.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const visiblePosts = posts.slice(currentIndex, currentIndex + 3);

  if (posts.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 px-4">
        <h3 className="text-lg sm:text-xl font-semibold mb-2">No more posts</h3>
        <p className="text-muted-foreground text-sm sm:text-base">
          Check back later for new posts from the community!
        </p>
      </div>
    );
  }

  if (currentIndex >= posts.length) {
    return (
      <div className="text-center py-8 sm:py-12 px-4">
        <h3 className="text-lg sm:text-xl font-semibold mb-2">That's all for now!</h3>
        <p className="text-muted-foreground text-sm sm:text-base">
          You've seen all available posts. Check back later for more!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-3 sm:space-y-4 w-full max-w-sm sm:max-w-lg mx-auto px-2">
      {/* Posts Stack - mobile optimized */}
      <div className="relative w-full" style={{ height: "440px" }}>
        {visiblePosts.map((post, index) => (
          <div
            key={post.id}
            className="absolute inset-0 transition-all duration-300 ease-out"
            style={{
              transform: `translateY(${index * 6}px) scale(${1 - index * 0.04})`,
              zIndex: visiblePosts.length - index,
            }}
          >
            <SwipeablePostCard
              post={post}
              onSwipeLeft={index === 0 ? handleSwipeLeft : undefined}
              onSwipeRight={index === 0 ? handleSwipeRight : undefined}
              onSuperLike={index === 0 ? handleSuperLike : undefined}
              isTop={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Swipe Actions - positioned with better mobile spacing */}
      <div className="w-full flex justify-center mt-2 sm:mt-4">
        <SwipeActions
          onLeft={handleSwipeLeft}
          onRight={handleSwipeRight}
          onSuper={handleSuperLike}
          superDisabled={superLikesUsed >= maxSuperLikes}
        />
      </div>

      {/* Progress Indicator - mobile optimized */}
      <div className="flex flex-col items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full shadow-sm mt-2">
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="font-medium">{currentIndex + 1} / {posts.length}</span>
          <span className="text-xs">Super Likes: {superLikesUsed}/{maxSuperLikes}</span>
        </div>
      </div>
    </div>
  );
};

export default SwipeablePostStack;
