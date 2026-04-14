import React from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/30 shadow-sm transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/60 focus:bg-white/8",
          "hover:border-white/20 hover:bg-white/7",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "backdrop-blur-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
