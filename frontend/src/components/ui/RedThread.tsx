import React from "react";

export interface RedThreadProps {
  startX: number | string;
  startY: number | string;
  endX: number | string;
  endY: number | string;
  curveOffset?: number;
  className?: string;
}

export const RedThread: React.FC<RedThreadProps> = ({
  startX,
  startY,
  endX,
  endY,
  curveOffset = 15,
  className = "",
}) => {
  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="redStringGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#DC2626" floodOpacity="0.7" />
        </filter>
      </defs>
      {/* Red thread path with natural curve */}
      <path
        d={`M ${startX} ${startY} Q ${(typeof startX === "number" ? startX : 50) + (typeof endX === "number" ? endX : 50) / 2} ${(typeof startY === "number" ? startY : 50) + curveOffset} ${endX} ${endY}`}
        stroke="#DC2626"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
        filter="url(#redStringGlow)"
        strokeDasharray="200"
        className="animate-pulse"
      />
      {/* Knot at start */}
      <circle cx={startX} cy={startY} r="3" fill="#991B1B" stroke="#F87171" strokeWidth="1" />
      {/* Knot at end */}
      <circle cx={endX} cy={endY} r="3" fill="#991B1B" stroke="#F87171" strokeWidth="1" />
    </svg>
  );
};
