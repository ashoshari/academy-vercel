import { Grid, Rows, Search } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

type ViewMode = "grid" | "table";

type CoursesFiltersProps = {
  role: string;
  teacherData: any[] | undefined;

  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;

  teacherFilter: any;
  setTeacherFilter: Dispatch<SetStateAction<any>>;

  statusFilter: any;
  setStatusFilter: Dispatch<SetStateAction<any>>;

  freeFilter: any;
  setFreeFilter: Dispatch<SetStateAction<any>>;

  viewMode: ViewMode;
  setViewMode: Dispatch<SetStateAction<ViewMode>>;
};

export default function CoursesFilters({
  role,
  teacherData,
  searchTerm,
  setSearchTerm,
  teacherFilter,
  setTeacherFilter,
  statusFilter,
  setStatusFilter,
  freeFilter,
  setFreeFilter,
  viewMode,
  setViewMode,
}: CoursesFiltersProps) {
  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-(--brand)">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="البحث في الدورات..."
            className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all duration-300 text-sm"
          />
        </div>

        {/* Teacher Filter */}
        {role !== "teacher" && (
          <select
            value={teacherFilter || ""}
            onChange={(e) => setTeacherFilter(e.target.value ? e.target.value : null)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all duration-300 text-sm"
          >
            <option value="">جميع المعلمين</option>
            {teacherData?.map((teacher: any) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
        )}

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all duration-300 text-sm"
        >
          <option value="">جميع الحالات</option>
          <option value="true">منشور</option>
          <option value="false">مسودة</option>
        </select>

        {/* Free Filter */}
        <select
          value={freeFilter}
          onChange={(e) => setFreeFilter(e.target.value as any)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all duration-300 text-sm"
        >
          <option value="all">جميع الأسعار</option>
          <option value="true">مجاني</option>
          <option value="false">مدفوع</option>
        </select>

        {/* View Mode */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("table")}
            className={`cursor-pointer p-2 rounded-lg transition-colors ${
              viewMode === "table"
                ? "bg-gray-100 text-(--brand)"
                : "text-gray-400 hover:bg-gray-100"
            }`}
            type="button"
          >
            <Rows size={16} />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`cursor-pointer p-2 rounded-lg transition-colors ${
              viewMode === "grid"
                ? "bg-gray-100 text-(--brand)"
                : "text-gray-400 hover:bg-gray-100"
            }`}
            type="button"
          >
            <Grid size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

