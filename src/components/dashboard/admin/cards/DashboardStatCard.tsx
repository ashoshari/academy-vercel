import type { LucideIcon } from "lucide-react";

export type DashboardStatCardProps = {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
  /** Tailwind color classes for the value (e.g. text-gray-800, text-green-600) */
  valueClassName?: string;
  /** Tailwind color classes for the icon (e.g. text-orange-500) */
  iconClassName?: string;
};

/** Matches course management stats row (4 columns on xl) */
export const DASHBOARD_STATS_GRID_4 =
  "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4";

/** Three stat cards — matches Libraries / admin stat rows */
export const DASHBOARD_STATS_GRID_3 =
  "grid grid-cols-1 lg:grid-cols-3 gap-4 w-full";

export default function DashboardStatCard({
  label,
  value,
  icon: Icon,
  valueClassName = "text-gray-800",
  iconClassName = "text-orange-500",
}: DashboardStatCardProps) {
  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50 w-full min-w-0">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{label}</p>
          <p className={`text-3xl font-bold ${valueClassName}`}>{value}</p>
        </div>
        <Icon className={`w-12 h-12 shrink-0 ${iconClassName}`} />
      </div>
    </div>
  );
}
