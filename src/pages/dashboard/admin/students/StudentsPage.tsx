import {
  Plus,
  Edit,
  Eye,
  Users,
  BookOpen,
  Phone,
  Mail,
  GraduationCap,
  CreditCard,
  FileText,
  UserCheck,
  CheckCircle,
  DollarSign,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useCustomQuery } from "@/hooks/useQuery";

export interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  dateOfBirth: string;
  gender: "male" | "female";
  location: string;
  parentPhone?: string;
  parentEmail?: string;
  schoolName?: string;
  grade: string;
  isActive: boolean;
  isVerified: boolean;
  registrationDate: string;
  lastLogin: string;
  totalCoursesEnrolled: number;
  completedCourses: number;
  currentCourses: number;
  totalSpent: number;
  averageGrade: number;
  studyHours: number;
  enrolledCourses: CourseEnrollment[];
  achievements: Achievement[];
  paymentHistory: PaymentRecord[];
  activityLog: ActivityRecord[];
}

export interface CourseEnrollment {
  courseId: number;
  courseName: string;
  courseType: "exam" | "ministry" | "course" | "cards";
  teacherName: string;
  enrollmentDate: string;
  completionDate?: string;
  progress: number; // 0-100
  grade?: number; // 0-100
  status: "active" | "completed" | "paused" | "dropped";
  timeSpent: number; // in hours
  lastAccessed: string;
  price: number;
  isPaid: boolean;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  earnedDate: string;
  category: "completion" | "grade" | "streak" | "participation";
}

export interface PaymentRecord {
  id: number;
  amount: number;
  date: string;
  method: "card" | "cash" | "bank_transfer";
  status: "completed" | "pending" | "failed";
  description: string;
  courseId?: number;
}

export interface ActivityRecord {
  id: number;
  action: string;
  description: string;
  timestamp: string;
  category: "login" | "course" | "payment" | "achievement" | "exam";
}

