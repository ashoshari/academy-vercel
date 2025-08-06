import { useState } from "react";
import {
  Play,
  Clock,
  BookOpen,
  Award,
  Calendar,
  Search,
  Grid,
  List,
  Users,
  Download,
  Target,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useCustomQuery } from "@/hooks/useQuery";
import { formatDateTimeSimple } from "@/utils/formatDateTime";

const AllCourses = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("progress");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();
  const numberOfCourses = 3;

  // GET MY COURSES
  const { data } = useCustomQuery(
    `/training/students/my-courses/?page_size=${numberOfCourses}&page=3`,
    ["myAllCourses", numberOfCourses]
  );

  const myCoursesData = data?.my_courses?.data;
  const myCoursesStats = data?.statistics;
  // Extended enrolled courses data
  const enrolledCourses = [
    {
      id: 1,
      title: "دورة الرياضيات الشاملة - الجبر والهندسة",
      teacher: "أ. محمد الأحمد",
      subject: "الرياضيات",
      progress: 75,
      totalLessons: 45,
      completedLessons: 34,
      nextLesson: "التفاضل والتكامل - الجزء الثالث",
      nextLessonDate: "2025-01-20",
      rating: 4.9,
      lastAccessed: "منذ يومين",
      totalDuration: "3 أشهر",
      certificate: true,
      enrolledDate: "2024-10-15",
      totalStudents: 1200,
      completionRate: 85,
      averageScore: 88,
    },
    {
      id: 2,
      title: "دورة الفيزياء المتقدمة",
      teacher: "أ. فاطمة السعد",
      subject: "الفيزياء",
      progress: 45,
      totalLessons: 38,
      completedLessons: 17,
      nextLesson: "الكهرباء والمغناطيسية",
      nextLessonDate: "2025-01-21",
      rating: 4.8,
      lastAccessed: "منذ 3 أيام",
      totalDuration: "2.5 أشهر",
      certificate: true,
      enrolledDate: "2024-11-01",
      totalStudents: 980,
      completionRate: 78,
      averageScore: 82,
    },
    {
      id: 3,
      title: "دورة اللغة الإنجليزية التفاعلية",
      teacher: "أ. ليلى المحمود",
      subject: "اللغة الإنجليزية",
      progress: 90,
      totalLessons: 30,
      completedLessons: 27,
      nextLesson: "المراجعة النهائية",
      nextLessonDate: "2025-01-19",
      rating: 4.9,
      lastAccessed: "منذ يوم واحد",
      totalDuration: "2 أشهر",
      certificate: true,
      enrolledDate: "2024-11-15",
      totalStudents: 1150,
      completionRate: 92,
      averageScore: 94,
    },
    {
      id: 4,
      title: "دورة الكيمياء العضوية",
      teacher: "أ. أحمد الخالد",
      subject: "الكيمياء",
      progress: 60,
      totalLessons: 32,
      completedLessons: 19,
      nextLesson: "المركبات الأروماتية",
      nextLessonDate: "2025-01-22",
      rating: 4.7,
      lastAccessed: "منذ 4 أيام",
      totalDuration: "2.5 أشهر",
      certificate: true,
      enrolledDate: "2024-10-20",
      totalStudents: 850,
      completionRate: 75,
      averageScore: 79,
    },
    {
      id: 5,
      title: "دورة الأحياء الجزيئية",
      teacher: "أ. نور العلي",
      subject: "الأحياء",
      progress: 30,
      totalLessons: 28,
      completedLessons: 8,
      nextLesson: "الحمض النووي والوراثة",
      nextLessonDate: "2025-01-23",
      rating: 4.6,
      lastAccessed: "منذ أسبوع",
      totalDuration: "2 أشهر",
      certificate: true,
      enrolledDate: "2024-12-01",
      totalStudents: 720,
      completionRate: 68,
      averageScore: 75,
    },
    {
      id: 6,
      title: "دورة اللغة العربية المتقدمة",
      teacher: "أ. سامر الحسن",
      subject: "اللغة العربية",
      progress: 85,
      totalLessons: 35,
      completedLessons: 30,
      nextLesson: "البلاغة والبيان",
      nextLessonDate: "2025-01-24",
      rating: 4.8,
      lastAccessed: "منذ يوم واحد",
      totalDuration: "3 أشهر",
      certificate: true,
      enrolledDate: "2024-09-10",
      totalStudents: 1300,
      completionRate: 88,
      averageScore: 91,
    },
  ];

  const subjects = [
    "all",
    "الرياضيات",
    "الفيزياء",
    "الكيمياء",
    "الأحياء",
    "اللغة الإنجليزية",
    "اللغة العربية",
  ];

  // Filter and sort courses
  const filteredCourses = enrolledCourses.filter((course) => {
    // Filter By Subject
    // const matchesSubject =
    //   filterSubject === "all" || course.subject === filterSubject;

    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });
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
          key={course?.id}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 group cursor-pointer transform hover:scale-105"
          //   onClick={() => onCourseClick(course.id)}
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-xs font-medium">
                    {course?.specialization?.name}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                  {course.course_name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{course.teacher}</p>
              </div>

              {/* Circular Progress */}
              <div className="relative w-12 h-12 flex-shrink-0">
                <svg
                  className="w-12 h-12 transform -rotate-90"
                  viewBox="0 0 48 48"
                >
                  <circle
                    cx="24"
                    cy="24"
                    r="18"
                    stroke="#e5e7eb"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="18"
                    stroke="#3b82f6"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={2 * Math.PI * 18}
                    strokeDashoffset={
                      (1 - course?.progress / 100) * (2 * Math.PI * 18)
                    }
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">
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
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${course?.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Next Lesson */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3 mb-4">
              <div className="flex items-center space-x-2 mb-1">
                <Play className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">
                  الدرس التالي:
                </span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                {course?.nextLesson || "لا يوجد"}
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
              <div className="flex items-center space-x-2">
                <Users className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-500">
                  {course?.total_number_of_enrolled_students}
                </span>
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={() => navigate(`/coursePage/${course?.id}`)}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2.5 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center space-x-2 text-sm"
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
    <div
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer"
      //   onClick={() => onCourseClick(course.id)}
    >
      {myCoursesData?.map((course: any) => (
        <div className="p-6">
          <div className="flex items-center space-x-6">
            {/* Progress Circle */}
            <div className="relative w-12 h-12 flex-shrink-0">
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
                <span className="text-sm font-bold text-blue-600">
                  {course?.progress}%
                </span>
              </div>
            </div>

            {/* Course Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-xs font-medium">
                      {course?.specialization?.name}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">
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

                {/* Stats */}
                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    {course?.total_number_of_enrolled_students} طالب
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${course?.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex-shrink-0">
              <button
                onClick={() => navigate(`/coursePage/${course?.id}`)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform group-hover:scale-105 flex items-center space-x-2"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() =>
                window.history.length > 1 ? navigate(-1) : navigate("/")
              }
              className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all duration-200 group"
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
            <div className="grid grid-cols-3 gap-6 text-center text-white">
              <div>
                <div className="text-3xl font-bold mb-1">
                  {myCoursesStats?.number_of_completed_lessons}
                </div>
                <div className="text-blue-100 text-sm">دروس مكتملة</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">
                  {
                    myCoursesStats?.percentage_of_completed_lessons_for_all_enrolled_courses
                  }
                  %
                </div>
                <div className="text-blue-100 text-sm">متوسط التقدم</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">
                  {myCoursesStats?.number_of_active_enrolled_courses}
                </div>
                <div className="text-blue-100 text-sm">دورات نشطة</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
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

            {/* Filters */}
            {/* <div className="flex items-center space-x-4">
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300"
              >
                <option value="all">جميع المواد</option>
                {subjects.slice(1).map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300"
              >
                <option value="progress">حسب التقدم</option>
                <option value="recent">الأحدث</option>
                <option value="rating">حسب التقييم</option>
                <option value="alphabetical">أبجدياً</option>
              </select>
            </div> */}

            {/* View Mode */}
            <div className="flex items-center bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-white shadow-sm text-blue-600"
                    : "text-gray-600"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-white shadow-sm text-blue-600"
                    : "text-gray-600"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            عرض{" "}
            <span className="font-semibold">
              {myCoursesStats?.number_of_active_enrolled_courses}
            </span>{" "}
            من أصل{" "}
            <span className="font-semibold">{myCoursesData?.length}</span> دورة
          </p>
        </div>

        {/* Courses Display */}
        {viewMode === "grid" ? (
          renderCourseCard()
        ) : (
          <div className="space-y-6">{renderCourseList()}</div>
        )}

        {/* Empty State */}
        {filteredCourses.length === 0 && (
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
    </div>
  );
};
export default AllCourses;
