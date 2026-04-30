import { useNavigate } from "react-router-dom";
import { User, Building2, CreditCard } from "lucide-react";
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

  const choose = (r: Role, path: string) => {
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
  }> = [
    { role: "solo", path: "/dashboard", icon: User, titleKey: "role.solo.title", descKey: "role.solo.desc", accent: "primary" },
    { role: "owner", path: "/owner", icon: Building2, titleKey: "role.owner.title", descKey: "role.owner.desc", accent: "owner" },
    { role: "member", path: "/member", icon: CreditCard, titleKey: "role.member.title", descKey: "role.member.desc", accent: "accent" },
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
              onClick={() => choose(o.role, o.path)}
              className={cn(
                "group text-left rounded-xl border bg-secondary/30 p-5 transition-all hover:-translate-y-0.5",
                o.accent === "primary" && "border-border hover:border-primary hover:bg-primary/5 hover:shadow-glow-soft",
                o.accent === "owner" && "border-border hover:border-owner hover:bg-owner/5 hover:shadow-glow-owner-soft",
                o.accent === "accent" && "border-border hover:border-accent hover:bg-accent/5 hover:shadow-glow-gold",
              )}
            >
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
                  o.accent === "primary" && "text-primary",
                  o.accent === "owner" && "text-owner",
                  o.accent === "accent" && "text-accent",
                )}
              >
                {t("role.continue")} →
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
