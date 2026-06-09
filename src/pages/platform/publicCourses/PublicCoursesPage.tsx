import { useCallback, useEffect, useMemo, useState } from "react";
import { Grid3X3, LayoutGrid, RotateCcw, Search } from "lucide-react";
import { useNavigate } from "react-router";
import CourseCard from "@/components/core/CourseCard";
import { CardSkeletonGrid } from "@/components/core/CardSkeleton";
import PlatformSlider from "@/components/core/PlatformSlider";
import HeroNavbar from "@/layout/platform/navbar/HeroNavbar";
import BrandPagination from "@/components/core/BrandPagination";
import FilterSection from "@/components/core/FilterSection";
import EmptyState from "@/components/core/EmptyState";
import { useCustomQuery } from "@/hooks/platform/usePlatformQuery";
import useTokenStore from "@/store/platform/useToken";
import {
  buildCoursesQueryString,
  EMPTY_COURSE_FILTERS,
  type CourseFilters,
  type StudentCourse,
} from "./types";
import { useCourseFilterOptions } from "./useCourseFilterOptions";
import { CATEGORIES } from "./mockData";

const PAGE_SIZE = 9;

function singleSelectToggle(prev: Set<string>, id: string): Set<string> {
  return prev.has(id) ? new Set() : new Set([id]);
}

