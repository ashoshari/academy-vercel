import type { CSSProperties } from "react";

export type CardSkeletonVariant = "default" | "course";

export interface CardSkeletonProps {
  variant?: CardSkeletonVariant;
  className?: string;
  /** Stagger entrance animation per card in a grid */
  index?: number;
  showMedia?: boolean;
}

function SkeletonBone({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`card-skeleton__bone ${className}`.trim()}
      style={style}
      aria-hidden="true"
    />
  );
}

export default function CardSkeleton({
  variant = "course",
  className = "",
  index = 0,
  showMedia = true,
}: CardSkeletonProps) {
  const staggerStyle = {
    animationDelay: `${index * 75}ms`,
  } as const;

  if (variant === "default") {
    return (
      <article
        className={`card-skeleton card-skeleton--enter ${className}`.trim()}
        style={staggerStyle}
        aria-hidden="true"
      >
        {showMedia && <div className="card-skeleton__media" />}
        <div className="card-skeleton__body">
          <SkeletonBone className="card-skeleton__bone--lg" />
          <SkeletonBone className="card-skeleton__bone--md" />
          <SkeletonBone className="card-skeleton__bone--sm" />
        </div>
      </article>
    );
  }

  return (
    <article
      className={`card-skeleton card-skeleton--course card-skeleton--enter ${className}`.trim()}
      style={staggerStyle}
      aria-hidden="true"
    >
      {showMedia && (
        <div className="card-skeleton__media">
          <div className="card-skeleton__media-badges">
            <SkeletonBone className="card-skeleton__bone--pill" />
            <SkeletonBone className="card-skeleton__bone--pill card-skeleton__bone--pill-sm" />
          </div>
          <SkeletonBone className="card-skeleton__bone--price-pill" />
        </div>
      )}

      <div className="card-skeleton__body">
        <SkeletonBone className="card-skeleton__bone--taxonomy" />

        <SkeletonBone className="card-skeleton__bone--title" />
        <SkeletonBone className="card-skeleton__bone--subtitle" />

        <div className="card-skeleton__teacher">
          <SkeletonBone className="card-skeleton__bone--avatar" />
          <SkeletonBone className="card-skeleton__bone--teacher-name" />
        </div>

        <div className="card-skeleton__meta">
          <SkeletonBone className="card-skeleton__bone--chip" />
          <SkeletonBone className="card-skeleton__bone--chip card-skeleton__bone--chip-sm" />
        </div>

        <div className="card-skeleton__footer">
          <SkeletonBone className="card-skeleton__bone--footer" />
        </div>
      </div>
    </article>
  );
}

export function CardSkeletonGrid({
  count = 6,
  variant = "course",
  gridClassName = "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5",
  className,
}: {
  count?: number;
  variant?: CardSkeletonVariant;
  gridClassName?: string;
  className?: string;
}) {
  return (
    <div
      className={gridClassName}
      aria-busy="true"
      aria-label="جاري تحميل البطاقات"
    >
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton
          key={i}
          variant={variant}
          index={i}
          className={className}
        />
      ))}
    </div>
  );
}
