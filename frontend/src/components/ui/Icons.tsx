import React from "react";
import {
  Code,
  Sparkles,
  Brain,
  Target,
  Folder,
  BookOpen,
  Search,
  Trophy,
  Flame,
  Star,
  Award,
  Video,
  FileText,
  ArrowRight,
  Terminal,
  Puzzle,
  GraduationCap,
  Check,
  X,
  Play,
  ChevronRight,
  Plus,
  HelpCircle,
  Shield,
  FileCode,
  Paperclip,
  Radio,
  Eye,
  AlertTriangle,
  Fingerprint,
} from "lucide-react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

// Detective Hat & Magnifier Brand Logo
export const DetectiveLogoIcon: React.FC<IconProps> = ({ className = "w-8 h-8", ...props }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      <linearGradient id="fedoraAmberGrad" x1="8" y1="10" x2="40" y2="38" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F59E0B" />
        <stop offset="0.6" stopColor="#D97706" />
        <stop offset="1" stopColor="#78350F" />
      </linearGradient>
      <linearGradient id="lensGrad" x1="20" y1="20" x2="44" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#DC2626" stopOpacity="0.6" />
        <stop offset="1" stopColor="#991B1B" stopOpacity="0.2" />
      </linearGradient>
    </defs>
    {/* Fedora Hat */}
    <path
      d="M14 22C14 15.3726 19.3726 10 26 10H28C32.4183 10 36 13.5817 36 18V22H14Z"
      fill="url(#fedoraAmberGrad)"
    />
    <path
      d="M10 22C8.34315 22 7 23.3431 7 25C7 25.5523 7.44772 26 8 26H42C42.5523 26 43 25.5523 43 25C43 23.3431 41.6569 22 40 22H10Z"
      fill="#D97706"
    />
    <path d="M14 20H36V22H14V20Z" fill="#1C1814" />
    <path
      d="M16 28L20 38H30L34 28"
      stroke="#D97706"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Magnifier Overlay with Red Evidence Tint */}
    <circle
      cx="32"
      cy="32"
      r="8"
      stroke="#FDE68A"
      strokeWidth="2.5"
      fill="url(#lensGrad)"
    />
    <path
      d="M38 38L45 45"
      stroke="#FDE68A"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

// Detective Character Avatar for Comms Dispatch
export const DetectiveAvatar: React.FC<IconProps> = ({ className = "w-10 h-10", ...props }) => (
  <svg
    viewBox="0 0 56 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      <linearGradient id="avatarBg" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1C1917" />
        <stop offset="1" stopColor="#0C0A09" />
      </linearGradient>
      <linearGradient id="fedoraAmber" x1="12" y1="8" x2="44" y2="36" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F59E0B" />
        <stop offset="1" stopColor="#B45309" />
      </linearGradient>
      <linearGradient id="skinGrad" x1="20" y1="20" x2="36" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDE68A" />
        <stop offset="1" stopColor="#D97706" />
      </linearGradient>
    </defs>
    <circle cx="28" cy="28" r="26" fill="url(#avatarBg)" stroke="#DC2626" strokeWidth="2" />
    <path d="M14 50C14 42 20 38 28 38C36 38 42 42 42 50" fill="#292524" />
    <path d="M22 40L28 47L34 40" stroke="#F59E0B" strokeWidth="1.5" fill="#1C1917" />
    <circle cx="28" cy="28" r="10" fill="url(#skinGrad)" />
    <circle cx="24" cy="27" r="1.5" fill="#18130B" />
    <circle cx="32" cy="27" r="1.5" fill="#18130B" />
    <path d="M23 32C25 33.5 31 33.5 33 32" stroke="#18130B" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M17 21C17 14 21 11 28 11C35 11 39 14 39 21H17Z" fill="url(#fedoraAmber)" />
    <path d="M12 21C12 21 18 22 28 22C38 22 44 21 44 21C44 23 38 24 28 24C18 24 12 23 12 21Z" fill="#D97706" />
    <path d="M18 19H38V21H18V19Z" fill="#18130B" />
  </svg>
);

// 3D Pushpin Component
export const Pushpin: React.FC<{ color?: "red" | "brass" | "steel" | "amber" | "cyan"; className?: string }> = ({
  color = "red",
  className = "w-6 h-6",
}) => {
  const getColors = () => {
    switch (color) {
      case "amber":
        return { head: "#F59E0B", highlight: "#FEF08A", shadow: "#78350F" };
      case "cyan":
        return { head: "#06B6D4", highlight: "#A5F3FC", shadow: "#164E63" };
      case "brass":
        return { head: "#D97706", highlight: "#FEF08A", shadow: "#451A03" };
      case "steel":
        return { head: "#64748B", highlight: "#E2E8F0", shadow: "#0F172A" };
      case "red":
      default:
        return { head: "#DC2626", highlight: "#FCA5A5", shadow: "#7F1D1D" };
    }
  };
  const c = getColors();

  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id={`pinShadow-${color}`} x="0" y="0" width="28" height="28" filterUnits="userSpaceOnUse">
          <feDropShadow dx="1.5" dy="2.5" stdDeviation="1.8" floodColor="#000000" floodOpacity="0.85" />
        </filter>
      </defs>
      <g filter={`url(#pinShadow-${color})`}>
        {/* Steel pin needle */}
        <path d="M14 16L14 26" stroke="#CBD5E1" strokeWidth="1.8" strokeLinecap="round" />
        {/* Shadow base ring */}
        <ellipse cx="14" cy="16" rx="5" ry="2" fill={c.shadow} />
        {/* Pushpin head */}
        <path d="M9 8C9 5.5 10.5 4 14 4C17.5 4 19 5.5 19 8C19 12 16.5 15 14 16C11.5 15 9 12 9 8Z" fill={c.head} />
        {/* Spherical top highlight */}
        <circle cx="14" cy="6.5" r="3.5" fill={c.highlight} fillOpacity="0.75" />
      </g>
    </svg>
  );
};