const StudentsPage = () => {
  const navigate = useNavigate();
  // const [showDetailsModal, setShowDetailsModal] = useState(false);
  // const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  // const [searchTerm, setSearchTerm] = useState("");
  // const [gradeFilter, setGradeFilter] = useState<string>("");
  // const [statusFilter, setStatusFilter] = useState<
  //   "all" | "active" | "inactive" | "verified" | "unverified"
  // >("all");

  // const [courseFilter, setCourseFilter] = useState<string>("");
  // const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const data = useCustomQuery("/account/admin/students/", ["students"]);
  const dataStatistics = useCustomQuery("/account/admin/students-statistics/", [
    "students-statistics",
  ]);

  // Filter students based on search and filters
  // const filteredStudents = studentsData.filter((student) => {
  //   const matchesSearch =
  //     student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     student.phone.includes(searchTerm);

  //   const matchesGrade = gradeFilter === "" || student.grade === gradeFilter;

  //   const matchesStatus =
  //     statusFilter === "all" ||
  //     (statusFilter === "active" && student.isActive) ||
  //     (statusFilter === "inactive" && !student.isActive) ||
  //     (statusFilter === "verified" && student.isVerified) ||
  //     (statusFilter === "unverified" && !student.isVerified);

  //   const matchesCourse =
  //     courseFilter === "" ||
  //     student.enrolledCourses.some((course) =>
  //       course.courseName.toLowerCase().includes(courseFilter.toLowerCase())
  //     );

  //   return matchesSearch && matchesGrade && matchesStatus && matchesCourse;
  // });

  // Get unique grades for filter
  // const uniqueGrades = [...new Set(studentsData.map((s) => s.grade))];

  // const handleDeleteStudent = (id: number) => {
  //   if (
  //     confirm("هل أنت متأكد من حذف هذا الطالب؟ سيتم حذف جميع بياناته نهائياً.")
  //   ) {
  //     setStudentsData(studentsData.filter((student) => student.id !== id));
  //   }
  // };

  // const toggleStudentStatus = (
  //   id: number,
  //   field: "isActive" | "isVerified"
  // ) => {
  //   setStudentsData(
  //     studentsData.map((student) =>
  //       student.id === id ? { ...student, [field]: !student[field] } : student
  //     )
  //   );
  // };

  const getCourseTypeIcon = (type: string) => {
    switch (type) {
      case "exam":
        return BookOpen;
      case "ministry":
        return FileText;
      case "course":
        return GraduationCap;
      case "cards":
        return CreditCard;
      default:
        return BookOpen;
    }
  };

  // const exportToExcel = () => {
  //   const csvContent = [
  //     [
  //       "الاسم",
  //       "البريد الإلكتروني",
  //       "الهاتف",
  //       "الصف",
  //       "الحالة",
  //       "مؤكد",
  //       "الدورات المسجلة",
  //       "الدورات المكتملة",
  //       "المعدل",
  //       "إجمالي الإنفاق",
  //     ],
  //     ...filteredStudents.map((student) => [
  //       student.name,
  //       student.email,
  //       student.phone,
  //       student.grade,
  //       student.isActive ? "نشط" : "غير نشط",
  //       student.isVerified ? "مؤكد" : "غير مؤكد",
  //       student.totalCoursesEnrolled,
  //       student.completedCourses,
  //       student.averageGrade,
  //       student.totalSpent,
  //     ]),
  //   ]
  //     .map((row) => row.join(","))
  //     .join("\n");

  //   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  //   const link = document.createElement("a");
  //   link.href = URL.createObjectURL(blob);
  //   link.download = `students-${new Date().toISOString().split("T")[0]}.csv`;
  //   link.click();
  // };

  const StudentCard = ({ student }: { student: any }) => (
    <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-orange-100/50 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={
                student.image ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  student.name
                )}&background=ffffff&color=f97316&size=64`
              }
              alt={student.name}
              className="w-16 h-16 rounded-full border-2 border-white/20"
            />
            {/* <div
              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                student.isActive ? "bg-green-500" : "bg-gray-400"
              }`}
            ></div> */}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">{student.name}</h3>
            <p className="text-orange-100 text-sm">{student.grade}</p>
            {/* <div className="flex items-center gap-2 mt-2">
              {student.isVerified && (
                <span className="bg-green-400/20 text-green-100 px-2 py-1 rounded-full text-xs font-medium">
                  مؤكد
                </span>
              )}
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  student.isActive
                    ? "bg-green-400/20 text-green-100"
                    : "bg-red-400/20 text-red-100"
                }`}
              >
                {student.isActive ? "نشط" : "غير نشط"}
              </span>
            </div> */}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">
              {student.total_number_of_enrolled_courses}
            </div>
            <div className="text-xs text-gray-500">دورات مسجلة</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {student.total_number_of_completed_courses}
            </div>
            <div className="text-xs text-gray-500">دورات مكتملة</div>
          </div>
          {/* <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {student.total_number_of_completed_courses} %
            </div>
            <div className="text-xs text-gray-500">المعدل</div>
          </div> */}
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {student.total_spend} د.أ
            </div>
            <div className="text-xs text-gray-500">إجمالي الإنفاق</div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone size={14} />
            <span>{student.mobile_number}</span>
          </div>
          {student.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail size={14} />
              <span className="truncate">{student.email}</span>
            </div>
          )}
          {/* <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={14} />
            <span>{student.location}</span>
          </div> */}
        </div>

        {/* Recent Courses */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-800 mb-3">الدورات الحالية</h4>
          <div className="space-y-2">
            {student?.current_courses
              ?.filter((c: any) => c.status === "active")
              .slice(0, 2)
              .map((course: any) => {
                const IconComponent = getCourseTypeIcon(course.courseType);
                return (
                  <div
                    key={course.courseId}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                  >
                    <IconComponent size={16} className="text-orange-500" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800 truncate">
                        {course.courseName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {course.progress}% مكتمل
                      </div>
                    </div>
                  </div>
                );
              })}
            {student?.current_courses?.filter((c: any) => c.status === "active")
              .length === 0 && (
              <p className="text-sm text-gray-500 text-center py-2">
                لا توجد دورات نشطة
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1">
            {/* <button
              onClick={() => toggleStudentStatus(student.id, "isActive")}
              className={`p-2 rounded-lg transition-colors ${
                student.isActive
                  ? "text-green-600 bg-green-50 hover:bg-green-100"
                  : "text-gray-400 bg-gray-50 hover:bg-gray-100"
              }`}
              title={student.isActive ? "إلغاء تفعيل الطالب" : "تفعيل الطالب"}
            >
              {student.isActive ? <UserCheck size={16} /> : <UserX size={16} />}
            </button> */}

            {/* <button
              onClick={() => toggleStudentStatus(student.id, "isVerified")}
              className={`p-2 rounded-lg transition-colors ${
                student.isVerified
                  ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
                  : "text-gray-400 bg-gray-50 hover:bg-gray-100"
              }`}
              title={student.isVerified ? "إلغاء التحقق" : "تأكيد الطالب"}
            >
              {student.isVerified ? (
                <CheckCircle size={16} />
              ) : (
                <XCircle size={16} />
              )}
            </button> */}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                navigate(`/dashboard/students/${student.id}`);
              }}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="عرض التفاصيل"
            >
              <Eye size={16} />
            </button>

            <button
              onClick={() => {
                navigate(`/dashboard/students/edit/${student.id}`);
              }}
              className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
              title="تعديل الطالب"
            >
              <Edit size={16} />
            </button>

            {/* 
              <button
                onClick={() => handleDeleteStudent(student.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="حذف الطالب"
              >
                <Trash2 size={16} />
              </button> 
            */}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">إدارة الطلاب</h1>
          <p className="text-gray-600 text-sm">
            إدارة شاملة لجميع الطلاب المسجلين في المنصة
          </p>
        </div>
        <div className="flex gap-3">
          {/* <button
            onClick={exportToExcel}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-all duration-300 flex items-center gap-2 text-sm"
          >
            <Download size={16} />
            تصدير Excel
          </button> */}
          <button
            onClick={() => navigate("/dashboard/students/add")}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2 text-sm"
          >
            <Plus size={16} />
            إضافة طالب
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">إجمالي الطلاب</p>
              <p className="text-3xl font-bold text-gray-800">
                {dataStatistics?.data?.data?.total_students}
              </p>
            </div>
            <Users className="w-12 h-12 text-orange-500" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">الطلاب النشطون</p>
              <p className="text-3xl font-bold text-green-600">
                {dataStatistics?.data?.data?.active_students}
              </p>
            </div>
            <UserCheck className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">الطلاب الغير نشطون</p>
              <p className="text-3xl font-bold text-blue-600">
                {dataStatistics?.data?.data?.inactive_students}
              </p>
            </div>
            <CheckCircle className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">إجمالي الإيرادات</p>
              <p className="text-3xl font-bold text-orange-600">
                {dataStatistics?.data?.data?.total_income}
                د.أ
              </p>
            </div>
            <DollarSign className="w-12 h-12 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      {/* <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="البحث في الطلاب..."
              className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
            />
          </div>

          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
          >
            <option value="">جميع الصفوف</option>
            {uniqueGrades.map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
          >
            <option value="all">جميع الحالات</option>
            <option value="active">نشط</option>
            <option value="inactive">غير نشط</option>
            <option value="verified">مؤكد</option>
            <option value="unverified">غير مؤكد</option>
          </select>

          <input
            type="text"
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            placeholder="فلترة بالدورة..."
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
          />

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-400 hover:bg-gray-100"
              }`}
            >
              <BarChart3 size={16} />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "table"
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-400 hover:bg-gray-100"
              }`}
            >
              <PieChart size={16} />
            </button>
          </div>

          <div className="flex items-center justify-center bg-gray-50 rounded-lg px-4 py-2">
            <span className="text-sm text-gray-600">
              {filteredStudents.length} من {studentsData.length} طالب
            </span>
          </div>
        </div>
      </div> */}

      {/* Students Grid/Table */}
      {/* {viewMode === "grid" ? ( */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.data?.data?.map((student: any) => (
          <StudentCard key={student.id} student={student} />
        ))}

        {data?.data?.data?.length === 0 && (
          <div className="col-span-full bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-orange-100/50">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              لا توجد نتائج
            </h3>
            <p className="text-gray-500 mb-6">ابدأ بإضافة طلاب جدد للمنصة</p>

            <button
              onClick={() => navigate("/dashboard/students/add")}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              <Plus size={16} />
              إضافة طالب جديد
            </button>
          </div>
        )}
      </div>
      {/* ) : ( */}

      {/* <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-orange-100/50">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الطالب
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الصف
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الدورات
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المعدل
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإنفاق
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.data?.data?.map((student: any) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            student.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              student.name
                            )}&background=f97316&color=ffffff&size=40`
                          }
                          alt={student.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="font-medium text-gray-900">
                            {student.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.grade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {student.totalCoursesEnrolled}
                        </span>
                        <span className="text-gray-500">
                          ({student.completedCourses} مكتمل)
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="font-medium">
                        {student.averageGrade.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="font-medium">
                        {student.totalSpent} د.أ
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            student.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {student.isActive ? "نشط" : "غير نشط"}
                        </span>
                        {student.isVerified && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            مؤكد
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowDetailsModal(true);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="عرض التفاصيل"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => {
                            navigate(`/dashboard/students/edit/${student.id}`);
                          }}
                          className="p-1 text-gray-400 hover:text-orange-600 transition-colors"
                          title="تعديل"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="حذف"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div> */}
      {/* )} */}
    </div>
  );
};

export default StudentsPage;
