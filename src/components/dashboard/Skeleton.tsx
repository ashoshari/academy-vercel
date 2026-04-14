import React from "react";

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Defaults to a neutral shimmer block */
  variant?: "default" | "card";
};

export default function Skeleton({
  variant = "default",
  className = "",
  ...props
}: SkeletonProps) {
  const base =
    variant === "card"
      ? "bg-white/95 backdrop-blur-xl border border-(--brand) shadow-lg"
      : "";

  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-lg bg-gray-100 ${base} ${className}`}
      {...props}
    />
  );
}

