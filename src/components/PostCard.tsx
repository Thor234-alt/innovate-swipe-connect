
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2, Eye, Trash2, MessageCircle } from "lucide-react";
import { Post } from "@/hooks/usePosts";
import { useProfile } from "@/hooks/useProfiles";
import PostCommentsModal from "./PostCommentsModal";

interface PostCardProps {
  post: Post;
  onDelete?: (postId: string) => Promise<void>;
  showDeleteButton?: boolean;
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

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onDelete, 
  showDeleteButton = false 
}) => {
  const { profile, isLoading } = useProfile(post.user_id);
  const [showComments, setShowComments] = useState(false);

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

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      onDelete?.(post.id);
    }
  };

  return (
    <>
      <Card className="w-full bg-white/90 shadow-lg border border-border/50">
        <CardHeader className="pb-4">
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
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-auto text-muted-foreground hover:text-primary"
                onClick={() => setShowComments(true)}
                title="View comments"
              >
                <MessageCircle className="h-3 w-3" />
              </Button>
              {showDeleteButton && onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={handleDelete}
                  title="Delete post"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
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
          
          <CardTitle className="text-lg font-bold leading-tight">
            {post.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {post.image_url && (
            <div className="mb-4">
              <img 
                src={post.image_url} 
                alt={post.title}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}
          
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-4">
            {post.content}
          </p>
          
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              By {getDisplayName()}
            </span>
          </div>
        </CardContent>
      </Card>

      <PostCommentsModal
        post={post}
        open={showComments}
        onClose={() => setShowComments(false)}
      />
    </>
  );
};

export default PostCard;
