import MultiSelectAutocomplete from "@/components/dashboard/admin/subsections/MultiSelector";
import { useCustomQuery } from "@/hooks/useQuery";
import { formatDateTimeSimple } from "@/utils/formatDateTime";
import { Search } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

type OptionId = string;

type MultiSelectOption = {
  id: OptionId;
  title: string;
};

type TriStateAll = "all" | "true" | "false" | "";

type CardCodesBatch = {
  id: OptionId;
  name?: string;
  created_at?: string;
  card?: { price?: number | string | null } | null;
};

type CardCodesQuery = {
  data?: {
    data?: CardCodesBatch[];
  };
};

type TeacherRef = { id: OptionId; name: string };
type TeachersQuery = { data?: TeacherRef[] };

type LibraryRef = { id: OptionId; name: string };
type LibrariesQuery = { data?: LibraryRef[] };

type GenerateCodesQuery = { pagination?: { count?: number } };

export type CardCodesFiltersProps = {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;

  codesFilter: OptionId[];
  setCodesFilter: Dispatch<SetStateAction<OptionId[]>>;

  teachersFilter: OptionId[];
  setTeachersFilter: Dispatch<SetStateAction<OptionId[]>>;

  librariesFilter: OptionId[];
  setLibrariesFilter: Dispatch<SetStateAction<OptionId[]>>;

  installmentFilter: TriStateAll;
  setInstallmentFilter: Dispatch<SetStateAction<TriStateAll>>;

  statusFilter: TriStateAll;
  setStatusFilter: Dispatch<SetStateAction<TriStateAll>>;

  loadAdminReferenceLists: boolean;
  cardCodes: { data?: CardCodesQuery } | undefined;

  isUsed: TriStateAll;
  setIsUsed: Dispatch<SetStateAction<TriStateAll>>;

  isCodeDownloaded: TriStateAll;
  setisCodeDownloaded: Dispatch<SetStateAction<TriStateAll>>;

  generateCodes: { data?: GenerateCodesQuery } | undefined;
};

function CardCodesFilters({
  searchTerm,
  setSearchTerm,
  codesFilter,
  setCodesFilter,
  teachersFilter,
  setTeachersFilter,
  librariesFilter,
  setLibrariesFilter,
  installmentFilter,
  setInstallmentFilter,
  statusFilter,
  setStatusFilter,
  loadAdminReferenceLists,
  cardCodes,
  isUsed,
  setIsUsed,
  isCodeDownloaded,
  setisCodeDownloaded,
  generateCodes,
}: CardCodesFiltersProps) {
  const { data: teachers } = useCustomQuery(
    "/account/admin/teachers/?pagination=false",
    ["teachers"],
    undefined,
    loadAdminReferenceLists,
  ) as { data?: TeachersQuery };
  const { data: libraries } = useCustomQuery(
    "/account/admin/libraries/",
    ["libraries"],
    undefined,
    loadAdminReferenceLists,
  ) as { data?: LibrariesQuery };
  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-(--brand)">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
        {/* Search */}
        <div className="relative col-span-1 lg:col-span-2">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="البحث في الكودات..."
            className="w-full h-full pr-10 pl-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all duration-300 text-sm"
          />
        </div>

        {/* Patchs Filter */}
        <div className="space-y-3">
          <MultiSelectAutocomplete
            value={codesFilter}
            onChange={setCodesFilter}
            options={
              (cardCodes?.data?.data?.data?.map((card) => ({
                id: String(card?.id ?? ""),
                title: `${card?.name ?? "—"} - ${card?.card?.price ?? "—"} - ${formatDateTimeSimple(
                  card?.created_at ?? "",
                )}`,
              })) ?? []) as MultiSelectOption[]
            }
            fullHeight={true}
            placeholder="جميع المجموعات"
            selectionDisplay="count"
            formatSelectionCount={(n) => `${n} مجموعة مختارة`}
          />
        </div>

        {loadAdminReferenceLists && (
          <>
            <div className="space-y-3">
              <MultiSelectAutocomplete
                value={teachersFilter}
                onChange={setTeachersFilter}
                options={
                  (teachers?.data?.map((teacher) => ({
                    id: String(teacher.id ?? ""),
                    title: teacher.name,
                  })) ?? []) as MultiSelectOption[]
                }
                fullHeight={true}
                placeholder="جميع المعلمين"
              />
            </div>

            <div className="space-y-3">
              <MultiSelectAutocomplete
                value={librariesFilter}
                onChange={setLibrariesFilter}
                options={
                  (libraries?.data?.map((library) => ({
                    id: String(library.id ?? ""),
                    title: library.name,
                  })) ?? []) as MultiSelectOption[]
                }
                fullHeight={true}
                placeholder="جميع المكتبات"
              />
            </div>
          </>
        )}

        {/* Installment Filter */}
        <select
          value={installmentFilter}
          onChange={(e) => setInstallmentFilter(e.target.value as any)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all duration-300 text-sm"
        >
          <option value="">جميع حالات التقسيط</option>
          <option value="true">يوجد تقسيط</option>
          <option value="false">لا يوجد تقسيط</option>
        </select>

        {/* Batch Filter */}
        <select
          value={isUsed || ""}
          onChange={(e) => setIsUsed(e.target.value as any)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all duration-300 text-sm"
        >
          <option value="all">جميع حالات الاستخدام</option>
          <option value="false">متاح</option>
          <option value="true">مستخدم</option>
        </select>

        {/* Download Filter */}
        <select
          value={isCodeDownloaded || ""}
          onChange={(e) => setisCodeDownloaded(e.target.value as any)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all duration-300 text-sm"
        >
          <option value="all">جميع حالات التحميل</option>
          <option value="true">تم التحميل</option>
          <option value="false">لم يتم التحميل</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all duration-300 text-sm"
        >
          <option value="all">جميع حالات التفعيل</option>
          <option value="true">مفعل</option>
          <option value="false">غير مفعل</option>
        </select>

        {/* Results Count */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex items-center justify-center bg-gray-50 rounded-lg px-4 py-2">
          <span className="text-sm text-gray-600">
            {generateCodes?.data?.pagination?.count} كود
          </span>
        </div>
      </div>
    </div>
  );
}

export default CardCodesFilters;
