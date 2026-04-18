import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Eye,
  EyeOff,
  BookOpen,
  Users,
  CheckCircle,
  Save,
  ArrowRight,
  Rows,
  Grid,
  User,
  XCircle,
  Settings,
} from "lucide-react";
import CourseContentPage from "@/components/dashboard/admin/courses/CourseContentPage";
import { useCustomQuery } from "@/hooks/useQuery";
import {
  useCustomPost,
  useCustomUpdate,
  useCustomRemove,
} from "@/hooks/useMutation";
import toast from "react-hot-toast";
import { formatDate } from "@/services/date";
import Pagination from "@/components/dashboard/core/Pagination";
import { ConfirmationModal } from "@/components/dashboard/core/ConfirmationModal";
import StatusToggleButton from "@/components/dashboard/core/StatusToggleButton";
import { useQueryClient } from "@tanstack/react-query";
import { readUserFromStorage, roleOf } from "@/services/auth";
import CourseActivation from "./CourseActivation";
import EditButton from "@/components/dashboard/core/EditButton";
import DeleteButton from "@/components/dashboard/core/DeleteButton";
import DashboardStatCard, {
  DASHBOARD_STATS_GRID_4,
} from "@/components/dashboard/admin/cards/DashboardStatCard";
import Skeleton from "@/components/dashboard/Skeleton";
import StatsCardsSkeleton from "@/components/dashboard/skeletons/StatsCardsSkeleton";
import TableSkeleton from "@/components/dashboard/skeletons/TableSkeleton";
import MultiSelectAutocomplete from "@/components/dashboard/admin/subsections/MultiSelector";

function parseImportOfferTargetIds(course: any): string[] {
  const fromIds = Array.isArray(course?.import_offer_target_ids)
    ? course.import_offer_target_ids
    : [];
  const fromTargets = Array.isArray(course?.import_offer_targets)
    ? course.import_offer_targets
    : [];

  const ids: string[] = [];
  const push = (item: unknown) => {
    if (typeof item === "string" && item) ids.push(item);
    else if (
      item &&
      typeof item === "object" &&
      "id" in (item as Record<string, unknown>)
    ) {
      const id = String((item as { id: string }).id);
      if (id) ids.push(id);
    }
  };
  for (const item of fromIds) push(item);
  for (const item of fromTargets) push(item);
  return [...new Set(ids)];
}

function courseWithNormalizedOfferImports(course: any) {
  if (!course) return course;

  const ids = parseImportOfferTargetIds(course).slice(0, 1);

  if (ids.length === 0) {
    // ❌ remove the field completely
    const { ...rest } = course;
    return rest;
  }

  return { ...course, import_offer_target_ids: ids };
}

/** Ensures the current import-offer target appears in the picker (list may omit it). */
function buildImportOfferEditOptions(
  picklistData: any[] | undefined,
  editingCourseId: string | undefined,
  selectedCourse: any,
) {
  const base =
    picklistData
      ?.filter((c: any) => String(c.id) !== String(editingCourseId))
      .map((c: any) => ({
        id: String(c.id),
        title: c.name ?? "—",
      })) ?? [];

  const selId = selectedCourse?.import_offer_target_ids?.[0];
  if (!selId) return base;
  if (base.some((o) => o.id === String(selId))) return base;

  const fromApi = Array.isArray(selectedCourse?.import_offer_targets)
    ? selectedCourse.import_offer_targets.find(
        (t: any) => String(t.id) === String(selId),
      )
    : null;

  return [{ id: String(selId), title: fromApi?.name ?? "—" }, ...base];
}

