import { useState } from "react";
import { Crown, Trophy, Medal, Flame, Dumbbell, Zap } from "lucide-react";
import { NFTBadge, BadgeTier } from "@/components/NFTBadge";
import { cn } from "@/lib/utils";
import { useLang } from "@/context/LanguageContext";

interface Athlete {
  rank: number;
  addr: string;
  tier: BadgeTier;
  streak: number;
  workouts: number;
  volume: number;
}

const athletes: Athlete[] = [
  { rank: 1, addr: "0x9F8e...1A2b", tier: "diamond", streak: 412, workouts: 487, volume: 184230 },
  { rank: 2, addr: "0x4D2c...8F9a", tier: "diamond", streak: 378, workouts: 421, volume: 156890 },
  { rank: 3, addr: "0xB7e1...3C4d", tier: "gold", streak: 245, workouts: 312, volume: 128450 },
  { rank: 4, addr: "0x1A2b...9F4c", tier: "gold", streak: 187, workouts: 234, volume: 98230 },
  { rank: 5, addr: "0x6E5f...2D1c", tier: "gold", streak: 178, workouts: 221, volume: 87340 },
  { rank: 6, addr: "0x8E5d...2A1b", tier: "silver", streak: 142, workouts: 187, volume: 76210 },
  { rank: 7, addr: "0xC3a4...5B6e", tier: "silver", streak: 121, workouts: 165, volume: 68920 },
  { rank: 8, addr: "0x2F1e...7A8b", tier: "silver", streak: 98, workouts: 142, volume: 58760 },
  { rank: 9, addr: "0x3F9c...7E2a", tier: "bronze", streak: 67, workouts: 89, volume: 42180 },
  { rank: 10, addr: "0x5D4e...3F2a", tier: "bronze", streak: 47, workouts: 134, volume: 48230 },
];

const Leaderboard = () => {
  const { t } = useLang();
  const [time, setTime] = useState<"WEEKLY" | "MONTHLY" | "ALL">("ALL");
  const [cat, setCat] = useState<"STREAK" | "VOLUME" | "BADGES">("STREAK");
  const top3 = athletes.slice(0, 3);
  const rest = athletes.slice(3);

  return (
    <div className="space-y-10 animate-fade-in">
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{t("leaderboard.title")}</h1>
        <p className="text-muted-foreground mt-2">{t("leaderboard.subtitle")}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <FilterGroup<"WEEKLY" | "MONTHLY" | "ALL"> label={t("leaderboard.timeframe")} options={["WEEKLY", "MONTHLY", "ALL"]} value={time} onChange={setTime} />
        <FilterGroup<"STREAK" | "VOLUME" | "BADGES"> label={t("leaderboard.category")} options={["STREAK", "VOLUME", "BADGES"]} value={cat} onChange={setCat} />
      </div>

      {/* Podium */}
      <div className="rounded-2xl border border-border bg-card p-6 md:p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, hsl(150 100% 50% / 0.08), transparent 70%)" }} />
        <div className="relative grid grid-cols-3 gap-4 items-end max-w-3xl mx-auto">
          {/* 2nd */}
          <PodiumCard athlete={top3[1]} place={2} height="h-32 md:h-40" icon={Medal} color="text-[hsl(0_0%_80%)]" />
          {/* 1st */}
          <PodiumCard athlete={top3[0]} place={1} height="h-44 md:h-56" icon={Crown} color="text-accent" highlight />
          {/* 3rd */}
          <PodiumCard athlete={top3[2]} place={3} height="h-24 md:h-32" icon={Trophy} color="text-[hsl(28_70%_60%)]" />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="text-lg font-bold">{t("leaderboard.rankings")}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-background/40 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left p-4 w-16">{t("leaderboard.rank")}</th>
                <th className="text-left p-4">{t("leaderboard.athlete")}</th>
                <th className="text-left p-4">{t("leaderboard.badge")}</th>
                <th className="text-right p-4">{t("leaderboard.streak")}</th>
                <th className="text-right p-4 hidden md:table-cell">{t("leaderboard.workouts")}</th>
                <th className="text-right p-4 hidden md:table-cell">Volume (kg)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rest.map((a) => (
                <tr key={a.rank} className="hover:bg-background/40 transition-colors cursor-pointer">
                  <td className="p-4 font-mono font-bold text-muted-foreground">#{a.rank}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center font-mono text-[10px] font-bold text-primary-foreground">
                        {a.addr.slice(2, 4).toUpperCase()}
                      </div>
                      <span className="font-mono text-xs">{a.addr}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <NFTBadge tier={a.tier} size="sm" animated={false} />
                  </td>
                  <td className="p-4 text-right">
                    <span className="font-mono font-bold inline-flex items-center gap-1">
                      <Flame className="h-3.5 w-3.5 text-primary" />
                      {a.streak}
                    </span>
                  </td>
                  <td className="p-4 text-right font-mono hidden md:table-cell">{a.workouts}</td>
                  <td className="p-4 text-right font-mono hidden md:table-cell">{a.volume.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const FilterGroup = <T extends string>({ label, options, value, onChange }: {
  label: string; options: readonly T[]; value: T; onChange: (v: T) => void;
}) => (
  <div className="flex items-center gap-2">
    <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{label}:</span>
    <div className="flex gap-1 bg-card rounded-lg p-1 border border-border">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={cn(
            "px-3 py-1.5 rounded-md text-xs font-mono tracking-wider transition-colors",
            value === o ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  </div>
);

const PodiumCard = ({
  athlete, place, height, icon: Icon, color, highlight,
}: {
  athlete: Athlete; place: number; height: string; icon: typeof Crown; color: string; highlight?: boolean;
}) => (
  <div className="flex flex-col items-center gap-3">
    <Icon className={cn("h-7 w-7", color, highlight && "drop-shadow-[0_0_8px_currentColor]")} />
    <NFTBadge tier={athlete.tier} size={highlight ? "lg" : "md"} />
    <div className="text-center">
      <div className="font-mono text-xs">{athlete.addr}</div>
      <div className="font-mono text-xs text-primary mt-1 inline-flex items-center gap-1">
        <Flame className="h-3 w-3" /> {athlete.streak} days
      </div>
    </div>
    <div
      className={cn(
        "w-full rounded-t-xl border border-b-0 flex items-center justify-center",
        height,
        highlight ? "border-primary/40 bg-primary/10 shadow-glow-soft" : "border-border bg-background/50",
      )}
    >
      <span className={cn("font-mono text-4xl md:text-6xl font-extrabold", color)}>#{place}</span>
    </div>
  </div>
);

export default Leaderboard;
