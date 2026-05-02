import { useNavigate } from "react-router-dom";
import { User, Building2, CreditCard, Lock } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useRole, type Role } from "@/context/RoleContext";
import { useLang } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

export const RoleSelectModal = ({ open, onOpenChange }: Props) => {
  const navigate = useNavigate();
  const { setRole } = useRole();
  const { t } = useLang();

  const choose = (r: Role, path: string, isLocked: boolean) => {
    if (isLocked) return; // kalo dikunci tombol ga aktif
    setRole(r);
    onOpenChange(false);
    navigate(path);
  };

  const options: Array<{
    role: Role;
    path: string;
    icon: typeof User;
    titleKey: "role.solo.title" | "role.owner.title" | "role.member.title";
    descKey: "role.solo.desc" | "role.owner.desc" | "role.member.desc";
    accent: "primary" | "owner" | "accent";
    isLocked?: boolean;
  }> = [
      { role: "solo", path: "/dashboard", icon: User, titleKey: "role.solo.title", descKey: "role.solo.desc", accent: "primary", isLocked: false },
      { role: "owner", path: "/owner", icon: Building2, titleKey: "role.owner.title", descKey: "role.owner.desc", accent: "owner", isLocked: true },
      { role: "member", path: "/member", icon: CreditCard, titleKey: "role.member.title", descKey: "role.member.desc", accent: "accent", isLocked: true },
    ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl border-border bg-card">
        <div className="space-y-2 text-center">
          <DialogTitle className="text-3xl font-extrabold tracking-tight">{t("role.title")}</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">{t("role.subtitle")}</DialogDescription>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 pt-4">
          {options.map((o) => (
            <button
              key={o.role}
              onClick={() => choose(o.role, o.path, o.isLocked || false)}
              disabled={o.isLocked}
              className={cn(
                "group text-left rounded-xl border bg-secondary/30 p-5 transition-all relative overflow-hidden",
                // Kalau ga dikunci, kasih efek hover
                !o.isLocked && "hover:-translate-y-0.5",
                !o.isLocked && o.accent === "primary" && "border-border hover:border-primary hover:bg-primary/5 hover:shadow-glow-soft",
                !o.isLocked && o.accent === "owner" && "border-border hover:border-owner hover:bg-owner/5 hover:shadow-glow-owner-soft",
                !o.isLocked && o.accent === "accent" && "border-border hover:border-accent hover:bg-accent/5 hover:shadow-glow-gold",
                // Kalau dikunci, bikin redup dan ga bisa diklik
                o.isLocked && "opacity-60 cursor-not-allowed grayscale"
              )}
            >
              {/* Overlay Badge "Coming Soon" kalau dilock */}
              {o.isLocked && (
                <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm border border-border text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                  <Lock className="h-3 w-3" /> COMING SOON
                </div>
              )}

              <div
                className={cn(
                  "h-12 w-12 rounded-lg border flex items-center justify-center mb-4",
                  o.accent === "primary" && "bg-primary/15 border-primary/30 text-primary",
                  o.accent === "owner" && "bg-owner/15 border-owner/30 text-owner",
                  o.accent === "accent" && "bg-accent/15 border-accent/30 text-accent",
                )}
              >
                <o.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">{t(o.titleKey)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(o.descKey)}</p>

              <div
                className={cn(
                  "mt-4 inline-flex items-center gap-1 text-xs font-semibold",
                  o.isLocked ? "text-muted-foreground" : (o.accent === "primary" && "text-primary"),
                  o.isLocked ? "" : (o.accent === "owner" && "text-owner"),
                  o.isLocked ? "" : (o.accent === "accent" && "text-accent"),
                )}
              >
                {o.isLocked ? t("role.comingSoon") : `${t("role.continue")} →`}
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};