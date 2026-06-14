import { ExternalLink, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NFTBadge, BadgeTier } from "@/components/NFTBadge";
import { useLang } from "@/context/LanguageContext";
import { useWorkout } from "@/context/WorkoutContext";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

type BadgeCategory = "streak" | "volume" | "mastery";

interface BadgeDef {
  id: string;
  tier: BadgeTier;
  category: BadgeCategory;
  name: string;
  target: number;
  rarity: string;
  color: string;
  mockContract: string;
  getCurrent: (streak: number, volumeKg: number, benchVolume: number) => number;
  formatLabel: (target: number) => string;
  formatProgress: (current: number, target: number) => string;
}

const TIER_ORDER: BadgeTier[] = ["bronze", "silver", "gold", "platinum", "diamond"];
const TIER_COLORS: Record<BadgeTier, string> = {
  bronze: "text-[hsl(28_70%_60%)]",
  silver: "text-[hsl(0_0%_80%)]",
  gold: "text-accent",
  platinum: "text-[hsl(210_40%_80%)]",
  diamond: "text-[hsl(190_100%_70%)]",
};

const fmtKg = (n: number) => n.toLocaleString("en-US");

const Badges = () => {
  const { t } = useLang();
  const { streak, totalVolumeKg, workouts } = useWorkout();
  const { publicKey } = useWallet();
  const walletAddress = publicKey?.toBase58() ?? null;

  const benchVolume = useMemo(() => {
    let total = 0;
    workouts.forEach((w) => {
      w.exercises?.forEach((ex) => {
        if (ex.name.toLowerCase().includes("bench")) {
          total += (parseInt(ex.sets) || 0) * (parseInt(ex.reps) || 0) * (parseFloat(ex.weight) || 0);
        }
      });
    });
    return total;
  }, [workouts]);

  const badgeDefinitions: BadgeDef[] = [
    // ── Consistency Streaks ──
    { id: "s7", tier: "bronze", category: "streak", name: "WEEK WARRIOR", target: 7, rarity: "COMMON", color: TIER_COLORS.bronze, mockContract: "WkWr...7d1a",
      getCurrent: (s) => s, formatLabel: (t) => `${t} Day Streak`, formatProgress: (c, t) => `${c}/${t} days` },
    { id: "s30", tier: "silver", category: "streak", name: "MONTHLY MACHINE", target: 30, rarity: "UNCOMMON", color: TIER_COLORS.silver, mockContract: "MnMc...30d2",
      getCurrent: (s) => s, formatLabel: (t) => `${t} Day Streak`, formatProgress: (c, t) => `${c}/${t} days` },
    { id: "s100", tier: "gold", category: "streak", name: "CENTURION", target: 100, rarity: "RARE", color: TIER_COLORS.gold, mockContract: "Cntr...100g",
      getCurrent: (s) => s, formatLabel: (t) => `${t} Day Streak`, formatProgress: (c, t) => `${c}/${t} days` },
    { id: "s365", tier: "diamond", category: "streak", name: "IMMORTAL ATHLETE", target: 365, rarity: "LEGENDARY", color: TIER_COLORS.diamond, mockContract: "ImAt...365d",
      getCurrent: (s) => s, formatLabel: (t) => `${t} Day Streak`, formatProgress: (c, t) => `${c}/${t} days` },

    // ── Total Volume ──
    { id: "v1t", tier: "bronze", category: "volume", name: "1-TON CLUB", target: 1000, rarity: "COMMON", color: TIER_COLORS.bronze, mockContract: "1Ton...b001",
      getCurrent: (_, v) => v, formatLabel: () => "1,000 kg Total Volume", formatProgress: (c, t) => `${fmtKg(c)}kg / ${fmtKg(t)}kg` },
    { id: "v5t", tier: "silver", category: "volume", name: "5-TON TITAN", target: 5000, rarity: "UNCOMMON", color: TIER_COLORS.silver, mockContract: "5Ton...s005",
      getCurrent: (_, v) => v, formatLabel: () => "5,000 kg Total Volume", formatProgress: (c, t) => `${fmtKg(c)}kg / ${fmtKg(t)}kg` },
    { id: "v10t", tier: "gold", category: "volume", name: "10-TON COLOSSUS", target: 10000, rarity: "RARE", color: TIER_COLORS.gold, mockContract: "10Tn...g010",
      getCurrent: (_, v) => v, formatLabel: () => "10,000 kg Total Volume", formatProgress: (c, t) => `${fmtKg(c)}kg / ${fmtKg(t)}kg` },
    { id: "v50t", tier: "platinum", category: "volume", name: "50-TON LEVIATHAN", target: 50000, rarity: "EPIC", color: TIER_COLORS.platinum, mockContract: "50Tn...p050",
      getCurrent: (_, v) => v, formatLabel: () => "50,000 kg Total Volume", formatProgress: (c, t) => `${fmtKg(c)}kg / ${fmtKg(t)}kg` },
    { id: "v100t", tier: "diamond", category: "volume", name: "100-TON TITAN", target: 100000, rarity: "LEGENDARY", color: TIER_COLORS.diamond, mockContract: "100T...d100",
      getCurrent: (_, v) => v, formatLabel: () => "100,000 kg Total Volume", formatProgress: (c, t) => `${fmtKg(c)}kg / ${fmtKg(t)}kg` },

    // ── Lift Mastery ──
    { id: "mBench", tier: "silver", category: "mastery", name: "THE BENCH PRESS BARON", target: 5000, rarity: "UNCOMMON", color: TIER_COLORS.silver, mockContract: "BnBr...s002",
      getCurrent: (_, __, b) => b, formatLabel: () => "5,000 kg Bench Volume", formatProgress: (c, t) => `${fmtKg(c)}kg / ${fmtKg(t)}kg` },
    { id: "mSquat", tier: "gold", category: "mastery", name: "SQUAT SOVEREIGN", target: 8000, rarity: "RARE", color: TIER_COLORS.gold, mockContract: "SqSv...g003",
      getCurrent: (_, v) => Math.floor(v * 0.35), formatLabel: () => "8,000 kg Squat Volume", formatProgress: (c, t) => `${fmtKg(c)}kg / ${fmtKg(t)}kg` },
    { id: "mDead", tier: "platinum", category: "mastery", name: "DEADLIFT DOMINATOR", target: 12000, rarity: "EPIC", color: TIER_COLORS.platinum, mockContract: "DlDm...p004",
      getCurrent: (_, v) => Math.floor(v * 0.4), formatLabel: () => "12,000 kg Deadlift Volume", formatProgress: (c, t) => `${fmtKg(c)}kg / ${fmtKg(t)}kg` },
    { id: "mOly", tier: "diamond", category: "mastery", name: "OLYMPUS LIFTER", target: 25000, rarity: "LEGENDARY", color: TIER_COLORS.diamond, mockContract: "OlLp...d005",
      getCurrent: (_, v) => Math.floor(v * 0.5), formatLabel: () => "25,000 kg Combined Big-3", formatProgress: (c, t) => `${fmtKg(c)}kg / ${fmtKg(t)}kg` },
  ];

  const allBadges = badgeDefinitions.map((def) => {
    const current = def.getCurrent(streak, totalVolumeKg, benchVolume);
    const earned = current >= def.target;
    const progressPercent = earned ? 100 : Math.min(Math.round((current / def.target) * 100), 99);
    return {
      ...def,
      current,
      earned,
      progress: progressPercent,
      requirement: def.formatLabel(def.target),
      progressLabel: def.formatProgress(Math.min(current, def.target), def.target),
      date: earned
        ? new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
        : "-",
      contract: def.mockContract,
    };
  });

  const earned = allBadges.filter((b) => b.earned);
  const locked = allBadges.filter((b) => !b.earned);

  const categoryLabels: Record<BadgeCategory, string> = {
    streak: t("badges.category.streak"),
    volume: t("badges.category.volume"),
    mastery: t("badges.category.mastery"),
  };

  const tierLabels: Record<BadgeTier, string> = {
    bronze: t("badges.tier.bronze"),
    silver: t("badges.tier.silver"),
    gold: t("badges.tier.gold"),
    platinum: t("badges.tier.platinum"),
    diamond: t("badges.tier.diamond"),
  };

  const handleExplorer = () => {
    if (walletAddress) {
      window.open(`https://explorer.solana.com/address/${walletAddress}?cluster=devnet`, "_blank");
    } else {
      toast.info("Connect wallet dulu untuk lihat di Solana Explorer!");
    }
  };

  const renderEarnedCard = (b: typeof allBadges[0], i: number) => (
    <div
      key={b.id}
      className="rounded-2xl border border-primary/30 bg-card p-6 shadow-glow-soft relative overflow-hidden animate-pulse-glow"
    >
      <div
        className="absolute inset-0 opacity-50 pointer-events-none"
        style={{ background: "radial-gradient(circle at top right, hsl(150 100% 50% / 0.1), transparent 60%)" }}
      />
      <div className="relative flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left">
        <NFTBadge tier={b.tier} size="lg" animated />
        <div className="flex-1 min-w-0 w-full">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary border border-primary/30 px-2 py-0.5 rounded">
              {tierLabels[b.tier]}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">{categoryLabels[b.category]}</span>
          </div>
          <h3 className={cn("text-lg font-extrabold tracking-wider", b.color)}>{b.name}</h3>
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
            {walletAddress && (
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">HOLDER</span>
                <span className="text-primary">{walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}</span>
              </div>
            )}
          </div>
          <Button variant="outline" size="sm" className="mt-4 w-full sm:w-auto" onClick={handleExplorer}>
            <ExternalLink className="h-3.5 w-3.5 mr-2" />
            {walletAddress ? "View on Explorer" : "Connect Wallet First"}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderLockedCard = (b: typeof allBadges[0], i: number) => (
    <div key={b.id} className="rounded-2xl border border-border bg-card p-6 relative opacity-75">
      <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left">
        <div className="relative grayscale opacity-50">
          <NFTBadge tier={b.tier} size="lg" locked animated={false} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-10 w-10 rounded-full bg-background/80 border border-border flex items-center justify-center">
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0 w-full">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground border border-border px-2 py-0.5 rounded">
              {tierLabels[b.tier]}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">{categoryLabels[b.category]}</span>
          </div>
          <h3 className="text-lg font-extrabold tracking-wider text-muted-foreground">{b.name}</h3>
          <p className="text-xs text-muted-foreground mt-1">Target: {b.requirement}</p>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between font-mono text-xs">
              <span className="text-muted-foreground">{b.progressLabel}</span>
              <span className="text-primary">{b.progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden border border-border">
              <div
                className="h-full bg-gradient-primary shadow-glow-soft transition-all duration-1000"
                style={{ width: `${b.progress}%` }}
              />
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground font-mono">
            RARITY: <span className={b.color}>{b.rarity}</span>
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 animate-fade-in">
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{t("badges.title")}</h1>
        <p className="text-muted-foreground mt-2 font-mono text-sm">
          {earned.length} / {allBadges.length} Badges Earned • {locked.length} Locked
        </p>
        {walletAddress ? (
          <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-xs text-primary">
              {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)} Connected
            </span>
          </div>
        ) : (
          <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/30 px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-muted-foreground" />
            <span className="font-mono text-xs text-muted-foreground">Wallet not connected</span>
          </div>
        )}
      </div>

      {/* Tier overview chips */}
      <div className="flex flex-wrap gap-2">
        {TIER_ORDER.map((tier) => {
          const tierBadges = allBadges.filter((b) => b.tier === tier);
          const tierEarned = tierBadges.filter((b) => b.earned).length;
          return (
            <div
              key={tier}
              className={cn(
                "rounded-xl border px-4 py-2 text-xs font-mono",
                tierEarned > 0 ? "border-primary/30 bg-primary/5 text-primary" : "border-border bg-card text-muted-foreground",
              )}
            >
              {tierLabels[tier]}: {tierEarned}/{tierBadges.length}
            </div>
          );
        })}
      </div>

      {/* Earned by category */}
      {(["streak", "volume", "mastery"] as BadgeCategory[]).map((cat) => {
        const catEarned = earned.filter((b) => b.category === cat);
        if (catEarned.length === 0) return null;
        return (
          <section key={cat}>
            <h2 className="text-sm font-mono uppercase tracking-widest text-primary mb-5">
              ● {categoryLabels[cat]} — {t("badges.earned")}
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {catEarned.map(renderEarnedCard)}
            </div>
          </section>
        );
      })}

      {earned.length === 0 && (
        <section>
          <h2 className="text-sm font-mono uppercase tracking-widest text-primary mb-5">● {t("badges.earned")}</h2>
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <p className="text-4xl mb-3">🏆</p>
            <p className="font-bold text-sm">Belum Ada Badge</p>
            <p className="text-xs text-muted-foreground mt-1 font-mono">
              Log workout setiap hari untuk unlock badge pertama lo!
            </p>
            <p className="text-xs text-primary mt-2 font-mono">{streak}/7 hari menuju Week Warrior</p>
          </div>
        </section>
      )}

      {/* Locked grouped by tier */}
      {TIER_ORDER.map((tier) => {
        const tierLocked = locked.filter((b) => b.tier === tier);
        if (tierLocked.length === 0) return null;
        return (
          <section key={tier}>
            <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-5">
              ● {tierLabels[tier]} — {t("badges.locked")}
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {tierLocked.map(renderLockedCard)}
            </div>
          </section>
        );
      })}

      <p className="text-center text-[11px] font-mono text-muted-foreground tracking-wider pt-4">
        POWERED BY SOLANA • NFT BADGE SYSTEM v2.0.0
      </p>
    </div>
  );
};

export default Badges;
