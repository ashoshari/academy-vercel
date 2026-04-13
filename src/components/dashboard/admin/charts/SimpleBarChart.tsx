import { useMemo } from "react";

const BAR_MIN_PX = 4;

export type SimpleBarPoint = {
  id: string;
  value: number;
  /** Shown in summary line when selected */
  labelFull: string;
  /** Short label under the bar (e.g. month number or abbr) */
  labelShort: string;
};

type SimpleBarChartProps = {
  points: SimpleBarPoint[];
  heightPx?: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** Summary line above chart */
  summaryPrefix?: string;
  formatValue?: (v: number) => string;
  emptyMessage?: string;
  loading?: boolean;
};

const defaultFormat = (v: number) =>
  new Intl.NumberFormat("ar-EG", { maximumFractionDigits: 2 }).format(v);

export default function SimpleBarChart({
  points,
  heightPx = 240,
  selectedId,
  onSelect,
  summaryPrefix = "",
  formatValue = defaultFormat,
  emptyMessage = "لا تتوفر بيانات للعرض.",
  loading = false,
}: SimpleBarChartProps) {
  const maxVal = useMemo(() => {
    const vals = points.map((p) => p.value);
    return Math.max(1, ...vals, 1);
  }, [points]);

  const selectedPoint = useMemo(
    () => points.find((p) => p.id === selectedId) ?? points[0],
    [points, selectedId],
  );

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="animate-pulse h-6 w-32 bg-gray-100 rounded-md" />
        <div
          className="animate-pulse bg-gray-100 rounded-lg"
          style={{ height: heightPx }}
        />
      </div>
    );
  }

  if (points.length === 0) {
    return (
      <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
        {emptyMessage}
      </div>
    );
  }

  return (
    <>
      <div className="mb-3 text-sm text-gray-700 min-h-6">
        {selectedPoint ? (
          <>
            <span className="font-medium">{selectedPoint.labelFull}</span>
            <span className="mx-2">•</span>
            {summaryPrefix ? (
              <span>
                {summaryPrefix}{" "}
                <strong className="text-gray-900">
                  {formatValue(selectedPoint.value)}
                </strong>
              </span>
            ) : (
              <strong className="text-gray-900">
                {formatValue(selectedPoint.value)}
              </strong>
            )}
          </>
        ) : (
          "—"
        )}
      </div>

      <div
        className="flex items-end justify-between gap-2 pt-2 pb-1 overflow-x-auto"
        style={{ minHeight: heightPx }}
      >
        {points.map((p) => {
          const raw = (p.value / maxVal) * heightPx;
          const heightBar = Math.max(BAR_MIN_PX, Math.round(raw));
          const active = p.id === selectedId;

          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(p.id)}
              className="cursor-pointer flex-1 min-w-8 flex flex-col items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
              title={`${p.labelFull}: ${formatValue(p.value)}`}
            >
              <div
                className={`w-full rounded-t-lg transition-all duration-300 ${
                  active
                    ? "bg-linear-to-t from-orange-600 to-orange-400 shadow-md"
                    : "bg-linear-to-t from-(--brand) to-(--brand-light) hover:from-(--brand-light) hover:to-(--brand)"
                }`}
                style={{ height: heightBar }}
              />
              <span
                className={`text-[11px] mt-2 text-center leading-tight px-0.5 ${
                  active ? "text-(--brand) font-semibold" : "text-gray-500"
                }`}
              >
                {p.labelShort}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
