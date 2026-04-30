import { Link as LinkIcon, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showBeta?: boolean;
  size?: "sm" | "md" | "lg";
}

export const Logo = ({ className, showBeta = true, size = "md" }: LogoProps) => {
  const sizes = {
    sm: { icon: "h-7 w-7", text: "text-lg", inner: "h-3.5 w-3.5", dumb: "h-3 w-3" },
    md: { icon: "h-9 w-9", text: "text-xl", inner: "h-4 w-4", dumb: "h-3.5 w-3.5" },
    lg: { icon: "h-12 w-12", text: "text-2xl", inner: "h-5 w-5", dumb: "h-4 w-4" },
  }[size];

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className={cn("relative flex items-center justify-center rounded-lg bg-primary/10 border border-primary/30 shadow-glow-soft", sizes.icon)}>
        <Dumbbell className={cn("absolute text-primary -rotate-12", sizes.dumb)} strokeWidth={2.5} />
        <LinkIcon className={cn("absolute text-primary opacity-60 rotate-45", sizes.inner)} strokeWidth={2} />
      </div>
      <div className="flex items-center gap-1.5">
        <span className={cn("font-extrabold tracking-tight text-foreground", sizes.text)}>
          Gain<span className="text-primary">Chain</span>
        </span>
        {showBeta && (
          <span className="rounded-md bg-primary/15 border border-primary/30 px-1.5 py-0.5 text-[9px] font-mono font-bold text-primary tracking-widest">
            BETA
          </span>
        )}
      </div>
    </div>
  );
};
