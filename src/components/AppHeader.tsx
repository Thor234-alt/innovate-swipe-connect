
import { BookOpen, User } from "lucide-react";
import { useAuthUser } from "@/hooks/useAuthUser";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export default function AppHeader() {
  const { user } = useAuthUser();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <header className="flex justify-between items-center py-4 px-8 bg-white border-b border-border sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-2 text-2xl font-black tracking-tight select-none">
        <BookOpen className="w-7 h-7 text-primary" />
        <span>Idea Tinder</span>
        <span className="ml-2 text-xs font-semibold bg-primary/10 px-2 py-1 rounded text-primary">MVP</span>
      </div>
      <div className="flex items-center gap-4">
        {/* Only show user & signout if logged in */}
        {user ? (
          <>
            <span className="flex items-center gap-2 font-medium text-sm px-4 py-2 rounded text-muted-foreground bg-muted/50 border">
              <User className="w-5 h-5" /> {user.email}
            </span>
            <Button variant="outline" onClick={handleSignOut}>Sign out</Button>
          </>
        ) : null}
      </div>
    </header>
  );
}
