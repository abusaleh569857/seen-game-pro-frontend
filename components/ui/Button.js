import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const Button = React.forwardRef(({ className, variant = "primary", size = "default", asChild = false, ...props }, ref) => {
  const Comp = asChild ? motion.div : motion.button;
  
  const baseStyles = "inline-flex items-center justify-center rounded-[12px] text-[13px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    primary: "bg-gradient-brand text-white shadow-[0_4px_14px_rgba(96,71,234,0.38)] hover:brightness-110",
    secondary: "bg-surface-1 text-text-1 hover:bg-surface-2 border border-border-1",
    ghost: "bg-transparent text-text-2 hover:text-text-1 hover:bg-white/5",
    vip: "bg-gradient-vip text-white shadow-btn",
  };
  
  const sizes = {
    default: "h-11 px-6 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-14 rounded-[16px] px-8 text-[15px]",
    icon: "h-11 w-11",
  };

  return (
    <Comp
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button };
