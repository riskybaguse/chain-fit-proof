import { Languages } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export const LanguageToggle = ({ className }: { className?: string }) => {
  const { lang, toggle } = useLang();
  return (
    <button
      onClick={toggle}
      aria-label={lang === "id" ? "Ganti bahasa" : "Toggle language"}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors",
        className,
      )}
    >
      <Languages className="h-3.5 w-3.5" />
      {lang === "id" ? "EN" : "ID"}
    </button>
  );
};
