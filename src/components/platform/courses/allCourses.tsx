import { useState, useEffect } from "react";
import {
  Play,
  Clock,
  BookOpen,
  Search,
  Grid,
  List,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useCustomQuery } from "@/hooks/platform/usePlatformQuery";
import { formatDateTimeSimple } from "@/utils/formatDateTime";
import Pagination from "@/components/dashboard/core/Pagination";

const AllCourses = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm); // update after delay
    }, 500); // 500ms delay

    return () => clearTimeout(handler); // cleanup on new keystroke
  }, [searchTerm]);

  const queryParams = new URLSearchParams();
  if (searchTerm) queryParams.append("course_name", searchTerm);
  if (page) queryParams.append("page", page.toString());
  const queryString = queryParams.toString();
  // GET MY COURSES
  const { data, error } = useCustomQuery(
    `/training/students/my-courses/?${queryString}`,
    ["myAllCourses", page, debouncedSearch],
  );
  const paginationData = data?.my_courses?.pagination;
  const myCoursesData = data?.my_courses?.data;
  const myCoursesStats = data?.statistics;
  // Extended enrolled courses data
  // Filter and sort courses
  // Sort By
  // .sort((a, b) => {
  //   switch (sortBy) {
  //     case "progress":
  //       return b.progress - a.progress;
  //     case "recent":
  //       return (
  //         new Date(b.enrolledDate).getTime() -
  //         new Date(a.enrolledDate).getTime()
  //       );
  //     case "rating":
  //       return b.rating - a.rating;
  //     case "alphabetical":
  //       return a.title.localeCompare(b.title);
  //     default:
  //       return 0;
  //   }
  // });

  const renderCourseCard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {myCoursesData?.map((course: any) => (
        <div
          key={course?.course_id}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 group transform hover:scale-105"
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="bg-blue-100 text-(--brand-secondary) px-2 py-1 rounded-lg text-xs font-medium">
                    {course?.specialization_material?.name || "-"}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-(--brand-secondary) transition-colors duration-300">
                  {course.course_name || "-"}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {course.teacher || "-"}
                </p>
              </div>

              {/* Circular Progress */}
              <div className="relative w-12 h-12 shrink-0">
                <svg
                  className="w-12 h-12 transform -rotate-90"
                  viewBox="0 0 48 48"
                >
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#e5e7eb"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#3b82f6"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={2 * Math.PI * 20}
                    strokeDashoffset={
                      (1 - course?.progress / 100) * (2 * Math.PI * 20)
                    }
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-(--brand-secondary)">
                    {course?.progress}%
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Details */}
            <div className="bg-gray-50 rounded-xl p-3 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">التقدم</span>
                <span className="text-sm font-medium text-gray-900">
                  {course?.total_number_of_completed_lessons}/
                  {course?.total_lessons}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-linear-to-r from-(--brand-secondary) to-(--brand-secondary-dark) h-2 rounded-full transition-all duration-500"
                  style={{ width: `${course?.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Next Lesson */}
            <div className="bg-linear-to-r from-blue-50 to-purple-50 rounded-xl p-3 mb-4">
              <div className="flex items-center space-x-2 mb-1">
                <Play className="w-4 h-4 text-(--brand-secondary)" />
                <span className="text-sm font-medium text-gray-900">
                  الدرس التالي:
                </span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                {course?.next_lesson ?? "لا يوجد"}
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-3 mb-4 text-xs justify-between">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-gray-500" />
                <span className="text-gray-600">
                  {formatDateTimeSimple(course?.enrollment_created_at)}
                </span>
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={() => navigate(`/coursePage/${course?.course_id}`)}
              className="w-full cursor-pointer text-white py-2.5 px-4 rounded-xl font-semibold bg-[linear-gradient(to_right,var(--brand-secondary),var(--brand-secondary-dark),var(--brand-secondary))] bg-size-[200%_100%] bg-left hover:bg-right transition-all duration-700 transform group-hover:scale-105 flex items-center justify-center space-x-2 text-sm"
            >
              <Play className="w-4 h-4" />
              <span>متابعة التعلم</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCourseList = () => (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
      {myCoursesData?.map((course: any) => (
        <div className="p-6">
          <div className="flex md:flex-row flex-col items-center gap-6 w-full">
            {/* Progress Circle */}
            <div className="relative w-20 h-20 md:w-12 md:h-12 shrink-0">
              <svg
                className=" w-20 h-20 md:w-12 md:h-12 transform -rotate-90"
                viewBox="0 0 48 48"
              >
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="#e5e7eb"
                  strokeWidth="4"
                  fill="none"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="#3b82f6"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 20}
                  strokeDashoffset={
                    (1 - course?.progress / 100) * (2 * Math.PI * 20)
                  }
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg md:text-xs font-bold text-(--brand-secondary)">
                  {course?.progress}%
                </span>
              </div>
            </div>

            {/* Course Info */}
            <div className="flex-1 w-full">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-blue-100 text-(--brand-secondary) px-2 py-1 rounded-lg text-xs font-medium">
                      {course?.specialization_material?.name ?? "-"}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-(--brand-secondary) transition-colors duration-300">
                    {course?.course_name}
                  </h3>
                  <p className="text-gray-600 mb-2">{course?.teacher}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>
                      {course?.total_number_of_completed_lessons}/
                      {course?.total_lessons} دروس
                    </span>
                    <span>•</span>
                    <span>
                      {formatDateTimeSimple(course?.enrollment_created_at)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-linear-to-r from-(--brand-secondary) to-(--brand-secondary-dark) h-2 rounded-full transition-all duration-500"
                    style={{ width: `${course?.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="shrink-0">
              <button
                onClick={() => navigate(`/coursePage/${course?.id}`)}
                className="bg-linear-to-r from-(--brand-secondary) to-(--brand-secondary-dark) text-white cursor-pointer px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform group-hover:scale-105 flex items-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>متابعة</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-linear-to-r from-(--brand-secondary) to-(--brand-secondary-dark) shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => {
                if (window.history.length > 1) {
                  navigate(-1);
                } else {
                  navigate("/");
                }
              }}
              className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-xl cursor-pointer flex items-center justify-center transition-all duration-200 group"
            >
              <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-white mb-6 md:mb-0">
              <h1 className="text-4xl font-bold mb-2">جميع دوراتي</h1>
              <p className="text-blue-100 text-lg">
                إدارة ومتابعة جميع الدورات المسجل فيها
              </p>
            </div>

            {/* Overall Stats */}
            {!error && myCoursesData?.length !== 0 && (
              <div className="grid grid-cols-3 gap-6 text-center text-white">
                <div>
                  <div className="text-3xl font-bold mb-1">
                    {myCoursesStats?.number_of_completed_lessons ?? "-"}
                  </div>
                  <div className="text-blue-100 text-sm">دروس مكتملة</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1">
                    {myCoursesStats?.percentage_of_completed_lessons_for_all_enrolled_courses.toFixed(
                      2,
                    ) ?? "-"}
                    %
                  </div>
                  <div className="text-blue-100 text-sm">متوسط التقدم</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1">
                    {myCoursesStats?.number_of_active_enrolled_courses ?? "-"}
                  </div>
                  <div className="text-blue-100 text-sm">دورات نشطة</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      {!error && myCoursesData?.length !== 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-6">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث في الدورات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300"
                />
              </div>
              {/* View Mode */}
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all cursor-pointer duration-200 ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm text-(--brand-secondary)"
                      : "text-gray-600"
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all cursor-pointer duration-200 ${
                    viewMode === "list"
                      ? "bg-white shadow-sm text-(--brand-secondary)"
                      : "text-gray-600"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          {!error && myCoursesData?.length !== 0 && (
            <div className="mb-6">
              <p className="text-gray-600">
                عرض{" "}
                <span className="font-semibold">
                  {myCoursesStats?.number_of_active_enrolled_courses ?? "-"}
                </span>{" "}
                من أصل{" "}
                <span className="font-semibold">
                  {myCoursesData?.length ?? "-"}
                </span>{" "}
                دورة
              </p>
            </div>
          )}

          {/* Courses Display */}

          {/* Empty State */}
          {myCoursesData?.length === 0 || !myCoursesData ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                لا توجد دورات
              </h3>
              <p className="text-gray-600">
                لم يتم العثور على دورات تطابق معايير البحث
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <>
              {renderCourseCard()}
              <Pagination
                currentPage={page}
                count={paginationData?.count}
                onPageChange={setPage}
              />
            </>
          ) : (
            <>
              <div className="space-y-6">{renderCourseList()}</div>
              <Pagination
                currentPage={page}
                count={paginationData?.count}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            لا توجد دورات
          </h3>
          <p className="text-gray-600">
            لم يتم العثور على دورات تطابق معايير البحث
          </p>
        </div>
      )}
    </div>
  );
};
export default AllCourses;
