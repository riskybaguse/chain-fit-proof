import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, Dumbbell, Trophy, BarChart3, LogOut, Wallet, Building2, UserCircle2 } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { OnboardingModal } from "./OnboardingModal";
import { LanguageToggle } from "./LanguageToggle";
import { useLang } from "@/context/LanguageContext";
import { useRole, ROLE_META } from "@/context/RoleContext";

const WALLET = "7xKm9pQrAv3Z2BcFDeGhJkLmNoPq8sTuVwXyZ12345";
const shortAddr = (a: string) => `${a.slice(0, 4)}...${a.slice(-4)}`;

export const AppShell = () => {
  const navigate = useNavigate();
  const { t } = useLang();
  const { role } = useRole();

  const baseLinks = [
    { to: "/dashboard", label: t("nav.dashboard"), icon: LayoutDashboard, accent: "primary" as const },
    { to: "/log", label: t("nav.log"), icon: Dumbbell, accent: "primary" as const },
    { to: "/badges", label: t("nav.badges"), icon: Trophy, accent: "primary" as const },
    { to: "/leaderboard", label: t("nav.leaderboard"), icon: BarChart3, accent: "primary" as const },
  ];

  const appLinks = [
    ...baseLinks,
    ...(role === "member"
      ? [{ to: "/member", label: t("nav.myGym"), icon: UserCircle2, accent: "accent" as const }]
      : []),
    ...(role === "owner"
      ? [{ to: "/owner", label: t("nav.owner"), icon: Building2, accent: "owner" as const }]
      : []),
  ];

  const meta = ROLE_META[role];

  const linkActiveClass = (accent: "primary" | "owner" | "accent") =>
    accent === "owner"
      ? "bg-owner/10 text-owner border border-owner/40"
      : accent === "accent"
        ? "bg-accent/10 text-accent border border-accent/40"
        : "bg-primary/10 text-primary border border-primary/30";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-xl border-b border-border">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link to="/dashboard"><Logo /></Link>
          <nav className="hidden md:flex items-center gap-1">
            {appLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end
                className={({ isActive }) =>
                  cn(
                    "inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                    isActive
                      ? linkActiveClass(l.accent)
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                  )
                }
              >
                <l.icon className="h-4 w-4" />
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <div className="hidden sm:flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5">
              <Wallet className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-mono text-foreground">{shortAddr(WALLET)}</span>
              <span
                className={cn(
                  "text-[10px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded border ml-1",
                  meta.chipClass,
                )}
              >
                {meta.label}
              </span>
              <span className="hidden md:inline text-xs font-mono text-muted-foreground border-l border-border pl-2 ml-1">
                4.27 SOL
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => navigate("/")} aria-label="Disconnect">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {/* Mobile nav */}
        <div className="md:hidden border-t border-border">
          <div className="container flex overflow-x-auto gap-1 py-2 items-center">
            <span
              className={cn(
                "text-[10px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded border shrink-0",
                meta.chipClass,
              )}
            >
              {meta.label}
            </span>
            {appLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end
                className={({ isActive }) =>
                  cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs whitespace-nowrap",
                    isActive
                      ? l.accent === "owner"
                        ? "bg-owner/10 text-owner"
                        : l.accent === "accent"
                          ? "bg-accent/10 text-accent"
                          : "bg-primary/10 text-primary"
                      : "text-muted-foreground",
                  )
                }
              >
                <l.icon className="h-3.5 w-3.5" />
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
      </header>
      <main className="container py-8">
        <Outlet />
      </main>
      <OnboardingModal />
    </div>
  );
};

export const MOCK_WALLET = WALLET;
export const formatAddr = shortAddr;
