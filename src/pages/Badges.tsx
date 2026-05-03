import { ExternalLink, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NFTBadge, BadgeTier } from "@/components/NFTBadge";
import { useLang } from "@/context/LanguageContext";
import { useWorkout } from "@/context/WorkoutContext";


const Badges = () => {
  const { t } = useLang();
  const { streak } = useWorkout(); // TWEAK: Ambil data streak asli dari user

  // definisi dasar target tiap badge
  const badgeDefinitions = [
    { tier: "bronze" as BadgeTier, name: "BRONZE ATHLETE", req: 30, rarity: "COMMON", color: "text-[hsl(28_70%_60%)]", mockContract: "BzCh...4F8m" },
    { tier: "silver" as BadgeTier, name: "SILVER WARRIOR", req: 90, rarity: "UNCOMMON", color: "text-[hsl(0_0%_80%)]", mockContract: "SvWr...9X2p" },
    { tier: "gold" as BadgeTier, name: "GOLD CHAMPION", req: 180, rarity: "RARE", color: "text-accent", mockContract: "GdCp...1A7x" },
    { tier: "diamond" as BadgeTier, name: "DIAMOND LEGEND", req: 365, rarity: "LEGENDARY", color: "text-[hsl(190_100%_70%)]", mockContract: "DmLg...8V0z" },
  ];

  // ngecek badge mana yang kebuka
  const allBadges = badgeDefinitions.map(def => {
    const isEarned = streak >= def.req; // Kalo streak ngelewatin target, berarti dapet!
    
    // Ngitung persentase progress bar (max 100%)
    const progressPercent = isEarned ? 100 : Math.min(Math.round((streak / def.req) * 100), 100);
    
    // Kalo dapet, kita kasih tanggal hari ini (sebagai simulasi tanggal minting NFT)
    const earnedDate = isEarned ? new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' }) : "-";

    return {
      ...def,
      earned: isEarned,
      progress: progressPercent,
      date: earnedDate,
      contract: def.mockContract,
      requirement: `${def.req} Hari Streak`
    };
  });

  // Pisahin mana yang udah dapet, mana yang masih digembok
  const earned = allBadges.filter(b => b.earned);
  const locked = allBadges.filter(b => !b.earned);

  return (
    <div className="space-y-10 animate-fade-in">
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{t("badges.title")}</h1>
        <p className="text-muted-foreground mt-2 font-mono text-sm">{earned.length} Badges Earned • {locked.length} Locked</p>
      </div>

      {/* Bagian Badge yang udah didapet */}
      {earned.length > 0 && (
        <section>
          <h2 className="text-sm font-mono uppercase tracking-widest text-primary mb-5">● {t("badges.earned")}</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {earned.map((b, i) => (
              <div key={i} className="rounded-2xl border border-primary/30 bg-card p-6 shadow-glow-soft relative overflow-hidden">
                <div className="absolute inset-0 opacity-50"
                  style={{ background: "radial-gradient(circle at top right, hsl(150 100% 50% / 0.08), transparent 60%)" }} />
                <div className="relative flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left">
                  <NFTBadge tier={b.tier} size="lg" />
                  <div className="flex-1 min-w-0 w-full">
                    <h3 className={`text-lg font-extrabold tracking-wider ${b.color}`}>{b.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{b.requirement}</p>
                    <div className="mt-4 space-y-2 font-mono text-xs">
                      <div className="flex justify-between gap-3">
                        <span className="text-muted-foreground">MINTED</span>
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
                    <Button variant="outline" size="sm" className="mt-4 w-full sm:w-auto">
                      <ExternalLink className="h-3.5 w-3.5 mr-2" />
                      View on Explorer
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bagian Badge yang masih digembok */}
      {locked.length > 0 && (
        <section>
          <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-5">● {t("badges.locked")}</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {locked.map((b, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-6 relative">
                <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left">
                  <div className="relative">
                    <NFTBadge tier={b.tier} size="lg" locked />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-10 w-10 rounded-full bg-background/80 border border-border flex items-center justify-center">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 w-full">
                    <h3 className="text-lg font-extrabold tracking-wider text-muted-foreground">{b.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">Target: {b.requirement}</p>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between font-mono text-xs">
                        <span className="text-muted-foreground">Progress ({streak}/{b.req})</span>
                        <span className="text-primary">{b.progress}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden border border-border">
                        <div className="h-full bg-gradient-primary shadow-glow-soft transition-all duration-1000" style={{ width: `${b.progress}%` }} />
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground font-mono">
                      RARITY: <span className={b.color}>{b.rarity}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Badges;
