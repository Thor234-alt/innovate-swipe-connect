
import { BookOpen, User } from "lucide-react";
import { useAuthUser } from "@/hooks/useAuthUser";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link, useLocation } from "react-router-dom";

export default function AppHeader() {
  const { user } = useAuthUser();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  // Use bold/primary color for active link
  function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`px-4 py-2 rounded font-medium text-sm transition
          ${isActive ? "text-primary font-bold bg-primary/10" : "text-muted-foreground hover:bg-muted/70"}
        `}
        tabIndex={0}
      >
        {children}
      </Link>
    );
  }

  return (
    <header className="flex justify-between items-center py-4 px-8 bg-white border-b border-border sticky top-0 z-20 shadow-sm">
      <Link to="/app" className="flex items-center gap-2 text-2xl font-black tracking-tight select-none">
        <BookOpen className="w-7 h-7 text-primary" />
        <span>Idea Tinder</span>
        <span className="ml-2 text-xs font-semibold bg-primary/10 px-2 py-1 rounded text-primary">MVP</span>
      </Link>
      <div className="flex items-center gap-2">
        {user && (
          <>
            <NavLink to="/app">Home</NavLink>
            <NavLink to="/profile"><User className="inline mr-1 w-4 h-4" />Profile</NavLink>
            <span className="hidden sm:flex items-center gap-2 font-medium text-sm px-4 py-2 rounded text-muted-foreground bg-muted/50 border">
              {user.email}
            </span>
            <Button variant="outline" onClick={handleSignOut}>Sign out</Button>
          </>
        )}
      </div>
    </header>
  );
}
