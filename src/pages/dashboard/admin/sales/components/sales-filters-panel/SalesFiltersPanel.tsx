import type { Dispatch, ReactNode, SetStateAction } from "react";
import { Search } from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";
import { SalesFilters } from "../../utils/salesFilters";

const CONTROL =
  "w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all duration-300 text-sm min-w-0";

function FilterField({
  label,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <label className="text-xs font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

type SetFilter = <K extends keyof SalesFilters>(
  key: K,
  value: SalesFilters[K],
) => void;

export default function SalesFiltersPanel({
  filters,
  setFilter,
  setFilters,
}: {
  filters: SalesFilters;
  setFilter: SetFilter;
  setFilters: Dispatch<SetStateAction<SalesFilters>>;
}) {
  const { data: subsectionsRes } = useCustomQuery(
    "/training/admin/subsections-ids/",
    ["subsections"],
  );
  const subsectionData = subsectionsRes?.data as any[] | undefined;

  const { data: cardsRes } = useCustomQuery("cards/", [
    "cards",
    "sales-filters",
  ]);
  const cardsList =
    (cardsRes as { data?: { data?: { id: string; price?: string }[] } })?.data
      ?.data ?? (cardsRes as { data?: { id: string; price?: string }[] })?.data;

  const { data: coursesRes } = useCustomQuery(
    "/training/admin/courses/?is_paginated=false",
    ["courses", "sales-filters"],
  );
  const coursesList =
    (coursesRes as { data?: { data?: { id: string; name: string }[] } })?.data
      ?.data ?? (coursesRes as { data?: { id: string; name: string }[] })?.data;

  const subSection = subsectionData?.find(
    (s: any) => String(s.id) === filters.subsection_id,
  );
  const subsub = subSection?.subsubsections?.find(
    (ss: any) => String(ss.id) === filters.subsubsection_id,
  );
  const spec = subsub?.specializations?.find(
    (sp: any) => String(sp.id) === filters.specialization_id,
  );
  const specMaterials =
    (spec?.specialization_materials?.length > 0
      ? spec?.specialization_materials
      : subsub?.specialization_materials) ?? [];

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-(--brand) w-full overflow-hidden">
      <div className="p-5 space-y-5">
        <FilterField label="بحث" hint="اسم الطالب أو رقم الجوال">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            <input
              type="search"
              autoComplete="off"
              value={filters.search}
              onChange={(e) => setFilter("search", e.target.value)}
              placeholder="ابحث بالاسم أو الجوال..."
              className={`${CONTROL} pr-10`}
            />
          </div>
        </FilterField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FilterField label="من تاريخ">
            <input
              type="date"
              value={filters.date_from}
              onChange={(e) => setFilter("date_from", e.target.value)}
              className={CONTROL}
            />
          </FilterField>
          <FilterField label="إلى تاريخ">
            <input
              type="date"
              value={filters.date_to}
              onChange={(e) => setFilter("date_to", e.target.value)}
              className={CONTROL}
            />
          </FilterField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <FilterField label="ترتيب العرض" hint="قائمة المبيعات فقط">
            <select
              value={filters.ordering}
              onChange={(e) => setFilter("ordering", e.target.value)}
              className={CONTROL}
            >
              <option value="-created_at">الأحدث إنشاءً</option>
              <option value="created_at">الأقدم إنشاءً</option>
              <option value="-activated_at">الأحدث تفعيلاً</option>
              <option value="activated_at">الأقدم تفعيلاً</option>
            </select>
          </FilterField>
          <FilterField label="عدد النتائج في الصفحة" hint="الحد الأقصى 100">
            <select
              value={filters.page_size}
              onChange={(e) =>
                setFilter(
                  "page_size",
                  Math.min(100, Math.max(1, Number(e.target.value))),
                )
              }
              className={CONTROL}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </FilterField>
          <FilterField label="البطاقة" hint="معرّف البطاقة (UUID)">
            <select
              value={filters.card_id}
              onChange={(e) => setFilter("card_id", e.target.value)}
              className={CONTROL}
            >
              <option value="">كل البطاقات</option>
              {cardsList?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.price ? `${c.id.slice(0, 8)}… — ${c.price}` : c.id}
                </option>
              ))}
            </select>
          </FilterField>
          <FilterField label="الدورة" hint="معرّف الدورة (UUID)">
            <select
              value={filters.course_id}
              onChange={(e) => setFilter("course_id", e.target.value)}
              className={CONTROL}
            >
              <option value="">كل الدورات</option>
              {coursesList?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </FilterField>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-700 mb-3">
            تصنيف الدورة (شجرة المقررات)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FilterField label="القسم الفرعي">
              <select
                value={filters.subsection_id}
                onChange={(e) => {
                  const v = e.target.value;
                  setFilters((prev) => ({
                    ...prev,
                    subsection_id: v,
                    subsubsection_id: "",
                    specialization_id: "",
                    specialization_material_id: "",
                    page: 1,
                  }));
                }}
                className={CONTROL}
              >
                <option value="">الكل</option>
                {subsectionData?.map((s: any) => (
                  <option key={s.id} value={s.id}>
                    {s.title ?? s.name}
                  </option>
                ))}
              </select>
            </FilterField>
            <FilterField label="القسم الفرعي الثاني">
              <select
                value={filters.subsubsection_id}
                onChange={(e) => {
                  const v = e.target.value;
                  setFilters((prev) => ({
                    ...prev,
                    subsubsection_id: v,
                    specialization_id: "",
                    specialization_material_id: "",
                    page: 1,
                  }));
                }}
                disabled={!filters.subsection_id}
                className={`${CONTROL} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <option value="">الكل</option>
                {subSection?.subsubsections?.map((ss: any) => (
                  <option key={ss.id} value={ss.id}>
                    {ss.title ?? ss.name}
                  </option>
                ))}
              </select>
            </FilterField>
            <FilterField label="التخصص">
              <select
                value={filters.specialization_id}
                onChange={(e) => {
                  const v = e.target.value;
                  setFilters((prev) => ({
                    ...prev,
                    specialization_id: v,
                    specialization_material_id: "",
                    page: 1,
                  }));
                }}
                disabled={!filters.subsubsection_id}
                className={`${CONTROL} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <option value="">الكل</option>
                {subsub?.specializations?.map((sp: any) => (
                  <option key={sp.id} value={sp.id}>
                    {sp.title ?? sp.name}
                  </option>
                ))}
              </select>
            </FilterField>
            <FilterField label="مادة التخصص">
              <select
                value={filters.specialization_material_id}
                onChange={(e) =>
                  setFilter("specialization_material_id", e.target.value)
                }
                disabled={!filters.subsubsection_id}
                className={`${CONTROL} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <option value="">الكل</option>
                {specMaterials.map((m: any) => (
                  <option key={m.id} value={m.id}>
                    {m.title ?? m.name}
                  </option>
                ))}
              </select>
            </FilterField>
          </div>
        </div>
      </div>
    </div>
  );
}
