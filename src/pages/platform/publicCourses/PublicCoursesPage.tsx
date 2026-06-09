import { useMemo, useState } from "react";
import { Grid3X3, LayoutGrid, RotateCcw } from "lucide-react";
import CourseCard from "@/components/core/CourseCard";
import PlatformSlider from "@/components/core/PlatformSlider";
import HeroNavbar from "@/layout/platform/navbar/HeroNavbar";
import BrandPagination from "@/components/core/BrandPagination";
import BrandSelect, {
  type BrandSelectOption,
} from "@/components/core/BrandSelect";
import FilterSection from "@/components/core/FilterSection";
import { CATEGORIES, FILTER_SECTIONS, MOCK_COURSES } from "./mockData";

const PAGE_SIZE = 9;
const TOTAL_PAGES = 10;

const SORT_OPTIONS: BrandSelectOption[] = [
  { value: "newest", label: "الأحدث" },
  { value: "popular", label: "الأكثر شعبية" },
  { value: "price-asc", label: "السعر: من الأقل" },
  { value: "price-desc", label: "السعر: من الأعلى" },
  { value: "rating", label: "التقييم" },
];

export default function PublicCoursesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<BrandSelectOption>(SORT_OPTIONS[0]);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, Set<string>>
  >(() =>
    Object.fromEntries(
      FILTER_SECTIONS.map((section) => [section.key, new Set<string>()]),
    ),
  );

  const toggleFilter = (sectionKey: string, optionId: string) => {
    setSelectedFilters((prev) => {
      const next = { ...prev };
      const sectionSet = new Set(prev[sectionKey]);
      if (sectionSet.has(optionId)) {
        sectionSet.delete(optionId);
      } else {
        sectionSet.add(optionId);
      }
      next[sectionKey] = sectionSet;
      return next;
    });
  };

  const resetFilters = () => {
    setSelectedFilters(
      Object.fromEntries(
        FILTER_SECTIONS.map((section) => [section.key, new Set<string>()]),
      ),
    );
  };

  const visibleCourses = useMemo(() => {
    const start = ((currentPage - 1) % 3) * 3;
    return MOCK_COURSES.slice(start, start + PAGE_SIZE);
  }, [currentPage]);

  const totalDisplayed = 24;

  return (
    <div className="min-h-screen bg-[#f9f9fb]">
      <section className="relative">
        <HeroNavbar />
        <PlatformSlider />
      </section>

      {/* Category bar */}
      <section className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          <h2 className="text-base font-bold text-brand-secondary mb-4">
            تصفح حسب الفئة
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  type="button"
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-100 bg-white hover:shadow-md hover:border-gray-200 transition-all cursor-pointer"
                >
                  <span
                    className="flex items-center justify-center w-12 h-12 rounded-full"
                    style={{ backgroundColor: category.iconBg }}
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{ color: category.iconColor }}
                    />
                  </span>
                  <span className="text-sm font-bold text-brand-secondary">
                    {category.title}
                  </span>
                  <span className="text-xs text-gray-500">
                    {category.subtitle}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters sidebar */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="filter-panel lg:sticky lg:top-6">
              <div className="filter-panel__header">
                <h2 className="filter-panel__title">تصفية النتائج</h2>
                <button
                  type="button"
                  className="filter-panel__reset"
                  onClick={resetFilters}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  إعادة ضبط
                </button>
              </div>

              {FILTER_SECTIONS.map((section) => (
                <FilterSection
                  key={section.key}
                  title={section.title}
                  options={section.options}
                  selected={selectedFilters[section.key]}
                  onToggle={(id) => toggleFilter(section.key, id)}
                />
              ))}
            </div>
          </aside>

          {/* Course grid */}
          <main className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-brand-secondary">
                  جميع الدورات
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  استكشف مجموعة واسعة من الدورات التعليمية المصممة لمساعدتك على
                  التفوق
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm text-gray-500">
                  عرض {totalDisplayed} دورة
                </span>

                <div className="flex items-center gap-1 p-1 bg-white border border-gray-200 rounded-lg">
                  <button
                    type="button"
                    className="p-1.5 rounded-md bg-gray-100 text-brand-secondary"
                    aria-label="عرض شبكي"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="p-1.5 rounded-md text-gray-400 hover:text-gray-600"
                    aria-label="عرض قائمة"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                </div>

                <BrandSelect
                  options={SORT_OPTIONS}
                  value={sortBy}
                  onChange={(option) => option && setSortBy(option)}
                  isSearchable={false}
                  minWidth={180}
                  aria-label="ترتيب الدورات"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {visibleCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>

            <div className="mt-10">
              <BrandPagination
                currentPage={currentPage}
                totalPages={TOTAL_PAGES}
                onPageChange={setCurrentPage}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
