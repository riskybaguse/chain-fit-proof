import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import { AppShell } from "./components/AppShell";
import Dashboard from "./pages/Dashboard";
import Badges from "./pages/Badges";
import Logger from "./pages/Logger";
import Leaderboard from "./pages/Leaderboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import MemberDashboard from "./pages/MemberDashboard";
import { LanguageProvider } from "./context/LanguageContext";
import { RoleProvider } from "./context/RoleContext";
import { RouteErrorBoundary } from "./components/RouteErrorBoundary";
import { SolanaProvider } from "./context/SolanaProvider";
import { WorkoutProvider } from "./context/WorkoutContext.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SolanaProvider>
      <LanguageProvider>
        <RoleProvider>
          <WorkoutProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <RouteErrorBoundary>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route element={<AppShell />}>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/log" element={<Logger />} />
                      <Route path="/badges" element={<Badges />} />
                      <Route path="/leaderboard" element={<Leaderboard />} />
                      <Route path="/owner" element={<OwnerDashboard />} />
                      <Route path="/member" element={<MemberDashboard />} />
                    </Route>
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </RouteErrorBoundary>
              </BrowserRouter>
            </TooltipProvider>
          </WorkoutProvider>
        </RoleProvider>
      </LanguageProvider>
    </SolanaProvider>
  </QueryClientProvider>);

export default App;
