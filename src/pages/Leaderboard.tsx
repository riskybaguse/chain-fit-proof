import { useState, useMemo } from "react";
import { Crown, Trophy, Medal, Flame, Dumbbell, Zap, UserCircle2 } from "lucide-react";
import { NFTBadge, BadgeTier } from "@/components/NFTBadge";
import { cn } from "@/lib/utils";
import { useLang } from "@/context/LanguageContext";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWorkout } from "@/context/WorkoutContext";

interface Athlete {
  rank: number;
  addr: string;
  tier: BadgeTier | "none";
  streak: number;
  workouts: number;
  volume: number;
  isMe?: boolean;
}

// DUMMY DATA :
const mockAthletes = [
  { addr: "0x9F8e...1A2b", streak: 385, workouts: 412, volume: 184230 }, // Suhu 1
  { addr: "0x4D2c...8F9a", streak: 365, workouts: 390, volume: 156890 }, // Suhu 2
  { addr: "0xB7e1...3C4d", streak: 213, workouts: 102, volume: 55450 },
  { addr: "0x1A2b...9F4c", streak: 93, workouts: 78, volume: 45230 },
  { addr: "0x6E5f...2D1c", streak: 45, workouts: 55, volume: 38340 },
  { addr: "0x8E5d...2A1b", streak: 30, workouts: 35, volume: 22210 },
  { addr: "0xC3a4...5B6e", streak: 21, workouts: 24, volume: 15920 },
  { addr: "0x2F1e...7A8b", streak: 14, workouts: 15, volume: 10760 },
  { addr: "0x3F9c...7E2a", streak: 7, workouts: 7, volume: 5180 },
  { addr: "0x5D4e...3F2a", streak: 3, workouts: 4, volume: 2230 },
];

// Mesin Penentu Tier NFT
const getTier = (s: number): BadgeTier | "none" => {
  if (s >= 365) return "diamond";
  if (s >= 180) return "gold";
  if (s >= 90) return "silver";
  if (s >= 30) return "bronze";
  return "none";
};