export default function PublicCoursesPage() {
  const navigate = useNavigate();
  const isLoggedIn = useTokenStore((state) => state.isLoggedIn);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState<CourseFilters>(EMPTY_COURSE_FILTERS);

  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, Set<string>>
  >({
    sections: new Set(),
    subsections: new Set(),
    subsubsections: new Set(),
    specializations: new Set(),
    materials: new Set(),
    courseType: new Set(),
  });

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 450);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: debouncedSearch }));
    setCurrentPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      section_id: [...selectedFilters.sections][0] ?? "",
      subsection_id: [...selectedFilters.subsections][0] ?? "",
      subsubsection_id: [...selectedFilters.subsubsections][0] ?? "",
      specialization_id: [...selectedFilters.specializations][0] ?? "",
      specialization_material_id: [...selectedFilters.materials][0] ?? "",
      is_free: selectedFilters.courseType.has("free") ? "true" : "",
      is_special: selectedFilters.courseType.has("special") ? "true" : "",
    }));
    setCurrentPage(1);
  }, [selectedFilters]);

  const { data: sectionsRes } = useCustomQuery("/training/admin/sections/", [
    "admin-sections",
    "public-courses",
  ]);

  const { data: subsectionsIdsRes } = useCustomQuery(
    "/training/admin/subsections-ids/",
    ["subsections-ids", "public-courses"],
  );

  const {
    sectionOptions,
    subsectionOptions,
    subsubsectionOptions,
    specializationOptions,
    materialOptions,
  } = useCourseFilterOptions(filters, sectionsRes, subsectionsIdsRes?.data);

  const queryString = buildCoursesQueryString(filters, currentPage, PAGE_SIZE);

  const {
    data: coursesRes,
    isLoading,
    isFetching,
  } = useCustomQuery(`/training/students/courses/?${queryString}`, [
    "public-courses",
    queryString,
  ]);

  const courses = (coursesRes?.data ?? []) as StudentCourse[];
  const totalCount = coursesRes?.pagination?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const showCourseSkeletons = isLoading || isFetching;

  const toggleFilter = useCallback((sectionKey: string, optionId: string) => {
    setSelectedFilters((prev) => {
      const next = { ...prev };
      const current = prev[sectionKey] ?? new Set<string>();
      next[sectionKey] = singleSelectToggle(current, optionId);

      if (sectionKey === "sections") {
        next.subsections = new Set();
        next.subsubsections = new Set();
        next.specializations = new Set();
        next.materials = new Set();
      } else if (sectionKey === "subsections") {
        next.subsubsections = new Set();
        next.specializations = new Set();
        next.materials = new Set();
      } else if (sectionKey === "subsubsections") {
        next.specializations = new Set();
        next.materials = new Set();
      } else if (sectionKey === "specializations") {
        next.materials = new Set();
      }

      return next;
    });
  }, []);

  const resetFilters = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setFilters(EMPTY_COURSE_FILTERS);
    setSelectedFilters({
      sections: new Set(),
      subsections: new Set(),
      subsubsections: new Set(),
      specializations: new Set(),
      materials: new Set(),
      courseType: new Set(),
    });
    setCurrentPage(1);
  };

  const handleCourseClick = (course: StudentCourse) => {
    if (isLoggedIn && course.is_enrolled && course.is_enrollment_active) {
      navigate(`/coursePage/${course.id}`);
      return;
    }

    if (course.teacher?.id) {
      const params = new URLSearchParams();
      if (filters.section_id) params.set("section_id", filters.section_id);
      if (course.subsection?.id)
        params.set("subsection_id", course.subsection.id);
      if (course.subsubsection?.id)
        params.set("subsubsection_id", course.subsubsection.id);
      if (course.specialization_material?.id)
        params.set(
          "specialization_material_id",
          course.specialization_material.id,
        );
      const qs = params.toString();
      navigate(`/teacher/${course.teacher.id}${qs ? `?${qs}` : ""}`);
    }
  };

  const filterSections = useMemo(
    () => [
      {
        key: "sections",
        title: "الأقسام",
        options: sectionOptions,
        defaultOpen: true,
      },
      {
        key: "subsections",
        title: "الأقسام الفرعيّة",
        options: subsectionOptions,
        defaultOpen: true,
      },
      {
        key: "subsubsections",
        title: "المستوى",
        options: subsubsectionOptions,
        defaultOpen: Boolean(selectedFilters.subsections.size),
        disabled: selectedFilters.subsections.size === 0,
      },
      {
        key: "specializations",
        title: "التخصص",
        options: specializationOptions,
        defaultOpen: Boolean(selectedFilters.subsubsections.size),
        disabled: selectedFilters.subsubsections.size === 0,
      },
      {
        key: "materials",
        title: "مواد التخصص",
        options: materialOptions,
        defaultOpen: Boolean(
          selectedFilters.specializations.size ||
          (selectedFilters.subsubsections.size &&
            specializationOptions.length === 0),
        ),
        disabled:
          selectedFilters.subsubsections.size === 0 ||
          materialOptions.length === 0,
      },
      {
        key: "courseType",
        title: "نوع الدورة",
        options: [
          { id: "free", label: "مجاني" },
          { id: "special", label: "مميزة" },
        ],
        defaultOpen: true,
      },
    ],
    [
      sectionOptions,
      subsectionOptions,
      subsubsectionOptions,
      specializationOptions,
      materialOptions,
      selectedFilters,
    ],
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (debouncedSearch) count++;
    for (const set of Object.values(selectedFilters)) {
      count += set.size;
    }
    return count;
  }, [debouncedSearch, selectedFilters]);

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="w-full lg:w-72 shrink-0">
            <div className="filter-panel lg:sticky lg:top-6">
              <div className="filter-panel__header">
                <h2 className="filter-panel__title">
                  تصفية النتائج
                  {activeFilterCount > 0 && (
                    <span className="mr-2 inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-(--brand) text-white text-xs font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </h2>
                <button
                  type="button"
                  className="filter-panel__reset"
                  onClick={resetFilters}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  إعادة ضبط
                </button>
              </div>

              <div className="px-4 py-3">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ابحث باسم الدورة أو الأستاذ..."
                    className="w-full pr-10 pl-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-(--brand)/30 focus:border-(--brand) transition-all"
                    aria-label="بحث باسم الدورة أو الأستاذ"
                  />
                </div>
              </div>

              {filterSections.map((section) =>
                section.disabled || section.options.length === 0 ? null : (
                  <FilterSection
                    key={section.key}
                    title={section.title}
                    options={section.options}
                    selected={selectedFilters[section.key] ?? new Set()}
                    onToggle={(id) => toggleFilter(section.key, id)}
                    defaultOpen={section.defaultOpen}
                  />
                ),
              )}
            </div>
          </aside>

          <main className="flex-1 min-w-0" id="courses-results">
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
                  {showCourseSkeletons
                    ? "جاري البحث..."
                    : `عرض ${courses.length} من ${totalCount} دورة`}
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
                    disabled
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {showCourseSkeletons ? (
              <CardSkeletonGrid count={PAGE_SIZE} variant="course" />
            ) : courses.length === 0 ? (
              <EmptyState
                title="لا توجد دورات"
                description="جرّب تعديل عوامل التصفية أو البحث بكلمة مختلفة."
                tone="info"
                size="lg"
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onClick={handleCourseClick}
                  />
                ))}
              </div>
            )}

            <div className="mt-10">
              <BrandPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
