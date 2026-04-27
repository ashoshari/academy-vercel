import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import CourseContentPage from "@/components/dashboard/admin/courses/CourseContentPage";
import { useCustomQuery } from "@/hooks/useQuery";
import {
  useCustomPost,
  useCustomUpdate,
  useCustomRemove,
} from "@/hooks/useMutation";
import toast from "react-hot-toast";
import Pagination from "@/components/dashboard/core/Pagination";
import { ConfirmationModal } from "@/components/dashboard/core/ConfirmationModal";
import { useQueryClient } from "@tanstack/react-query";
import { readUserFromStorage, roleOf } from "@/services/auth";
import CourseActivation from "./CourseActivation";

import Skeleton from "@/components/dashboard/Skeleton";
import TableSkeleton from "@/components/dashboard/skeletons/TableSkeleton";
import CourseForm from "./CourseForm";
import EmptyState from "@/components/core/EmptyState";
import {
  buildCourseFormData,
  buildImportOfferEditOptions,
  courseWithNormalizedOfferImports,
  normalizeScalar,
} from "./utils";
import { CourseCard } from "../cards/CourseCard";
import CourseStats from "./CourseStats";
import Header from "./Header";
import CoursesFilters from "./CoursesFilters";
import CoursesTable from "./CoursesTable";

