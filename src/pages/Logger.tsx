import { useState } from "react";
import { Plus, Trash2, CheckCircle2, Loader2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useLang } from "@/context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useWorkout } from "@/context/WorkoutContext";

type WorkoutType = "PUSH" | "PULL" | "LEG" | "CUSTOM";

interface Exercise { id: number; name: string; sets: string; reps: string; weight: string }

const types: { key: WorkoutType; emoji: string; label: string }[] = [
  { key: "PUSH", emoji: "💪", label: "Push" },
  { key: "PULL", emoji: "🦾", label: "Pull" },
  { key: "LEG", emoji: "🦵", label: "Leg" },
  { key: "CUSTOM", emoji: "⚙️", label: "Custom" },
];

const Logger = () => {
  const { t } = useLang();
  const navigate = useNavigate();
  const { addWorkout, workouts } = useWorkout(); // narik fitur
  const [type, setType] = useState<WorkoutType>("PUSH");
  const [customName, setCustomName] = useState("");
  const [date] = useState(new Date().toISOString().slice(0, 10));
  const [exercises, setExercises] = useState<Exercise[]>([
    { id: 1, name: "Bench Press", sets: "4", reps: "8", weight: "80" },
  ]);
  const [duration, setDuration] = useState("60");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState<"ALL" | WorkoutType>("ALL");

  const addExercise = () => setExercises((arr) => [...arr, { id: Date.now(), name: "", sets: "", reps: "", weight: "" }]);
  const remove = (id: number) => setExercises((arr) => arr.filter((e) => e.id !== id));
  const update = (id: number, k: keyof Exercise, v: string) =>
    setExercises((arr) => arr.map((e) => (e.id === id ? { ...e, [k]: v } : e)));

  const submit = async () => {
    // Validasi kecil biar ga submit kosong
    if (exercises.length === 0 || exercises[0].name === "") {
      toast.error("Masukin minimal 1 latihan dong bre!");
      return;
    }

    const finalType = type === "CUSTOM"
      ? (customName.trim() === "" ? "CUSTOM" : customName.trim().toUpperCase())
      : type;

    setSubmitting(true);

    // Simulasi loading Solana
    await new Promise((r) => setTimeout(r, 2000));

    // Tembak ke Otak (Context)
    addWorkout({
      date,
      type: finalType,
      duration,
      exercises,
    });

    setSubmitting(false);
    toast.success("✅ Workout saved on Solana!");

    // Optional: Lempar balik ke dashboard biar dia liat streak-nya nambah
    setTimeout(() => navigate("/dashboard"), 1500);
  };

  const filtered = workouts.filter((h) => filter === "ALL" || h.type === filter);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{t("logger.title")}</h1>
        <p className="text-muted-foreground mt-2">{t("logger.subtitle")}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 space-y-6">
          {/* Date + Type */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 block">{t("logger.date")}</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={date}
                  disabled
                  className="pl-9 font-mono bg-secondary/50 border-border opacity-70 cursor-not-allowed"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 block">{t("logger.duration")}</Label>
              <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="font-mono bg-background border-border" />
            </div>
          </div>

          <div>
            <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 block">{t("logger.type")}</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {types.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setType(t.key)}
                  className={cn(
                    "rounded-xl border p-4 text-center transition-all",
                    type === t.key
                      ? "border-primary bg-primary/10 shadow-glow-soft text-primary"
                      : "border-border bg-background hover:border-primary/40",
                  )}
                >
                  <div className="text-2xl mb-1">{t.emoji}</div>
                  <div className="text-xs font-bold tracking-wider">{t.label}</div>
                </button>
              ))}
            </div>
            {type === "CUSTOM" && (
              <div className="mt-4 animate-fade-in">
                <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 block">
                  Judul Latihan Custom
                </Label>
                <Input
                  placeholder="Contoh: CROSSFIT, FULL BODY, MUAY THAI..."
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="bg-background border-border font-mono"
                  maxLength={15} // Balesan asdos: batesin 15 huruf aja biar UI lu kaga jebol
                />
              </div>
            )}
          </div>

          {/* Exercises */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{t("logger.exercises")}</Label>
              <Button variant="outline" size="sm" onClick={addExercise}>
                <Plus className="h-3.5 w-3.5" />
                {t("logger.addExercise")}
              </Button>
            </div>
            <div className="space-y-2">
              {exercises.map((ex, i) => (
                <div key={ex.id} className="grid grid-cols-12 gap-2 items-center rounded-xl border border-border bg-background p-3">
                  <div className="col-span-12 sm:col-span-5">
                    <Input placeholder={`Exercise ${i + 1}`} value={ex.name} onChange={(e) => update(ex.id, "name", e.target.value)} className="bg-card border-border" />
                  </div>
                  <Input placeholder="Sets" type="number" value={ex.sets} onChange={(e) => update(ex.id, "sets", e.target.value)} className="col-span-4 sm:col-span-2 bg-card border-border font-mono" />
                  <Input placeholder="Reps" type="number" value={ex.reps} onChange={(e) => update(ex.id, "reps", e.target.value)} className="col-span-4 sm:col-span-2 bg-card border-border font-mono" />
                  <Input placeholder="kg" type="number" value={ex.weight} onChange={(e) => update(ex.id, "weight", e.target.value)} className="col-span-3 sm:col-span-2 bg-card border-border font-mono" />
                  <button onClick={() => remove(ex.id)} className="col-span-1 h-9 w-9 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 block">{t("logger.notes")}</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t("logger.notesPlaceholder")} className="bg-background border-border" rows={3} />
          </div>

          <Button variant="hero" size="xl" className="w-full" onClick={submit} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {t("logger.confirming")}
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5" />
                {t("logger.save")}
              </>
            )}
          </Button>
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-primary/30 bg-card p-5 shadow-glow-soft">
            <h3 className="font-bold mb-3 text-sm">On-Chain Submission</h3>
            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">NETWORK</span><span className="text-primary">SOLANA MAINNET</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">EST. FEE</span><span>~0.00012 SOL</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">CONFIRMATION</span><span>~2 sec</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">PERMANENT</span><span className="text-primary">YES ✓</span></div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-bold mb-2 text-sm">💡 {t("logger.tips")}</h3>
            <ul className="text-xs text-muted-foreground space-y-2 leading-relaxed">
              <li>• Be honest — every entry is permanent.</li>
              <li>• Log right after gym for accurate data.</li>
              <li>• Track weights consistently to monitor PRs.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* History */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-xl font-bold">{t("logger.history")}</h2>
          <div className="flex gap-1 bg-background rounded-lg p-1 border border-border">
            {(["ALL", "PUSH", "PULL", "LEG"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-mono tracking-wider transition-colors",
                  filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="p-4 grid gap-3">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground font-mono">
              Belum ada data latihan.
            </div>
          ) : (
            filtered.map((w, i) => {
              const typeData = types.find(t => t.key === w.type);

              // Kalo kosong, kasih teks default "Pending..."
              const validTx = w.txHash || "Pending...";

              // Potong txHash cuma kalo panjangnya lebih dari 8 karakter
              const displayTx = validTx.length > 8
                ? `${validTx.slice(0, 4)}...${validTx.slice(-4)}`
                : validTx;

              // Jaga-jaga kalo exercises-nya kosong
              const exerciseList = w.exercises && w.exercises.length > 0
                ? w.exercises.map(e => e.name).join(", ")
                : "Tidak ada data gerakan";

              return (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-xl border border-border bg-background hover:border-primary/40 hover:shadow-glow-soft transition-all group"
                >
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className="h-12 w-12 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-2xl border border-primary/20">
                      {typeData?.emoji || "🏋️"}
                    </div>

                    <div className="truncate">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm tracking-wider">{w.type}</span>
                        <span className="text-[10px] font-mono text-muted-foreground px-2 py-0.5 rounded-full bg-secondary">
                          {w.date}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate w-[150px] sm:w-[300px]">
                        {exerciseList}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <a href="#" className="text-xs font-mono text-primary hover:underline flex items-center justify-end gap-1 mb-1">
                      {displayTx} <CheckCircle2 className="h-3 w-3" />
                    </a>
                    <div className="text-[10px] font-mono text-muted-foreground">
                      {w.duration} MIN • {w.exercises?.length || 0} EXS
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Logger;