const Leaderboard = () => {
  const { t } = useLang();
  
  // 1. Tarik Data Real dari Lo (Developer)
  const { publicKey } = useWallet();
  const { streak: actualStreak, workouts: myWorkoutsArray } = useWorkout(); 

  const [time, setTime] = useState<"WEEKLY" | "MONTHLY" | "ALL">("ALL");
  const [cat, setCat] = useState<"STREAK" | "VOLUME" | "WORKOUTS">("STREAK");

  const handleTimeChange = (newTime: "WEEKLY" | "MONTHLY" | "ALL") => setTime(newTime);
  const handleCatChange = (newCat: "STREAK" | "VOLUME" | "WORKOUTS") => setCat(newCat);

  // 2. Olah Data Klasemen secara Dinamis
  const leaderboardData = useMemo(() => {
    const myAddr = publicKey ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}` : "You (Guest)";
    
    // --- 1. LOGIKA DATA ASLI LO (Tarik mundur dari hari ini) ---
    const now = new Date();
    const timeLimit = new Date();
    // Reset jam ke 00:00:00 biar akurat hitung harinya
    now.setHours(0, 0, 0, 0); 
    
    if (time === "WEEKLY") timeLimit.setDate(now.getDate() - 7);
    if (time === "MONTHLY") timeLimit.setDate(now.getDate() - 30);

    let myCalculatedWorkouts = 0;
    let myCalculatedVolume = 0;

    // Filter history beneran cuma yang masuk di rentang waktu
    const filteredMyWorkouts = time === "ALL" 
      ? myWorkoutsArray 
      : myWorkoutsArray.filter(w => new Date(w.date) >= timeLimit);

    myCalculatedWorkouts = filteredMyWorkouts.length;
    
    filteredMyWorkouts.forEach(w => {
      if (w.exercises && Array.isArray(w.exercises)) {
        w.exercises.forEach(ex => {
          myCalculatedVolume += (parseInt(ex.sets) || 0) * (parseInt(ex.reps) || 0) * (parseFloat(ex.weight) || 0);
        });
      }
    });

    // Batasin streak biar logis. Kalau ALL ya asli. Kalau WEEKLY, max streak lo ya 7 hari berturut-turut di minggu itu.
    const myCappedStreak = time === "WEEKLY" ? Math.min(actualStreak, 7) : time === "MONTHLY" ? Math.min(actualStreak, 30) : actualStreak;

    const me = {
      addr: myAddr,
      streak: myCappedStreak,
      workouts: myCalculatedWorkouts,
      volume: myCalculatedVolume,
      isMe: true,
    };

    // --- 2. LOGIKA DATA DUMMY (Simulasi Live Berdasarkan Variasi Matematika) ---
    const scaledMocks = mockAthletes.map((m, i) => {
      // Hitung rata-rata volume per latihan dari data All-Time mereka
      const avgVol = m.workouts > 0 ? m.volume / m.workouts : 0;

      if (time === "WEEKLY") {
        // Kita bikin seolah-olah minggu ini mereka mainnya beda-beda (ada yang libur, ada yang full)
        const wStreak = Math.min(m.streak, 7 - (i % 3)); // Ngasilin variasi streak 7, 6, 5, 7, 6...
        const wWorkouts = Math.min(m.workouts, wStreak + (i % 2)); // Workouts dikit di atas streak
        const wVolume = Math.round(wWorkouts * avgVol);
        return { ...m, streak: wStreak, workouts: wWorkouts, volume: wVolume };
      }
      if (time === "MONTHLY") {
        // Sama, untuk 30 hari ke belakang
        const mStreak = Math.min(m.streak, 30 - (i % 5)); 
        const mWorkouts = Math.min(m.workouts, mStreak + (i % 4));
        const mVolume = Math.round(mWorkouts * avgVol);
        return { ...m, streak: mStreak, workouts: mWorkouts, volume: mVolume };
      }
      return m; 
    });

    // --- 3. LOGIKA SORTING (Diadu!) ---
    let combined = [...scaledMocks, me];
    
    combined.sort((a, b) => {
      if (cat === "VOLUME") return b.volume - a.volume;
      if (cat === "WORKOUTS") return b.workouts - a.workouts; // <--- TAMBAHIN INI!
      return b.streak - a.streak; // Default Streak
    });

    const finalData: Athlete[] = combined.map((athlete, index) => ({
      ...athlete,
      rank: index + 1,
      tier: getTier(athlete.streak)
    }));

    const myRankIndex = finalData.findIndex(a => a.isMe);
    
    return {
      top3: finalData.slice(0, 3),
      rest: finalData.slice(3, 10),
      myData: finalData[myRankIndex]
    };
  }, [publicKey, actualStreak, myWorkoutsArray, time, cat]);

  const { top3, rest, myData } = leaderboardData;

  return (
    <div className="space-y-10 animate-fade-in">
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{t("leaderboard.title")}</h1>
        <p className="text-muted-foreground mt-2">{t("leaderboard.subtitle")}</p>
      </div>

      {/* HIGHLIGHT: POSISI LO (Your Position) */}
      <div className="rounded-xl border border-primary/40 bg-primary/5 p-4 flex items-center justify-between shadow-glow-soft">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-background border border-primary/30 flex items-center justify-center font-mono font-extrabold text-xl">
            #{myData?.rank || "-"}
          </div>
          <div>
            <div className="font-bold font-mono text-sm inline-flex items-center gap-2">
              {myData?.addr} <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded uppercase">You</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1 flex gap-3 font-mono">
              <span className="inline-flex items-center gap-1"><Flame className="h-3 w-3 text-primary"/> {myData?.streak}</span>
              <span className="inline-flex items-center gap-1"><Dumbbell className="h-3 w-3 text-muted-foreground"/> {myData?.workouts}</span>
            </div>
          </div>
        </div>
        <div className="hidden sm:block">
          {myData?.tier !== "none" && <NFTBadge tier={myData?.tier as BadgeTier} size="sm" />}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <FilterGroup<"WEEKLY" | "MONTHLY" | "ALL"> label={t("leaderboard.timeframe")} options={["WEEKLY", "MONTHLY", "ALL"]} value={time} onChange={handleTimeChange} />
        <FilterGroup<"STREAK" | "VOLUME" | "WORKOUTS"> label={t("leaderboard.category")} options={["STREAK", "VOLUME", "WORKOUTS"]} value={cat} onChange={handleCatChange} />
      </div>
      
      {/* Podium */}
      <div className="rounded-2xl border border-border bg-card p-6 md:p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, hsl(150 100% 50% / 0.08), transparent 70%)" }} />
        <div className="relative grid grid-cols-3 gap-4 items-end max-w-3xl mx-auto">
          {top3[1] && <PodiumCard athlete={top3[1]} place={2} height="h-32 md:h-40" icon={Medal} color="text-[hsl(0_0%_80%)]" cat={cat} />}
          {top3[0] && <PodiumCard athlete={top3[0]} place={1} height="h-44 md:h-56" icon={Crown} color="text-accent" highlight cat={cat} />}
          {top3[2] && <PodiumCard athlete={top3[2]} place={3} height="h-24 md:h-32" icon={Trophy} color="text-[hsl(28_70%_60%)]" cat={cat} />}
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
                <th className="text-center p-4">{t("leaderboard.badge")}</th>
                
                {/* Kolom Utama */}
                <th className="text-right p-4 text-primary">
                  {cat === "VOLUME" ? "Volume" : cat === "WORKOUTS" ? t("leaderboard.workouts") : t("leaderboard.streak")}
                </th>
                
                {/* Kolom Cadangan 1 */}
                <th className="text-right p-4 hidden md:table-cell">
                  {cat === "STREAK" ? "Volume" : t("leaderboard.streak")}
                </th>
                
                {/* Kolom Cadangan 2 */}
                <th className="text-right p-4 hidden md:table-cell">
                  {cat === "WORKOUTS" ? "Volume" : t("leaderboard.workouts")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rest.map((a) => (
                <tr key={a.addr} className={cn("transition-colors", a.isMe ? "bg-primary/10 border-l-2 border-l-primary" : "hover:bg-background/40")}>
                  <td className={cn("p-4 font-mono font-bold", a.isMe ? "text-primary" : "text-muted-foreground")}>#{a.rank}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("h-8 w-8 rounded-full flex items-center justify-center font-mono text-[10px] font-bold", a.isMe ? "bg-primary text-primary-foreground shadow-glow-soft" : "bg-gradient-primary text-primary-foreground")}>
                        {a.isMe ? "YOU" : a.addr.slice(2, 4).toUpperCase()}
                      </div>
                      <span className={cn("font-mono text-xs", a.isMe && "text-primary font-bold")}>{a.addr}</span>
                    </div>
                  </td>
                  <td className="p-4 flex justify-center">
                    {a.tier !== "none" ? <NFTBadge tier={a.tier as BadgeTier} size="sm" animated={false} /> : <span className="text-muted-foreground">-</span>}
                  </td>
                  
                  {/* Body Kolom Utama */}
                  <td className="p-4 text-right">
                    <span className="font-mono font-bold text-primary inline-flex items-center gap-1">
                      {cat === "VOLUME" ? (
                        <><Dumbbell className="h-3.5 w-3.5" /> {a.volume.toLocaleString()} <span className="text-[10px]">kg</span></>
                      ) : cat === "WORKOUTS" ? (
                        <><Zap className="h-3.5 w-3.5" /> {a.workouts} <span className="text-[10px]">x</span></>
                      ) : (
                        <><Flame className="h-3.5 w-3.5" /> {a.streak}</>
                      )}
                    </span>
                  </td>
                  
                  {/* Body Kolom Cadangan 1 */}
                  <td className="p-4 text-right font-mono hidden md:table-cell text-muted-foreground">
                    {cat === "STREAK" ? (
                      <>{a.volume.toLocaleString()} <span className="text-[10px]">kg</span></>
                    ) : (
                      <>{a.streak} <span className="text-[10px]">days</span></>
                    )}
                  </td>
                  
                  {/* Body Kolom Cadangan 2 */}
                  <td className="p-4 text-right font-mono hidden md:table-cell text-muted-foreground">
                    {cat === "WORKOUTS" ? (
                       <>{a.volume.toLocaleString()} <span className="text-[10px]">kg</span></>
                    ) : (
                       <>{a.workouts} <span className="text-[10px]">x</span></>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ... FilterGroup
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

// ... PodiumCard...
const PodiumCard = ({
  athlete, place, height, icon: Icon, color, highlight, cat // <--- Tambahin 'cat' di sini
}: {
  athlete: Athlete; place: number; height: string; icon: typeof Crown; color: string; highlight?: boolean; cat: string;
}) => (
  <div className={cn("flex flex-col items-center relative", athlete.isMe && "z-10")}>
    {athlete.isMe && <div className="absolute -top-10 text-[10px] font-bold bg-primary text-primary-foreground px-2 py-1 rounded animate-bounce">YOU</div>}
    
    <Icon className={cn("h-7 w-7 mb-3 relative z-20", color, highlight && "drop-shadow-[0_0_8px_currentColor]")} />
    
    <div className="min-h-[5rem] flex items-center justify-center relative z-20">
      {athlete.tier !== "none" ? (
        <NFTBadge tier={athlete.tier as BadgeTier} size={highlight ? "lg" : "md"} />
      ) : (
        <UserCircle2 className="h-12 w-12 text-muted-foreground/30"/>
      )}
    </div>

    <div className="text-center mt-3 relative z-20">
      <div className={cn("font-mono text-xs font-bold", athlete.isMe ? "text-primary" : "text-foreground")}>{athlete.addr}</div>
      
      {/* TWEAK: Teks bunglon 3 wujud (Volume, Workouts, Streak) */}
      <div className="font-mono text-xs text-primary mt-1 inline-flex items-center gap-1">
        {cat === "VOLUME" ? (
          <><Dumbbell className="h-3 w-3" /> {athlete.volume.toLocaleString()} kg</>
        ) : cat === "WORKOUTS" ? (
          <><Zap className="h-3 w-3" /> {athlete.workouts} sessions</>
        ) : (
          <><Flame className="h-3 w-3" /> {athlete.streak} days</>
        )}
      </div>
    </div>

    <div
      className={cn(
        "w-full rounded-t-xl border border-b-0 flex items-center justify-center transition-all relative z-10 mt-4",
        height,
        highlight ? "border-primary/40 bg-primary/10 shadow-glow-soft" : "border-border bg-background/50",
        athlete.isMe && "border-primary shadow-glow bg-primary/20"
      )}
    >
      <span className={cn("font-mono text-4xl md:text-6xl font-extrabold", color)}>#{place}</span>
    </div>
  </div>
);

export default Leaderboard;