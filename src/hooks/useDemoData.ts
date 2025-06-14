
import { useAuthUser } from "./useAuthUser";
import { seedIdeas } from "@/data/seedIdeas";
import { Post } from "./usePosts";

export function useDemoData() {
  const { user } = useAuthUser();

  // Convert seed ideas to Post format for the current user
  const getDemoPostsForUser = (): Post[] => {
    if (!user?.id) return [];
    
    return seedIdeas.map(idea => ({
      ...idea,
      user_id: user.id, // Use actual user ID so they appear in profile
    }));
  };

  return {
    demoPostsForUser: getDemoPostsForUser()
  };
}