const CoursesPage = () => {
  const user = readUserFromStorage();
  const role = roleOf(user) ?? "";
  const [currentView, setCurrentView] = useState<
    "list" | "create" | "clone" | "edit" | "content" | "activate"
  >("list");
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [cloneSourceCourse, setCloneSourceCourse] = useState<any>(null);
  const [cloneBaseDraft, setCloneBaseDraft] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [teacherFilter, setTeacherFilter] = useState<any>(null);
  const [freeFilter, setFreeFilter] = useState<any>();
  const [statusFilter, setStatusFilter] = useState<any>();
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

  // GET teachers
  const { data: teachers } = useCustomQuery(
    "/account/admin/teachers/?page_size=9999",
    ["teachers"],
    undefined,
    !["teacher", "library"].includes(role.toLowerCase()),
  );

  const teacherData = teachers?.data;

  // GET Codes
  const { data: cards } = useCustomQuery("/cards/", ["cards"]);

  // GET SubSection
  const { data: subsections } = useCustomQuery(
    "/training/admin/subsections-ids/",
    ["subsections"],
  );
  const subsectionData = subsections?.data;

  const cardsData = cards?.data;
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

  const { mutateAsync: cloneCourse, isPending: isCloning } = useCustomPost(
    `/training/admin/courses/${cloneSourceCourse?.id ?? "noop"}/clone/`,
    ["courses", "courses-stats"],
  );

  // DELETE Courses
  const { mutateAsync: deleteCourse, isPending: isDeleting } = useCustomRemove(
    `/training/admin/courses/${courseId}/`,
    ["deleteCourses", courseId],
  );

  const handleCreateCourse = async () => {
    const formData = buildCourseFormData(newCourse, "create", role);
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

  const handleCloneCourse = async () => {
    if (!cloneSourceCourse?.id) {
      toast.error("لم يتم تحديد دورة للنسخ");
      return;
    }
    const base = cloneBaseDraft ?? {};
    const changedData: Record<string, any> = {};

    const keys = [
      "name",
      "short_description",
      "long_description",
      "teacher",
      "time_in_hours",
      "image",
      "is_free",
      "card_price",
      "start_date",
      "end_date",
      "is_published",
      "is_special",
      "is_show_general_questions",
      "subsection",
      "subsubsection",
      "specialization",
      "specialization_material",
      "import_offer_target_ids",
    ];

    for (const key of keys) {
      const nextVal = (newCourse as any)?.[key];
      const baseVal = (base as any)?.[key];

      if (key === "image") {
        // Only send image if user picked a new file
        if (nextVal instanceof File) changedData.image = nextVal;
        continue;
      }

      if (key === "import_offer_target_ids") {
        const nextId = Array.isArray(nextVal) ? nextVal[0] : undefined;
        const baseId = Array.isArray(baseVal) ? baseVal[0] : undefined;
        if (nextId !== baseId) changedData.import_offer_target_ids = [nextId];
        continue;
      }

      const a = normalizeScalar(nextVal);
      const b = normalizeScalar(baseVal);
      if (a !== b) changedData[key] = nextVal;
    }

    // Build FormData only from changed keys (all optional)
    const fd = new FormData();
    const append = (k: string, v: unknown) => {
      if (!v || v === "") return;
      fd.append(k, v instanceof File ? v : String(v));
    };
    const appendBool = (k: string, v: unknown) => {
      if (!v) return;
      fd.append(k, String(Boolean(v)));
    };

    append("name", changedData.name);
    append("short_description", changedData.short_description);
    append("long_description", changedData.long_description);
    if (role !== "teacher") append("teacher", changedData.teacher);
    append("time_in_hours", changedData.time_in_hours);
    append(
      "image",
      changedData.image instanceof File ? changedData.image : undefined,
    );
    appendBool("is_free", changedData.is_free);
    append("card_price", changedData.card_price);
    append("start_date", changedData.start_date);
    append("end_date", changedData.end_date);
    appendBool("is_published", changedData.is_published);
    appendBool("is_special", changedData.is_special);
    appendBool(
      "is_show_general_questions",
      changedData.is_show_general_questions,
    );
    append("subsection", changedData.subsection);
    append("subsubsection", changedData.subsubsection);
    append("specialization", changedData.specialization);
    append("specialization_material", changedData.specialization_material);
    if (
      Array.isArray(changedData.import_offer_target_ids) &&
      changedData.import_offer_target_ids.length > 0
    ) {
      const id = changedData.import_offer_target_ids[0];
      if (id) fd.append("import_offer_target_ids", String(id));
    }

    try {
      const res = await cloneCourse(fd);
      toast.success(res.message ?? "تم نسخ الدورة بنجاح");
      setCloneSourceCourse(null);
      setCloneBaseDraft(null);
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
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["courses-stats"] });
      return res;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "حدث خطأ أثناء نسخ الدورة");
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
          const id = value[0];
          if (id) formData.append(key, String(id));
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

  // Course Content Management View
  if (currentView === "content" && selectedCourse) {
    return (
      <CourseContentPage
        course={selectedCourse}
        onBack={() => setCurrentView("list")}
        onUpdateCourse={(updatedCourse: any) => {
          setSelectedCourse(courseWithNormalizedOfferImports(updatedCourse));
        }}
      />
    );
  }
  const handleCourseFormBack = () => {
    setNewCourse({
      is_free: true,
      is_published: true,
      is_special: false,
      is_show_general_questions: true,
      import_offer_target_ids: [],
    });
    setCloneSourceCourse(null);
    setSelectedSubSection("");
    setSelectedSubSub("");
    setSelectedSpec("");
    setCurrentView("list");
  };

  // Create Course View
  if (currentView === "create") {
    return (
      <CourseForm
        mode="create"
        role={role}
        newCourse={newCourse}
        setNewCourse={setNewCourse}
        teacherData={teacherData}
        cardsData={cardsData}
        courseData={courseData}
        selectedSubSection={selectedSubSection}
        setSelectedSubSection={setSelectedSubSection}
        selectedSubSub={selectedSubSub}
        setSelectedSubSub={setSelectedSubSub}
        selectedSpec={selectedSpec}
        setSelectedSpec={setSelectedSpec}
        subsectionData={subsectionData}
        subSection={subSection}
        subsub={subsub}
        spec={spec}
        isPendingSubmit={isCreating}
        onSubmit={handleCreateCourse}
        onCancel={() => setCurrentView("list")}
        onBack={handleCourseFormBack}
      />
    );
  }

  // Clone Course View (no semesters/units; all fields optional)
  if (currentView === "clone") {
    return (
      <CourseForm
        mode="clone"
        role={role}
        cloneSourceName={cloneSourceCourse?.name ?? null}
        newCourse={newCourse}
        setNewCourse={setNewCourse}
        teacherData={teacherData}
        cardsData={cardsData}
        courseData={courseData}
        selectedSubSection={selectedSubSection}
        setSelectedSubSection={setSelectedSubSection}
        selectedSubSub={selectedSubSub}
        setSelectedSubSub={setSelectedSubSub}
        selectedSpec={selectedSpec}
        setSelectedSpec={setSelectedSpec}
        subsectionData={subsectionData}
        subSection={subSection}
        subsub={subsub}
        spec={spec}
        isPendingSubmit={isCloning}
        onSubmit={handleCloneCourse}
        onCancel={() => setCurrentView("list")}
        onBack={handleCourseFormBack}
      />
    );
  }

  // Edit Course View (reuses CourseForm)
  if (currentView === "edit" && selectedCourse) {
    return (
      <CourseForm
        mode="edit"
        role={role}
        newCourse={selectedCourse}
        setNewCourse={setSelectedCourse}
        teacherData={teacherData}
        cardsData={cardsData}
        courseData={courseData}
        importOfferOptions={buildImportOfferEditOptions(
          courseData,
          selectedCourse?.id,
          selectedCourse,
        )}
        selectedSubSection={selectedSubSection}
        setSelectedSubSection={setSelectedSubSection}
        selectedSubSub={selectedSubSub}
        setSelectedSubSub={setSelectedSubSub}
        selectedSpec={selectedSpec}
        setSelectedSpec={setSelectedSpec}
        subsectionData={subsectionData}
        subSection={subSection}
        subsub={subsub}
        spec={spec}
        isPendingSubmit={isEditing}
        onSubmit={() => {
          setCourseId(selectedCourse?.id);
          void handleEditCourse();
        }}
        onCancel={() => {
          setSelectedSubSection("");
          setSelectedSubSub("");
          setSelectedSpec("");
          setCurrentView("list");
        }}
        onBack={() => {
          setSelectedSubSection("");
          setSelectedSubSub("");
          setSelectedSpec("");
          setCurrentView("list");
        }}
      />
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
      <Header setCurrentView={setCurrentView} />

      <CourseStats role={role} />

      {/* Filters */}
      <CoursesFilters
        role={role}
        teacherData={teacherData}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        teacherFilter={teacherFilter}
        setTeacherFilter={setTeacherFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        freeFilter={freeFilter}
        setFreeFilter={setFreeFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
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
        <div className="col-span-full bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-(--brand)">
          <EmptyState
            title="لا توجد نتائج"
            description="ابدأ بإضافة دورة جديدة للمنصة"
            action={
              <button
                onClick={() => setCurrentView("create")}
                className="btn-brand-slide px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2"
              >
                <Plus size={16} />
                إضافة دورة جديدة
              </button>
            }
            size="md"
          />
        </div>
      ) : viewMode === "grid" ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseData
              ?.filter((course: any) => course?.teacher?.is_active === true)
              .map((activeCourse: any) => (
                <CourseCard
                  key={activeCourse.id}
                  course={activeCourse}
                  role={role}
                  setSelectedCourse={setSelectedCourse}
                  setCurrentView={setCurrentView}
                  requestCoursePublishToggle={requestCoursePublishToggle}
                  setCloneSourceCourse={setCloneSourceCourse}
                  setCloneBaseDraft={setCloneBaseDraft}
                  setNewCourse={setNewCourse}
                  setSelectedSubSection={setSelectedSubSection}
                  setSelectedSubSub={setSelectedSubSub}
                  setSelectedSpec={setSelectedSpec}
                  requestDeleteCourse={requestDeleteCourse}
                />
              ))}
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
          <CoursesTable
            courseData={courseData}
            setSelectedCourse={setSelectedCourse}
            setCurrentView={setCurrentView}
            requestCoursePublishToggle={requestCoursePublishToggle}
            setCloneSourceCourse={setCloneSourceCourse}
            setCloneBaseDraft={setCloneBaseDraft}
            setNewCourse={setNewCourse}
            setSelectedSubSection={setSelectedSubSection}
            setSelectedSubSub={setSelectedSubSub}
            setSelectedSpec={setSelectedSpec}
            requestDeleteCourse={requestDeleteCourse}
          />
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
