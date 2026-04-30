import { Trophy, Medal, Crown, Gem } from "lucide-react";
import { cn } from "@/lib/utils";

export type BadgeTier = "bronze" | "silver" | "gold" | "diamond";

interface NFTBadgeProps {
  tier: BadgeTier;
  size?: "sm" | "md" | "lg";
  locked?: boolean;
  animated?: boolean;
}

const tierConfig: Record<BadgeTier, { gradient: string; glow: string; icon: typeof Trophy; ring: string }> = {
  bronze: {
    gradient: "bg-gradient-bronze",
    glow: "shadow-[0_0_30px_hsl(28_70%_50%/0.45)]",
    icon: Medal,
    ring: "ring-[hsl(28_70%_50%/0.4)]",
  },
  silver: {
    gradient: "bg-gradient-silver",
    glow: "shadow-[0_0_30px_hsl(0_0%_75%/0.5)]",
    icon: Medal,
    ring: "ring-[hsl(0_0%_75%/0.4)]",
  },
  gold: {
    gradient: "bg-gradient-gold",
    glow: "shadow-glow-gold",
    icon: Crown,
    ring: "ring-[hsl(51_100%_50%/0.4)]",
  },
  diamond: {
    gradient: "bg-gradient-diamond",
    glow: "shadow-[0_0_40px_hsl(190_100%_70%/0.5),0_0_80px_hsl(270_80%_70%/0.3)]",
    icon: Gem,
    ring: "ring-[hsl(190_100%_70%/0.4)]",
  },
};

export const NFTBadge = ({ tier, size = "md", locked = false, animated = true }: NFTBadgeProps) => {
  const cfg = tierConfig[tier];
  const Icon = cfg.icon;
  const dim = { sm: "h-16 w-16", md: "h-24 w-24", lg: "h-36 w-36" }[size];
  const iconSize = { sm: "h-7 w-7", md: "h-10 w-10", lg: "h-16 w-16" }[size];

  return (
    <div className={cn("relative inline-flex", animated && "group")}>
      <div
        className={cn(
          "relative rounded-full flex items-center justify-center ring-4",
          dim,
          cfg.gradient,
          cfg.ring,
          !locked && cfg.glow,
          locked && "opacity-30 grayscale",
          animated && !locked && "transition-transform duration-500 group-hover:scale-105",
        )}
      >
        {/* shimmer overlay */}
        {!locked && (
          <div
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              background:
                "linear-gradient(120deg, transparent 30%, hsl(0 0% 100% / 0.35) 50%, transparent 70%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 3s linear infinite",
            }}
          />
        )}
        <Icon className={cn(iconSize, "relative z-10 text-background drop-shadow")} strokeWidth={2.2} />
        {/* chain accent dot */}
        <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-background border border-border flex items-center justify-center">
          <div className={cn("h-2.5 w-2.5 rounded-full", cfg.gradient)} />
        </div>
      </div>
    </div>
  );
};
