import { useCustomQuery } from "@/hooks/useQuery";
import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type ChartPoint = {
  month: string;
  month_short: string;
  year: number;
  month_number: number;
  total_income: number;
};

const BAR_MIN_PX = 4;
const CHART_HEIGHT_PX = 240;

const MAX_YEAR = 2060;
const MIN_YEAR = 2022;

function formatMoney(n: number) {
  return new Intl.NumberFormat("ar-EG", {
    maximumFractionDigits: 2,
  }).format(n);
}

export default function RevenueChart() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const [year, setYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);

  const res = useCustomQuery(`/account/admin/main-income-chart/?year=${year}`, [
    "main-income-chart",
    year,
  ]);

  const points: ChartPoint[] = useMemo(
    () => res?.data?.data?.chart_data ?? [],
    [res?.data?.data?.chart_data]
  );

  useEffect(() => {
    const apiYear = res?.data?.data?.year;
    if (apiYear && +apiYear !== year) {
      setYear(+apiYear);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [res?.data?.data?.year]);

  useEffect(() => {
    if (!points?.length) return;
    const exists = points.some((p) => p.month_number === selectedMonth);
    if (!exists) {
      setSelectedMonth(year === currentYear ? currentMonth : 1);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, year]);

  const maxIncome = useMemo(() => {
    const vals = points.map((p) => p.total_income);
    return Math.max(1, ...vals, 1);
  }, [points]);

  const selectedPoint = useMemo(
    () => points.find((p) => p.month_number === selectedMonth),
    [points, selectedMonth]
  );

  const years = useMemo(() => {
    const arr: number[] = [];
    for (let y = MAX_YEAR; y >= MIN_YEAR; y--) arr.push(y);
    return arr;
  }, []);

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const loading = !res?.data && !res?.error;

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">الإيرادات الشهرية</h2>

        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">السنة</label>

          <div ref={menuRef} className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className="px-3 py-1.5 rounded-md border border-gray-200 text-sm flex items-center gap-1 hover:bg-gray-50 focus:ring-2 focus:ring-orange-500"
              aria-haspopup="listbox"
              aria-expanded={open}
            >
              {year}
              <ChevronDown size={14} className="text-gray-500" />
            </button>

            {open && (
              <div
                className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded-md shadow-lg
                  max-h-64 overflow-y-auto z-20"
                role="listbox"
              >
                {years.map((y) => (
                  <button
                    key={y}
                    onClick={() => {
                      setYear(y);
                      setOpen(false);
                    }}
                    className={`w-full text-right px-3 py-2 text-sm transition-colors
              ${
                y === year
                  ? "bg-orange-100 text-orange-700 font-semibold"
                  : "text-gray-700 hover:bg-orange-50"
              }`}
                    role="option"
                    aria-selected={y === year}
                  >
                    {y}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected month summary */}
      <div className="mb-3 text-sm text-gray-700">
        {selectedPoint ? (
          <>
            <span className="font-medium">{selectedPoint.month}</span>
            <span className="mx-2">•</span>
            الإيراد:{" "}
            <strong className="text-gray-900">
              {formatMoney(selectedPoint.total_income)}
            </strong>
          </>
        ) : (
          "—"
        )}
      </div>

      {/* Loading / Empty */}
      {loading && (
        <div className="space-y-2">
          <div className="animate-pulse h-6 w-32 bg-gray-100 rounded-md" />
          <div className="animate-pulse h-60 bg-gray-100 rounded-lg" />
        </div>
      )}

      {!loading && points.length === 0 && (
        <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
          لا تتوفر بيانات للعرض في هذه السنة.
        </div>
      )}

      {/* Chart */}
      {points.length > 0 && (
        <div
          className="flex items-end justify-between gap-2 pt-2 pb-3"
          style={{ height: CHART_HEIGHT_PX }}
        >
          {points.map((p) => {
            const raw = (p.total_income / maxIncome) * CHART_HEIGHT_PX;
            const heightPx = Math.max(BAR_MIN_PX, Math.round(raw));
            const active = p.month_number === selectedMonth;

            return (
              <button
                key={p.month_number}
                onClick={() => setSelectedMonth(p.month_number)}
                className="flex-1 flex flex-col items-center group focus:outline-none"
                title={`${p.month}: ${formatMoney(p.total_income)}`}
              >
                <div
                  className={`w-full rounded-t-lg transition-all duration-300 ${
                    active
                      ? "bg-gradient-to-t from-orange-600 to-orange-400 shadow-md"
                      : "bg-gradient-to-t from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500"
                  }`}
                  style={{ height: heightPx }}
                />
                <span
                  className={`text-xs mt-2 ${
                    active ? "text-orange-700 font-semibold" : "text-gray-500"
                  }`}
                >
                  {p.month_number}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/*month short names */}
      {points.length > 0 && (
        <div className="grid grid-cols-12 gap-2 -mt-1">
          {points.map((p) => {
            const active = p.month_number === selectedMonth;
            return (
              <button
                key={`lbl-${p.month_number}`}
                onClick={() => setSelectedMonth(p.month_number)}
                className={`text-[11px] py-1 rounded-md transition-colors ${
                  active
                    ? "bg-orange-50 text-orange-700 font-semibold"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {p.month_short}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
