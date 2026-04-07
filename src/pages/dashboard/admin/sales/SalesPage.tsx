import { useMemo, useState } from "react";

import { useCustomQuery } from "@/hooks/useQuery";
import Spinner from "@/components/dashboard/Spinner";
import SalesListTable from "./components/sales-table/SalesTable";
import SalesStats from "./components/sales-stats/SalesStats";
import {
  buildMutualQueryString,
  buildSalesListQueryString,
  initialSalesFilters,
  mutualFilterKeyParts,
  type SalesFilters,
} from "./utils/salesFilters";
import TimeSeries from "./components/time-series/TimeSeries";
import SalesByCategory from "./components/sales-stats/StatsByCategory";
import StatsByCard from "./components/sales-stats/StatsByCard";
import SalesFiltersPanel from "./components/sales-filters-panel/SalesFiltersPanel";
import { CardSalesStats } from "./types/types";

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
          <SalesByCategory byCategory={byCategory} />
          <StatsByCard byCard={byCard} />
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
