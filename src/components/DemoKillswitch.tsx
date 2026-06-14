import { Power } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DemoKillswitchProps {
  variant?: "fab" | "inline";
  className?: string;
}

export const DemoKillswitch = ({ variant = "fab", className }: DemoKillswitchProps) => {
  const handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  if (variant === "inline") {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleReset}
            className={cn(
              "inline-flex items-center justify-center h-7 w-7 rounded-md",
              "text-muted-foreground/40 hover:text-destructive/70 hover:bg-destructive/5",
              "transition-colors",
              className,
            )}
            aria-label="Reset demo state"
          >
            <Power className="h-3.5 w-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs font-mono">
          Demo Reset
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={handleReset}
          className={cn(
            "fixed bottom-4 right-4 z-50 h-9 w-9 rounded-full",
            "bg-background/30 backdrop-blur-sm border border-border/40",
            "flex items-center justify-center",
            "text-muted-foreground/30 hover:text-destructive/60 hover:border-destructive/30",
            "transition-all hover:scale-105",
            className,
          )}
          aria-label="Reset demo state"
        >
          <Power className="h-3.5 w-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="left" className="text-xs font-mono">
        Demo Reset
      </TooltipContent>
    </Tooltip>
  );
};
