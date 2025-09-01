/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LucideIcon } from "lucide-react";

export type StatItem<T extends object> = {
  key: Extract<keyof T, string>;
  label: string;
  icon: LucideIcon;
  variant?: "primary" | "glass";
};

export interface StatisticsCardsProps<T extends object> {
  data?: T | null;
  items: ReadonlyArray<StatItem<T>>;
  loading?: boolean;
  role?: string;
  emptyLabel?: string;
}

function getValue<T extends object, K extends Extract<keyof T, string>>(
  data: T,
  key: K
): T[K] {
  return (data as any)[key] as T[K];
}

function valueToNode<T extends object>(item: StatItem<T>, data?: T | null) {
  const raw = data ? getValue(data, item.key) : undefined;

  if (raw == null) return "—";
  return String(raw);
}

export default function StatisticsCards<T extends object>({
  data,
  items,
  loading,
  role,
  emptyLabel = "لا توجد بيانات",
}: StatisticsCardsProps<T>) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: Math.max(4, items.length || 1) }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl p-6 border border-orange-100/50 shadow-lg bg-white animate-pulse h-[110px]"
          />
        ))}
      </div>
    );
  }
  if (!data) {
    return (
      <div className="text-center text-gray-500 text-sm py-10">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 ${
        role === "teacher" ? "lg:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-4"
      } gap-4`}
    >
      {items.map(({ key, label, icon: Icon, variant = "glass" }) => {
        const isPrimary = variant === "primary";
        return (
          <div
            key={String(key)}
            className={
              isPrimary
                ? "bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg"
                : "bg-white/95 backdrop-blur-xl rounded-xl p-6 shadow-lg border border-orange-100/50"
            }
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={
                    isPrimary
                      ? "text-orange-100 text-sm"
                      : "text-gray-500 text-sm"
                  }
                >
                  {label}
                </p>
                <p
                  className={
                    isPrimary
                      ? "text-3xl font-bold"
                      : "text-3xl font-bold text-gray-800"
                  }
                >
                  {valueToNode({ key, label, icon: Icon, variant }, data)}
                </p>
              </div>
              <Icon
                className={
                  isPrimary
                    ? "w-12 h-12 text-orange-200"
                    : "w-12 h-12 text-orange-500"
                }
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
