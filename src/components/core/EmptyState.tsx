import type { ReactNode } from "react";
import noDataIllustration from "@/assets/no-data-to-display.png";

type EmptyStateTone = "neutral" | "info" | "warning";
type EmptyStateSize = "sm" | "md" | "lg";

const toneStyles: Record<EmptyStateTone, { title: string; desc: string }> = {
  neutral: {
    title: "text-gray-900",
    desc: "text-gray-600",
  },
  info: {
    title: "text-gray-900",
    desc: "text-gray-600",
  },
  warning: {
    title: "text-gray-900",
    desc: "text-gray-600",
  },
};

const sizeStyles: Record<
  EmptyStateSize,
  { wrap: string; image: string; title: string; desc: string }
> = {
  sm: {
    wrap: "py-8",
    image:
      "max-h-24 sm:max-h-28 w-auto max-w-[min(100%,11rem)] sm:max-w-[13rem]",
    title: "text-lg",
    desc: "text-sm",
  },
  md: {
    wrap: "py-10",
    image:
      "max-h-32 sm:max-h-36 w-auto max-w-[min(100%,15rem)] sm:max-w-[17rem]",
    title: "text-xl",
    desc: "text-base",
  },
  lg: {
    wrap: "py-14",
    image:
      "max-h-40 sm:max-h-48 w-auto max-w-[min(100%,18rem)] sm:max-w-[22rem]",
    title: "text-2xl",
    desc: "text-base",
  },
};

export default function EmptyState({
  title,
  description,
  action,
  tone = "neutral",
  size = "md",
  className = "",
  fullHeight = false,
  dir = "rtl",
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  tone?: EmptyStateTone;
  size?: EmptyStateSize;
  className?: string;
  fullHeight?: boolean;
  dir?: "rtl" | "ltr" | "auto";
}) {
  const t = toneStyles[tone];
  const s = sizeStyles[size];

  return (
    <div
      dir={dir}
      className={[
        fullHeight ? "min-h-[60vh]" : "",
        "w-full flex items-center justify-center",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[
          "w-full max-w-lg px-4 flex flex-col items-center text-center",
          s.wrap,
        ].join(" ")}
      >
        <img
          src={noDataIllustration}
          alt=""
          width={440}
          height={330}
          loading="lazy"
          decoding="async"
          draggable={false}
          className={[
            "block object-contain object-center select-none",
            s.image,
          ].join(" ")}
        />

        <h6
          className={[
            "text-(--brand) mt-10 font-bold tracking-tight",
            t.title,
            s.title,
          ].join(" ")}
        >
          {title}
        </h6>

        {description ? (
          <p className={["mt-2 leading-relaxed", t.desc, s.desc].join(" ")}>
            {description}
          </p>
        ) : null}

        {action ? (
          <div className="mt-6 flex justify-center">{action}</div>
        ) : null}
      </div>
    </div>
  );
}
