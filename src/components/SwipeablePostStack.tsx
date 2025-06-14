
import React, { useState, useEffect } from "react";
import SwipeablePostCard from "./SwipeablePostCard";
import SwipeActions from "./SwipeActions";
import { Post } from "@/hooks/usePosts";
import { toast } from "@/hooks/use-toast";

interface SwipeablePostStackProps {
  posts: Post[];
}

const SwipeablePostStack: React.FC<SwipeablePostStackProps> = ({ posts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [superLikesUsed, setSuperLikesUsed] = useState(0);
  const maxSuperLikes = 3;

  const handleSwipeLeft = () => {
    toast({
      title: "Passed",
      description: "You passed on this post",
      duration: 1500,
    });
    nextPost();
  };

  const handleSwipeRight = () => {
    toast({
      title: "Liked!",
      description: "You liked this post",
      duration: 1500,
    });
    nextPost();
  };

  const handleSuperLike = () => {
    if (superLikesUsed >= maxSuperLikes) {
      toast({
        title: "No more super likes",
        description: `You've used all ${maxSuperLikes} super likes for today`,
        variant: "destructive",
        duration: 2000,
      });
      return;
    }
    
    setSuperLikesUsed(prev => prev + 1);
    toast({
      title: "Super Liked! ⭐",
      description: "You super liked this post",
      duration: 1500,
    });
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
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No more posts</h3>
        <p className="text-muted-foreground">
          Check back later for new posts from the community!
        </p>
      </div>
    );
  }

  if (currentIndex >= posts.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">That's all for now!</h3>
        <p className="text-muted-foreground">
          You've seen all available posts. Check back later for more!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Posts Stack */}
      <div className="relative w-full max-w-md mx-auto" style={{ height: "500px" }}>
        {visiblePosts.map((post, index) => (
          <div
            key={post.id}
            className="absolute inset-0 transition-all duration-300 ease-out"
            style={{
              transform: `translateY(${index * 8}px) scale(${1 - index * 0.05})`,
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

      {/* Swipe Actions - moved closer to cards */}
      <SwipeActions
        onLeft={handleSwipeLeft}
        onRight={handleSwipeRight}
        onSuper={handleSuperLike}
        superDisabled={superLikesUsed >= maxSuperLikes}
      />

      {/* Progress Indicator */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{currentIndex + 1} / {posts.length}</span>
        <div className="flex items-center gap-1 ml-4">
          <span>Super Likes: {superLikesUsed}/{maxSuperLikes}</span>
        </div>
      </div>
    </div>
  );
};

export default SwipeablePostStack;
