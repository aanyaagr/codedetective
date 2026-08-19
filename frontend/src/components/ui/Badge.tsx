import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "amber-pill" | "difficulty" | "case-tag" | "step-num" | "accent-category" | "outline";
  accentColor?: string;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "amber-pill",
  accentColor,
  className,
  children,
  ...props
}) => {
  const baseStyles = "inline-flex items-center text-center font-semibold select-none";

  const variantStyles = {
    "amber-pill":
      "text-[10px] sm:text-xs font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full bg-[#18130B]/90 text-amber-400 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]",
    difficulty:
      "text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-500/30",
    "case-tag":
      "text-xs font-mono font-bold tracking-wider px-2 py-1 rounded bg-[#1A2230] text-slate-200 border border-white/10",
    "step-num":
      "text-sm sm:text-base font-extrabold text-amber-400 font-mono",
    "accent-category":
      "text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md bg-white/5 border border-white/10",
    outline:
      "text-xs px-2.5 py-1 rounded-full border border-white/20 text-slate-300",
  };

  return (
    <span
      className={twMerge(clsx(baseStyles, variantStyles[variant], className))}
      {...props}
    >
      {children}
    </span>
  );
};
