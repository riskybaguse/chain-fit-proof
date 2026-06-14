import { useState } from "react";
import { Scale, Shield, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLang } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";

interface CalibrationModalProps {
  open: boolean;
}

export const CalibrationModal = ({ open }: CalibrationModalProps) => {
  const { t } = useLang();
  const { setBodyWeight, walletAddress } = useUser();
  const [weight, setWeight] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const kg = parseFloat(weight);
    if (!kg || kg < 30 || kg > 300) {
      toast.error(t("calibration.error.invalid"));
      return;
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setBodyWeight(kg);
    setSubmitting(false);
    toast.success(t("calibration.success"));
  };

  const shortAddr = walletAddress
    ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
    : "—";

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-md border-primary/40 bg-card shadow-glow-soft [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div
          className="absolute inset-0 rounded-lg pointer-events-none opacity-40"
          style={{
            background:
              "radial-gradient(circle at top, hsl(150 100% 50% / 0.12), transparent 60%)",
          }}
        />

        <div className="relative space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center shadow-glow-soft">
              <Scale className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-extrabold tracking-tight">
                {t("calibration.title")}
              </DialogTitle>
              <p className="text-xs font-mono text-primary mt-0.5">{shortAddr}</p>
            </div>
          </div>

          <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
            {t("calibration.desc")}
          </DialogDescription>

          <div className="flex items-start gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3">
            <Shield className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("calibration.privacy")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 block">
                {t("calibration.weightLabel")}
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  min={30}
                  max={300}
                  step={0.1}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="75"
                  className="font-mono text-lg bg-background border-border pr-12"
                  autoFocus
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground">
                  kg
                </span>
              </div>
            </div>

            <Button variant="hero" size="lg" className="w-full" type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("calibration.calibrating")}
                </>
              ) : (
                t("calibration.submit")
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
