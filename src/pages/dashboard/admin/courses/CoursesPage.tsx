import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Eye,
  EyeOff,
  BookOpen,
  Users,
  CheckCircle,
  Save,
  Folder,
  ArrowRight,
  Rows,
  Grid,
  User,
} from "lucide-react";
import CourseContentPage from "@/components/dashboard/admin/courses/CourseContentPage";
import { useCustomQuery } from "@/hooks/useQuery";
import { useCustomPost, useCustomUpdate } from "@/hooks/useMutation";
import toast from "react-hot-toast";
import { formatDate } from "@/services/date";
import Pagination from "@/components/dashboard/core/Pagination";
import Spinner from "@/components/dashboard/Spinner";
import { useQueryClient } from "@tanstack/react-query";
const CoursesPage = () => {
  const [currentView, setCurrentView] = useState<
    "list" | "create" | "edit" | "content"
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
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const queryParams = new URLSearchParams();
  if (searchTerm) queryParams.append("name", searchTerm);
  if (teacherFilter) queryParams.append("teacher", teacherFilter);
  // if (categoryFilter) queryParams.append("material", categoryFilter);
  if (freeFilter !== null && freeFilter !== undefined)
    queryParams.append("is_free", freeFilter);
  if (statusFilter) queryParams.append("is_published", statusFilter);
  if (page) queryParams.append("page", page.toString());
  const queryString = queryParams.toString();
  // GET courses
  const { data, isLoading } = useCustomQuery(
    `/training/admin/courses/?${queryString}`,
    ["courses", page, searchTerm, teacherFilter, freeFilter, statusFilter]
  );

  const courseData = data?.data;
  const paginationData = data?.pagination;
  // GET courses stats
  const { data: coursesStats } = useCustomQuery(
    "/training/admin/courses-statistics/",
    ["coursesStats"]
  );
  // GET teachers
  const { data: teachers } = useCustomQuery("/account/admin/teachers/", [
    "teachers",
  ]);

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
    ["subsections"]
  );
  const subsectionData = subsections?.data;
  // const specializationData = specializations?.data;
  // const specialization_materialData = specialization_material?.data;
  const cardsData = cards?.data;

  const [selectedSubSection, setSelectedSubSection] = useState<string>("");
  const [selectedSubSub, setSelectedSubSub] = useState<string>("");
  const [selectedSpec, setSelectedSpec] = useState<string>("");
  const subSection = subsectionData?.find(
    (s: any) => s.id === selectedSubSection
  );
  const subsub = subSection?.subsubsections?.find(
    (ss: any) => ss.id === selectedSubSub
  );
  const spec = subsub?.specializations?.find(
    (sp: any) => sp.id === selectedSpec
  );
  console.log("spec", spec);

  const [courses, setCourses] = useState<any>();
  useEffect(() => {
    setCourses(courseData);
  }, [courseData]);
  const courseStatsData = coursesStats?.data;

  const [newCourse, setNewCourse] = useState<any>({});
  // const [editCourseData, setEditCourseData] = useState<any>({});

  // PUT Course
  const { mutateAsync: editCourse } = useCustomUpdate(
    `/training/admin/courses/${courseId}/`,
    ["editcourses", courseId]
  );

  // POST New Course
  const { mutateAsync: createCourse } = useCustomPost(
    "/training/admin/courses/",
    ["postCourses"]
  );
  const handleCreateCourse = async () => {
    const formData = new FormData();
    newCourse.name && formData.append("name", newCourse.name);
    newCourse.short_description &&
      formData.append("short_description", newCourse.short_description);
    newCourse.long_description &&
      formData.append("long_description", newCourse.long_description);
    newCourse.teacher && formData.append("teacher", newCourse.teacher);
    newCourse.level && formData.append("level", newCourse?.level);
    newCourse.time_in_hours &&
      formData.append("time_in_hours", newCourse.time_in_hours);
    newCourse.is_free && formData.append("is_free", newCourse.is_free || false);
    newCourse.card_price &&
      formData.append("card_price", newCourse.card_price || null);
    newCourse.start_date && formData.append("start_date", newCourse.start_date);
    newCourse.end_date && formData.append("end_date", newCourse.end_date);
    newCourse.subsection && formData.append("subsection", newCourse.subsection);
    newCourse.subsubsection &&
      formData.append("subsubsection", newCourse.subsubsection);
    newCourse.specialization &&
      formData.append("specialization", newCourse.specialization);
    newCourse.specialization_material &&
      formData.append(
        "specialization_material",
        newCourse.specialization_material
      );
    newCourse.is_published &&
      formData.append("is_published", newCourse.is_published ?? true);
    newCourse.is_special &&
      formData.append("is_special", newCourse.is_special || false);
    if (newCourse.image instanceof File && newCourse.image) {
      formData.append("image", newCourse.image);
    }
    try {
      const res = await createCourse(formData);
      toast.success(res.message ?? "تم الحفظ بنجاح");
      setNewCourse({});
      setSelectedSubSection("");
      setSelectedSubSub("");
      setSelectedSpec("");
      setCurrentView("list");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
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
      (course: any) => course?.id === selectedCourse?.id
    );
    if (!currentCourse) {
      toast.error("هذا الكورس غير موجود");
      return;
    }

    const changedData = Object.keys(selectedCourse)
      .filter(
        (key) =>
          selectedCourse[key as keyof typeof selectedCourse] !==
          currentCourse[key as keyof typeof currentCourse]
      )
      .reduce((acc, key) => {
        acc[key] = selectedCourse[key as keyof typeof selectedCourse];
        return acc;
      }, {} as Record<string, any>);

    try {
      const formData = new FormData();

      Object.entries(changedData).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      });

      const res = await editCourse(formData);
      toast.success(res.message ?? "تم الحفظ بنجاح");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      setCurrentView("list");
    } catch (err: any) {
      toast.error(err?.response?.data?.error);
    }
  };

  // const handleDeleteCourse = (id: number) => {
  //   if (
  //     confirm(
  //       "هل أنت متأكد من حذف هذه الدورة؟ سيتم حذف جميع المحتوى المرتبط بها."
  //     )
  //   ) {
  // setCourses(courses.filter((course) => course.id !== id));
  //   }
  // };

  const toggleCourseStatus = async (courseId: string) => {
    setCourses((prev: any) =>
      prev?.map((course: any) =>
        course?.id === courseId
          ? { ...course, is_published: !course?.is_published }
          : course
      )
    );
    setCourseId(courseId);
    const updateCourse = courses.find((c: any) => c?.id === courseId);
    const newStatus = !updateCourse?.is_published;
    try {
      await editCourse({ is_published: newStatus });
      toast.success("تم تعديل حالة الدورة بنجاح");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    } catch (error) {
      toast.error("حدث خطاء في تعديل حالة الدورة");
      setCourses((prevCourses: any) =>
        prevCourses.map((course: any) =>
          course.id === courseId
            ? { ...course, is_published: !course.is_published }
            : course
        )
      );
    }
    // setCourses(
    //   courses.map((course) =>
    //     course.id === id
    //       ? {
    //           ...course,
    //           [field]: !course[field],
    //           updatedAt: new Date().toISOString().split("T")[0],
    //           publishedAt:
    //             field === "isPublished" && !course[field]
    //               ? new Date().toISOString().split("T")[0]
    //               : course.publishedAt,
    //         }
    //       : course
    //   )
    // );
  };
  const getLevelColor = (level: any) => {
    switch (level) {
      case "مبتدئ":
        return "bg-green-100 text-green-800";
      case "متوسط":
        return "bg-yellow-100 text-yellow-800";
      case "متقدم":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const CourseCard = ({ course }: { course: any }) => (
    <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-orange-100/50 overflow-hidden hover:shadow-xl transition-all duration-300 group">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

        {/* Status Badges */}
        <div className="absolute top-4 right-4 flex gap-2">
          {course?.is_special && (
            <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
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
                course?.level?.name
              )}`}
            >
              {course?.level?.name}
            </span>
          </div>
        )}

        {/* Level Badge */}
        {/* <div className="absolute bottom-4 right-4">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(
              course.level
            )}`}
          >
            {course?.specialization_material?.name}
          </span>
        </div>
        <div className="absolute bottom-4 left-4">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(
              course.level
            )}`}
          >
            {course?.specialization?.name}
          </span>
        </div> */}
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
                  (material: any) => `${material.name} `
                )}
              </p>
            </div>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800">
                {course?.specialization_material?.name || "-"}
              </div>
              <div className="text-xs text-gray-500">مادة التخصص</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {course?.time_in_hours ? course?.time_in_hours + "h" : "-"}
              </div>
              <div className="text-xs text-gray-500">ساعة</div>
            </div>

            {/* Rating */}
            {/* <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Star size={14} className="text-yellow-500 fill-current" />
              <span className="text-lg font-bold text-gray-800">
                {course?.rating.toFixed(1)}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              {course.reviewsCount} تقييم
            </div>
          </div> */}
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
            {/* <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              course?.is_active
                ? "bg-blue-100 text-blue-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {course?.is_active ? "نشط" : "معطل"}
          </span> */}
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
              className="cursor-pointer p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="إدارة المحتوى"
            >
              <Folder size={16} />
            </button>

            {/* <button
              onClick={() => toggleCourseStatus(course?.id, "isActive")}
              className={`cursor-pointer p-2 rounded-lg transition-colors ${
                course?.is_active
                  ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
                  : "text-gray-400 bg-gray-50 hover:bg-gray-100"
              }`}
              title={course?.is_active ? "تعطيل الدورة" : "تفعيل الدورة"}
            >
              {course?.is_active ? <Pause size={16} /> : <Play size={16} />}
            </button> */}

            <button
              onClick={() => {
                toggleCourseStatus(course?.id);
              }}
              className={`cursor-pointer p-2 rounded-lg transition-colors ${
                course?.is_Published
                  ? "text-green-600 bg-green-50 hover:bg-green-100"
                  : "text-gray-400 bg-gray-50 hover:bg-gray-100"
              }`}
              title={course?.is_Published ? "إلغاء النشر" : "نشر الدورة"}
            >
              {course?.is_published ? (
                <Eye className="text-green-600" size={16} />
              ) : (
                <EyeOff size={16} />
              )}
            </button>

            {/* Raiting */}
            {/* <button
              onClick={() => toggleCourseStatus(course.id, "isFeatured")}
              className={`cursor-pointer p-2 rounded-lg transition-colors ${
                course.isFeatured
                  ? "text-yellow-600 bg-yellow-50 hover:bg-yellow-100"
                  : "text-gray-400 bg-gray-50 hover:bg-gray-100"
              }`}
              title={course.isFeatured ? "إزالة من المميز" : "إضافة للمميز"}
            >
              <Star size={16} />
            </button> */}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setSelectedCourse(course);
                console.log("selectedCourse", selectedCourse);
                setCurrentView("edit");
              }}
              className="cursor-pointer p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
              title="تعديل الدورة"
            >
              <Edit size={16} />
            </button>

            {/* <button
              onClick={() => handleDeleteCourse(course.id)}
              className="cursor-pointer p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="حذف الدورة"
            >
              <Trash2 size={16} />
            </button> */}
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
          setSelectedCourse(updatedCourse);
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
              setNewCourse({});
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
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-8 border border-orange-100/50">
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
                  placeholder="وصف تفصيلي للدورة..."
                />
              </div>

              {/* Teacher and specialization */}
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  >
                    <option value="">اختر المعلم</option>
                    {teacherData?.map((teacher: any) => (
                      <option key={teacher?.id} value={teacher?.id}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    التخصص *
                  </label>
                  <select
                    value={newCourse?.specialization || ""}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        specialization: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  >
                    <option value="">جميع التخصصات</option>
                    {specializationData?.map((specialization: any) => (
                      <option
                        key={specialization?.id}
                        value={specialization?.name}
                      >
                        {specialization?.name}
                      </option>
                    ))}
                  </select>
                </div> */}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المستوى
                  </label>
                  <select
                    value={newCourse?.level}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        level: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  >
                    <option value="">اختر المستوى</option>
                    <option value="d72e95dd-dc4c-4495-8ec5-cea7e7c5a0c3">
                      مبتدئ
                    </option>
                    <option value="e6ec8a9c-e0d0-47ae-a2c9-2f6defb2ca97">
                      متوسط
                    </option>
                    <option value="381137cd-7aa9-4165-a0e1-181dc686cb50">
                      متقدم
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المدة (بالساعات)
                  </label>
                  <input
                    type="number"
                    value={newCourse.time_in_hours}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        time_in_hours: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="40"
                    min="0"
                  />
                </div>
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
                    className="cursor-pointer px-4 py-3 bg-orange-500 text-white text-sm font-medium rounded-lg shadow hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
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
                      checked={newCourse.is_free === true}
                      onChange={() =>
                        setNewCourse({
                          ...newCourse,
                          is_free: true,
                          card: 0,
                        })
                      }
                      className="text-orange-600 focus:ring-orange-500"
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
                      className="text-orange-600 focus:ring-orange-500"
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
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
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
                    تاريخ البداية *
                  </label>
                  <input
                    type="date"
                    value={newCourse?.start_date || ""}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, start_date: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              {/* Maximum Students */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحد الأقصى للطلاب
                </label>
                <input
                  type="number"
                  value={newCourse?.maximum_number_of_students || 0}
                  onChange={(e) =>
                    setNewCourse({
                      ...newCourse,
                      maximum_number_of_students: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="100"
                  min="1"
                />
              </div> */}

              {/* SubSection */}
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
                      setNewCourse({
                        ...newCourse,
                        subsection: e.target.value,
                      });
                    }}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
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
                      الصف
                    </label>
                    <select
                      value={selectedSubSub}
                      onChange={(e) => {
                        setSelectedSubSub(e.target.value);
                        setSelectedSpec("");
                        setNewCourse({
                          ...newCourse,
                          subsubsection: e.target.value,
                        });
                      }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
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
                      التخصص
                    </label>
                    <select
                      value={selectedSpec}
                      onChange={(e) => {
                        setSelectedSpec(e.target.value);
                        setNewCourse({
                          ...newCourse,
                          specialization: e.target.value,
                        });
                      }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
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
              {(spec?.specialization_materials.length > 0 ||
                (subsub?.specializations?.length == 0 &&
                  subsub?.specialization_materials?.length > 0)) && (
                <div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      مادة التخصص
                    </label>
                    <select
                      value={newCourse?.specialization_material}
                      onChange={(e) => {
                        setNewCourse({
                          ...newCourse,
                          specialization_material: e.target.value,
                        });
                      }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    >
                      <option value="">اختر مادة التخصص</option>
                      {(spec?.specialization_materials.length > 0
                        ? spec?.specialization_materials
                        : subsub?.specialization_materials
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
              <div className="grid grid-cols-2 gap-4">
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
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </div>

                {/* Active */}
                {/* <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">نشط</p>
                    <p className="text-sm text-gray-500">يمكن التسجيل فيه</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={newCourse.isActive || false}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, isActive: e.target.checked })
                    }
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </div> */}

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">مميز</p>
                    <p className="text-sm text-gray-500">يظهر في المميزة</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={newCourse.is_special || false}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        is_special: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={() => setCurrentView("list")}
              className="cursor-pointer px-6 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={handleCreateCourse}
              disabled={
                !newCourse.name ||
                !newCourse.start_date ||
                !newCourse.end_date ||
                (!newCourse.is_free && !newCourse.card_price) ||
                !newCourse.teacher
              }
              className="cursor-pointer px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              إنشاء الدورة
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
            onClick={() => setCurrentView("list")}
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
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-8 border border-orange-100/50">
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
                  placeholder="وصف تفصيلي للدورة..."
                />
              </div>

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
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
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

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    التصنيف
                  </label>
                  <input
                    type="text"
                    value={selectedCourse?.specialization}
                    onChange={(e) =>
                      setSelectedCourse({
                        ...selectedCourse,
                        specialization: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="مثل:  علمي ، أدبي"
                  />
                </div> */}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المستوى
                  </label>
                  <select
                    value={selectedCourse?.level?.id}
                    onChange={(e) =>
                      setSelectedCourse({
                        ...selectedCourse,
                        level: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  >
                    <option value="">اختر المستوى</option>
                    <option value="d72e95dd-dc4c-4495-8ec5-cea7e7c5a0c3">
                      مبتدئ
                    </option>
                    <option value="e6ec8a9c-e0d0-47ae-a2c9-2f6defb2ca97">
                      متوسط
                    </option>
                    <option value="381137cd-7aa9-4165-a0e1-181dc686cb50">
                      متقدم
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المدة (بالساعات)
                  </label>
                  <input
                    type="number"
                    value={selectedCourse?.time_in_hours}
                    onChange={(e) =>
                      setSelectedCourse({
                        ...selectedCourse,
                        time_in_hours: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="40"
                    min="0"
                  />
                </div>
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
                    className="cursor-pointer px-4 py-3 bg-orange-500 text-white text-sm font-medium rounded-lg shadow hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
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
                          card_price: 0,
                        })
                      }
                      className="text-orange-600 focus:ring-orange-500"
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
                      className="text-orange-600 focus:ring-orange-500"
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
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              {/* Targeted Sections */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  التخصصات المستهدفة
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {specializationData?.map((specialization: any) => (
                    <label
                      key={specialization?.id}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="radio"
                        name="specialization" // Same name for all radio buttons
                        value={specialization?.id}
                        checked={
                          selectedCourse?.specialization === specialization?.id
                        }
                        onChange={(e) => {
                          setSelectedCourse({
                            ...selectedCourse,
                            specialization: e.target.value,
                          });
                        }}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm">{specialization?.name}</span>
                    </label>
                  ))}
                </div>
              </div> */}

              {/* Targeted Subsections */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  الأقسام الفرعية المستهدفة
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {specialization_materialData?.map(
                    (specialization_material: any) => (
                      <label
                        key={specialization_material?.id}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="radio"
                          name="specialization_material" // Same name for all radio buttons
                          value={specialization_material?.id}
                          checked={
                            selectedCourse.specialization_material ===
                            specialization_material?.id
                          }
                          onChange={(e) => {
                            setSelectedCourse({
                              ...selectedCourse,
                              specialization_material: e.target.value,
                            });
                          }}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-sm">
                          {specialization_material?.name}
                        </span>
                      </label>
                    )
                  )}
                </div>
              </div> */}

              {/* SubSection */}
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
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
                      الصف
                    </label>
                    <select
                      value={selectedSubSub}
                      onChange={(e) => {
                        setSelectedSubSub(e.target.value);
                        setSelectedSpec("");
                        setSelectedCourse({
                          ...selectedCourse,
                          subsubsection: e.target.value,
                        });
                      }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
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
                      التخصص
                    </label>
                    <select
                      value={selectedSpec}
                      onChange={(e) => {
                        setSelectedSpec(e.target.value);
                        setSelectedCourse({
                          ...selectedCourse,
                          specialization: e.target.value,
                        });
                      }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
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
              {(spec?.specialization_materials?.length > 0 ||
                (subsub?.specializations?.length == 0 &&
                  subsub?.specialization_materials?.length > 0)) && (
                <div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      مادة التخصص
                    </label>
                    <select
                      value={selectedCourse?.specialization_material}
                      onChange={(e) => {
                        setSelectedCourse({
                          ...selectedCourse,
                          specialization_material: e.target.value,
                        });
                      }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    >
                      <option value="">اختر مادة التخصص</option>
                      {(spec?.specialization_materials.length > 0
                        ? spec?.specialization_materials
                        : subsub?.specialization_materials
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

              {/* Maximum Students */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحد الأقصى للطلاب
                </label>
                <input
                  type="number"
                  value={selectedCourse?.maximum_number_of_students || 0}
                  onChange={(e) =>
                    setSelectedCourse({
                      ...selectedCourse,
                      maximum_number_of_students: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="100"
                  min="1"
                />
              </div> */}

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
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </div>

                {/* <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">نشط</p>
                    <p className="text-sm text-gray-500">يمكن التسجيل فيه</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedCourse?.is_published}
                    onChange={(e) =>
                      setSelectedCourse({
                        ...selectedCourse,
                        is_published: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </div> */}

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
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={() => setCurrentView("list")}
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
                !selectedCourse.name ||
                !selectedCourse.start_date ||
                !selectedCourse.end_date ||
                (!selectedCourse.is_free && !selectedCourse.card_price) ||
                !selectedCourse.teacher
              }
              className="cursor-pointer px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              حفظ التغييرات
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default List View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">إدارة الدورات</h1>
          <p className="text-gray-600 text-sm">
            إدارة شاملة لجميع الدورات التعليمية في المنصة
          </p>
        </div>
        <button
          onClick={() => setCurrentView("create")}
          className="cursor-pointer bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2 text-sm"
        >
          <Plus size={16} />
          إنشاء دورة جديدة
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">إجمالي الدورات</p>
              <p className="text-3xl font-bold text-gray-800">
                {courseStatsData?.total_courses || "-"}
              </p>
            </div>
            <BookOpen className="w-12 h-12 text-orange-500" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">الدورات النشطة</p>
              <p className="text-3xl font-bold text-green-600">
                {courseStatsData?.active_courses || "-"}
              </p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">إجمالي الطلاب</p>
              <p className="text-3xl font-bold text-blue-600">
                {courseStatsData?.total_students_in_enrolled_courses || "-"}
              </p>
            </div>
            <Users className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        {/* <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">متوسط التقييم</p>
              <p className="text-3xl font-bold text-orange-600">
                2
              </p>
            </div>
            <Star className="w-12 h-12 text-orange-500" />
          </div>
        </div> */}
      </div>

      {/* Filters */}
      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="البحث في الدورات..."
              className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
            />
          </div>

          {/* Teacher Filter */}
          <select
            value={teacherFilter || ""}
            onChange={(e) =>
              setTeacherFilter(e.target.value ? e.target.value : null)
            }
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
          >
            <option value="">جميع المعلمين</option>
            {teacherData?.map((teacher: any) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          {/* <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
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
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
          >
            <option value="">جميع الحالات</option>
            <option value="true">منشور</option>
            <option value="false">مسودة</option>
          </select>

          {/* Free Filter */}
          <select
            value={freeFilter}
            onChange={(e) => setFreeFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
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
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-400 hover:bg-gray-100"
              }`}
            >
              <Rows size={16} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`cursor-pointer p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-400 hover:bg-gray-100"
              }`}
            >
              <Grid size={16} />
            </button>
          </div>
        </div>
      </div>
      {/* Courses Grid/Table */}
      {isLoading ? (
        <div className="flex justify-center">
          <Spinner size={40} thickness={4} className="text-orange-500" />
        </div>
      ) : !courseData || courseData?.length === 0 ? (
        <div className="col-span-full bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-orange-100/50">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            لا توجد نتائج
          </h3>
          <p className="text-gray-500 mb-6">ابدأ بإضافة دورة جديدة للمنصة</p>

          <button
            onClick={() => setCurrentView("create")}
            className="cursor-pointer bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <Plus size={16} />
            إضافة دورة جديدة
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseData?.map((course: any) => (
              <CourseCard key={course.id} course={course} />
            ))}

            {courseData?.length === 0 && (
              <div className="col-span-full bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-orange-100/50">
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
                    className="cursor-pointer bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2 mx-auto"
                  >
                    <Plus size={16} />
                    إنشاء دورة جديدة
                  </button>
                )}
              </div>
            )}
          </div>
          <Pagination
            currentPage={page}
            count={paginationData?.count}
            onPageChange={setPage}
          />
        </>
      ) : (
        <>
          {/* Table View */}
          <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-orange-100/50">
            <div className="overflow-x-auto">
              <table className="w-full">
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
                  {courseData?.map((course: any) => (
                    <tr key={course?.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {/* {course?.image && (
                          <img
                            loading="lazy"
                            src={course?.image}
                            alt={course?.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )} */}
                          <div>
                            <div className="font-medium text-gray-900 line-clamp-1">
                              {course?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {course?.time_in_hours}h{" "}
                              {course?.level?.name && "•" + course?.level?.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {/* {course?.teacher?.image ? (
                          <img
                            loading="lazy"
                            src={course?.teacher?.image}
                            alt={course?.teacher?.name}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <User size={24} className="text-gray-500" />
                        )} */}
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
                              ? "bg-blue-100 text-blue-800"
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
                            className="cursor-pointer p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="إدارة المحتوى"
                          >
                            <Folder size={16} />
                          </button>
                          <button
                            onClick={() => {
                              toggleCourseStatus(course?.id);
                            }}
                            className={`cursor-pointer p-2 rounded-lg transition-colors ${
                              course?.is_published
                                ? "text-green-600"
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

                          <button
                            onClick={() => {
                              setSelectedCourse(course);
                              setCurrentView("edit");
                              console.log("Editing course:", course);
                            }}
                            className="cursor-pointer p-1 text-gray-400 hover:text-orange-600 transition-colors"
                            title="تعديل"
                          >
                            <Edit size={16} />
                          </button>
                          {/* <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="cursor-pointer p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="حذف"
                        >
                          <Trash2 size={16} />
                        </button> */}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination
            currentPage={page}
            count={paginationData?.count}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
};

export default CoursesPage;
