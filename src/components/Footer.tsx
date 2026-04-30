import { Link } from "react-router-dom";
import { Twitter, Github, MessageCircle } from "lucide-react";
import { Logo } from "./Logo";
import { useLang } from "@/context/LanguageContext";

export const Footer = () => {
  const { t } = useLang();
  return (
    <footer className="border-t border-border bg-card/30 mt-24">
      <div className="container py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2 space-y-4">
          <Logo />
          <p className="text-sm text-muted-foreground max-w-sm">
            {t("footer.desc")}
          </p>
          <div className="flex items-center gap-3">
            <a href="#" aria-label="Twitter" className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-border hover:border-primary/50 hover:text-primary transition-colors">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Discord" className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-border hover:border-primary/50 hover:text-primary transition-colors">
              <MessageCircle className="h-4 w-4" />
            </a>
            <a href="#" aria-label="GitHub" className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-border hover:border-primary/50 hover:text-primary transition-colors">
              <Github className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground mb-4">{t("footer.platform")}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="/#features" className="hover:text-primary">Features</a></li>
            <li><a href="/#how" className="hover:text-primary">How It Works</a></li>
            <li><Link to="/leaderboard" className="hover:text-primary">Leaderboard</Link></li>
            <li><Link to="/dashboard" className="hover:text-primary">Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground mb-4">{t("footer.resources")}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-primary">About</a></li>
            <li><a href="#" className="hover:text-primary">Docs</a></li>
            <li><a href="#" className="hover:text-primary">{t("footer.privacy")}</a></li>
            <li><a href="#" className="hover:text-primary">Terms</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container py-5 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground font-mono">
            {t("footer.copy")}
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            {t("footer.immutable")}
          </p>
        </div>
      </div>
    </footer>
  );
};
