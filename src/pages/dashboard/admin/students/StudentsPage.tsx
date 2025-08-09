import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  X,
  Users,
  BookOpen,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Award,
  CreditCard,
  FileText,
  Download,
  UserCheck,
  UserX,
  BarChart3,
  PieChart,
  CheckCircle,
  XCircle,
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
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [gradeFilter, setGradeFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive" | "verified" | "unverified"
  >("all");

  const [courseFilter, setCourseFilter] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const data = useCustomQuery("/account/admin/students/", ["students"]);
  const dataStatistics = useCustomQuery("/account/admin/students-statistics/", [
    "students-statistics",
  ]);

  // Sample data for students
  const [studentsData, setStudentsData] = useState<Student[]>([
    {
      id: 1,
      name: "أحمد محمد علي",
      email: "ahmed.mohamed@example.com",
      phone: "0791234567",
      avatar:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
      dateOfBirth: "2005-03-15",
      gender: "male",
      location: "عمان، الأردن",
      parentPhone: "0796543210",
      parentEmail: "parent.ahmed@example.com",
      schoolName: "مدرسة الملك عبدالله الثاني",
      grade: "التوجيهي العلمي",
      isActive: true,
      isVerified: true,
      registrationDate: "2024-01-15",
      lastLogin: "2024-01-20",
      totalCoursesEnrolled: 5,
      completedCourses: 2,
      currentCourses: 3,
      totalSpent: 150.0,
      averageGrade: 87.5,
      studyHours: 45,
      enrolledCourses: [
        {
          courseId: 1,
          courseName: "الرياضيات المتقدمة",
          courseType: "course",
          teacherName: "د. أحمد محمد",
          enrollmentDate: "2024-01-15",
          progress: 75,
          grade: 85,
          status: "active",
          timeSpent: 20,
          lastAccessed: "2024-01-20",
          price: 50.0,
          isPaid: true,
        },
        {
          courseId: 2,
          courseName: "امتحانات الفيزياء",
          courseType: "exam",
          teacherName: "م. خالد سالم",
          enrollmentDate: "2024-01-10",
          completionDate: "2024-01-18",
          progress: 100,
          grade: 90,
          status: "completed",
          timeSpent: 15,
          lastAccessed: "2024-01-18",
          price: 30.0,
          isPaid: true,
        },
        {
          courseId: 3,
          courseName: "أسئلة وزارية - كيمياء",
          courseType: "ministry",
          teacherName: "د. سارة عبدالله",
          enrollmentDate: "2024-01-12",
          progress: 60,
          status: "active",
          timeSpent: 10,
          lastAccessed: "2024-01-19",
          price: 40.0,
          isPaid: true,
        },
      ],
      achievements: [
        {
          id: 1,
          title: "أول إنجاز",
          description: "إكمال أول دورة بنجاح",
          icon: "Award",
          earnedDate: "2024-01-18",
          category: "completion",
        },
        {
          id: 2,
          title: "طالب متميز",
          description: "الحصول على معدل أعلى من 85%",
          icon: "Star",
          earnedDate: "2024-01-19",
          category: "grade",
        },
      ],
      paymentHistory: [
        {
          id: 1,
          amount: 50.0,
          date: "2024-01-15",
          method: "card",
          status: "completed",
          description: "دورة الرياضيات المتقدمة",
          courseId: 1,
        },
        {
          id: 2,
          amount: 30.0,
          date: "2024-01-10",
          method: "card",
          status: "completed",
          description: "امتحانات الفيزياء",
          courseId: 2,
        },
      ],
      activityLog: [
        {
          id: 1,
          action: "تسجيل دخول",
          description: "دخول إلى المنصة",
          timestamp: "2024-01-20 09:30:00",
          category: "login",
        },
        {
          id: 2,
          action: "إكمال درس",
          description: "إكمال درس المعادلات التفاضلية",
          timestamp: "2024-01-20 10:15:00",
          category: "course",
        },
      ],
    },
    {
      id: 2,
      name: "فاطمة أحمد سالم",
      email: "fatima.ahmed@example.com",
      phone: "0792345678",
      avatar:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150",
      dateOfBirth: "2006-07-22",
      gender: "female",
      location: "إربد، الأردن",
      parentPhone: "0797654321",
      parentEmail: "parent.fatima@example.com",
      schoolName: "مدرسة الملكة رانيا",
      grade: "الحادي عشر العلمي",
      isActive: true,
      isVerified: true,
      registrationDate: "2024-01-12",
      lastLogin: "2024-01-19",
      totalCoursesEnrolled: 3,
      completedCourses: 1,
      currentCourses: 2,
      totalSpent: 90.0,
      averageGrade: 92.0,
      studyHours: 28,
      enrolledCourses: [
        {
          courseId: 4,
          courseName: "اللغة العربية",
          courseType: "course",
          teacherName: "أ. فاطمة أحمد",
          enrollmentDate: "2024-01-12",
          progress: 80,
          grade: 92,
          status: "active",
          timeSpent: 18,
          lastAccessed: "2024-01-19",
          price: 45.0,
          isPaid: true,
        },
        {
          courseId: 5,
          courseName: "بطاقات الأحياء",
          courseType: "cards",
          teacherName: "د. محمد الأحمد",
          enrollmentDate: "2024-01-14",
          completionDate: "2024-01-17",
          progress: 100,
          grade: 95,
          status: "completed",
          timeSpent: 10,
          lastAccessed: "2024-01-17",
          price: 25.0,
          isPaid: true,
        },
      ],
      achievements: [
        {
          id: 3,
          title: "متفوقة",
          description: "الحصول على معدل أعلى من 90%",
          icon: "Star",
          earnedDate: "2024-01-17",
          category: "grade",
        },
      ],
      paymentHistory: [
        {
          id: 3,
          amount: 45.0,
          date: "2024-01-12",
          method: "bank_transfer",
          status: "completed",
          description: "دورة اللغة العربية",
          courseId: 4,
        },
      ],
      activityLog: [
        {
          id: 3,
          action: "تسجيل دخول",
          description: "دخول إلى المنصة",
          timestamp: "2024-01-19 14:20:00",
          category: "login",
        },
      ],
    },
    {
      id: 3,
      name: "محمد خالد عبدالله",
      email: "mohammed.khaled@example.com",
      phone: "0793456789",
      avatar:
        "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150",
      dateOfBirth: "2004-11-08",
      gender: "male",
      location: "الزرقاء، الأردن",
      parentPhone: "0798765432",
      schoolName: "مدرسة الحسين بن علي",
      grade: "التوجيهي الأدبي",
      isActive: false,
      isVerified: false,
      registrationDate: "2024-01-08",
      lastLogin: "2024-01-16",
      totalCoursesEnrolled: 2,
      completedCourses: 0,
      currentCourses: 1,
      totalSpent: 35.0,
      averageGrade: 72.0,
      studyHours: 12,
      enrolledCourses: [
        {
          courseId: 6,
          courseName: "التاريخ الإسلامي",
          courseType: "course",
          teacherName: "أ. عبدالرحمن محمد",
          enrollmentDate: "2024-01-08",
          progress: 45,
          grade: 72,
          status: "paused",
          timeSpent: 8,
          lastAccessed: "2024-01-16",
          price: 35.0,
          isPaid: true,
        },
      ],
      achievements: [],
      paymentHistory: [
        {
          id: 4,
          amount: 35.0,
          date: "2024-01-08",
          method: "cash",
          status: "completed",
          description: "دورة التاريخ الإسلامي",
          courseId: 6,
        },
      ],
      activityLog: [
        {
          id: 4,
          action: "تسجيل دخول",
          description: "دخول إلى المنصة",
          timestamp: "2024-01-16 16:45:00",
          category: "login",
        },
      ],
    },
  ]);

  // Filter students based on search and filters
  const filteredStudents = studentsData.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phone.includes(searchTerm);

    const matchesGrade = gradeFilter === "" || student.grade === gradeFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && student.isActive) ||
      (statusFilter === "inactive" && !student.isActive) ||
      (statusFilter === "verified" && student.isVerified) ||
      (statusFilter === "unverified" && !student.isVerified);

    const matchesCourse =
      courseFilter === "" ||
      student.enrolledCourses.some((course) =>
        course.courseName.toLowerCase().includes(courseFilter.toLowerCase())
      );

    return matchesSearch && matchesGrade && matchesStatus && matchesCourse;
  });

  // Get unique grades for filter
  const uniqueGrades = [...new Set(studentsData.map((s) => s.grade))];

  const handleDeleteStudent = (id: number) => {
    if (
      confirm("هل أنت متأكد من حذف هذا الطالب؟ سيتم حذف جميع بياناته نهائياً.")
    ) {
      setStudentsData(studentsData.filter((student) => student.id !== id));
    }
  };

  const toggleStudentStatus = (
    id: number,
    field: "isActive" | "isVerified"
  ) => {
    setStudentsData(
      studentsData.map((student) =>
        student.id === id ? { ...student, [field]: !student[field] } : student
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100";
      case "completed":
        return "text-blue-600 bg-blue-100";
      case "paused":
        return "text-yellow-600 bg-yellow-100";
      case "dropped":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

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

  const StudentDetailsModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {selectedStudent && (
          <>
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      selectedStudent.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        selectedStudent.name
                      )}&background=f97316&color=ffffff&size=64`
                    }
                    alt={selectedStudent.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {selectedStudent.name}
                    </h2>
                    <p className="text-gray-600">{selectedStudent.grade}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Personal Info */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <h3 className="font-bold text-gray-800 mb-4">
                      المعلومات الشخصية
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500">
                          البريد الإلكتروني
                        </span>
                        <p className="font-medium">{selectedStudent.email}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">
                          رقم الهاتف
                        </span>
                        <p className="font-medium">{selectedStudent.phone}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">
                          تاريخ الميلاد
                        </span>
                        <p className="font-medium">
                          {selectedStudent.dateOfBirth}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">الجنس</span>
                        <p className="font-medium">
                          {selectedStudent.gender === "male" ? "ذكر" : "أنثى"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">الموقع</span>
                        <p className="font-medium">
                          {selectedStudent.location}
                        </p>
                      </div>
                      {selectedStudent.schoolName && (
                        <div>
                          <span className="text-sm text-gray-500">المدرسة</span>
                          <p className="font-medium">
                            {selectedStudent.schoolName}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Parent Info */}
                  {(selectedStudent.parentPhone ||
                    selectedStudent.parentEmail) && (
                    <div className="bg-blue-50 rounded-xl p-6 mb-6">
                      <h3 className="font-bold text-gray-800 mb-4">
                        معلومات ولي الأمر
                      </h3>
                      <div className="space-y-3">
                        {selectedStudent.parentPhone && (
                          <div>
                            <span className="text-sm text-gray-500">
                              هاتف ولي الأمر
                            </span>
                            <p className="font-medium">
                              {selectedStudent.parentPhone}
                            </p>
                          </div>
                        )}
                        {selectedStudent.parentEmail && (
                          <div>
                            <span className="text-sm text-gray-500">
                              بريد ولي الأمر
                            </span>
                            <p className="font-medium">
                              {selectedStudent.parentEmail}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Statistics */}
                  <div className="bg-orange-50 rounded-xl p-6">
                    <h3 className="font-bold text-gray-800 mb-4">الإحصائيات</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">تاريخ التسجيل</span>
                        <span className="font-medium">
                          {selectedStudent.registrationDate}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">آخر دخول</span>
                        <span className="font-medium">
                          {selectedStudent.lastLogin}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ساعات الدراسة</span>
                        <span className="font-medium">
                          {selectedStudent.studyHours} ساعة
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">الإنجازات</span>
                        <span className="font-medium">
                          {selectedStudent.achievements.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Courses and Activity */}
                <div className="lg:col-span-2">
                  {/* Enrolled Courses */}
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-800 mb-4">
                      الدورات المسجلة
                    </h3>
                    <div className="space-y-3">
                      {selectedStudent.enrolledCourses.map((course) => {
                        const IconComponent = getCourseTypeIcon(
                          course.courseType
                        );
                        return (
                          <div
                            key={course.courseId}
                            className="bg-white border border-gray-200 rounded-lg p-4"
                          >
                            <div className="flex items-start gap-4">
                              <IconComponent
                                size={24}
                                className="text-orange-500 mt-1"
                              />
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h4 className="font-medium text-gray-800">
                                      {course.courseName}
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                      المعلم: {course.teacherName}
                                    </p>
                                  </div>
                                  <div className="text-left">
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                        course.status
                                      )}`}
                                    >
                                      {course.status === "active"
                                        ? "نشط"
                                        : course.status === "completed"
                                        ? "مكتمل"
                                        : course.status === "paused"
                                        ? "متوقف"
                                        : "منسحب"}
                                    </span>
                                    <p className="text-sm text-gray-500 mt-1">
                                      {course.price} د.أ
                                    </p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-500">
                                      التقدم
                                    </span>
                                    <div className="flex items-center gap-2 mt-1">
                                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                                        <div
                                          className="bg-orange-500 h-2 rounded-full transition-all"
                                          style={{
                                            width: `${course.progress}%`,
                                          }}
                                        ></div>
                                      </div>
                                      <span className="font-medium">
                                        {course.progress}%
                                      </span>
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">
                                      الدرجة
                                    </span>
                                    <p className="font-medium">
                                      {course.grade || "-"}%
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">
                                      الوقت المستغرق
                                    </span>
                                    <p className="font-medium">
                                      {course.timeSpent} ساعة
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">
                                      آخر وصول
                                    </span>
                                    <p className="font-medium">
                                      {course.lastAccessed}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Achievements */}
                  {selectedStudent.achievements.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-bold text-gray-800 mb-4">
                        الإنجازات
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedStudent.achievements.map((achievement) => (
                          <div
                            key={achievement.id}
                            className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
                          >
                            <div className="flex items-center gap-3">
                              <Award className="w-8 h-8 text-yellow-600" />
                              <div>
                                <h4 className="font-medium text-gray-800">
                                  {achievement.title}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {achievement.description}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {achievement.earnedDate}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Payment History */}
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-800 mb-4">
                      سجل المدفوعات
                    </h3>
                    <div className="space-y-2">
                      {selectedStudent.paymentHistory.map((payment) => (
                        <div
                          key={payment.id}
                          className="bg-green-50 border border-green-200 rounded-lg p-3"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-800">
                                {payment.description}
                              </p>
                              <p className="text-sm text-gray-500">
                                {payment.date}
                              </p>
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-green-600">
                                {payment.amount} د.أ
                              </p>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  payment.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : payment.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {payment.status === "completed"
                                  ? "مكتمل"
                                  : payment.status === "pending"
                                  ? "معلق"
                                  : "فاشل"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Activity Log */}
                  <div>
                    <h3 className="font-bold text-gray-800 mb-4">سجل النشاط</h3>
                    <div className="space-y-2">
                      {selectedStudent.activityLog
                        .slice(0, 5)
                        .map((activity) => (
                          <div
                            key={activity.id}
                            className="bg-gray-50 rounded-lg p-3"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-800">
                                  {activity.action}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {activity.description}
                                </p>
                              </div>
                              <p className="text-xs text-gray-500">
                                {activity.timestamp}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
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
      {viewMode === "grid" ? (
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
      ) : (
        // Table View
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-orange-100/50">
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
        </div>
      )}

      {/* Modals */}
      {showDetailsModal && <StudentDetailsModal />}
    </div>
  );
};

export default StudentsPage;
