
import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2, Eye, ChevronLeft, ChevronRight, Star, MessageCircle } from "lucide-react";
import { Post } from "@/hooks/usePosts";
import { useProfile } from "@/hooks/useProfiles";
import HeartAnimation from "./HeartAnimation";
import PostCommentsModal from "./PostCommentsModal";
import { motion, useMotionValue, useAnimation } from "framer-motion";
import { useDrag } from "@use-gesture/react";

interface SwipeablePostCardProps {
  post: Post;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSuperLike?: () => void;
  style?: React.CSSProperties;
  isTop?: boolean;
}

const IDEA_TYPE_LABELS = {
  'concept': 'Concept',
  'mvp': 'MVP Ready',
  'imaginable': 'Imaginable',
  'futuristic': 'Futuristic',
};

const IDEA_TYPE_COLORS = {
  'concept': 'bg-blue-100 text-blue-800',
  'mvp': 'bg-green-100 text-green-800',
  'imaginable': 'bg-purple-100 text-purple-800',
  'futuristic': 'bg-orange-100 text-orange-800',
};

const SwipeablePostCard: React.FC<SwipeablePostCardProps> = ({
  post,
  onSwipeLeft,
  onSwipeRight,
  onSuperLike,
  style,
  isTop,
}) => {
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { profile, isLoading } = useProfile(post.user_id);

  // Motion/gesture setup
  const x = useMotionValue(0);
  const controls = useAnimation();
  const cardRef = useRef<HTMLDivElement>(null);

  const threshold = 120; // px threshold for swipe

  // useDrag returns an object with event handlers, not a function
  const bind = useDrag(
    ({ down, movement: [mx], velocity: [vx], direction: [dx], last }) => {
      // Move card
      if (!isTop) return;
      x.set(down ? mx : 0);

      if (last) {
        if (mx > threshold || (vx > 0.6 && dx > 0)) {
          // Swipe right
          controls.start({ x: 500, opacity: 0, rotate: 12, transition: { duration: 0.35 } }).then(() => {
            x.set(0);
            onSwipeRight?.();
          });
        } else if (mx < -threshold || (vx > 0.6 && dx < 0)) {
          // Swipe left
          controls.start({ x: -500, opacity: 0, rotate: -12, transition: { duration: 0.35 } }).then(() => {
            x.set(0);
            onSwipeLeft?.();
          });
        } else {
          // Restore to center
          controls.start({ x: 0, rotate: 0, opacity: 1, transition: { duration: 0.25 } });
        }
      }
    }
  );

  const handleLike = () => {
    setShowHeartAnimation(true);
    // animate right
    controls.start({ x: 500, opacity: 0, rotate: 12, transition: { duration: 0.35 } }).then(() => {
      x.set(0);
      onSwipeRight?.();
    });
  };

  const handlePass = () => {
    controls.start({ x: -500, opacity: 0, rotate: -12, transition: { duration: 0.35 } }).then(() => {
      x.set(0);
      onSwipeLeft?.();
    });
  };

  const handleSuperLike = () => {
    onSuperLike?.(); // Could trigger an animation if desired
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDisplayName = () => {
    if (isLoading) return "Loading...";
    if (profile?.full_name) return profile.full_name;
    return "Anonymous User";
  };

  return (
    <>
      <motion.div
        ref={cardRef}
        className={`w-full mx-auto bg-white rounded-2xl shadow-2xl border border-border p-3 sm:p-6 pb-4 sm:pb-6 relative select-none transition-all duration-300
        ${isTop ? "hover:shadow-3xl hover:-translate-y-0.5 z-10" : "opacity-80 scale-95 z-0"}`}
        style={{ ...style, x, height: "440px" }}
        tabIndex={0}
        aria-label={`Post: ${post.title}`}
        animate={controls}
        {...(isTop ? bind : {})}
        drag={false}
        whileTap={isTop ? { scale: 0.97 } : undefined}
      >
        <Card className="border-0 shadow-none p-0 bg-transparent h-full flex flex-col">
          <CardHeader className="p-0 pb-2 sm:pb-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">
                {formatDate(post.created_at)}
              </span>
              <div className="flex items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {post.analytics?.views || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  {post.analytics?.likes || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Share2 className="h-3 w-3" />
                  {post.analytics?.shares || 0}
                </span>
              </div>
            </div>
            
            {/* Idea Type Badge */}
            {post.idea_type && (
              <div className="mb-2">
                <Badge 
                  variant="secondary" 
                  className={`${IDEA_TYPE_COLORS[post.idea_type as keyof typeof IDEA_TYPE_COLORS] || 'bg-gray-100 text-gray-800'} text-xs`}
                >
                  {IDEA_TYPE_LABELS[post.idea_type as keyof typeof IDEA_TYPE_LABELS] || post.idea_type}
                </Badge>
              </div>
            )}
            
            <CardTitle className="text-base sm:text-lg font-bold leading-tight">
              {post.title}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0 flex-1 flex flex-col">
            {post.image_url && (
              <div className="mb-3 sm:mb-4 flex-shrink-0">
                <img 
                  src={post.image_url} 
                  alt={post.title}
                  className="w-full h-28 sm:h-32 object-cover rounded-lg"
                />
              </div>
            )}
            
            <div className="flex-1 overflow-hidden">
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 overflow-y-auto max-h-20 sm:max-h-24">
                {post.content}
              </p>
            </div>
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-3 sm:mb-4 flex-shrink-0">
                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {post.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{post.tags.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between mt-auto pt-2 sm:pt-4 flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  By {getDisplayName()}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto text-muted-foreground hover:text-primary"
                  onClick={() => setShowComments(true)}
                  title="View comments"
                >
                  <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
              <div className="flex gap-1 sm:gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="p-1.5 sm:p-2 rounded-full hover:bg-destructive/10 border-destructive/20"
                  aria-label="Pass"
                  onClick={handlePass}
                >
                  <ChevronLeft className="text-destructive h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="p-1.5 sm:p-2 rounded-full hover:bg-primary/10 border-primary/20"
                  aria-label="Super Like"
                  onClick={handleSuperLike}
                >
                  <Star className="text-primary h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="p-1.5 sm:p-2 rounded-full hover:bg-green-100 border-green-200"
                  aria-label="Like"
                  onClick={handleLike}
                >
                  <ChevronRight className="text-green-700 h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <HeartAnimation 
        show={showHeartAnimation} 
        onComplete={() => setShowHeartAnimation(false)} 
      />

      <PostCommentsModal
        post={post}
        open={showComments}
        onClose={() => setShowComments(false)}
      />
    </>
  );
};

export default SwipeablePostCard;
