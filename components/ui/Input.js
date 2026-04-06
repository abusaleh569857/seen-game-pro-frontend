import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, icon: Icon, ...props }, ref) => {
  return (
    <div className="relative">
      {Icon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 xl:pl-5">
          <Icon className="h-4 w-4 xl:h-5 xl:w-5 text-text-2 group-focus-within:text-brand transition-colors" />
        </div>
      )}
      <input
        type={type}
        className={cn(
          "flex h-[48px] md:h-[50px] xl:h-[56px] w-full rounded-[14px] xl:rounded-2xl border border-border-1 bg-surface-2 px-4 xl:px-5 py-2 text-[13px] md:text-[14px] xl:text-[15px] font-bold text-text-1 outline-none transition-all placeholder:font-normal placeholder:text-text-3 focus:border-brand focus:bg-white focus:ring-[4px] focus:ring-brand/10 disabled:cursor-not-allowed disabled:opacity-50",
          Icon && "pl-[44px] xl:pl-14",
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
});

Input.displayName = "Input";

export { Input };
