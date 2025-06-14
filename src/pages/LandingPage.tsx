
import { Button } from "@/components/ui/button";
import { BookOpen, LogIn, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useAuthUser } from "@/hooks/useAuthUser";
import { toast } from "@/hooks/use-toast";

const Logo = () => (
  <span className="flex items-center gap-2 text-3xl font-black tracking-tight select-none">
    <BookOpen className="w-8 h-8 text-primary" />
    <span>Idea Tinder</span>
  </span>
);

export default function LandingPage() {
  const { session, isLoading } = useAuthUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) navigate("/app");
  }, [session, navigate]);

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/app",
      },
    });
    if (error) toast({ title: "Login failed", description: error.message });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="flex items-center justify-between px-8 py-5 border-b border-border">
        <Logo />
        <div>
          <Button variant="secondary" onClick={handleGoogleLogin} disabled={isLoading}>
            <LogIn className="mr-2" /> Continue with Google
          </Button>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6 animate-fade-in">
          Swipe Right on Innovation
        </h1>
        <p className="max-w-2xl text-xl md:text-2xl text-muted-foreground text-center mb-10 animate-fade-in">
          Discover and validate big ideas through a gamified, community-driven Tinder-like platform. Post your vision, get feedback, and connect with fellow innovators.
        </p>
        <Button
          className="text-lg px-8 py-4 animate-scale-in"
          size="lg"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <LogIn className="mr-3" /> Continue with Google
        </Button>
      </main>
      <footer className="flex flex-col items-center py-8 text-muted-foreground">
        <span className="text-xs">© 2025 Idea Tinder</span>
      </footer>
    </div>
  );
}