const CoursesPage = () => {
  const user = readUserFromStorage();
  const role = roleOf(user) ?? "";
  const [currentView, setCurrentView] = useState<
    "list" | "create" | "edit" | "content" | "activate"
  >("list");
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [teacherFilter, setTeacherFilter] = useState<any>(null);
  // const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [freeFilter, setFreeFilter] = useState<any>();
  const [statusFilter, setStatusFilter] = useState<any>();
  // const [levelFilter] = useState<
  //   "all" | "beginner" | "intermediate" | "advanced"
  // >("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [courseId, setCourseId] = useState<any>(null);
  const [pendingCoursePublishToggle, setPendingCoursePublishToggle] = useState<{
    id: string;
    isPublished: boolean;
    title: string;
  } | null>(null);
  const [pendingDeleteCourse, setPendingDeleteCourse] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [paginationFilter, setPaginationFilter] = useState({
    page: 1,
    page_size: 6,
  });
  const queryClient = useQueryClient();

  const queryParams = new URLSearchParams();
  if (searchTerm) queryParams.append("name", searchTerm);
  if (role !== "teacher" && teacherFilter)
    queryParams.append("teacher", teacherFilter);
  // if (categoryFilter) queryParams.append("material", categoryFilter);
  if (freeFilter !== null && freeFilter !== undefined)
    queryParams.append("is_free", freeFilter);
  if (statusFilter) queryParams.append("is_published", statusFilter);
  queryParams.append("page", String(paginationFilter?.page));
  queryParams.append("page_size", String(paginationFilter?.page_size));
  const queryString = queryParams.toString();
  // GET courses
  const { data, isLoading } = useCustomQuery(
    `/training/admin/courses/?${queryString}`,
    [
      "courses",
      paginationFilter,
      searchTerm,
      teacherFilter,
      freeFilter,
      statusFilter,
      role,
    ],
  );

  const courseData = data?.data;
  const paginationData = data?.pagination;

  // GET courses stats
  const { data: coursesStats, isLoading: isLoadingCourseStats } =
    useCustomQuery("/training/admin/courses-statistics/", [
      "courses-stats",
      role,
    ]);
  // GET teachers
  const { data: teachers } = useCustomQuery(
    "/account/admin/teachers/?page_size=9999",
    ["teachers"],
    undefined,
    !["teacher", "library"].includes(role.toLowerCase()),
  );

  const teacherData = teachers?.data;
  // GET Specializations
  // const { data: specializations } = useCustomQuery(
  //   "/training/admin/specializations/",
  //   ["specializations"]
  // );

  // GET Codes
  const { data: cards } = useCustomQuery("/cards/", ["cards"]);

  // GET Specializations_material
  // const { data: specialization_material } = useCustomQuery(
  //   "/training/admin/specialization-materials/",
  //   ["specializations_material"]
  // );

  // GET SubSection
  const { data: subsections } = useCustomQuery(
    "/training/admin/subsections-ids/",
    ["subsections"],
  );
  const subsectionData = subsections?.data;
  // const specializationData = specializations?.data;
  // const specialization_materialData = specialization_material?.data;
  const cardsData = cards?.data;

  const [editSections, setEditSections] = useState(false);
  const [selectedSubSection, setSelectedSubSection] = useState<string>("");
  const [selectedSubSub, setSelectedSubSub] = useState<string>("");
  const [selectedSpec, setSelectedSpec] = useState<string>("");
  const subSection = subsectionData?.find(
    (s: any) => s.id === selectedSubSection,
  );
  const subsub = subSection?.subsubsections?.find(
    (ss: any) => ss.id === selectedSubSub,
  );
  const spec = subsub?.specializations?.find(
    (sp: any) => sp.id === selectedSpec,
  );

  const [courses, setCourses] = useState<any>();
  useEffect(() => {
    setCourses(courseData);
  }, [courseData]);
  const courseStatsData = coursesStats?.data;

  const [newCourse, setNewCourse] = useState<any>({
    is_free: true,
    is_published: true,
    is_special: false,
    is_show_general_questions: true,
  });

  // PUT Course
  const { mutateAsync: editCourse, isPending: isEditing } = useCustomUpdate(
    () => `/training/admin/courses/${courseId}/`,
    ["editcourses", courseId],
  );

  const { mutateAsync: publishCourse, isPending: isPublishing } =
    useCustomUpdate(
      () =>
        `/training/admin/courses/${pendingCoursePublishToggle?.id ?? "noop"}/`,
      ["courses", "courses-stats"],
    );

  // POST New Course
  const { mutateAsync: createCourse, isPending: isCreating } = useCustomPost(
    "/training/admin/courses/",
    ["postCourses"],
  );

  // DELETE Courses
  const { mutateAsync: deleteCourse, isPending: isDeleting } = useCustomRemove(
    `/training/admin/courses/${courseId}/`,
    ["deleteCourses", courseId],
  );

  const handleCreateCourse = async () => {
    const formData = new FormData();
    if (newCourse.name) formData.append("name", newCourse.name);
    if (newCourse.short_description)
      formData.append("short_description", newCourse.short_description);
    if (newCourse.long_description)
      formData.append("long_description", newCourse.long_description);
    if (role !== "teacher" && newCourse.teacher)
      formData.append("teacher", newCourse.teacher);
    // newCourse.level && formData.append("level", newCourse?.level);
    if (newCourse.time_in_hours)
      formData.append("time_in_hours", newCourse.time_in_hours);
    if (newCourse.is_free)
      formData.append("is_free", newCourse.is_free || true);
    if (newCourse.card_price)
      formData.append("card_price", newCourse.card_price || null);
    if (newCourse.start_date)
      formData.append("start_date", newCourse.start_date);
    if (newCourse.end_date) formData.append("end_date", newCourse.end_date);
    if (newCourse.subsection)
      formData.append("subsection", newCourse.subsection);
    if (newCourse.subsubsection)
      formData.append("subsubsection", newCourse.subsubsection);
    if (newCourse.specialization)
      formData.append("specialization", newCourse.specialization);
    if (newCourse.specialization_material)
      formData.append(
        "specialization_material",
        newCourse.specialization_material,
      );
    if (newCourse.is_published) {
      formData.append("is_published", newCourse.is_published ?? true);
    }
    if (newCourse.is_special) {
      formData.append("is_special", newCourse.is_special || false);
    }
    if (newCourse.is_show_general_questions) {
      formData.append(
        "is_show_general_questions",
        newCourse.is_show_general_questions || true,
      );
    }
    if (newCourse.image instanceof File && newCourse.image) {
      formData.append("image", newCourse.image);
    }
    try {
      const res = await createCourse(formData);
      toast.success(res.message ?? "تم الحفظ بنجاح");
      setNewCourse({
        is_free: true,
        is_published: true,
        is_special: false,
        is_show_general_questions: true,
        import_offer_target_ids: [],
      });
      setSelectedSubSection("");
      setSelectedSubSub("");
      setSelectedSpec("");
      setCurrentView("list");
      queryClient.invalidateQueries({
        queryKey: [
          "courses",
          paginationFilter,
          searchTerm,
          teacherFilter,
          freeFilter,
          statusFilter,
        ],
      });
      queryClient.invalidateQueries({ queryKey: ["courses-stats"] });
    } catch (err: any) {
      toast.error(err?.response?.data?.error);
    }
  };
  const handleEditCourse = async () => {
    if (!selectedCourse?.id) {
      toast.error("لم يتم تحديد كورس للتعديل");
      return;
    }
    const currentCourse = courseData?.find(
      (course: any) => course?.id === selectedCourse?.id,
    );
    if (!currentCourse) {
      toast.error("هذا الكورس غير موجود");
      return;
    }

    const changedData = Object.keys(selectedCourse)
      .filter(
        (key) =>
          selectedCourse[key as keyof typeof selectedCourse] !==
          currentCourse[key as keyof typeof currentCourse],
      )
      .reduce(
        (acc, key) => {
          acc[key] = selectedCourse[key as keyof typeof selectedCourse];
          return acc;
        },
        {} as Record<string, any>,
      );

    try {
      const formData = new FormData();

      Object.entries(changedData).forEach(([key, value]) => {
        if (key === "import_offer_targets") return;
        if (value instanceof File) {
          formData.append(key, value);
        } else if (key === "import_offer_target_ids" && Array.isArray(value)) {
          formData.append(key, value[0] ?? "");
        } else {
          formData.append(key, String(value));
        }
      });

      const res = await editCourse(formData);
      toast.success(res.message ?? "تم الحفظ بنجاح");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      setCurrentView("list");
      setSelectedSubSection("");
      setSelectedSubSub("");
      setSelectedSpec("");
      setEditSections(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.error);
    }
  };

  const requestDeleteCourse = (course: any) => {
    const id = String(course?.id ?? "");
    if (!id) return;
    setCourseId(id);
    setPendingDeleteCourse({
      id,
      title: String(course?.name ?? "—"),
    });
  };

  const confirmDeleteCourse = async () => {
    if (!pendingDeleteCourse) return;
    try {
      const response: any = await deleteCourse();
      toast.success(response.message ?? "تم الحذف بنجاح");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      setPendingDeleteCourse(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.error);
    }
  };

  const toggleCourseStatus = async (courseId: string) => {
    setCourses((prev: any) =>
      prev?.map((course: any) =>
        course?.id === courseId
          ? { ...course, is_published: !course?.is_published }
          : course,
      ),
    );
    const updateCourse = courses.find((c: any) => c?.id === courseId);
    const newStatus = !updateCourse?.is_published;
    try {
      await publishCourse({ is_published: newStatus });
      toast.success("تم تعديل حالة الدورة بنجاح");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      setPendingCoursePublishToggle(null);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || "حدث خطاء في تعديل حالة الدورة",
      );
      setCourses((prevCourses: any) =>
        prevCourses.map((course: any) =>
          course.id === courseId
            ? { ...course, is_published: !course.is_published }
            : course,
        ),
      );
    }
  };

  const requestCoursePublishToggle = (course: any) => {
    setPendingCoursePublishToggle({
      id: String(course?.id ?? ""),
      isPublished: Boolean(course?.is_published),
      title: String(course?.name ?? course?.title ?? "—"),
    });
  };
  const getLevelColor = (level: any) => {
    switch (level) {
      case "مبتدئ":
        return "bg-green-100 text-green-800";
      case "متوسط":
        return "bg-gray-100 text-(--brand)";
      case "متقدم":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const CourseCard = ({ course }: { course: any }) => (
    <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-(--brand) overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        <img
          loading="lazy"
          src={
            course?.image ||
            "https://www.malvernbh.com/wp-content/uploads/2023/02/shutterstock_1079701271-1-min-1010x673.jpg"
          }
          alt={course?.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>

        {/* Status Badges */}
        <div className="absolute top-4 right-4 flex gap-2">
          {course?.is_special && (
            <span className="bg-(--brand) text-white px-2 py-1 rounded-full text-xs font-medium">
              مميز
            </span>
          )}
          {course?.is_free && (
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              مجاني
            </span>
          )}
        </div>
        {course?.level?.name && (
          <div className="absolute top-4 left-4 flex gap-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(
                course?.level?.name,
              )}`}
            >
              {course?.level?.name}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col">
        {/* Header */}
        <div className="mb-4 h-20">
          <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
            {course?.name}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {course?.short_description}
          </p>
        </div>

        <div>
          {/* Teacher */}
          {role !== "teacher" && (
            <div className="flex items-center gap-3 mb-4">
              {course?.teacher?.image ? (
                <img
                  loading="lazy"
                  src={course?.teacher?.image}
                  alt={course?.teacher?.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <User size={24} className="text-gray-500" />
              )}
              <div>
                <p className="font-medium text-gray-800 text-sm">
                  {course?.teacher?.name}
                </p>
                <p className="text-gray-500 text-xs">
                  {course?.teacher?.materials?.map(
                    (material: any) => `${material.name} `,
                  )}
                </p>
              </div>
            </div>
          )}
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800">
                {course?.specialization_material?.name || "-"}
              </div>
              <div className="text-xs text-gray-500">مادة التخصص</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-(--brand-secondary)">
                {course?.time_in_hours ? course?.time_in_hours + "h" : "-"}
              </div>
              <div className="text-xs text-gray-500">ساعة</div>
            </div>

            {/* Is Free */}
            <div className="text-center col-span-2">
              <div className="text-lg font-bold text-green-600">
                {course.is_free
                  ? "مجاني"
                  : `${
                      course?.card_price?.price
                        ? course?.card_price?.price + " د.أ"
                        : "-"
                    }`}
              </div>
              <div className="text-xs text-gray-500">السعر</div>
            </div>
          </div>

          {/* Status */}
          <div className="flex gap-2 mb-4">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                course?.is_published
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {course?.is_published ? "منشور" : "مسودة"}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setSelectedCourse(course);
                setCurrentView("content");
              }}
              className="cursor-pointer p-2 text-gray-400 hover:text-(--brand-secondary) hover:bg-blue-50 rounded-lg transition-colors"
              title="إدارة المحتوى"
            >
              <Settings size={16} />
            </button>

            <StatusToggleButton
              isOn={Boolean(course?.is_published)}
              onToggle={() => {
                requestCoursePublishToggle(course);
              }}
              titleOn="إلغاء النشر"
              titleOff="نشر الدورة"
            />
          </div>

          <div className="flex items-center gap-1">
            <EditButton
              onClick={() => {
                setSelectedCourse(courseWithNormalizedOfferImports(course));
                setCurrentView("edit");
              }}
              className="cursor-pointer p-2 text-gray-400 hover:text-(--brand) hover:bg-gray-50 rounded-lg transition-colors"
              title="تعديل الدورة"
            />
            <DeleteButton
              onClick={() => {
                requestDeleteCourse(course);
              }}
              title="حذف الدورة"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Course Content Management View
  if (currentView === "content" && selectedCourse) {
    return (
      <CourseContentPage
        course={selectedCourse}
        onBack={() => setCurrentView("list")}
        onUpdateCourse={(updatedCourse: any) => {
          // setCourses(
          //   courses.map((course) =>
          //     course.id === updatedCourse.id ? updatedCourse : course
          //   )
          // );
          setSelectedCourse(courseWithNormalizedOfferImports(updatedCourse));
        }}
      />
    );
  }
  // Create Course View
  if (currentView === "create") {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setNewCourse({
                is_free: true,
                is_published: true,
                is_special: false,
                is_show_general_questions: true,
                import_offer_target_ids: [],
              });
              setSelectedSubSection("");
              setSelectedSubSub("");
              setSelectedSpec("");
              setCurrentView("list");
            }}
            className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowRight size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              إنشاء دورة جديدة
            </h1>
            <p className="text-gray-600 text-sm">
              أضف دورة تعليمية جديدة للمنصة
            </p>
          </div>
        </div>

        {/* Create Form */}
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-8 border border-(--brand)">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Info */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">
                المعلومات الأساسية
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان الدورة *
                </label>
                <input
                  type="text"
                  value={newCourse?.name || ""}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                  placeholder="أدخل عنوان الدورة..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف مختصر
                </label>
                <input
                  type="text"
                  value={newCourse?.short_description || ""}
                  onChange={(e) =>
                    setNewCourse({
                      ...newCourse,
                      short_description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                  placeholder="وصف مختصر للدورة..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوصف التفصيلي
                </label>
                <textarea
                  value={newCourse?.long_description || ""}
                  onChange={(e) =>
                    setNewCourse({
                      ...newCourse,
                      long_description: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all resize-none"
                  placeholder="وصف تفصيلي للدورة..."
                />
              </div>

              {/* Teacher and specialization */}
              {role !== "teacher" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المعلم *
                    </label>
                    <select
                      value={newCourse?.teacher || ""}
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          teacher: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                    >
                      <option value="">اختر المعلم</option>
                      {teacherData
                        ?.filter((t: any) => t?.is_active)
                        .map((teacher: any) => (
                          <option key={teacher.id} value={teacher.id}>
                            {teacher.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المدة (بالساعات)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  lang="en"
                  value={newCourse?.time_in_hours || 0}
                  onChange={(e) =>
                    setNewCourse({
                      ...newCourse,
                      time_in_hours: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                  placeholder="40"
                  min="0"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="imageUpload"
                  className="block text-sm font-medium text-gray-700"
                >
                  الصورة المصغرة
                </label>
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="imageUpload"
                    className="btn-brand-slide cursor-pointer px-4 py-3 text-white text-sm font-medium rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-(--brand) transition-all"
                  >
                    اختر الصورة المصغرة
                  </label>

                  <input
                    id="imageUpload"
                    type="file"
                    className="invisible w-0 h-0"
                    onChange={(e) => {
                      setNewCourse({
                        ...newCourse,
                        image: e.target.files?.[0],
                      });
                    }}
                    accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, image/svg+xml"
                  />

                  <span id="fileName" className="text-sm text-gray-500">
                    {newCourse?.image
                      ? newCourse?.image?.name
                      : "لم يتم اختيار صورة"}
                  </span>
                  {(typeof newCourse?.image === "string" ||
                    newCourse?.image instanceof File) && (
                    <img
                      loading="lazy"
                      src={
                        newCourse?.image instanceof File
                          ? URL.createObjectURL(newCourse.image)
                          : newCourse?.image
                      }
                      alt="Preview"
                      className="w-10 h-10 object-cover rounded"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Settings and Targeting */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">
                الإعدادات والاستهداف
              </h2>

              {/* Pricing */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  التسعير *
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="pricing"
                      checked={newCourse?.is_free === true}
                      onChange={() =>
                        setNewCourse({
                          ...newCourse,
                          is_free: true,
                          card_price: 0,
                        })
                      }
                      className="text-(--brand) focus:ring-(--brand)"
                    />
                    <span>دورة مجانية</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="pricing"
                      checked={newCourse?.is_free === false}
                      onChange={() =>
                        setNewCourse({ ...newCourse, is_free: false })
                      }
                      className="text-(--brand) focus:ring-(--brand)"
                    />
                    <span>دورة مدفوعة</span>
                  </label>
                </div>
                {newCourse?.is_free === false && (
                  <div className="mt-3">
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          البطاقة *
                        </label>
                        <select
                          value={newCourse?.card_price}
                          onChange={(e) => {
                            setNewCourse({
                              ...newCourse,
                              card_price: e.target.value,
                            });
                          }}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                        >
                          <option value="">اختر بطاقة</option>
                          {cardsData
                            ?.filter((card: any) => card?.is_active)
                            .map((card: any) => (
                              <option key={card.id} value={card.id}>
                                {card?.price} د.ا
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاريخ البداية *
                  </label>
                  <input
                    type="date"
                    value={newCourse?.start_date || ""}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, start_date: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاريخ النهاية *
                  </label>
                  <input
                    type="date"
                    value={newCourse?.end_date || ""}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, end_date: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                  />
                </div>
              </div>

              {/* SubSection */}
              <div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    القسم *
                  </label>
                  <select
                    value={selectedSubSection}
                    onChange={(e) => {
                      setSelectedSubSection(e.target.value);
                      setSelectedSubSub("");
                      setSelectedSpec("");
                      setNewCourse({
                        ...newCourse,
                        subsection: e.target.value,
                        subsubsection: "",
                        specialization: "",
                        specialization_material: "",
                      });
                    }}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                  >
                    <option value="">اختر القسم</option>
                    {subsectionData?.map((subSection: any) => (
                      <option key={subSection.id} value={subSection.id}>
                        {subSection?.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* SubSubSection */}
              {subSection?.subsubsections.length > 0 && (
                <div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الصف *
                    </label>
                    <select
                      value={selectedSubSub}
                      onChange={(e) => {
                        setSelectedSubSub(e.target.value);
                        setSelectedSpec("");
                        setNewCourse({
                          ...newCourse,
                          subsubsection: e.target.value,
                          specialization: "",
                          specialization_material: "",
                        });
                      }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                    >
                      <option value="">اختر الصف</option>
                      {subSection?.subsubsections?.map((subSubSection: any) => (
                        <option key={subSubSection.id} value={subSubSection.id}>
                          {subSubSection?.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Specialization */}
              {subsub?.specializations.length > 0 && (
                <div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      التخصص *
                    </label>
                    <select
                      value={selectedSpec}
                      onChange={(e) => {
                        setSelectedSpec(e.target.value);
                        setNewCourse({
                          ...newCourse,
                          specialization: e.target.value,
                          specialization_material: "",
                        });
                      }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                    >
                      <option value="">اختر قسم فرعي</option>
                      {subsub?.specializations?.map((specialization: any) => (
                        <option
                          key={specialization.id}
                          value={specialization.id}
                        >
                          {specialization?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Specialization Material */}
              {selectedSubSub &&
                subsub?.specialization_materials.length == 0 &&
                subsub?.specializations.length == 0 && (
                  <p className="col-span-1 lg:col-span-2 text-center text-md text-red-600 font-semibold">
                    لا يوجد مواد تخصص لعرضها برجاء اختيار مسار صحيح
                  </p>
                )}
              {(spec?.specialization_materials.length > 0 ||
                (subsub?.specializations?.length == 0 &&
                  subsub?.specialization_materials?.length > 0)) && (
                <div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      مادة التخصص *
                    </label>
                    <select
                      value={newCourse?.specialization_material}
                      onChange={(e) => {
                        setNewCourse({
                          ...newCourse,
                          specialization_material: e.target.value,
                        });
                      }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                    >
                      <option value="">اختر مادة التخصص</option>
                      {(spec?.specialization_materials.length > 0
                        ? (spec?.specialization_materials ?? [])
                        : (subsub?.specialization_materials ?? [])
                      ).map((specialization_material: any) => (
                        <option
                          key={specialization_material.id}
                          value={specialization_material.id}
                        >
                          {specialization_material?.material}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Status Settings */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">منشور</p>
                    <p className="text-sm text-gray-500">متاح للطلاب</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={newCourse?.is_published ?? true}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        is_published: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-(--brand) focus:ring-(--brand)"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">مميز</p>
                    <p className="text-sm text-gray-500">يظهر في المميزة</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={newCourse.is_special ?? false}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        is_special: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-(--brand) focus:ring-(--brand)"
                  />
                </div>

                <div className="col-span-1 lg:col-span-2 flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">إظهار الأسئلة</p>
                    <p className="text-sm text-gray-500">
                      إظهار صفحة الأسئلة الخاصة بالدورة
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={newCourse?.is_show_general_questions ?? true}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        is_show_general_questions: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-(--brand) focus:ring-(--brand)"
                  />
                </div>

                <div className="col-span-1 lg:col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    استيراد عرض الأسئلة من دورة أخرى (اختياري)
                  </label>
                  <p className="text-xs text-gray-500">
                    يمكن اختيار دورة واحدة فقط لنسخ إعدادات عرض الأسئلة المرتبطة
                    بها.
                  </p>
                  <MultiSelectAutocomplete
                    single
                    value={newCourse.import_offer_target_ids || []}
                    onChange={(ids) =>
                      setNewCourse({
                        ...newCourse,
                        import_offer_target_ids: ids.slice(0, 1),
                      })
                    }
                    options={
                      courseData?.map((c: any) => ({
                        id: String(c.id),
                        title: c.name ?? "—",
                      })) ?? []
                    }
                    placeholder="اختر الدورة المصدر..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex md:flex-row flex-col gap-4 justify-end mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={() => setCurrentView("list")}
              className="cursor-pointer px-6 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={handleCreateCourse}
              disabled={
                isCreating ||
                !newCourse.name ||
                !newCourse.start_date ||
                !newCourse.end_date ||
                (!newCourse.is_free && !newCourse.card_price) ||
                (role !== "teacher" && !newCourse.teacher) ||
                !newCourse.subsection ||
                !newCourse.subsubsection ||
                (subsub?.specializations.length > 0
                  ? !newCourse.specialization
                  : false) ||
                !newCourse.specialization_material
              }
              className="btn-brand-slide md:justify-start justify-center px-6 py-3 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              {isCreating ? "جاري الإنشاء..." : "إنشاء الدورة"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Edit Course View
  if (currentView === "edit" && selectedCourse) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setSelectedSubSection("");
              setSelectedSubSub("");
              setSelectedSpec("");
              setEditSections(false);
              setCurrentView("list");
            }}
            className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowRight size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">تعديل الدورة</h1>
            <p className="text-gray-600 text-sm">{selectedCourse?.name}</p>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-8 border border-(--brand)">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Info */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">
                المعلومات الأساسية
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان الدورة *
                </label>
                <input
                  type="text"
                  value={selectedCourse?.name}
                  onChange={(e) =>
                    setSelectedCourse({
                      ...selectedCourse,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                  placeholder="أدخل عنوان الدورة..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف مختصر
                </label>
                <input
                  type="text"
                  value={selectedCourse?.short_description || ""}
                  onChange={(e) =>
                    setSelectedCourse({
                      ...selectedCourse,
                      short_description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                  placeholder="وصف مختصر للدورة..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوصف التفصيلي *
                </label>
                <textarea
                  value={selectedCourse?.long_description || ""}
                  onChange={(e) =>
                    setSelectedCourse({
                      ...selectedCourse,
                      long_description: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all resize-none"
                  placeholder="وصف تفصيلي للدورة..."
                />
              </div>

              {/* Teacher */}
              {role !== "teacher" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المعلم *
                    </label>
                    <select
                      value={selectedCourse?.teacher.id}
                      onChange={(e) =>
                        setSelectedCourse({
                          ...selectedCourse,
                          teacher: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                    >
                      <option value="">اختر المعلم</option>
                      {teacherData
                        ?.filter((t: any) => t?.is_active)
                        .map((teacher: any) => (
                          <option key={teacher.id} value={teacher.id}>
                            {teacher.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              )}
              {/* Time In Hours */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المدة (بالساعات)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  lang="en"
                  value={selectedCourse?.time_in_hours}
                  onChange={(e) =>
                    setSelectedCourse({
                      ...selectedCourse,
                      time_in_hours: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                  placeholder="40"
                  min="0"
                />
              </div>

              {/* Image */}
              <div className="flex flex-col justify-center gap-2">
                <label
                  htmlFor="fileUpload"
                  className="block text-sm font-medium text-gray-700"
                >
                  الصورة المصغرة
                </label>
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="fileUpload"
                    className="btn-brand-slide cursor-pointer px-4 py-3 text-white text-sm font-medium rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-(--brand) transition-all"
                  >
                    اختر الصورة المصغرة
                  </label>

                  <input
                    id="fileUpload"
                    type="file"
                    className="invisible w-0 h-0"
                    onChange={(e) => {
                      setSelectedCourse({
                        ...selectedCourse,
                        image: e.target.files?.[0],
                      });
                    }}
                    accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, image/svg+xml"
                  />

                  <span id="fileName" className="text-sm text-gray-500">
                    {selectedCourse?.image
                      ? selectedCourse?.image?.name
                      : "لم يتم اختيار صورة"}
                  </span>
                  {(typeof selectedCourse?.image === "string" ||
                    selectedCourse?.image instanceof File) && (
                    <img
                      loading="lazy"
                      src={
                        selectedCourse?.image instanceof File
                          ? URL.createObjectURL(selectedCourse.image)
                          : selectedCourse?.image // existing image URL from DB
                      }
                      alt="Preview"
                      className="w-10 h-10 object-cover rounded"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">
                الإعدادات
              </h2>

              {/* Pricing */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  التسعير *
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="pricing"
                      checked={selectedCourse.is_free === true}
                      onChange={() =>
                        setSelectedCourse({
                          ...selectedCourse,
                          is_free: true,
                        })
                      }
                      className="text-(--brand) focus:ring-(--brand)"
                    />
                    <span>دورة مجانية</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="pricing"
                      checked={selectedCourse?.is_free === false}
                      onChange={() =>
                        setSelectedCourse({ ...selectedCourse, is_free: false })
                      }
                      className="text-(--brand) focus:ring-(--brand)"
                    />
                    <span>دورة مدفوعة</span>
                  </label>
                </div>
                {selectedCourse?.is_free === false && (
                  <div className="mt-3">
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          البطاقة *
                        </label>
                        <select
                          value={selectedCourse?.card_price?.id}
                          onChange={(e) => {
                            setSelectedCourse({
                              ...selectedCourse,
                              card_price: e.target.value,
                            });
                          }}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                        >
                          <option value="">اختر بطاقة</option>
                          {cardsData
                            ?.filter((card: any) => card?.is_active)
                            .map((card: any) => (
                              <option key={card.id} value={card.id}>
                                {card?.price} د.ا
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاريخ البداية
                  </label>
                  <input
                    type="date"
                    value={formatDate(selectedCourse?.start_date) || ""}
                    onChange={(e) =>
                      setSelectedCourse({
                        ...selectedCourse,
                        start_date: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاريخ النهاية
                  </label>
                  <input
                    type="date"
                    value={formatDate(selectedCourse?.end_date) || ""}
                    onChange={(e) =>
                      setSelectedCourse({
                        ...selectedCourse,
                        end_date: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                  />
                </div>
              </div>

              {/* SubSection */}
              {!editSections ? (
                <button
                  onClick={() => setEditSections(!editSections)}
                  className="btn-brand-slide px-6 py-3 rounded-lg transition-all flex items-center gap-2"
                >
                  تعديل الأقسام
                </button>
              ) : (
                <>
                  <div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        القسم
                      </label>
                      <select
                        value={selectedSubSection}
                        onChange={(e) => {
                          setSelectedSubSection(e.target.value);
                          setSelectedSubSub("");
                          setSelectedSpec("");
                          setSelectedCourse({
                            ...selectedCourse,
                            subsection: e.target.value,
                            subsubsection: "",
                            specialization: "",
                            specialization_material: "",
                          });
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                      >
                        <option value="">اختر القسم</option>
                        {subsectionData?.map((subSection: any) => (
                          <option key={subSection.id} value={subSection.id}>
                            {subSection?.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {/* SubSubSection */}
                  {subSection?.subsubsections.length > 0 && (
                    <div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          الصف *
                        </label>
                        <select
                          value={selectedSubSub}
                          onChange={(e) => {
                            setSelectedSubSub(e.target.value);
                            setSelectedSpec("");
                            setSelectedCourse({
                              ...selectedCourse,
                              subsubsection: e.target.value,
                              specialization: "",
                              specialization_material: "",
                            });
                          }}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                        >
                          <option value="">اختر الصف</option>
                          {subSection?.subsubsections?.map(
                            (subSubSection: any) => (
                              <option
                                key={subSubSection.id}
                                value={subSubSection.id}
                              >
                                {subSubSection?.title}
                              </option>
                            ),
                          )}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Specialization */}
                  {subsub?.specializations.length > 0 && (
                    <div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          التخصص *
                        </label>
                        <select
                          value={selectedSpec}
                          onChange={(e) => {
                            setSelectedSpec(e.target.value);
                            setSelectedCourse({
                              ...selectedCourse,
                              specialization: e.target.value,
                              specialization_material: "",
                            });
                          }}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                        >
                          <option value="">اختر التخصص</option>
                          {subsub?.specializations?.map(
                            (specialization: any) => (
                              <option
                                key={specialization.id}
                                value={specialization.id}
                              >
                                {specialization?.name}
                              </option>
                            ),
                          )}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Specialization Material */}
                  {selectedSubSub &&
                    subsub?.specialization_materials.length == 0 &&
                    subsub?.specializations.length == 0 && (
                      <p className="col-span-1 lg:col-span-2 text-center text-md text-red-600 font-semibold">
                        لا يوجد مواد تخصص لعرضها برجاء اختيار مسار صحيح
                      </p>
                    )}
                  {(spec?.specialization_materials?.length > 0 ||
                    (subsub?.specializations?.length == 0 &&
                      subsub?.specialization_materials?.length > 0)) && (
                    <div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          مادة التخصص *
                        </label>
                        <select
                          value={selectedCourse?.specialization_material}
                          onChange={(e) => {
                            setSelectedCourse({
                              ...selectedCourse,
                              specialization_material: e.target.value,
                            });
                          }}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                        >
                          <option value="">اختر مادة التخصص</option>
                          {(spec?.specialization_materials.length > 0
                            ? (spec?.specialization_materials ?? [])
                            : (subsub?.specialization_materials ?? [])
                          ).map((specialization_material: any) => (
                            <option
                              key={specialization_material.id}
                              value={specialization_material.id}
                            >
                              {specialization_material?.material}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Status Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">منشور</p>
                    <p className="text-sm text-gray-500">متاح للطلاب</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedCourse.is_published}
                    onChange={(e) =>
                      setSelectedCourse({
                        ...selectedCourse,
                        is_published: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-(--brand) focus:ring-(--brand)"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">مميز</p>
                    <p className="text-sm text-gray-500">يظهر في المميزة</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedCourse?.is_special}
                    onChange={(e) =>
                      setSelectedCourse({
                        ...selectedCourse,
                        is_special: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-(--brand) focus:ring-(--brand)"
                  />
                </div>

                <div className="flex items-center col-span-1 lg:col-span-2 justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">إظهار الأسئلة</p>
                    <p className="text-sm text-gray-500">
                      إظهار صفحة الأسئلة الخاصة بالدورة
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedCourse?.is_show_general_questions}
                    onChange={(e) =>
                      setSelectedCourse({
                        ...selectedCourse,
                        is_show_general_questions: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-(--brand) focus:ring-(--brand)"
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    استيراد عرض الأسئلة من دورة أخرى (اختياري)
                  </label>
                  <p className="text-xs text-gray-500">
                    يمكن اختيار دورة واحدة فقط لنسخ إعدادات عرض الأسئلة المرتبطة
                    بها.
                  </p>
                  <MultiSelectAutocomplete
                    single
                    value={selectedCourse.import_offer_target_ids || []}
                    onChange={(ids) =>
                      setSelectedCourse({
                        ...selectedCourse,
                        import_offer_target_ids: ids.slice(0, 1),
                      })
                    }
                    options={buildImportOfferEditOptions(
                      courseData,
                      selectedCourse?.id,
                      selectedCourse,
                    )}
                    placeholder="اختر الدورة المصدر..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={() => {
                setSelectedSubSection("");
                setSelectedSubSub("");
                setSelectedSpec("");
                setEditSections(false);
                setCurrentView("list");
              }}
              className="cursor-pointer px-6 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={() => {
                setCourseId(selectedCourse?.id);
                handleEditCourse();
              }}
              disabled={
                isEditing ||
                !selectedCourse.name ||
                !selectedCourse.start_date ||
                !selectedCourse.end_date ||
                (!selectedCourse.is_free && !selectedCourse.card_price) ||
                (role !== "teacher" && !selectedCourse.teacher) ||
                !selectedCourse.subsection ||
                !selectedCourse.subsubsection ||
                (subsub?.specializations.length > 0
                  ? !selectedCourse.specialization
                  : false) ||
                !selectedCourse.specialization_material
              }
              className="btn-brand-slide px-6 py-3 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              {isEditing ? "جاري الحفظ..." : "حفظ التغييرات"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default List View
  return (
    <div className="space-y-6">
      {currentView === "activate" && selectedCourse && (
        <CourseActivation
          setCurrentView={setCurrentView}
          selectedCourse={selectedCourse}
        />
      )}
      {/* Header */}
      <div className="flex md:flex-row flex-col gap-5 items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">إدارة الدورات</h1>
          <p className="text-gray-600 text-sm">
            إدارة شاملة لجميع الدورات التعليمية في المنصة
          </p>
        </div>
        <button
          onClick={() => setCurrentView("create")}
          className="btn-brand-slide px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 text-sm"
        >
          <Plus size={16} />
          إنشاء دورة جديدة
        </button>
      </div>

      {/* Stats Cards */}
      {isLoadingCourseStats ? (
        <StatsCardsSkeleton count={4} gridClassName={DASHBOARD_STATS_GRID_4} />
      ) : (
        <div className={DASHBOARD_STATS_GRID_4}>
          <DashboardStatCard
            label="إجمالي الدورات"
            value={courseStatsData?.total_courses ?? "-"}
            icon={BookOpen}
            valueClassName="text-gray-800"
            iconClassName="text-(--brand)"
          />
          <DashboardStatCard
            label="الدورات النشطة"
            value={courseStatsData?.active_courses ?? "-"}
            icon={CheckCircle}
            valueClassName="text-green-600"
            iconClassName="text-green-500"
          />
          <DashboardStatCard
            label="الدورات الغير نشطة"
            value={courseStatsData?.inactive_courses ?? "-"}
            icon={XCircle}
            valueClassName="text-red-600"
            iconClassName="text-red-500"
          />
          <DashboardStatCard
            label="إجمالي الطلاب"
            value={courseStatsData?.total_students_in_enrolled_courses ?? "-"}
            icon={Users}
            valueClassName="text-(--brand-secondary)"
            iconClassName="text-blue-500"
          />
        </div>
      )}

      {/* Filters */}
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
              onChange={(e) =>
                setTeacherFilter(e.target.value ? e.target.value : null)
              }
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

          {/* Category Filter */}
          {/* <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all duration-300 text-sm"
          >
            <option value="">جميع التصنيفات</option>
            {specializationData?.map((category: any) => (
              <option key={category?.id} value={category?.name}>
                {category?.name}
              </option>
            ))}
          </select> */}

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
            >
              <Grid size={16} />
            </button>
          </div>
        </div>
      </div>
      {/* Courses Grid/Table */}
      {isLoading || isDeleting || isEditing ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} variant="card" className="h-96 rounded-xl" />
            ))}
          </div>
        ) : (
          <TableSkeleton rows={10} header={false} />
        )
      ) : !courseData || courseData?.length === 0 ? (
        <div className="col-span-full bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-(--brand)">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            لا توجد نتائج
          </h3>
          <p className="text-gray-500 mb-6">ابدأ بإضافة دورة جديدة للمنصة</p>

          <button
            onClick={() => setCurrentView("create")}
            className="btn-brand-slide px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <Plus size={16} />
            إضافة دورة جديدة
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseData
              ?.filter((course: any) => course?.teacher?.is_active === true)
              .map((activeCourse: any) => (
                <CourseCard key={activeCourse.id} course={activeCourse} />
              ))}

            {courseData?.length === 0 && (
              <div className="col-span-full bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-(--brand)">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  {searchTerm || teacherFilter || statusFilter !== "all"
                    ? "لا توجد نتائج"
                    : "لا توجد دورات"}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || statusFilter !== "all"
                    ? "لم يتم العثور على دورات تطابق المعايير المحددة"
                    : "ابدأ بإنشاء دورة تعليمية جديدة"}
                </p>
                {!searchTerm && statusFilter === "all" && (
                  <button
                    onClick={() => setCurrentView("create")}
                    className="btn-brand-slide px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 mx-auto"
                  >
                    <Plus size={16} />
                    إنشاء دورة جديدة
                  </button>
                )}
              </div>
            )}
          </div>
          <Pagination
            currentPage={paginationFilter.page}
            onPageChange={(page: any) =>
              setPaginationFilter((prev) => ({ ...prev, page }))
            }
            count={paginationData?.count}
            pageSize={paginationFilter.page_size}
          />
        </>
      ) : (
        <>
          {/* Table View */}
          <div className="w-full max-w-50 min-w-full pb-6 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-(--brand) overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الدورة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المعلم
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      القسم
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الصف
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      التخصص
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      مادة التخصص
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      السعر
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 overflow-x-auto">
                  {courseData
                    ?.filter(
                      (course: any) => course?.teacher?.is_active === true,
                    )
                    .map((course: any) => (
                      <tr key={course?.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="font-medium text-gray-900 line-clamp-1">
                                {course?.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {course?.time_in_hours}h{" "}
                                {course?.level?.name &&
                                  "•" + course?.level?.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-900">
                              {course?.teacher?.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {course?.subsection?.title || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {course?.subsubsection?.title || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {course?.specialization?.name || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {course?.specialization_material?.name || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {course?.is_free
                            ? "مجاني"
                            : `${
                                course?.card_price?.price
                                  ? course?.card_price?.price + " د.أ"
                                  : "-"
                              }`}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                course?.is_published
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {course?.is_published ? "منشور" : "مسودة"}
                            </span>
                            {/* <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            course.isActive
                              ? "bg-blue-100 text-(--brand-secondary)"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {course.isActive ? "نشط" : "معطل"}
                        </span> */}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedCourse(course);
                                setCurrentView("content");
                              }}
                              className="cursor-pointer p-1 text-gray-400 hover:text-(--brand-secondary) transition-colors"
                              title="إدارة المحتوى"
                            >
                              <Settings size={16} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedCourse(course);
                                setCurrentView("activate");
                              }}
                              className="cursor-pointer p-1 text-gray-400 hover:text-(--brand-secondary) transition-colors"
                              title="تفعيل دورة"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => {
                                requestCoursePublishToggle(course);
                              }}
                              className={`cursor-pointer p-2 rounded-lg transition-colors ${
                                course?.is_published
                                  ? "text-(--brand-secondary)"
                                  : "text-gray-400"
                              }`}
                              title={
                                course?.is_published
                                  ? "إلغاء النشر"
                                  : "نشر الدورة"
                              }
                            >
                              {course?.is_published ? (
                                <Eye size={16} />
                              ) : (
                                <EyeOff size={16} />
                              )}
                            </button>

                            <EditButton
                              onClick={() => {
                                setSelectedCourse(
                                  courseWithNormalizedOfferImports(course),
                                );
                                setCurrentView("edit");
                              }}
                              className="cursor-pointer p-1 text-gray-400 hover:text-(--brand) transition-colors"
                              title="تعديل الدورة"
                            />
                            <DeleteButton
                              onClick={() => {
                                requestDeleteCourse(course);
                              }}
                              title="حذف الدورة"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination
            currentPage={paginationFilter.page}
            onPageChange={(page: any) =>
              setPaginationFilter((prev) => ({ ...prev, page }))
            }
            count={paginationData?.count}
            pageSize={paginationFilter.page_size}
          />
        </>
      )}

      {pendingCoursePublishToggle && (
        <ConfirmationModal
          open
          onClose={() => !isPublishing && setPendingCoursePublishToggle(null)}
          onConfirm={() => toggleCourseStatus(pendingCoursePublishToggle.id)}
          title={
            pendingCoursePublishToggle.isPublished
              ? "إلغاء نشر الدورة"
              : "نشر الدورة"
          }
          variant={
            pendingCoursePublishToggle.isPublished ? "danger" : "success"
          }
          confirmLabel={
            pendingCoursePublishToggle.isPublished
              ? "نعم، إلغاء النشر"
              : "نعم، نشر"
          }
          isPending={isPublishing}
          description={
            <>
              <p className="text-base">
                هل أنت متأكد أنك تريد{" "}
                <span className="font-bold text-gray-900">
                  {pendingCoursePublishToggle.isPublished ? "إلغاء نشر" : "نشر"}
                </span>{" "}
                هذه الدورة؟
              </p>
              <p className="text-sm text-gray-600">
                الدورة:{" "}
                <span className="font-semibold text-(--brand-secondary)">
                  {pendingCoursePublishToggle.title}
                </span>
              </p>
            </>
          }
        />
      )}

      {pendingDeleteCourse && (
        <ConfirmationModal
          open
          onClose={() => !isDeleting && setPendingDeleteCourse(null)}
          onConfirm={confirmDeleteCourse}
          title="حذف الدورة"
          variant="danger"
          confirmLabel="نعم، حذف"
          isPending={isDeleting}
          description={
            <>
              <p className="text-base">
                هل أنت متأكد من حذف هذه الدورة؟ سيتم حذف جميع المحتوى المرتبط
                بها.
              </p>
              <p className="text-sm text-gray-600">
                الدورة:{" "}
                <span className="font-semibold text-(--brand-secondary)">
                  {pendingDeleteCourse.title}
                </span>
              </p>
            </>
          }
        />
      )}
    </div>
  );
};

export default CoursesPage;
