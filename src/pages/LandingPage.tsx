
import { Button } from "@/components/ui/button";
import { BookOpen, LogIn, User, Sparkles, Zap, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useAuthUser } from "@/hooks/useAuthUser";
import { toast } from "@/hooks/use-toast";

const Logo = () => (
  <span className="flex items-center gap-2 text-3xl font-black tracking-tight select-none">
    <div className="relative">
      <BookOpen className="w-8 h-8 text-blue-600" />
      <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400" />
    </div>
    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-foreground relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
      </div>

      <header className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/20 backdrop-blur-sm bg-white/10">
        <Logo />
        <div>
          <Button 
            variant="secondary" 
            onClick={handleGoogleLogin} 
            disabled={isLoading}
            className="bg-white/90 hover:bg-white text-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <LogIn className="mr-2" /> Continue with Google
          </Button>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Main heading with gradient */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-center animate-fade-in">
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              Swipe Right on
            </span>
            <span className="block bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent leading-tight">
              Innovation
            </span>
          </h1>

          {/* Subtitle with better styling */}
          <p className="max-w-2xl text-xl md:text-2xl text-gray-700 text-center mx-auto animate-fade-in leading-relaxed">
            Discover and validate big ideas through a gamified, community-driven Tinder-like platform. 
            <span className="text-blue-600 font-semibold"> Post your vision</span>, 
            <span className="text-purple-600 font-semibold"> get feedback</span>, and 
            <span className="text-pink-600 font-semibold"> connect with fellow innovators</span>.
          </p>

          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-6 mt-12 animate-fade-in">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/20">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="text-gray-700 font-medium">Swipe to Like</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/20">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-700 font-medium">Get Instant Feedback</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/20">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span className="text-gray-700 font-medium">Connect & Innovate</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-8">
            <Button
              className="text-lg px-10 py-6 animate-scale-in bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 rounded-2xl border-0"
              size="lg"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <LogIn className="mr-3 w-5 h-5" /> 
              Start Swiping Ideas
              <Sparkles className="ml-3 w-5 h-5" />
            </Button>
          </div>
        </div>
      </main>

      <footer className="relative z-10 flex flex-col items-center py-8 text-gray-600 bg-white/30 backdrop-blur-sm border-t border-white/20">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-4 h-4 text-red-500" />
          <span className="text-sm">Made for innovators, by innovators</span>
        </div>
        <span className="text-xs">© 2025 Idea Tinder</span>
      </footer>
    </div>
  );
}
