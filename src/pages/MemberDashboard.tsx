import {
  Flame, Trophy, Dumbbell, Target, MapPin, Users, ExternalLink,
  Building2, Calendar, Sparkles, Award, ArrowRight, CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NFTBadge } from "@/components/NFTBadge";
import { cn } from "@/lib/utils";
import { useLang } from "@/context/LanguageContext";

const GYM = {
  name: "Iron Forge Gym",
  location: "Jakarta Selatan, ID",
  members: 48,
  memberSince: "2026-02-11",
  activeUntil: "2026-08-11",
  contract: "GymF0rg3MembershipNFT9pQrAv3Z2BcF7xKm",
  tokenId: "#0247",
};

const USER_WALLET = "9Zx2C4vB6nM8aSdF";
const shortAddr = (a: string) => `${a.slice(0, 4)}...${a.slice(-4)}`;

const leaderboard = [
  { wallet: "7xKm9pQrAv3Z2BcF", streak: 187, workouts: 312, badge: "diamond" as const },
  { wallet: "8E5d2A1bXyZ7HjKp", streak: 142, workouts: 268, badge: "gold" as const },
  { wallet: "1A2b9F4cDeGhJkLm", streak: 91, workouts: 184, badge: "silver" as const },
  { wallet: "4Q1wE3rT5yU7iO9p", streak: 64, workouts: 142, badge: "silver" as const },
  { wallet: USER_WALLET, streak: 23, workouts: 16, badge: "bronze" as const, you: true },
  { wallet: "3F9c7E2aQwR1MnLo", streak: 47, workouts: 98, badge: "bronze" as const },
  { wallet: "5T7yU8iO9pAsDfGh", streak: 21, workouts: 54, badge: "bronze" as const },
  { wallet: "6H8jK0lP2oI4uY6t", streak: 18, workouts: 47, badge: "bronze" as const },
  { wallet: "2B4n6M8a0SdF1Gh3", streak: 14, workouts: 39, badge: "bronze" as const },
  { wallet: "0Po9Iu8Yt7Re6Wq5", streak: 12, workouts: 31, badge: "bronze" as const },
];

const fmtDate = (d: string, locale: "id-ID" | "en-US") =>
  new Date(d).toLocaleDateString(locale, { day: "2-digit", month: "short", year: "numeric" });