// Torn Masking Tape Strip
export const TapeStrip: React.FC<{ className?: string; text?: string; variant?: "hazard" | "masking" }> = ({
  className = "w-28 h-6",
  text,
  variant = "masking",
}) => (
  <div
    className={`select-none transform backdrop-blur-xs flex items-center justify-center font-mono text-[9px] font-black tracking-widest uppercase shadow-md ${
      variant === "hazard"
        ? "bg-amber-400/90 text-black border-y border-black/40"
        : "bg-[#E6DFD5]/40 border border-white/20 text-[#292218] font-bold"
    } ${className}`}
    style={{
      clipPath: "polygon(0% 15%, 5% 0%, 95% 0%, 100% 15%, 98% 85%, 100% 100%, 0% 100%, 3% 85%)",
    }}
  >
    {text}
  </div>
);

// Distressed Rubber Stamp
export const RubberStamp: React.FC<{
  text: string;
  color?: "red" | "amber" | "cyan" | "emerald";
  className?: string;
  rotation?: string;
}> = ({ text, color = "red", className = "", rotation = "-rotate-3" }) => {
  const getStyles = () => {
    switch (color) {
      case "amber":
        return "border-amber-600 text-amber-500 bg-amber-950/20";
      case "cyan":
        return "border-cyan-600 text-cyan-400 bg-cyan-950/20";
      case "emerald":
        return "border-emerald-600 text-emerald-400 bg-emerald-950/20";
      case "red":
      default:
        return "border-red-600 text-red-600 bg-red-950/30";
    }
  };

  return (
    <div
      className={`inline-block border-2 border-dashed px-2.5 py-0.5 font-mono font-black text-[10px] sm:text-[11px] tracking-[0.2em] uppercase select-none transform ${rotation} shadow-sm ${getStyles()} ${className}`}
      style={{
        maskImage: "radial-gradient(circle, rgba(0,0,0,1) 80%, rgba(0,0,0,0.6) 100%)",
      }}
    >
      {text}
    </div>
  );
};

// Pinned Polaroid Crime Scene Photo
export const PolaroidPhoto: React.FC<{
  title: string;
  caseRef: string;
  className?: string;
  rotation?: string;
  pinColor?: "red" | "brass" | "steel" | "amber" | "cyan";
}> = ({ title, caseRef, className = "w-44 h-52", rotation = "rotate-2", pinColor = "red" }) => (
  <div
    className={`relative polaroid-frame p-2.5 flex flex-col justify-between transform ${rotation} transition-transform duration-300 hover:rotate-0 hover:scale-105 z-10 ${className}`}
  >
    {/* Pushpin at top */}
    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
      <Pushpin color={pinColor} className="w-6 h-6" />
    </div>

    {/* Photo Image Area */}
    <div className="w-full h-32 bg-[#10141D] rounded-xs overflow-hidden relative border border-black/40">
      <svg viewBox="0 0 100 80" className="w-full h-full opacity-80" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="80" fill="#141822" />
        <circle cx="50" cy="35" r="28" fill="#DFD5BE" fillOpacity="0.15" />
        <path d="M40 75C40 50 45 42 50 42C55 42 60 50 60 75Z" fill="#0A0D14" />
        <circle cx="50" cy="35" r="10" fill="#0A0D14" />
        <ellipse cx="50" cy="30" rx="16" ry="4" fill="#0A0D14" />
        <path d="M42 30C42 22 46 20 50 20C54 20 58 22 58 30Z" fill="#0A0D14" />
        <polygon points="25,50 35,45 25,40" fill="#DC2626" />
        <line x1="25" y1="40" x2="25" y2="65" stroke="#FDE68A" strokeWidth="1.5" />
        <line x1="0" y1="70" x2="100" y2="70" stroke="#F59E0B" strokeWidth="3" strokeDasharray="6 3" />
      </svg>
      <span className="absolute bottom-1 right-1 text-[8px] font-mono font-black text-red-400 bg-black/80 px-1 rounded">
        {caseRef}
      </span>
    </div>

    {/* Polaroid Bottom Caption */}
    <div className="pt-2 text-center">
      <span className="text-[10px] font-mono font-black text-[#1C1814] uppercase tracking-wider block">
        {title}
      </span>
    </div>
  </div>
);

