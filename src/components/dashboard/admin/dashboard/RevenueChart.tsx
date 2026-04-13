import { useCustomQuery } from "@/hooks/useQuery";
import { readUserFromStorage, roleOf } from "@/services/auth";
import SimpleBarChart, {
  type SimpleBarPoint,
} from "@/components/dashboard/admin/charts/SimpleBarChart";
import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type ChartPoint = {
  month: string;
  month_short: string;
  year: number;
  month_number: number;
  total_income: number;
};

// function formatMoney(n: number) {
//   return new Intl.NumberFormat("ar-EG", {
//     maximumFractionDigits: 2,
//   }).format(n);
// }

export default function RevenueChart() {
  const user = readUserFromStorage();
  const role = roleOf(user);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const MAX_YEAR = currentYear + 2;
  const MIN_YEAR = currentYear - 2;
  const [year, setYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);

  const res = useCustomQuery(`/account/admin/main-income-chart/?year=${year}`, [
    "main-income-chart",
    year,
    role,
    user?.type?.id,
  ]);

  const points: ChartPoint[] = useMemo(
    () => res?.data?.data?.chart_data ?? [],
    [res?.data?.data?.chart_data],
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

  const barPoints: SimpleBarPoint[] = useMemo(
    () =>
      points.map((p) => ({
        id: String(p.month_number),
        value: p.total_income,
        labelFull: p.month,
        labelShort: p.month_short,
      })),
    [points],
  );

  const years = useMemo(() => {
    const arr: number[] = [];
    for (let y = MIN_YEAR; y <= MAX_YEAR; y++) arr.push(y);
    return arr;
  }, [MIN_YEAR, MAX_YEAR]);

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
    <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-(--brand)">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">الإيرادات الشهرية</h2>

        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">السنة</label>

          <div ref={menuRef} className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className="cursor-pointer px-3 py-1.5 rounded-md border border-gray-200 text-sm flex items-center gap-1 hover:bg-gray-50 focus:ring-2 focus:ring-orange-500"
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
                    className={`cursor-pointer w-full text-right px-3 py-2 text-sm transition-colors
              ${
                y === year
                  ? "bg-orange-100 text-(--brand) font-semibold"
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

      <SimpleBarChart
        points={barPoints}
        selectedId={String(selectedMonth)}
        onSelect={(id) => setSelectedMonth(Number(id))}
        summaryPrefix="الإيراد:"
        formatValue={(v) => v.toFixed(2)}
        loading={loading}
        emptyMessage="لا تتوفر بيانات للعرض في هذه السنة."
      />
    </div>
  );
}
