
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, MessageCircle, Reply } from "lucide-react";
import { Post, useComments } from "@/hooks/usePosts";
import { useProfile } from "@/hooks/useProfiles";
import { useAuthUser } from "@/hooks/useAuthUser";

interface PostCommentsModalProps {
  post: Post;
  open: boolean;
  onClose: () => void;
}

const PostCommentsModal: React.FC<PostCommentsModalProps> = ({
  post,
  open,
  onClose,
}) => {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const { comments, isLoading, addComment } = useComments(post.id);
  const { user } = useAuthUser();

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      await addComment.mutateAsync({ content: newComment.trim() });
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim()) return;
    
    try {
      await addComment.mutateAsync({ 
        content: replyContent.trim(), 
        parentId 
      });
      setReplyContent("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Failed to add reply:", error);
    }
  };

  const CommentItem = ({ comment, isReply = false }: { comment: any; isReply?: boolean }) => {
    const { profile } = useProfile(comment.user_id);
    const isPostOwner = user?.id === post.user_id;
    const isCommentOwner = user?.id === comment.user_id;
    
    const getDisplayName = () => {
      if (profile?.full_name) return profile.full_name;
      return `User ${comment.user_id.slice(0, 8)}...`;
    };

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    const replies = comments.filter(c => c.parent_comment_id === comment.id);

    return (
      <div className={`${isReply ? 'ml-8 border-l-2 border-gray-100 pl-4' : ''}`}>
        <div className="flex gap-3 py-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback>
              {getDisplayName().charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium">{getDisplayName()}</span>
              {comment.user_id === post.user_id && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  Author
                </span>
              )}
              <span className="text-xs text-muted-foreground">
                {formatDate(comment.created_at)}
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-2">{comment.content}</p>
            
            {/* Reply button - show for post owner or comment owner, but not on replies */}
            {!isReply && user && (isPostOwner || isCommentOwner) && (
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-auto text-xs text-muted-foreground hover:text-primary"
                onClick={() => setReplyingTo(comment.id)}
              >
                <Reply className="h-3 w-3 mr-1" />
                Reply
              </Button>
            )}

            {/* Reply form */}
            {replyingTo === comment.id && (
              <div className="mt-3 space-y-2">
                <Textarea
                  placeholder="Write a reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[60px] resize-none text-sm"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleSubmitReply(comment.id)}
                    disabled={!replyContent.trim() || addComment.isPending}
                  >
                    <Send className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyContent("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Render replies */}
        {replies.length > 0 && (
          <div className="mt-2">
            {replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} isReply={true} />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Filter to show only top-level comments (those without parent_comment_id)
  const topLevelComments = comments.filter(comment => !comment.parent_comment_id);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Comments on "{post.title}"
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col min-h-0">
          <ScrollArea className="flex-1 pr-4">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading comments...
              </div>
            ) : topLevelComments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No comments yet. Be the first to comment!
              </div>
            ) : (
              <div className="space-y-1">
                {topLevelComments.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))}
              </div>
            )}
          </ScrollArea>
          
          {user && (
            <div className="pt-4 border-t">
              <div className="flex gap-3">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[80px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmitComment();
                    }
                  }}
                />
                <Button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || addComment.isPending}
                  size="sm"
                  className="shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostCommentsModal;
