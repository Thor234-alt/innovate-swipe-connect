
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Share, Eye, Reply } from "lucide-react";
import { Post, useComments, usePostLikes } from "@/hooks/usePosts";
import { formatDistanceToNow } from "date-fns";
import { useAuthUser } from "@/hooks/useAuthUser";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const { comments, addComment } = useComments(post.id);
  const { toggleLike } = usePostLikes();
  const { user } = useAuthUser();

  const isPostCreator = user?.id === post.user_id;

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    await addComment.mutateAsync({ content: newComment });
    setNewComment("");
  };

  const handleAddReply = async (parentCommentId: string) => {
    if (!replyContent.trim()) return;
    
    await addComment.mutateAsync({ 
      content: replyContent, 
      parentId: parentCommentId 
    });
    setReplyContent("");
    setReplyingTo(null);
  };

  const handleLike = () => {
    toggleLike.mutate(post.id);
  };

  // Group comments by parent/child relationship
  const parentComments = comments.filter(comment => !comment.parent_comment_id);
  const getReplies = (commentId: string) => 
    comments.filter(comment => comment.parent_comment_id === commentId);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{post.title}</CardTitle>
        <div className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm leading-relaxed mb-4">{post.content}</p>
        
        {/* Analytics */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{post.analytics?.views || 0} views</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            <span>{post.analytics?.likes || 0} likes</span>
          </div>
          <div className="flex items-center gap-1">
            <Share className="w-4 h-4" />
            <span>{post.analytics?.shares || 0} shares</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>{comments.length} comments</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        {/* Action buttons */}
        <div className="flex gap-2 w-full">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLike}
            className="flex items-center gap-1"
          >
            <Heart className="w-4 h-4" />
            Like
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1"
          >
            <MessageCircle className="w-4 h-4" />
            Comment
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
          >
            <Share className="w-4 h-4" />
            Share
          </Button>
        </div>

        {/* Comments section */}
        {showComments && (
          <div className="w-full space-y-3">
            {/* Add comment */}
            <div className="space-y-2">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px]"
              />
              <Button 
                onClick={handleAddComment}
                disabled={!newComment.trim() || addComment.isPending}
                size="sm"
              >
                {addComment.isPending ? "Posting..." : "Post Comment"}
              </Button>
            </div>

            {/* Comments list */}
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {parentComments.map((comment) => {
                const replies = getReplies(comment.id);
                return (
                  <div key={comment.id} className="space-y-2">
                    {/* Parent comment */}
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm">{comment.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                        </div>
                        {isPostCreator && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                            className="text-xs h-6 px-2"
                          >
                            <Reply className="w-3 h-3 mr-1" />
                            Reply
                          </Button>
                        )}
                      </div>
                      
                      {/* Reply input for post creator */}
                      {replyingTo === comment.id && (
                        <div className="mt-3 space-y-2">
                          <Textarea
                            placeholder="Write a reply..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className="min-h-[60px] text-sm"
                          />
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => handleAddReply(comment.id)}
                              disabled={!replyContent.trim() || addComment.isPending}
                              size="sm"
                              className="text-xs"
                            >
                              {addComment.isPending ? "Replying..." : "Reply"}
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyContent("");
                              }}
                              size="sm"
                              className="text-xs"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Replies */}
                    {replies.map((reply) => (
                      <div key={reply.id} className="ml-6 bg-muted/30 rounded-lg p-2">
                        <p className="text-sm">{reply.content}</p>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
              {parentComments.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
