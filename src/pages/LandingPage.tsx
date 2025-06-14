
import { Button } from "@/components/ui/button";
import { BookOpen, LogIn, User, Sparkles, Zap, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useAuthUser } from "@/hooks/useAuthUser";
import { toast } from "@/hooks/use-toast";

const Logo = () => (
  <span className="flex items-center gap-2 text-2xl font-bold tracking-tight select-none">
    <div className="relative">
      <BookOpen className="w-7 h-7 text-gray-900" />
      <Sparkles className="absolute -top-0.5 -right-0.5 w-3 h-3 text-gray-600" />
    </div>
    <span className="text-gray-900">
      Idea Tinder
    </span>
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
    <div className="min-h-screen flex flex-col bg-white text-gray-900 relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 opacity-50"></div>
      
      {/* Minimal geometric shapes */}
      <div className="absolute top-20 right-20 w-32 h-32 border border-gray-200 rounded-full opacity-30"></div>
      <div className="absolute bottom-32 left-16 w-24 h-24 bg-gray-100 rounded-lg opacity-40"></div>
      <div className="absolute top-1/3 left-1/4 w-2 h-16 bg-gray-300 opacity-20"></div>

      <header className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-gray-200">
        <Logo />
        <Button 
          variant="outline" 
          onClick={handleGoogleLogin} 
          disabled={isLoading}
          className="bg-white hover:bg-gray-50 text-gray-900 border-gray-300 hover:border-gray-400 transition-all duration-200"
        >
          <LogIn className="mr-2 w-4 h-4" /> Continue with Google
        </Button>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-8 max-w-3xl mx-auto">
          {/* Clean, minimal heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 leading-tight">
            <span className="block">Swipe Right on</span>
            <span className="block font-bold">Innovation</span>
          </h1>

          {/* Simple subtitle */}
          <p className="max-w-xl text-lg md:text-xl text-gray-600 text-center mx-auto leading-relaxed font-light">
            Discover and validate ideas through a simple, community-driven platform. 
            <strong className="text-gray-900"> Post your vision</strong>, 
            <strong className="text-gray-900"> get feedback</strong>, and 
            <strong className="text-gray-900"> connect with innovators</strong>.
          </p>

          {/* Minimal feature highlights */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-gray-700" />
              </div>
              <span className="text-gray-700 font-medium">Swipe to Like</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <Zap className="w-4 h-4 text-gray-700" />
              </div>
              <span className="text-gray-700 font-medium">Get Feedback</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-gray-700" />
              </div>
              <span className="text-gray-700 font-medium">Connect & Build</span>
            </div>
          </div>

          {/* Simple CTA Button */}
          <div className="pt-8">
            <Button
              className="text-lg px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg"
              size="lg"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <LogIn className="mr-2 w-5 h-5" /> 
              Start Swiping Ideas
            </Button>
          </div>
        </div>
      </main>

      <footer className="relative z-10 flex flex-col items-center py-6 text-gray-500 border-t border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-3 h-3 text-gray-400" />
          <span className="text-sm">Made for innovators</span>
        </div>
        <span className="text-xs">© 2025 Idea Tinder</span>
      </footer>
    </div>
  );
}
