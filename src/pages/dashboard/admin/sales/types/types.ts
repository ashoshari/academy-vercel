export interface NamedRef {
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

export interface CardSalesStats {
  total_sales: number;
  total_teacher_share: string;
  total_card_revenue: string;
  by_category: SalesByCategoryRow[];
  by_card: SalesByCardRow[];
  applied_filters: Record<string, unknown>;
}

interface SalesCategory {
  subsection: NamedRef;
  subsubsection: NamedRef;
  specialization: NamedRef;
  specialization_material: NamedRef;
}

interface SalesRow {
  enrollment_id: string;
  activated_at: string;
  student: { id: string; name: string; mobile_number: string };
  course: { id: string; name: string };
  card: { id: string; price: string };
  teacher_share: string;
  share_percent_of_card: string;
  category: SalesCategory;
}

export interface SalesListResponse {
  count: number;
  page: number;
  page_size: number;
  data: SalesRow[];
}

export type TimeseriesChartRow = {
  year: number;
  month: number;
  label: string;
  total_teacher_share: string;
  total_sales: number;
};

export type TimeseriesPayload = {
  granularity: string;
  chart: TimeseriesChartRow[];
};
