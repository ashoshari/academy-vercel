/** Shared filter model: mutual params (stats + sales) + sales-list-only params */

export type SalesFilters = {
  search: string;
  date_from: string;
  date_to: string;
  card_id: string;
  course_id: string;
  subsection_id: string;
  subsubsection_id: string;
  specialization_id: string;
  specialization_material_id: string;
  ordering: string;
  page: number;
  page_size: number;
};

export const initialSalesFilters: SalesFilters = {
  search: "",
  date_from: "",
  date_to: "",
  card_id: "",
  course_id: "",
  subsection_id: "",
  subsubsection_id: "",
  specialization_id: "",
  specialization_material_id: "",
  ordering: "-created_at",
  page: 1,
  page_size: 10,
};

/** Query string for `/stats/` and mutual part of `/sales/` */
export function buildMutualQueryString(f: SalesFilters): string {
  const p = new URLSearchParams();
  if (f.search.trim()) p.append("search", f.search.trim());
  if (f.date_from) p.append("date_from", f.date_from);
  if (f.date_to) p.append("date_to", f.date_to);
  if (f.card_id) p.append("card_id", f.card_id);
  if (f.course_id) p.append("course_id", f.course_id);
  if (f.subsection_id) p.append("subsection_id", f.subsection_id);
  if (f.subsubsection_id) p.append("subsubsection_id", f.subsubsection_id);
  if (f.specialization_id) p.append("specialization_id", f.specialization_id);
  if (f.specialization_material_id)
    p.append("specialization_material_id", f.specialization_material_id);
  return p.toString();
}

/** Full query string for `/sales/` list (mutual + pagination + ordering) */
export function buildSalesListQueryString(f: SalesFilters): string {
  const base = buildMutualQueryString(f);
  const p = new URLSearchParams(base);
  if (f.ordering) p.append("ordering", f.ordering);
  p.append("page", String(f.page));
  p.append(
    "page_size",
    String(Math.min(100, Math.max(1, Math.floor(f.page_size)))),
  );
  return p.toString();
}

/** Timeseries/chart API: mutual filters + optional `year` (calendar year for 12 months) */
export function buildTimeseriesQueryString(
  f: SalesFilters,
  year?: number | "",
): string {
  const p = new URLSearchParams(buildMutualQueryString(f));
  if (year !== undefined && year !== "") p.append("year", String(year));
  return p.toString();
}

/** Stable list for React Query keys (mutual filters only) */
export function mutualFilterKeyParts(f: SalesFilters) {
  return [
    f.search,
    f.date_from,
    f.date_to,
    f.card_id,
    f.course_id,
    f.subsection_id,
    f.subsubsection_id,
    f.specialization_id,
    f.specialization_material_id,
  ] as const;
}
