import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";
import { useClickOutside } from "@/hooks/useClickOutside";
import SimpleBarChart, {
  type SimpleBarPoint,
} from "@/components/dashboard/admin/charts/SimpleBarChart";
import {
  buildMutualQueryString,
  buildTimeseriesQueryString,
  type SalesFilters,
} from "../../utils/salesFilters";
import { TimeseriesChartRow, TimeseriesPayload } from "../../types/types";

function parseTimeseriesPayload(raw: unknown): TimeseriesPayload | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as Record<string, unknown>;
  const inner = (r.data as Record<string, unknown> | undefined) ?? r;
  const chart = inner.chart;
  if (!Array.isArray(chart)) return undefined;
  return {
    granularity: String(inner.granularity ?? "month"),
    chart: chart as TimeseriesChartRow[],
  };
}

const now = new Date();
const CURRENT_YEAR = now.getFullYear();
const MIN_YEAR = CURRENT_YEAR - 5;
const MAX_YEAR = CURRENT_YEAR + 2;

export default function TimeSeries({ filters }: { filters: SalesFilters }) {
  const [chartYear, setChartYear] = useState<number | "">("");
  const [selectedBarId, setSelectedBarId] = useState<string | null>(null);
  const [yearMenuOpen, setYearMenuOpen] = useState(false);
  const yearMenuRef = useRef<HTMLDivElement | null>(null);

  const qs = useMemo(
    () => buildTimeseriesQueryString(filters, chartYear),
    [filters, chartYear],
  );

  const mutualKey = buildMutualQueryString(filters);
  const { data: raw, isLoading } = useCustomQuery(
    `/v2/teacher/card-sales/timeseries/?${qs}`,
    [
      "card-sales-timeseries",
      mutualKey,
      chartYear === "" ? "rolling" : chartYear,
    ],
  );

  const payload = useMemo(() => parseTimeseriesPayload(raw), [raw]);
  const chartRows = useMemo(() => payload?.chart ?? [], [payload?.chart]);

  const { salesPoints, sharePoints } = useMemo(() => {
    const sales: SimpleBarPoint[] = [];
    const share: SimpleBarPoint[] = [];

    for (const r of chartRows) {
      const id = `${r.year}-${r.month}`;
      const labelShort = String(r.month);
      const labelFull = r.label;

      sales.push({
        id,
        value: r.total_sales,
        labelFull,
        labelShort,
      });

      share.push({
        id,
        value: Math.max(0, parseFloat(r.total_teacher_share) || 0),
        labelFull,
        labelShort,
      });
    }

    return { salesPoints: sales, sharePoints: share };
  }, [chartRows]);

  const { salesPointIds, firstSalesId } = useMemo(() => {
    if (!salesPoints.length) {
      return {
        salesPointIds: new Set<string>(),
        salesCount: 0,
        firstSalesId: null as string | null,
      };
    }

    return {
      salesPointIds: new Set(salesPoints.map((p) => p.id)),
      salesCount: salesPoints.length,
      firstSalesId: salesPoints[0].id,
    };
  }, [salesPoints]);

  useEffect(() => {
    if (!firstSalesId) {
      setSelectedBarId(null);
      return;
    }

    setSelectedBarId((prev) =>
      prev && salesPointIds.has(prev) ? prev : firstSalesId,
    );
  }, [firstSalesId, salesPointIds]);

  useClickOutside(yearMenuRef, () => setYearMenuOpen(false), yearMenuOpen);

  const yearOptions = useMemo(() => {
    const arr: number[] = [];
    for (let y = MIN_YEAR; y <= MAX_YEAR; y++) arr.push(y);
    return arr;
  }, []);

  const selectedIdForCharts =
    selectedBarId && salesPointIds.has(selectedBarId)
      ? selectedBarId
      : firstSalesId;

  return (
    <div
      className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50 w-full"
      dir="rtl"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800">
            المبيعات عبر الزمن
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <label className="text-sm text-gray-600 whitespace-nowrap">
            سنة الرسم البياني
          </label>
          <div ref={yearMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setYearMenuOpen((v) => !v)}
              className="cursor-pointer px-3 py-1.5 rounded-md border border-gray-200 text-sm flex items-center gap-1 hover:bg-gray-50 focus:ring-2 focus:ring-orange-500 min-w-34 justify-between"
              aria-haspopup="listbox"
              aria-expanded={yearMenuOpen}
            >
              {chartYear === "" ? "آخر 12 شهرًا" : chartYear}
              <ChevronDown size={14} className="text-gray-500" />
            </button>
            {yearMenuOpen && (
              <div
                className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-y-auto z-20"
                role="listbox"
              >
                <button
                  type="button"
                  onClick={() => {
                    setChartYear("");
                    setYearMenuOpen(false);
                  }}
                  className={`cursor-pointer w-full text-right px-3 py-2 text-sm transition-colors ${
                    chartYear === ""
                      ? "bg-orange-100 text-orange-700 font-semibold"
                      : "text-gray-700 hover:bg-orange-50"
                  }`}
                >
                  آخر 12 شهرًا
                </button>
                {yearOptions.map((y) => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => {
                      setChartYear(y);
                      setYearMenuOpen(false);
                    }}
                    className={`cursor-pointer w-full text-right px-3 py-2 text-sm transition-colors ${
                      y === chartYear
                        ? "bg-orange-100 text-orange-700 font-semibold"
                        : "text-gray-700 hover:bg-orange-50"
                    }`}
                    role="option"
                  >
                    {y}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-3">
            عدد المبيعات
          </h3>
          <SimpleBarChart
            points={salesPoints}
            selectedId={selectedIdForCharts}
            onSelect={setSelectedBarId}
            summaryPrefix="المبيعات:"
            formatValue={(v) => String(Math.round(v))}
            loading={isLoading}
            emptyMessage="لا توجد بيانات للمبيعات في هذه الفترة."
          />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-3">
            حصة المعلم
          </h3>
          <SimpleBarChart
            points={sharePoints}
            selectedId={selectedIdForCharts}
            onSelect={setSelectedBarId}
            summaryPrefix="القيمة:"
            formatValue={(v) => v.toFixed(2)}
            loading={isLoading}
            emptyMessage="لا توجد بيانات لحصة المعلم في هذه الفترة."
          />
        </div>
      </div>
    </div>
  );
}
