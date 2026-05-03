import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dumbbell, Link2, User, Building2, ArrowLeft, Check, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useLang } from "@/context/LanguageContext";
import { useRole } from "@/context/RoleContext";
import { useWallet } from "@solana/wallet-adapter-react";

const STORAGE_KEY = "gainchain.onboarding.v1";

type Persona = "solo" | "owner" | "member" | null;
type Step = 1 | 2;

const goals = ["Muscle Gain", "Fat Loss", "Endurance", "General Fitness"] as const;
const levels = ["Beginner", "Intermediate", "Advanced"] as const;
const programs = ["Push Pull Leg", "Full Body", "Custom"] as const;

export const OnboardingModal = () => {
  const { connected, disconnect } = useWallet();
  const { t, lang } = useLang();
  const { setRole } = useRole();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const [persona, setPersona] = useState<Persona>(null);

  // Solo state
  const [goal, setGoal] = useState<string>("Muscle Gain");
  const [level, setLevel] = useState<string>("Beginner");
  const [program, setProgram] = useState<string>("Push Pull Leg");

  // Owner state
  const [gymName, setGymName] = useState("");
  const [gymLocation, setGymLocation] = useState("");
  const [gymDesc, setGymDesc] = useState("");
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState("");

  const [inviteCode, setInviteCode] = useState("");

  // Fungsi satpam buat nyegat user yang iseng ngeklik silang
  const handleModalClose = async (newOpenState: boolean) => {
    // Kalau newOpenState false (artinya user nekan X atau klik area luar modal)
    if (!newOpenState) {
      const isDone = localStorage.getItem(STORAGE_KEY);

      // Kalau dia belum selesai onboarding (data di storage belum ada)
      if (!isDone) {
        await disconnect(); // Putusin paksa dompetnya!
        toast({
          title: lang === "id" ? "Login Dibatalkan" : "Login Cancelled",
          description: lang === "id" ? "Pilih role untuk masuk ke aplikasi." : "Choose a role to enter the app.",
          variant: "destructive"
        });
        // AppShell bakal otomatis nendang dia ke "/" karena status connected jadi false
      }
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY);
    
    // Fungsi khusus buat buka modal dengan ngecek tiket VIP
    const openVipRoute = () => {
      if (connected && !done) {
        const intent = sessionStorage.getItem("gainchain.intent");
        
        if (intent === "owner") {
          // JALUR VIP: Langsung lempar ke Step 2 form Owner
          setPersona("owner");
          setStep(2);
          sessionStorage.removeItem("gainchain.intent"); // Sobek tiketnya biar ga kepake dua kali
        } else {
          // JALUR NORMAL: Kalau ga ada tiket, mulai dari Step 1
          if (step !== 2) { // Jaga-jaga biar ga keriset kalo lagi di step 2
            setPersona(null);
            setStep(1);
          }
        }
        setOpen(true);
      }
    };

    // 1. Jalankan otomatis setiap kali dompet berubah status jadi connect
    openVipRoute();

    // 2. Pasang pendengar sinyal biar bisa dipaksa buka dari Landing Page
    window.addEventListener("vip-owner-trigger", openVipRoute);
    return () => window.removeEventListener("vip-owner-trigger", openVipRoute);
  }, [connected]); // Dependency tetep connected
  
  const choose = (p: Exclude<Persona, null>) => {
    setPersona(p);
    setStep(2);
  };

  const back = () => {
    setStep(1);
    setPersona(null);
  };

  const finishSolo = () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ persona: "solo", goal, level, program, at: Date.now() }),
    );
    toast({ title: lang === "id" ? "Profil athlete dibuat" : "Athlete profile created", description: `${goal} • ${level} • ${program}` });
    setRole("solo");
    setOpen(false);
    navigate("/dashboard");
  };

  const finishOwner = () => {
    if (!gymName.trim() || !gymLocation.trim() || !capacity || !price) {
      toast({ title: lang === "id" ? "Lengkapi data gym" : "Complete gym details", description: lang === "id" ? "Nama, lokasi, kapasitas & harga wajib diisi." : "Name, location, capacity, and price are required.", variant: "destructive" });
      return;
    }
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        persona: "owner",
        gymName: gymName.trim(),
        location: gymLocation.trim(),
        description: gymDesc.trim(),
        capacity: Number(capacity),
        price: Number(price),
        at: Date.now(),
      }),
    );
    toast({ title: lang === "id" ? "Gym terdaftar on-chain" : "Gym registered on-chain", description: lang === "id" ? `${gymName} siap menerima member.` : `${gymName} is ready to accept members.` });
    setRole("owner");
    setOpen(false);
    navigate("/owner");
  };

  const finishMember = () => {
    if (!inviteCode.trim()) {
      toast({ title: "Masukkan Kode", description: "Kode invite gym wajib diisi.", variant: "destructive" });
      return;
    }
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ persona: "member", inviteCode, at: Date.now() }),
    );
    toast({ title: "Berhasil Gabung", description: "Lo sekarang resmi jadi member on-chain." });

    setRole("member");
    setOpen(false);
    navigate("/member");
  };

  return (
    <Dialog open={open} onOpenChange={handleModalClose}>
      <DialogContent className="max-w-2xl border-border bg-card p-0 overflow-hidden flex flex-col max-h-[90dvh]">
        {/* Header bar */}
        <div className="relative px-6 pt-6 pb-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" />
            {t("onboarding.step")} {step} {t("onboarding.of")} 2
          </div>
        </div>

        {step === 1 && (
          <div className="px-6 pb-6 pt-4 space-y-6 animate-fade-in overflow-y-auto">
            {/* Illustration */}
            <div className="flex flex-col items-center text-center gap-4">
              <div className="relative h-20 w-20 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow-soft animate-pulse-glow">
                <Dumbbell className="h-9 w-9 text-primary-foreground" />
                <div className="absolute -bottom-2 -right-2 h-9 w-9 rounded-xl bg-card border border-primary/40 flex items-center justify-center">
                  <Link2 className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div>
                <DialogTitle className="text-3xl font-extrabold tracking-tight">
                  {t("onboarding.welcome")} <span className="text-gradient-primary">GainChain!</span>
                </DialogTitle>
                <DialogDescription className="mt-2 text-base text-muted-foreground">
                  {t("onboarding.chooseStart")}
                </DialogDescription>
              </div>
            </div>

            {/* Three option cards */}
            <div className="grid sm:grid-cols-3 gap-4">
              <button
                onClick={() => choose("solo")}
                className="group text-left rounded-xl border border-border bg-secondary/30 p-5 transition-all hover:border-primary hover:bg-primary/5 hover:shadow-glow-soft hover:-translate-y-0.5"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center mb-4 group-hover:bg-primary/25">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">{t("onboarding.solo.title")}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t("onboarding.solo.desc")}
                </p>
                <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  {t("onboarding.chooseThis")} →
                </div>
              </button>

              <button
                onClick={() => choose("owner")}
                className="group text-left rounded-xl border border-border bg-secondary/30 p-5 transition-all hover:border-owner hover:bg-owner/5 hover:shadow-glow-owner-soft hover:-translate-y-0.5"
              >
                <div className="h-12 w-12 rounded-lg bg-owner/15 border border-owner/30 flex items-center justify-center mb-4 group-hover:bg-owner/25">
                  <Building2 className="h-6 w-6 text-owner" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">{t("onboarding.owner.title")}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t("onboarding.owner.desc")}
                </p>
                <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-owner">
                  {t("onboarding.chooseThis")} →
                </div>
              </button>

              <button
                onClick={() => choose("member")}
                className="group text-left rounded-xl border border-border bg-secondary/30 p-5 transition-all hover:border-accent hover:bg-accent/5 hover:shadow-glow-soft hover:-translate-y-0.5"
              >
                <div className="h-12 w-12 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center mb-4 group-hover:bg-accent/25">
                  <User className="h-6 w-6 text-accent" /> {/* Jangan lupa import User dari lucide-react kalo belum */}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">Saya Member Gym</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Masuk pakai kode invite, dapatkan akses NFT membership.
                </p>
                <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-accent">
                  Pilih ini →
                </div>
              </button>
            </div>

            <p className="text-center text-[11px] font-mono text-muted-foreground">
              {t("onboarding.powered")}
            </p>
          </div>
        )}

        {step === 2 && persona === "solo" && (
          <div className="px-6 pb-6 pt-4 space-y-6 animate-fade-in overflow-y-auto">
            <div>
              <DialogTitle className="text-2xl font-extrabold">{t("onboarding.setupAthlete")}</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {t("onboarding.personalize")}
              </DialogDescription>
            </div>

            <ChipGroup label={t("onboarding.goal")} options={[...goals]} value={goal} onChange={setGoal} accent="primary" />
            <ChipGroup label={t("onboarding.level")} options={[...levels]} value={level} onChange={setLevel} accent="primary" />
            <ChipGroup label={t("onboarding.program")} options={[...programs]} value={program} onChange={setProgram} accent="primary" />

            <div className="flex items-center justify-between pt-2">
              <Button variant="ghost" onClick={back}>
                <ArrowLeft className="h-4 w-4" /> {t("onboarding.back")}
              </Button>
              <Button variant="hero" size="lg" onClick={finishSolo}>
                {t("onboarding.start")} <Check className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && persona === "owner" && (
          <div className="px-6 pb-6 pt-4 space-y-5 animate-fade-in overflow-y-auto">
            <div>
              <DialogTitle className="text-2xl font-extrabold">{t("onboarding.registerGym")}</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {t("onboarding.registerDesc")}
              </DialogDescription>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label={t("onboarding.gymName")}>
                <Input value={gymName} onChange={(e) => setGymName(e.target.value.slice(0, 60))} placeholder="Iron Temple Jakarta" />
              </Field>
              <Field label={t("onboarding.location")}>
                <Input value={gymLocation} onChange={(e) => setGymLocation(e.target.value.slice(0, 100))} placeholder="Jakarta, Indonesia" />
              </Field>
            </div>

            <Field label={t("onboarding.gymDesc")}>
              <Textarea
                value={gymDesc}
                onChange={(e) => setGymDesc(e.target.value.slice(0, 280))}
                placeholder={lang === "id" ? "Gym strength 24/7 dengan equipment lengkap & komunitas serius." : "24/7 strength gym with complete equipment and a serious community."}
                rows={3}
              />
              <div className="text-[10px] font-mono text-muted-foreground text-right mt-1">{gymDesc.length}/280</div>
            </Field>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label={t("onboarding.capacity")}>
                <Input type="number" min={1} max={10000} value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="200" />
              </Field>
              <Field label={t("onboarding.price")}>
                <Input type="number" min={0} step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="25" />
              </Field>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button variant="ghost" onClick={back}>
                <ArrowLeft className="h-4 w-4" /> {t("onboarding.back")}
              </Button>
              <Button variant="owner" size="lg" onClick={finishOwner}>
                {t("onboarding.register")} <Check className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        {step === 2 && persona === "member" && (
          <div className="px-6 pb-6 pt-4 space-y-6 animate-fade-in overflow-y-auto">
            <div>
              <DialogTitle className="text-2xl font-extrabold">Gabung ke Gym</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Masukkan kode invite dari Owner Gym buat dapetin akses membership lo.
              </DialogDescription>
            </div>

            <Field label="Gym Invite Code">
              <Input
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="Misal: IRON-7XKM"
              />
            </Field>

            <div className="flex items-center justify-between pt-2">
              <Button variant="ghost" onClick={back}>
                <ArrowLeft className="h-4 w-4" /> {t("onboarding.back")}
              </Button>
              <Button variant="hero" size="lg" onClick={finishMember} className="bg-accent text-accent-foreground hover:bg-accent/90">
                Gabung <Check className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{label}</Label>
    {children}
  </div>
);

const ChipGroup = ({
  label,
  options,
  value,
  onChange,
  accent,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  accent: "primary" | "owner";
}) => (
  <div className="space-y-2">
    <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{label}</Label>
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value === o;
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={cn(
              "px-4 py-2 rounded-lg border text-sm font-semibold transition-all",
              active
                ? accent === "primary"
                  ? "bg-primary/15 border-primary text-primary shadow-glow-soft"
                  : "bg-owner/15 border-owner text-owner shadow-glow-owner-soft"
                : "bg-secondary/40 border-border text-muted-foreground hover:text-foreground hover:border-foreground/30",
            )}
          >
            {o}
          </button>
        );
      })}
    </div>
  </div>
);
