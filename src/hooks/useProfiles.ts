
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export function useProfile(userId: string) {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!userId
  });

  return {
    profile: profile as Profile | null,
    isLoading
  };
}

export function useProfiles(userIds: string[]) {
  const { data: profiles, isLoading } = useQuery({
    queryKey: ['profiles', userIds],
    queryFn: async () => {
      if (!userIds.length) return [];
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);

      if (error) throw error;
      return data;
    },
    enabled: userIds.length > 0
  });

  return {
    profiles: (profiles || []) as Profile[],
    isLoading
  };
}
