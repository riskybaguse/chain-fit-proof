import { ExternalLink, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NFTBadge, BadgeTier } from "@/components/NFTBadge";
import { useLang } from "@/context/LanguageContext";

interface BadgeRow {
  tier: BadgeTier;
  name: string;
  earned: boolean;
  date?: string;
  contract?: string;
  requirement: string;
  progress?: number; // 0-100
  rarity: string;
  color: string;
}

const badges: BadgeRow[] = [
  { tier: "bronze", name: "BRONZE ATHLETE", earned: true, date: "2026-03-20", contract: "BzCh...4F8m", requirement: "30 Hari Streak", rarity: "COMMON", color: "text-[hsl(28_70%_60%)]" },
  { tier: "silver", name: "SILVER WARRIOR", earned: false, requirement: "90 Hari Streak", progress: 52, rarity: "UNCOMMON", color: "text-[hsl(0_0%_80%)]" },
  { tier: "gold", name: "GOLD CHAMPION", earned: false, requirement: "180 Hari Streak", progress: 26, rarity: "RARE", color: "text-accent" },
  { tier: "diamond", name: "DIAMOND LEGEND", earned: false, requirement: "365 Hari Streak", progress: 13, rarity: "LEGENDARY", color: "text-[hsl(190_100%_70%)]" },
];

// Add second earned badge
badges.splice(1, 0, {
  tier: "bronze",
  name: "30-DAY DEBUT",
  earned: true,
  date: "2026-02-15",
  contract: "GnCh...9aRt",
  requirement: "First 30 days",
  rarity: "COMMON",
  color: "text-[hsl(28_70%_60%)]",
});

const Badges = () => {
  const { t } = useLang();
  const earned = badges.filter(b => b.earned);
  const locked = badges.filter(b => !b.earned);
  return (
    <div className="space-y-10 animate-fade-in">
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{t("badges.title")}</h1>
        <p className="text-muted-foreground mt-2 font-mono text-sm">{earned.length} Badges Earned • {locked.length} Locked</p>
      </div>

      <section>
        <h2 className="text-sm font-mono uppercase tracking-widest text-primary mb-5">● {t("badges.earned")}</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {earned.map((b, i) => (
            <div key={i} className="rounded-2xl border border-primary/30 bg-card p-6 shadow-glow-soft relative overflow-hidden">
              <div className="absolute inset-0 opacity-50"
                style={{ background: "radial-gradient(circle at top right, hsl(150 100% 50% / 0.08), transparent 60%)" }} />
              <div className="relative flex gap-5">
                <NFTBadge tier={b.tier} size="lg" />
                <div className="flex-1 min-w-0">
                  <h3 className={`text-lg font-extrabold tracking-wider ${b.color}`}>{b.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{b.requirement}</p>
                  <div className="mt-4 space-y-2 font-mono text-xs">
                    <div className="flex justify-between gap-3">
                      <span className="text-muted-foreground">EARNED</span>
                      <span>{b.date}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-muted-foreground">CONTRACT</span>
                      <span className="text-primary">{b.contract}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-muted-foreground">RARITY</span>
                      <span className={b.color}>● {b.rarity}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-4">
                    <ExternalLink className="h-3.5 w-3.5" />
                    {t("badges.viewSolana")}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-5">● {t("badges.locked")}</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {locked.map((b, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-6 relative">
              <div className="flex gap-5">
                <div className="relative">
                  <NFTBadge tier={b.tier} size="lg" locked />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-10 w-10 rounded-full bg-background/80 border border-border flex items-center justify-center">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-extrabold tracking-wider text-muted-foreground">{b.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{t("badges.requirement")}: {b.requirement}</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between font-mono text-xs">
                      <span className="text-muted-foreground">{t("badges.progress")}</span>
                      <span className="text-primary">{b.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden border border-border">
                      <div className="h-full bg-gradient-primary shadow-glow-soft" style={{ width: `${b.progress}%` }} />
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {t("badges.rarity")}: <span className={b.color}>{b.rarity}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Badges;
