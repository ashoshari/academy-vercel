import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

type EmptyStateTone = "neutral" | "info" | "warning";
type EmptyStateSize = "sm" | "md" | "lg";

const toneStyles: Record<
  EmptyStateTone,
  { ring: string; iconBg: string; icon: string; title: string; desc: string }
> = {
  neutral: {
    ring: "ring-gray-200",
    iconBg: "bg-gray-100",
    icon: "text-gray-700",
    title: "text-gray-900",
    desc: "text-gray-600",
  },
  info: {
    ring: "ring-blue-200",
    iconBg: "bg-blue-50",
    icon: "text-blue-700",
    title: "text-gray-900",
    desc: "text-gray-600",
  },
  warning: {
    ring: "ring-amber-200",
    iconBg: "bg-amber-50",
    icon: "text-amber-700",
    title: "text-gray-900",
    desc: "text-gray-600",
  },
};

const sizeStyles: Record<
  EmptyStateSize,
  { wrap: string; iconWrap: string; iconSize: number; title: string; desc: string }
> = {
  sm: {
    wrap: "py-8",
    iconWrap: "w-12 h-12",
    iconSize: 22,
    title: "text-lg",
    desc: "text-sm",
  },
  md: {
    wrap: "py-10",
    iconWrap: "w-16 h-16",
    iconSize: 26,
    title: "text-xl",
    desc: "text-base",
  },
  lg: {
    wrap: "py-14",
    iconWrap: "w-20 h-20",
    iconSize: 32,
    title: "text-2xl",
    desc: "text-base",
  },
};

export default function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
  tone = "neutral",
  size = "md",
  className = "",
  fullHeight = false,
  dir = "rtl",
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
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
      ].join(" ")}
    >
      <div className={["w-full max-w-xl px-4", s.wrap].join(" ")}>
        <div
          className={[
            "rounded-3xl bg-white/80 backdrop-blur-sm",
            "shadow-lg shadow-black/5",
            "ring-1",
            t.ring,
            "p-6 sm:p-8",
            "text-center",
          ].join(" ")}
        >
          <div className="flex justify-center">
            <div
              className={[
                s.iconWrap,
                "rounded-2xl",
                "flex items-center justify-center",
                t.iconBg,
                "ring-1",
                t.ring,
                "shadow-sm",
              ].join(" ")}
            >
              <Icon size={s.iconSize} className={t.icon} />
            </div>
          </div>

          <h3
            className={[
              "mt-5 font-bold tracking-tight",
              t.title,
              s.title,
            ].join(" ")}
          >
            {title}
          </h3>

          {description ? (
            <p className={["mt-2 leading-relaxed", t.desc, s.desc].join(" ")}>
              {description}
            </p>
          ) : null}

          {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
        </div>
      </div>
    </div>
  );
}