// Vintage Coffee Ring Stain Graphic
export const CoffeeStain: React.FC<{ className?: string }> = ({ className = "w-28 h-28" }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none opacity-20 ${className}`}
  >
    <circle
      cx="50"
      cy="50"
      r="42"
      stroke="#78350F"
      strokeWidth="4"
      strokeDasharray="40 10 15 5 60 15"
      strokeOpacity="0.8"
    />
    <circle
      cx="52"
      cy="48"
      r="38"
      stroke="#78350F"
      strokeWidth="2"
      strokeDasharray="20 30 10 40"
      strokeOpacity="0.5"
    />
  </svg>
);

// Rank Shield Icon
export const RankShieldIcon: React.FC<{ rankId: string; className?: string; isGold?: boolean }> = ({
  rankId,
  className = "w-14 h-14",
  isGold = false,
}) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M32 4L54 12V32C54 45.5 44.5 56.5 32 60C19.5 56.5 10 45.5 10 32V12L32 4Z"
      fill={isGold || rankId === "chief-inspector" ? "#78350F" : "#1E293B"}
      stroke={isGold || rankId === "chief-inspector" ? "#F59E0B" : "#64748B"}
      strokeWidth="2.5"
    />
    <polygon
      points="32,20 35,27 42,28 37,33 38.5,41 32,37 25.5,41 27,33 22,28 29,27"
      fill={isGold || rankId === "chief-inspector" ? "#FEF08A" : "#94A3B8"}
    />
  </svg>
);

// Fingerprint Icon
export const FingerprintIcon: React.FC<IconProps> = ({ className = "w-6 h-6", ...props }) => (
  <Fingerprint className={className} {...props} />
);

// Theater Masks Icon
export const TheaterMasksIcon: React.FC<IconProps> = ({ className = "w-6 h-6", ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} {...props}>
    <path d="M3 13C3 7.5 6.5 4 11 4C15.5 4 19 7.5 19 13C19 18.5 15.5 21 11 21C6.5 21 3 18.5 3 13Z" />
    <circle cx="8" cy="11" r="1" fill="currentColor" />
    <circle cx="14" cy="11" r="1" fill="currentColor" />
    <path d="M8 15C9 17 13 17 14 15" />
  </svg>
);

// XP Hexagon
export const XpHexagonIcon: React.FC<IconProps> = ({ className = "w-6 h-6", ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} {...props}>
    <polygon points="12 2 21 7.2 21 16.8 12 22 3 16.8 3 7.2" stroke="currentColor" strokeWidth="2" fill="rgba(245, 158, 11, 0.2)" />
    <text x="12" y="15" textAnchor="middle" fontSize="8.5" fontWeight="900" fill="currentColor" fontFamily="monospace">
      XP
    </text>
  </svg>
);

// Dynamic Icon Resolver
export const DynamicIcon: React.FC<{ name: string; className?: string }> = ({ name, className = "w-5 h-5" }) => {
  switch (name) {
    case "code":
      return <Code className={className} />;
    case "sparkles":
      return <Sparkles className={className} />;
    case "brain":
      return <Brain className={className} />;
    case "target":
      return <Target className={className} />;
    case "folder":
      return <Folder className={className} />;
    case "book":
      return <BookOpen className={className} />;
    case "search":
      return <Search className={className} />;
    case "fingerprint":
      return <Fingerprint className={className} />;
    case "trophy":
      return <Trophy className={className} />;
    case "flame":
      return <Flame className={className} />;
    case "star":
      return <Star className={className} />;
    case "badge":
      return <Shield className={className} />;
    case "video":
      return <Video className={className} />;
    case "file-text":
      return <FileText className={className} />;
    case "award":
      return <Award className={className} />;
    case "arrow-right":
      return <ArrowRight className={className} />;
    case "terminal":
      return <Terminal className={className} />;
    case "puzzle":
      return <Puzzle className={className} />;
    case "graduation-cap":
      return <GraduationCap className={className} />;
    case "masks":
      return <TheaterMasksIcon className={className} />;
    case "xp":
      return <XpHexagonIcon className={className} />;
    case "detective":
      return <DetectiveLogoIcon className={className} />;
    default:
      return <Sparkles className={className} />;
  }
};
