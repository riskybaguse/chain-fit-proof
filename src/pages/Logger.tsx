import { useState } from "react";
import { Plus, Trash2, CheckCircle2, Loader2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useLang } from "@/context/LanguageContext";

type WorkoutType = "PUSH" | "PULL" | "LEG" | "CUSTOM";

interface Exercise { id: number; name: string; sets: string; reps: string; weight: string }

const types: { key: WorkoutType; emoji: string; label: string }[] = [
  { key: "PUSH", emoji: "💪", label: "Push" },
  { key: "PULL", emoji: "🦾", label: "Pull" },
  { key: "LEG", emoji: "🦵", label: "Leg" },
  { key: "CUSTOM", emoji: "⚙️", label: "Custom" },
];

const history = [
  { date: "2026-04-26", type: "PULL", duration: 58, exercises: ["Pull Up 4×8", "Barbell Row 4×10 @70kg", "Lat Pulldown 3×12 @55kg", "Bicep Curl 3×12 @14kg", "Hammer Curl 3×12 @12kg"], tx: "4hN2vBcL8mQs" },
  { date: "2026-04-25", type: "LEG",  duration: 71, exercises: ["Squat 5×5 @100kg", "Romanian DL 4×8 @80kg", "Leg Press 4×10 @180kg", "Leg Curl 3×12 @45kg", "Calf Raise 4×15 @60kg"], tx: "9aZ3kRpW1nDe" },
  { date: "2026-04-24", type: "PUSH", duration: 55, exercises: ["Bench Press 4×8 @80kg", "OHP 4×8 @45kg", "Incline DB 3×10 @22kg", "Lateral Raise 3×15 @8kg", "Tricep Pushdown 3×12 @30kg"], tx: "2cF7xJtH5gYu" },
];

const Logger = () => {
  const { t } = useLang();
  const [type, setType] = useState<WorkoutType>("PUSH");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
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
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 2000));
    setSubmitting(false);
    toast.success("✅ Workout saved on Solana!", {
      description: `TX: 7xKm9pQrAv3Z...${Math.random().toString(36).slice(2, 6)}`,
    });
  };

  const filtered = history.filter((h) => filter === "ALL" || h.type === filter);

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
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="pl-9 font-mono bg-background border-border" />
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
        <div className="divide-y divide-border">
          {filtered.map((w, i) => (
            <details key={i} className="group">
              <summary className="cursor-pointer p-5 flex items-center justify-between hover:bg-background/40 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="chip-primary text-[10px]">{w.type}</span>
                  <span className="font-mono text-sm">{w.date}</span>
                  <span className="font-mono text-xs text-muted-foreground hidden sm:inline">{w.duration} min • {w.exercises.length} exercises</span>
                </div>
                <span className="font-mono text-xs text-primary">{w.tx}...</span>
              </summary>
              <div className="px-5 pb-5 grid gap-2">
                {w.exercises.map((ex, j) => (
                  <div key={j} className="flex items-center gap-3 px-4 py-2 rounded-md bg-background border border-border font-mono text-xs">
                    <span className="text-primary">●</span>
                    <span>{ex}</span>
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Logger;
