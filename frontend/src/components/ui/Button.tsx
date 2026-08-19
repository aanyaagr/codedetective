import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gold-outline" | "run" | "case-action";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "right",
  className,
  children,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-md transition-all duration-200 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-center";

  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 gap-1.5 tracking-wider",
    md: "text-xs sm:text-sm px-4 py-2.5 gap-2 tracking-wider",
    lg: "text-sm sm:text-base px-6 py-3.5 gap-2.5 tracking-wider uppercase font-bold",
  };

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-extrabold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:brightness-105 active:scale-[0.98] border border-amber-300/40",
    secondary:
      "bg-[#141A23] hover:bg-[#1C2533] text-slate-200 hover:text-white border border-white/10 hover:border-amber-500/40 shadow-sm",
    outline:
      "bg-black/30 hover:bg-white/5 text-slate-300 hover:text-white border border-white/20 hover:border-white/40",
    "gold-outline":
      "bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 border border-amber-500/40 hover:border-amber-400 shadow-sm shadow-amber-950/50",
    ghost:
      "bg-transparent hover:bg-white/5 text-slate-300 hover:text-white",
    run:
      "bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-mono font-bold tracking-wider text-xs px-3 py-1.5 rounded shadow-md shadow-emerald-950/80 border border-emerald-400/30",
    "case-action":
      "bg-[#161D27] hover:bg-[#1E2736] text-slate-300 hover:text-white border border-white/10 hover:border-slate-500 text-xs px-3 py-1.5 rounded font-mono tracking-wider",
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))}
      {...props}
    >
      {icon && iconPosition === "left" && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === "right" && <span className="flex-shrink-0">{icon}</span>}
    </button>
  );
};
