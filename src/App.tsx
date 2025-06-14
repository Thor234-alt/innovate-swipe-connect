
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AppHome from "./pages/AppHome";
import NotFound from "./pages/NotFound";
import AppHeader from "@/components/AppHeader";
import { useAuthUser } from "@/hooks/useAuthUser";
import { Suspense } from "react";

const queryClient = new QueryClient();

// A wrapper component for protected routes
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useAuthUser();
  const location = useLocation();
  if (isLoading) return <div className="p-16 text-center">Loading...</div>;
  if (!session) return <Navigate to="/" state={{ from: location }} replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<LandingPage />}
          />
          <Route
            path="/app"
            element={
              <RequireAuth>
                <AppHeader />
                <Suspense fallback={<div className="p-8">Loading...</div>}>
                  <AppHome />
                </Suspense>
              </RequireAuth>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
