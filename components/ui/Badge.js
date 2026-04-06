import * as React from "react";
import { cn } from "@/lib/utils";

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2";
  
  const variants = {
    default: "border border-transparent bg-brand text-white shadow hover:bg-brand-dark",
    secondary: "border border-transparent bg-surface-2 text-text-1 hover:bg-surface-3",
    outline: "text-text-1 border border-border-1",
    ghost: "border-transparent bg-white/10 text-white/80 hover:bg-white/20 border border-white/10 backdrop-blur-md",
  };

  return (
    <div
      ref={ref}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export { Badge };
