import React, { useRef, useState } from "react";
import { cn } from "../../libs/utils";


interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export const GlowButton = ({
  children,
  className,
  glowColor = "rgba(99,102,241,0.6)",
  disabled,
  ...props
}: GlowButtonProps) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;
    const id = Date.now();
    setRipples((r) => [...r, { x: e.clientX - rect.left, y: e.clientY - rect.top, id }]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 700);
    props.onClick?.(e);
  };

  return (
    <button
      ref={btnRef}
      {...props}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "relative overflow-hidden group transition-all duration-200",
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
      style={{
        boxShadow: disabled ? "none" : `0 0 20px ${glowColor}, 0 4px 24px rgba(0,0,0,0.3)`,
      }}
    >
      {/* Shine sweep */}
      {!disabled && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)",
            backgroundSize: "200% 100%",
            animation: "shine-sweep 1.5s ease infinite",
          }}
        />
      )}
      {/* Ripples */}
      {ripples.map((r) => (
        <span
          key={r.id}
          style={{
            position: "absolute",
            left: r.x,
            top: r.y,
            width: 8,
            height: 8,
            marginLeft: -4,
            marginTop: -4,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.35)",
            transform: "scale(0)",
            animation: "ripple-expand 0.7s ease-out forwards",
            pointerEvents: "none",
          }}
        />
      ))}
      <span className="relative z-10">{children}</span>
    </button>
  );
};
