import React from "react";
import { cn } from "../../libs/utils";

export const ShimmerBorder = ({
  children,
  className,
  containerClassName,
  shimmerColor = "#6366f1",
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  shimmerColor?: string;
}) => {
  return (
    <div
      className={cn("relative p-[1px] overflow-hidden rounded-2xl", containerClassName)}
      style={{
        background: `linear-gradient(135deg, rgba(99,102,241,0.5), rgba(99,102,241,0.05) 40%, rgba(99,102,241,0.5))`,
      }}
    >
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg, ${shimmerColor}40 60deg, transparent 120deg)`,
          animation: "shimmer-spin 3s linear infinite",
        }}
      />
      <div className={cn("relative rounded-2xl z-10", className)}>
        {children}
      </div>
    </div>
  );
};
