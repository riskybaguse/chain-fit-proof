import { Link } from "react-router-dom";
import { Flame, Dumbbell, Zap, Trophy, ExternalLink, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NFTBadge } from "@/components/NFTBadge";
import { useLang } from "@/context/LanguageContext";
import { useWorkout } from "@/context/WorkoutContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";

const Dashboard = () => {
  const { t } = useLang();
  const { workouts, streak, totalWorkouts, totalVolume } = useWorkout();

  // BIKIN TANGGAL HARI INI JADI DINAMIS
  const today = new Date();
  const dateFormatted = today.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const dateShort = today.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // LOGIKA PENGHITUNG BADGE OTOMATIS BERDASARKAN STREAK
  let badgesEarned = 0;
  if (streak >= 30) badgesEarned++;
  if (streak >= 90) badgesEarned++;
  if (streak >= 180) badgesEarned++;
  if (streak >= 365) badgesEarned++;

  let nextBadgeDays = 30 - streak;
  let nextBadgeName = "Bronze";
  if (streak >= 30) { nextBadgeDays = 90 - streak; nextBadgeName = "Silver"; }
  if (streak >= 90) { nextBadgeDays = 180 - streak; nextBadgeName = "Gold"; }
  if (streak >= 180) { nextBadgeDays = 365 - streak; nextBadgeName = "Diamond"; }

  // LOGIKA PENGHITUNG WORKOUT BULAN INI
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const workoutsThisMonth = workouts.filter((w) => {
    if (!w || !w.date) return false;
    const wDate = new Date(w.date);
    return wDate.getMonth() === currentMonth && wDate.getFullYear() === currentYear;
  }).length;

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
              7xKm9pQrAv3Z2BcF...12345 • {dateFormatted}
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
        <StatCard icon={Flame} label={t("dashboard.currentStreak")} value={streak.toString()} unit="Days" sub={`Personal Best: ${Math.max(streak, 62)} Days`} accent="primary" />
        <StatCard icon={Dumbbell} label={t("dashboard.totalWorkouts")} value={totalWorkouts.toString()} sub={`This month: ${workoutsThisMonth}`} />
        {/* Catatan Asdos: totalVolume masih dari Context, biarin aja dulu buat MVP */}
        <StatCard icon={Zap} label={t("dashboard.totalVolume")} value={totalVolume} unit="kg" sub="Tracking actively" />
        <StatCard icon={Trophy} label={t("dashboard.badgesEarned")} value={badgesEarned.toString()} sub={nextBadgeDays > 0 ? `Next: ${nextBadgeName} (${nextBadgeDays} days away)` : "Max Level Reached!"} accent="gold" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Log */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold">{t("dashboard.quickLog.title")}</h2>
              <p className="text-sm text-muted-foreground font-mono mt-1">{dateShort}</p>
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
          <p className="text-sm text-muted-foreground mb-5">
            {90 - streak > 0 ? `${90 - streak} hari lagi untuk Silver Badge!` : "Silver Badge Achieved!"}
          </p>
          <div className="flex justify-center mb-5">
            <NFTBadge tier="silver" size="lg" locked={streak < 90} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between font-mono text-xs">
              <span className="text-muted-foreground">{streak} / 90 DAYS</span>
              <span className="text-primary font-bold">
                {Math.min(Math.round((streak / 90) * 100), 100)}%
              </span>
            </div>
            <div className="h-3 rounded-full bg-secondary overflow-hidden border border-border">
              <div 
                className="h-full bg-gradient-primary shadow-glow-soft transition-all duration-1000" 
                style={{ width: `${Math.min((streak / 90) * 100, 100)}%` }} 
              />
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
            {workouts.slice(0, 7).map((w, i) => (
                <tr key={i} className="hover:bg-background/40 transition-colors">
                  <td className="p-4 font-mono text-xs">{w.date}</td>
                  <td className="p-4"><span className="chip-primary text-[10px]">{w.type.toUpperCase()}</span></td>
                  <td className="p-4 font-mono">{w.duration} min</td>
                  <td className="p-4 font-mono">{w.exercises.length}</td>
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
  // Antisipasi kalau context telat nge-load
  const workoutContext = useWorkout();
  const workouts = workoutContext?.workouts || [];

  // SABUK PENGAMAN 1: Pake fungsi di dalem useState biar nilainya dikunci kuat-kuat
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());

  // SABUK PENGAMAN 2: Validasi ganda biar currentDate ga pernah undefined
  const safeDate = (currentDate instanceof Date && !isNaN(currentDate.getTime())) 
    ? currentDate 
    : new Date();

  const year = safeDate.getFullYear();
  const month = safeDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Bikin nama bulan manual biar aman di semua browser
  const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
  const monthName = `${monthNames[month]} ${year}`;

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // SABUK PENGAMAN 3: Bungkus filter pake useMemo dan try-catch
  const workoutDays = useMemo(() => {
    if (!Array.isArray(workouts)) return new Set();

    return new Set(
      workouts
        .filter((w) => {
          if (!w || !w.date) return false; // Tendang kalo datanya cacat
          try {
            const wDate = new Date(w.date);
            // Kalo tangganya ga valid, isNaN bakal nangkep dan nendang datanya
            if (!(wDate instanceof Date) || isNaN(wDate.getTime())) return false;
            return wDate.getMonth() === month && wDate.getFullYear() === year;
          } catch (err) {
            return false;
          }
        })
        .map((w) => {
          try {
            return parseInt(w.date.split("-")[2], 10);
          } catch (err) {
            return 0;
          }
        })
    );
  }, [workouts, month, year]);

  // SABUK PENGAMAN 4: Validasi realToday
  const realToday = new Date();
  const safeToday = (realToday instanceof Date && !isNaN(realToday.getTime())) 
    ? realToday 
    : new Date();

  const isCurrentMonth = safeToday.getMonth() === month && safeToday.getFullYear() === year;
  const todayDate = safeToday.getDate();

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-4">
        <div>
          <h2 className="text-xl font-bold">{t("dashboard.calendar") || "Streak Calendar"}</h2>
          <div className="flex items-center gap-2 mt-1">
            <button onClick={prevMonth} className="p-1 rounded-md hover:bg-secondary text-muted-foreground transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <p className="text-xs font-mono text-muted-foreground font-bold w-24 text-center">
              {monthName}
            </p>
            <button onClick={nextMonth} className="p-1 rounded-md hover:bg-secondary text-muted-foreground transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
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
        
        {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
        
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
          const isWorkout = workoutDays.has(d);
          const isToday = isCurrentMonth && d === todayDate;
          
          return (
            <div
              key={d}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center border transition-all ${
                isToday ? "border-primary shadow-glow-soft ring-1 ring-primary/50" : "border-border"
              } ${isWorkout ? "bg-primary/15" : "bg-background/40 hover:bg-secondary/50"}`}
            >
              <span className={`text-xs font-mono ${isWorkout ? "text-foreground font-bold" : "text-muted-foreground"}`}>{d}</span>
              {isWorkout && <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-glow-soft mt-1" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
