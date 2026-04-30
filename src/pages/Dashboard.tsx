import { Link } from "react-router-dom";
import { Flame, Dumbbell, Zap, Trophy, ExternalLink, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NFTBadge } from "@/components/NFTBadge";
import { useLang } from "@/context/LanguageContext";

const recentWorkouts = [
  { date: "2026-04-27", type: "Push", duration: "62 min", exercises: 6, tx: "7xKm9pQrAv3Z" },
  { date: "2026-04-26", type: "Pull", duration: "58 min", exercises: 5, tx: "4hN2vBcL8mQs" },
  { date: "2026-04-25", type: "Leg",  duration: "71 min", exercises: 7, tx: "9aZ3kRpW1nDe" },
  { date: "2026-04-24", type: "Push", duration: "55 min", exercises: 6, tx: "2cF7xJtH5gYu" },
  { date: "2026-04-23", type: "Pull", duration: "60 min", exercises: 5, tx: "5dM1nKsP4vBz" },
  { date: "2026-04-22", type: "Leg",  duration: "68 min", exercises: 7, tx: "8eR6yLqA3wXc" },
  { date: "2026-04-21", type: "Push", duration: "63 min", exercises: 6, tx: "1bG4tWpN7uVk" },
];

const Dashboard = () => {
  const { t } = useLang();
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome */}
      <div className="rounded-2xl border border-border bg-card p-6 md:p-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-50"
          style={{ background: "radial-gradient(ellipse at top right, hsl(150 100% 50% / 0.1), transparent 60%)" }} />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {t("dashboard.welcome")}
            </h1>
            <p className="font-mono text-sm text-muted-foreground mt-2">
              7xKm9pQrAv3Z2BcF...12345 • Senin, 27 April 2026
            </p>
          </div>
          <Button asChild variant="hero">
            <Link to="/log">
              {t("dashboard.logToday")} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Flame} label={t("dashboard.currentStreak")} value="47" unit="Days" sub="Personal Best: 62 Days" accent="primary" />
        <StatCard icon={Dumbbell} label={t("dashboard.totalWorkouts")} value="134" sub="This month: 18" />
        <StatCard icon={Zap} label={t("dashboard.totalVolume")} value="48,230" unit="kg" sub="This week: 2,840 kg" />
        <StatCard icon={Trophy} label={t("dashboard.badgesEarned")} value="2" sub="Next: Silver (43 days away)" accent="gold" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Log */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold">{t("dashboard.quickLog.title")}</h2>
              <p className="text-sm text-muted-foreground font-mono mt-1">Mon, 27 April 2026</p>
            </div>
            <span className="chip-primary"><CheckCircle2 className="h-3 w-3" />On-Chain</span>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { emoji: "💪", name: "PUSH DAY", sub: "Chest • Shoulder • Tricep" },
              { emoji: "🦾", name: "PULL DAY", sub: "Back • Bicep" },
              { emoji: "🦵", name: "LEG DAY", sub: "Quad • Ham • Calves" },
            ].map((d) => (
              <Link
                key={d.name}
                to="/log"
                className="rounded-xl border border-border bg-background hover:border-primary/50 hover:shadow-glow-soft transition-all p-5 text-center group"
              >
                <div className="text-4xl mb-2">{d.emoji}</div>
                <div className="font-bold text-sm tracking-wider group-hover:text-primary transition-colors">{d.name}</div>
                <div className="text-[10px] font-mono text-muted-foreground mt-1 uppercase tracking-wider">{d.sub}</div>
              </Link>
            ))}
          </div>
          <Link to="/log" className="block mt-4 text-center text-sm text-primary hover:underline">
            {t("dashboard.quickLog.custom")}
          </Link>
        </div>

        {/* Progress to next badge */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-bold mb-1">{t("dashboard.progressSilver")}</h2>
          <p className="text-sm text-muted-foreground mb-5">{t("dashboard.progressSilverSub")}</p>
          <div className="flex justify-center mb-5">
            <NFTBadge tier="silver" size="lg" locked />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between font-mono text-xs">
              <span className="text-muted-foreground">47 / 90 DAYS</span>
              <span className="text-primary font-bold">52%</span>
            </div>
            <div className="h-3 rounded-full bg-secondary overflow-hidden border border-border">
              <div className="h-full bg-gradient-primary shadow-glow-soft transition-all" style={{ width: "52%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Workouts */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold">{t("dashboard.recentWorkouts")}</h2>
          <span className="text-xs font-mono text-muted-foreground">LAST 7 SESSIONS</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-background/40 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Type</th>
                <th className="text-left p-4">Duration</th>
                <th className="text-left p-4">Exercises</th>
                <th className="text-left p-4">TX Hash</th>
                <th className="text-left p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentWorkouts.map((w, i) => (
                <tr key={i} className="hover:bg-background/40 transition-colors">
                  <td className="p-4 font-mono text-xs">{w.date}</td>
                  <td className="p-4"><span className="chip-primary text-[10px]">{w.type.toUpperCase()}</span></td>
                  <td className="p-4 font-mono">{w.duration}</td>
                  <td className="p-4 font-mono">{w.exercises}</td>
                  <td className="p-4">
                    <a href="#" className="font-mono text-xs text-primary hover:underline inline-flex items-center gap-1">
                      {w.tx}...
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-xs text-primary">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Streak Calendar */}
      <StreakCalendar />
    </div>
  );
};

const StatCard = ({
  icon: Icon, label, value, unit, sub, accent,
}: {
  icon: typeof Flame; label: string; value: string; unit?: string; sub: string; accent?: "primary" | "gold";
}) => (
  <div className="rounded-2xl border border-border bg-card p-5 hover:border-primary/30 transition-colors">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{label}</span>
      <Icon className={`h-4 w-4 ${accent === "gold" ? "text-accent" : "text-primary"}`} />
    </div>
    <div className="flex items-baseline gap-1.5">
      <span className={`font-mono text-3xl md:text-4xl font-extrabold ${accent === "gold" ? "text-accent" : "text-foreground"}`}>{value}</span>
      {unit && <span className="text-sm text-muted-foreground font-mono">{unit}</span>}
    </div>
    <p className="text-xs text-muted-foreground mt-2">{sub}</p>
  </div>
);

const StreakCalendar = () => {
  const { t } = useLang();
  // April 2026 starts on Wednesday
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const workoutDays = new Set([1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22, 24, 25, 26, 27]);
  const today = 27;
  const offset = 2; // Wednesday

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold">{t("dashboard.calendar")}</h2>
          <p className="text-xs font-mono text-muted-foreground mt-1">APRIL 2026</p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-primary shadow-glow-soft" /> Workout</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-secondary border border-border" /> Rest</span>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
          <div key={d} className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground py-2">{d}</div>
        ))}
        {Array.from({ length: offset }).map((_, i) => <div key={`o${i}`} />)}
        {days.map((d) => {
          const isWorkout = workoutDays.has(d);
          const isToday = d === today;
          return (
            <div
              key={d}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center border transition-all ${
                isToday ? "border-primary shadow-glow-soft" : "border-border"
              } ${isWorkout ? "bg-primary/15" : "bg-background/40"}`}
            >
              <span className={`text-xs font-mono ${isWorkout ? "text-foreground" : "text-muted-foreground"}`}>{d}</span>
              {isWorkout && <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-glow-soft mt-1" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
