import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Wallet } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LanguageToggle } from "./LanguageToggle";
import { useLang } from "@/context/LanguageContext";
import { RoleSelectModal } from "./RoleSelectModal";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const location = useLocation();
  const { t } = useLang();

  const links = [
    { label: t("nav.home"), to: "/", isRoute: true },
    { label: t("nav.features"), to: "/#features", isRoute: false },
    { label: t("nav.how"), to: "/#how", isRoute: false },
    { label: t("nav.badges"), to: "/#badges", isRoute: false },
    { label: t("nav.about"), to: "/#about", isRoute: false },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <nav className="container flex h-16 items-center justify-between">
        <Link to="/" aria-label="GainChain home">
          <Logo />
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) =>
            l.isRoute ? (
              <Link
                key={l.to}
                to={l.to}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.to}
                href={l.to}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {l.label}
              </a>
            )
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <LanguageToggle />
          
          {/* TWEAK DESKTOP */}
          <div className="[&_.wallet-adapter-button]:bg-primary [&_.wallet-adapter-button]:hover:bg-primary/90 [&_.wallet-adapter-button]:h-10 [&_.wallet-adapter-button]:px-4 [&_.wallet-adapter-button]:rounded-md [&_.wallet-adapter-button]:font-bold [&_.wallet-adapter-button]:text-primary-foreground [&_.wallet-adapter-button]:text-sm">
            <WalletMultiButton />
          </div>

        </div>

        <div className="md:hidden flex items-center gap-2">
          <LanguageToggle />
          <button
            className="text-foreground p-2"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl animate-fade-in">
          <div className="container py-4 flex flex-col gap-1">
            {links.map((l) =>
              l.isRoute ? (
                <Link
                  key={l.to}
                  to={l.to}
                  className="px-3 py-3 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary"
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.to}
                  href={l.to}
                  className="px-3 py-3 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary"
                >
                  {l.label}
                </a>
              )
            )}
            {/* TWEAK MOBILE */}
            <div className="mt-3 w-full [&_.wallet-adapter-button]:bg-primary [&_.wallet-adapter-button]:hover:bg-primary/90 [&_.wallet-adapter-button]:h-10 [&_.wallet-adapter-button]:w-full [&_.wallet-adapter-button]:justify-center [&_.wallet-adapter-button]:rounded-md [&_.wallet-adapter-button]:font-bold [&_.wallet-adapter-button]:text-primary-foreground [&_.wallet-adapter-button]:text-sm">
              <WalletMultiButton />
            </div>
          </div>
        </div>
      )}

      <RoleSelectModal open={roleOpen} onOpenChange={setRoleOpen} />
    </header>
  );
};