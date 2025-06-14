
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Eye, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Post } from "@/hooks/usePosts";

interface SwipeablePostCardProps {
  post: Post;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSuperLike?: () => void;
  style?: React.CSSProperties;
  isTop?: boolean;
}

const SwipeablePostCard: React.FC<SwipeablePostCardProps> = ({
  post,
  onSwipeLeft,
  onSwipeRight,
  onSuperLike,
  style,
  isTop,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      className={`w-[340px] md:w-[380px] lg:w-[440px] max-w-full mx-auto bg-white rounded-2xl shadow-2xl border border-border p-6 pb-4 relative select-none transition-all duration-300
      ${isTop ? "hover:shadow-3xl hover:-translate-y-0.5 z-10" : "opacity-80 scale-95 z-0"}`}
      style={style}
      tabIndex={0}
      aria-label={`Post: ${post.title}`}
    >
      <Card className="border-0 shadow-none p-0">
        <CardHeader className="p-0 pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">
              {formatDate(post.created_at)}
            </span>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
          <CardTitle className="text-lg sm:text-xl font-bold leading-tight">
            {post.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-4">
            {post.content}
          </p>
          
          <div className="flex items-center justify-between mt-auto">
            <span className="text-xs text-muted-foreground">
              By User {post.user_id.slice(0, 8)}...
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="p-2 rounded-full hover:bg-destructive/10 border-destructive/20"
                aria-label="Pass"
                onClick={onSwipeLeft}
              >
                <ChevronLeft className="text-destructive h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="p-2 rounded-full hover:bg-primary/10 border-primary/20"
                aria-label="Super Like"
                onClick={onSuperLike}
              >
                <Star className="text-primary h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="p-2 rounded-full hover:bg-green-100 border-green-200"
                aria-label="Like"
                onClick={onSwipeRight}
              >
                <ChevronRight className="text-green-700 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SwipeablePostCard;
