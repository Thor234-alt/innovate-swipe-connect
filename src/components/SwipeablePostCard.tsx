
import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2, Eye, ChevronLeft, ChevronRight, Star, MessageCircle } from "lucide-react";
import { Post } from "@/hooks/usePosts";
import { useProfile } from "@/hooks/useProfiles";
import HeartAnimation from "./HeartAnimation";
import PostCommentsModal from "./PostCommentsModal";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";

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

  // Motion values for swipe animation
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!isTop) return;

    const threshold = 100;
    const { offset } = info;

    if (offset.x > threshold) {
      // Swipe right - like
      setShowHeartAnimation(true);
      onSwipeRight?.();
    } else if (offset.x < -threshold) {
      // Swipe left - pass
      onSwipeLeft?.();
    } else {
      // Return to center
      x.set(0);
      y.set(0);
    }
  };

  const handleLike = () => {
    setShowHeartAnimation(true);
    onSwipeRight?.();
  };

  const handlePass = () => {
    onSwipeLeft?.();
  };

  const handleSuperLike = () => {
    onSuperLike?.();
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
        className={`w-full mx-auto bg-white rounded-2xl shadow-2xl border border-border p-3 sm:p-6 pb-4 sm:pb-6 relative select-none transition-all duration-300
        ${isTop ? "hover:shadow-3xl hover:-translate-y-0.5 z-10 cursor-grab active:cursor-grabbing" : "opacity-80 scale-95 z-0 pointer-events-none"}`}
        tabIndex={0}
        aria-label={`Post: ${post.title}`}
        drag={isTop ? true : false}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{
          x,
          y,
          rotate,
          opacity,
          ...style,
          height: "440px"
        }}
        whileDrag={{ scale: 1.05 }}
        animate={isTop ? { x: 0, y: 0, scale: 1 } : { scale: 0.95 }}
        exit={{ x: 1000, opacity: 0, rotate: 30 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
