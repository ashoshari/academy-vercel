import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import { useCustomQuery } from "@/hooks/useQuery";
import Spinner from "@/components/dashboard/Spinner";
import SalesFiltersPanel from "./components/SalesFiltersPanel";
import SalesListTable from "./components/SalesListTable";
import SalesStats from "./components/sales-stats/SalesStats";
import {
  buildMutualQueryString,
  buildSalesListQueryString,
  initialSalesFilters,
  mutualFilterKeyParts,
  type SalesFilters,
} from "./salesFilters";
import TimeSeries from "./components/time-series/TimeSeries";

interface NamedRef {
  id: string | null;
  title: string | null;
}

interface SalesByCategoryRow {
  subsection: NamedRef;
  subsubsection: NamedRef;
  specialization: NamedRef;
  specialization_material: NamedRef;
  sold_count: number;
  total_teacher_share: string;
  total_card_revenue: string;
}

interface SalesByCardRow {
  card_id: string;
  card_price: string;
  sold_count: number;
  total_teacher_share: string;
}

interface CardSalesStats {
  total_sales: number;
  total_teacher_share: string;
  total_card_revenue: string;
  by_category: SalesByCategoryRow[];
  by_card: SalesByCardRow[];
  applied_filters: Record<string, unknown>;
}

const TABLE_CARD =
  "w-full max-w-50 min-w-full pb-6 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-orange-100/50 overflow-hidden";

const TH =
  "px-6 py-3 text-right text-xs whitespace-nowrap font-medium text-gray-500 uppercase tracking-wider";
const TD = "px-6 py-4 whitespace-nowrap text-sm text-gray-900 tabular-nums";
const TD_TEXT = "px-6 py-4 whitespace-nowrap text-sm text-gray-900";

function cellTitle(ref: NamedRef | undefined): string {
  const t = ref?.title?.trim();
  return t || "—";
}

function SalesTableSection({
  title,
  count,
  countLabel,
  children,
}: {
  title: string;
  count: number;
  countLabel: string;
  children: ReactNode;
}) {
  return (
    <div className={TABLE_CARD}>
      <div className="p-6 border-b border-gray-200 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full min-w-0">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <div className="bg-gray-50 rounded-lg px-4 py-2 shrink-0">
          <span className="text-sm text-gray-600 whitespace-nowrap">
            {count} {countLabel}
          </span>
        </div>
      </div>
      <div className="overflow-x-auto w-full min-w-0">{children}</div>
    </div>
  );
}

const SalesPage = () => {
  const [filters, setFilters] = useState<SalesFilters>(initialSalesFilters);

  const setFilter = <K extends keyof SalesFilters>(
    key: K,
    value: SalesFilters[K],
  ) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };
      if (key !== "page") next.page = 1;
      return next;
    });
  };

  const setPage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const mutualQS = useMemo(() => buildMutualQueryString(filters), [filters]);
  const salesQS = useMemo(() => buildSalesListQueryString(filters), [filters]);

  const statsUrl = mutualQS
    ? `/v2/teacher/card-sales/stats/?${mutualQS}`
    : `/v2/teacher/card-sales/stats/`;

  const { data: statsResponse, isLoading: isLoadingStats } = useCustomQuery(
    statsUrl,
    ["sales-stats", ...mutualFilterKeyParts(filters)],
  );

  const { data: salesResponse, isLoading: isLoadingSales } = useCustomQuery(
    `/v2/teacher/card-sales/sales/?${salesQS}`,
    [
      "card-sales",
      "sales-list",
      ...mutualFilterKeyParts(filters),
      filters.ordering,
      filters.page,
      filters.page_size,
    ],
  );

  const stats: CardSalesStats | undefined = statsResponse?.data;
  const byCategory = stats?.by_category ?? [];
  const byCard = stats?.by_card ?? [];

  return (
    <div
      className="space-y-6 flex flex-col items-start justify-start w-full min-w-0"
      dir="rtl"
    >
      <div className="flex md:flex-row flex-col gap-5 items-center justify-between w-full">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">المبيعات</h1>
          <p className="text-gray-600 text-sm">إحصائيات مبيعات البطاقات</p>
        </div>
      </div>

      <SalesFiltersPanel
        filters={filters}
        setFilter={setFilter}
        setFilters={setFilters}
      />

      {isLoadingStats ? (
        <div className="flex justify-center w-full py-12">
          <Spinner size={40} thickness={4} className="text-orange-500" />
        </div>
      ) : (
        <>
          <SalesStats stats={stats} />
          <TimeSeries filters={filters} />

          <SalesTableSection
            title="حسب التصنيف"
            count={byCategory.length}
            countLabel="تصنيف"
          >
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className={TH}>القسم الفرعي</th>
                  <th className={TH}>القسم الفرعي الثاني</th>
                  <th className={TH}>التخصص</th>
                  <th className={TH}>المادة</th>
                  <th className={TH}>عدد المبيعات</th>
                  <th className={TH}>حصة المعلم</th>
                  <th className={TH}>إيراد البطاقة</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {byCategory.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-gray-500 text-sm"
                    >
                      لا توجد بيانات
                    </td>
                  </tr>
                ) : (
                  byCategory.map((row, idx) => (
                    <tr
                      key={`${row.subsection.id}-${row.specialization_material.id}-${idx}`}
                      className="hover:bg-gray-50"
                    >
                      <td className={TD_TEXT}>{cellTitle(row.subsection)}</td>
                      <td className={TD_TEXT}>
                        {cellTitle(row.subsubsection)}
                      </td>
                      <td className={TD_TEXT}>
                        {cellTitle(row.specialization)}
                      </td>
                      <td className={TD_TEXT}>
                        {cellTitle(row.specialization_material)}
                      </td>
                      <td className={TD}>{row.sold_count}</td>
                      <td className={TD}>{row.total_teacher_share}</td>
                      <td className={TD}>{row.total_card_revenue}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </SalesTableSection>

          <SalesTableSection
            title="حسب البطاقة"
            count={byCard.length}
            countLabel="بطاقة"
          >
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className={TH}>معرّف البطاقة</th>
                  <th className={TH}>سعر البطاقة</th>
                  <th className={TH}>عدد المبيعات</th>
                  <th className={TH}>حصة المعلم</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {byCard.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-gray-500 text-sm"
                    >
                      لا توجد بيانات
                    </td>
                  </tr>
                ) : (
                  byCard.map((row) => (
                    <tr key={row.card_id} className="hover:bg-gray-50">
                      <td
                        className={`${TD_TEXT} font-mono text-xs max-w-[min(100vw,320px)] truncate`}
                        title={row.card_id}
                      >
                        {row.card_id}
                      </td>
                      <td className={TD}>{row.card_price}</td>
                      <td className={TD}>{row.sold_count}</td>
                      <td className={TD}>{row.total_teacher_share}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </SalesTableSection>
        </>
      )}

      <SalesListTable
        filters={filters}
        setPage={setPage}
        salesResponse={salesResponse}
        isLoadingSales={isLoadingSales}
      />
    </div>
  );
};

export default SalesPage;
