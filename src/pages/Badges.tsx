import { ExternalLink, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NFTBadge, BadgeTier } from "@/components/NFTBadge";
import { useLang } from "@/context/LanguageContext";
import { useWorkout } from "@/context/WorkoutContext";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";

const Badges = () => {
  const { t } = useLang();
  const { streak } = useWorkout();
  const { publicKey } = useWallet();
  const walletAddress = publicKey?.toBase58() ?? null;

  const badgeDefinitions = [
    { tier: "bronze" as BadgeTier, name: "BRONZE ATHLETE", req: 30, rarity: "COMMON", color: "text-[hsl(28_70%_60%)]", mockContract: "BzCh...4F8m" },
    { tier: "silver" as BadgeTier, name: "SILVER WARRIOR", req: 90, rarity: "UNCOMMON", color: "text-[hsl(0_0%_80%)]", mockContract: "SvWr...9X2p" },
    { tier: "gold" as BadgeTier, name: "GOLD CHAMPION", req: 180, rarity: "RARE", color: "text-accent", mockContract: "GdCp...1A7x" },
    { tier: "diamond" as BadgeTier, name: "DIAMOND LEGEND", req: 365, rarity: "LEGENDARY", color: "text-[hsl(190_100%_70%)]", mockContract: "DmLg...8V0z" },
  ];

  const allBadges = badgeDefinitions.map(def => {
    const isEarned = streak >= def.req;
    const progressPercent = isEarned ? 100 : Math.min(Math.round((streak / def.req) * 100), 100);
    const earnedDate = isEarned
      ? new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
      : "-";

    return {
      ...def,
      earned: isEarned,
      progress: progressPercent,
      date: earnedDate,
      contract: def.mockContract,
      requirement: `${def.req} Hari Streak`,
    };
  });

  const earned = allBadges.filter(b => b.earned);
  const locked = allBadges.filter(b => !b.earned);

  const handleExplorer = () => {
    if (walletAddress) {
      window.open(
        `https://explorer.solana.com/address/${walletAddress}?cluster=devnet`,
        "_blank"
      );
    } else {
      toast.info("Connect wallet dulu untuk lihat di Solana Explorer!");
    }
  };

  return (
    <div className="space-y-10 animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          {t("badges.title")}
        </h1>
        <p className="text-muted-foreground mt-2 font-mono text-sm">
          {earned.length} Badges Earned • {locked.length} Locked
        </p>

        {/* Wallet status indicator */}
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
            <span className="font-mono text-xs text-muted-foreground">
              Wallet not connected
            </span>
          </div>
        )}
      </div>

      {/* Earned Badges */}
      {earned.length > 0 && (
        <section>
          <h2 className="text-sm font-mono uppercase tracking-widest text-primary mb-5">
            ● {t("badges.earned")}
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {earned.map((b, i) => (
              <div
                key={i}
                className="rounded-2xl border border-primary/30 bg-card p-6 shadow-glow-soft relative overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-50"
                  style={{
                    background:
                      "radial-gradient(circle at top right, hsl(150 100% 50% / 0.08), transparent 60%)",
                  }}
                />
                <div className="relative flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left">
                  <NFTBadge tier={b.tier} size="lg" />
                  <div className="flex-1 min-w-0 w-full">
                    <h3 className={`text-lg font-extrabold tracking-wider ${b.color}`}>
                      {b.name}
                    </h3>
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

                      {/* Wallet address row — muncul kalau connected */}
                      {walletAddress && (
                        <div className="flex justify-between gap-3">
                          <span className="text-muted-foreground">HOLDER</span>
                          <span className="text-primary">
                            {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Button View on Explorer */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 w-full sm:w-auto"
                      onClick={handleExplorer}
                    >
                      <ExternalLink className="h-3.5 w-3.5 mr-2" />
                      {walletAddress ? "View on Explorer" : "Connect Wallet First"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty earned state */}
      {earned.length === 0 && (
        <section>
          <h2 className="text-sm font-mono uppercase tracking-widest text-primary mb-5">
            ● {t("badges.earned")}
          </h2>
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <p className="text-4xl mb-3">🏆</p>
            <p className="font-bold text-sm">Belum Ada Badge</p>
            <p className="text-xs text-muted-foreground mt-1 font-mono">
              Log workout setiap hari untuk unlock badge pertama lo!
            </p>
            <p className="text-xs text-primary mt-2 font-mono">
              {streak}/30 hari menuju Bronze Badge
            </p>
          </div>
        </section>
      )}

      {/* Locked Badges */}
      {locked.length > 0 && (
        <section>
          <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-5">
            ● {t("badges.locked")}
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {locked.map((b, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card p-6 relative"
              >
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
                    <h3 className="text-lg font-extrabold tracking-wider text-muted-foreground">
                      {b.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Target: {b.requirement}
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between font-mono text-xs">
                        <span className="text-muted-foreground">
                          Progress ({streak}/{b.req})
                        </span>
                        <span className="text-primary">{b.progress}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden border border-border">
                        <div
                          className="h-full bg-gradient-primary shadow-glow-soft transition-all duration-1000"
                          style={{ width: `${b.progress}%` }}
                        />
                      </div>
                      <p className="text-[10px] font-mono text-muted-foreground">
                        {b.req - streak > 0
                          ? `${b.req - streak} hari lagi untuk unlock!`
                          : "Hampir sampai!"}
                      </p>
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

      {/* Footer */}
      <p className="text-center text-[11px] font-mono text-muted-foreground tracking-wider pt-4">
        POWERED BY SOLANA • NFT BADGE SYSTEM v1.0.0
      </p>
    </div>
  );
};

export default Badges;