const MemberDashboard = () => {
  const { t, lang } = useLang();
  const locale = lang === "id" ? "id-ID" : "en-US";
  const challenges = [
    {
      name: "30-Day Push Challenge",
      desc:
        lang === "id"
          ? "Selesaikan 30 hari Push Day dalam 45 hari. Bonus poin untuk konsistensi harian."
          : "Complete 30 Push Days in 45 days. Earn bonus points for daily consistency.",
      end: "2026-06-15",
      prize: "Exclusive Push Master NFT",
      participants: 18,
      capacity: 30,
      tier: "gold" as const,
    },
    {
      name: "Volume Beast — 50,000kg",
      desc:
        lang === "id"
          ? "Akumulasi total angkatan 50,000kg dalam 1 bulan. Khusus member Iron Forge."
          : "Accumulate 50,000kg total lifting volume in 1 month. Exclusive for Iron Forge members.",
      end: "2026-05-30",
      prize: "Silver Volume Badge + 0.2 SOL",
      participants: 12,
      capacity: 25,
      tier: "silver" as const,
    },
  ];
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {GYM.name} <span className="text-muted-foreground font-normal">{t("member.titleSuffix")}</span>
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-mono font-bold tracking-widest border border-accent/40 bg-accent/15 text-accent shadow-glow-gold">
              <Trophy className="h-3 w-3" />
              MEMBER
            </span>
          </div>
          <p className="text-sm text-muted-foreground font-mono">
            Wallet: <span className="text-foreground">{shortAddr(USER_WALLET)}</span> • {t("member.memberSince")} {fmtDate(GYM.memberSince, locale)}
          </p>
        </div>
      </div>

      {/* Membership NFT Card */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <div
            className="relative rounded-3xl p-1 overflow-hidden animate-pulse-glow"
            style={{ background: "var(--gradient-gold)" }}
          >
            <div className="rounded-[22px] bg-card p-7 md:p-9 relative overflow-hidden">
              <div className="absolute inset-0 bg-grid opacity-20" />
              <div
                className="absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl opacity-30"
                style={{ background: "var(--gradient-gold)" }}
              />
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(circle at 0% 100%, hsl(150 100% 50% / 0.12), transparent 60%)" }}
              />

              <div className="relative">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-gold flex items-center justify-center shadow-glow-gold">
                      <Building2 className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-accent">{t("member.smartMembership")}</p>
                      <h3 className="text-xl font-extrabold">{GYM.name}</h3>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-[10px] font-mono font-bold tracking-widest text-primary">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    {t("member.active")}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-5 border-y border-border">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{t("member.tokenId")}</p>
                    <p className="font-mono text-sm font-bold mt-1">{GYM.tokenId}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Member Since</p>
                    <p className="font-mono text-sm font-bold mt-1">{fmtDate(GYM.memberSince, locale)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{t("member.activeUntil")}</p>
                    <p className="font-mono text-sm font-bold mt-1 text-primary">{fmtDate(GYM.activeUntil, locale)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{t("member.contract")}</p>
                    <p className="font-mono text-sm font-bold mt-1">{shortAddr(GYM.contract)}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 mt-6">
                  <p className="text-xs font-mono text-muted-foreground inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    {t("member.verifiedSolana")}
                  </p>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-3.5 w-3.5" />
                    {t("member.viewExplorer")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gym info banner */}
        <div className="rounded-3xl border border-border bg-card p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-14 w-14 rounded-xl bg-secondary border border-border flex items-center justify-center">
              <Building2 className="h-7 w-7 text-accent" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">{GYM.name}</h3>
              <p className="text-xs font-mono text-muted-foreground">{t("member.verifiedGym")}</p>
            </div>
          </div>

          <div className="space-y-3 mt-2">
            <div className="flex items-center justify-between rounded-lg bg-background/50 border border-border px-3 py-2">
              <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5 text-accent" /> {t("member.members")}
              </span>
              <span className="font-mono text-sm font-bold">{GYM.members} {t("member.members")}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-background/50 border border-border px-3 py-2">
              <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-accent" /> {t("member.location")}
              </span>
              <span className="font-mono text-xs font-bold">{GYM.location}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-background/50 border border-border px-3 py-2">
              <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-accent" /> {t("member.status")}
              </span>
              <span className="font-mono text-xs font-bold text-primary">VERIFIED</span>
            </div>
          </div>

          <Button variant="outline" size="sm" className="mt-auto pt-2">
            {t("member.visitGym")}
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Flame, label: t("member.myStreak"), value: "23", unit: lang === "id" ? "Hari" : "Days", emoji: "🔥" },
          { icon: Trophy, label: t("member.myRank"), value: "#5", unit: `of ${GYM.members}` },
          { icon: Dumbbell, label: t("member.workoutsMonth"), value: "16", unit: lang === "id" ? "Sesi" : "Sessions" },
          { icon: Target, label: t("member.nextBadge"), value: "7", unit: lang === "id" ? "hari ke Bronze" : "days to Bronze" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-accent/25 bg-card p-5 relative overflow-hidden hover:-translate-y-0.5 transition-transform"
          >
            <div
              className="absolute inset-0 opacity-50 pointer-events-none"
              style={{ background: "radial-gradient(circle at 100% 0%, hsl(51 100% 50% / 0.1), transparent 60%)" }}
            />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{s.label}</span>
                <div className="h-8 w-8 rounded-lg flex items-center justify-center border border-accent/35 bg-accent/10">
                  <s.icon className="h-4 w-4 text-accent" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                {s.emoji && <span className="text-xl">{s.emoji}</span>}
                <span className="font-mono text-3xl font-extrabold text-foreground">{s.value}</span>
                <span className="text-xs font-mono text-muted-foreground">{s.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Leaderboard + Challenges */}
      <div className="grid lg:grid-cols-5 gap-5">
        {/* Leaderboard */}
        <div className="lg:col-span-3 rounded-2xl border border-border bg-card overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold inline-flex items-center gap-2">
                <Trophy className="h-4 w-4 text-accent" />
                {t("member.leaderboardGym")} {GYM.name}
              </h2>
              <p className="text-xs text-muted-foreground">{t("member.top10")}</p>
            </div>
            <span className="chip">{t("member.thisMonth")}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground bg-background/40">
                  <th className="text-left px-5 py-3 w-12">#</th>
                  <th className="text-left px-5 py-3">Member</th>
                  <th className="text-left px-5 py-3">Streak</th>
                  <th className="text-left px-5 py-3">Workouts</th>
                  <th className="text-right px-5 py-3">Badge</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((m, i) => (
                  <tr
                    key={m.wallet + i}
                    className={cn(
                      "border-t border-border transition-colors",
                      m.you
                        ? "bg-accent/10 hover:bg-accent/15"
                        : "hover:bg-secondary/40",
                    )}
                    style={m.you ? { boxShadow: "inset 3px 0 0 hsl(var(--accent))" } : undefined}
                  >
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          "inline-flex h-7 w-7 items-center justify-center rounded-full font-mono text-xs font-extrabold",
                          i === 0 ? "bg-gradient-gold text-accent-foreground" :
                          i === 1 ? "bg-gradient-silver text-background" :
                          i === 2 ? "bg-gradient-bronze text-white" :
                          "bg-secondary text-muted-foreground",
                        )}
                      >
                        {i + 1}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs">{shortAddr(m.wallet)}</span>
                        {m.you && (
                          <span className="text-[9px] font-mono font-bold tracking-widest text-accent border border-accent/40 rounded-full px-1.5 py-0.5">
                            {t("member.you")}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1.5 font-mono">
                        <Flame className="h-3.5 w-3.5 text-primary" />
                        {m.streak}d
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs">{m.workouts}</td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end">
                        <NFTBadge tier={m.badge} size="sm" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Challenges */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold inline-flex items-center gap-2">
              <Award className="h-4 w-4 text-accent" />
              {t("member.activeChallenges")}
            </h2>
            <span className="chip-primary text-[10px]">{challenges.length} {t("member.live")}</span>
          </div>
          {challenges.map((c) => {
            const pct = Math.round((c.participants / c.capacity) * 100);
            return (
              <div
                key={c.name}
                className="rounded-2xl border border-border bg-card p-5 hover:border-accent/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-bold leading-tight">{c.name}</h3>
                  <NFTBadge tier={c.tier} size="sm" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">{c.desc}</p>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="rounded-lg bg-background/50 border border-border px-3 py-2">
                    <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">{t("member.ends")}</p>
                    <p className="font-mono text-xs font-bold inline-flex items-center gap-1 mt-0.5">
                      <Calendar className="h-3 w-3 text-accent" /> {fmtDate(c.end, locale)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-background/50 border border-border px-3 py-2">
                    <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">{t("member.prize")}</p>
                    <p className="font-mono text-xs font-bold text-accent truncate mt-0.5">{c.prize}</p>
                  </div>
                </div>

                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-muted-foreground">{c.participants} {lang === "id" ? "member ikut" : "members participating"}</span>
                    <span className="text-accent">{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-gradient-gold" style={{ width: `${pct}%` }} />
                  </div>
                </div>

                <Button variant="gold" size="sm" className="w-full">
                  {t("member.joinChallenge")}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-center text-[11px] font-mono text-muted-foreground tracking-wider pt-4">
        POWERED BY SOLANA • MEMBERSHIP NFT v1.2.0
      </p>
    </div>
  );
};

export default MemberDashboard;
