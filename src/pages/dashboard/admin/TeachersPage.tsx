import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  //   EyeOff,
  Save,
  X,
  Users,
  //   BookOpen,
  //   Calendar,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Award,
  //   Clock,
  //   TrendingUp,
  //   TrendingDown,
  //   Activity,
  //   CreditCard,
  //   FileText,
  Download,
  //   Filter,
  UserCheck,
  UserX,
  Star,
  //   Target,
  BarChart3,
  PieChart,
  //   User,
  //   Hash,
  CheckCircle,
  XCircle,
  //   AlertCircle,
  //   DollarSign,
  Shield,
  //   Key,
  RefreshCw,
} from "lucide-react";
// import { useCustomQuery } from "@/hooks/useQuery";

export interface Teacher {
  id: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  avatar?: string;
  specialization: string;
  experience: number;
  qualification: string;
  bio: string;
  location: string;
  isActive: boolean;
  isVerified: boolean;
  rating: number;
  studentsCount: number;
  coursesCount: number;
  joinDate: string;
  lastLogin: string;
  subjects: string[];
  certifications: string[];
  lastPasswordChange: string;
}

const TeachersPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [_, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive" | "verified" | "unverified"
  >("all");
  const [experienceFilter, setExperienceFilter] = useState<
    "all" | "junior" | "mid" | "senior"
  >("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const [newTeacher, setNewTeacher] = useState<Partial<Teacher>>({
    name: "",
    email: "",
    phone: "",
    password: "",
    specialization: "",
    experience: 0,
    qualification: "",
    bio: "",
    location: "",
    isActive: true,
    isVerified: false,
    subjects: [],
    certifications: [],
  });

  // Sample data for teachers
  const [teachers, setTeachers] = useState<any[]>([
    {
      id: 1,
      name: "د. أحمد محمد",
      email: "ahmed.mohamed@example.com",
      phone: "0791234567",
      password: "Ahmed123@",
      avatar:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
      specialization: "الرياضيات",
      experience: 8,
      qualification: "دكتوراه",
      bio: "دكتور في الرياضيات مع خبرة 8 سنوات في التدريس الجامعي والثانوي. متخصص في الجبر والهندسة التحليلية.",
      location: "عمان، الأردن",
      isActive: true,
      isVerified: true,
      rating: 4.8,
      studentsCount: 156,
      coursesCount: 12,
      joinDate: "2024-01-15",
      lastLogin: "2024-01-20",
      subjects: ["الجبر", "الهندسة", "التفاضل والتكامل"],
      certifications: ["شهادة التدريس المعتمدة", "دورة التعلم الإلكتروني"],
      lastPasswordChange: "2024-01-15",
    },
    {
      id: 2,
      name: "أ. فاطمة أحمد",
      email: "fatima.ahmed@example.com",
      phone: "0792345678",
      password: "Fatima456#",
      avatar:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150",
      specialization: "اللغة العربية",
      experience: 5,
      qualification: "ماجستير",
      bio: "معلمة لغة عربية متخصصة في الأدب والنحو مع خبرة في تدريس جميع المراحل الدراسية.",
      location: "إربد، الأردن",
      isActive: true,
      isVerified: true,
      rating: 4.6,
      studentsCount: 134,
      coursesCount: 8,
      joinDate: "2024-01-10",
      lastLogin: "2024-01-19",
      subjects: ["النحو", "الأدب", "البلاغة"],
      certifications: ["دبلوم التربية", "دورة طرق التدريس الحديثة"],
      lastPasswordChange: "2024-01-10",
    },
    {
      id: 3,
      name: "م. خالد سالم",
      email: "khaled.salem@example.com",
      phone: "0793456789",
      password: "Khaled789$",
      avatar:
        "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150",
      specialization: "الفيزياء",
      experience: 12,
      qualification: "ماجستير",
      bio: "مهندس فيزيائي مع خبرة واسعة في تدريس الفيزياء النظرية والتطبيقية لطلاب التوجيهي.",
      location: "الزرقاء، الأردن",
      isActive: false,
      isVerified: true,
      rating: 4.9,
      studentsCount: 89,
      coursesCount: 15,
      joinDate: "2024-01-05",
      lastLogin: "2024-01-18",
      subjects: ["الميكانيكا", "الكهرباء", "البصريات"],
      certifications: ["شهادة الهندسة المعتمدة", "دورة المختبرات العلمية"],
      lastPasswordChange: "2024-01-05",
    },
    {
      id: 4,
      name: "د. سارة عبدالله",
      email: "sara.abdullah@example.com",
      phone: "0794567890",
      password: "Sara2024!",
      avatar:
        "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150",
      specialization: "الكيمياء",
      experience: 6,
      qualification: "دكتوراه",
      bio: "دكتورة في الكيمياء التحليلية مع اهتمام خاص بالكيمياء العضوية وتطبيقاتها العملية.",
      location: "عمان، الأردن",
      isActive: true,
      isVerified: false,
      rating: 4.7,
      studentsCount: 112,
      coursesCount: 10,
      joinDate: "2024-01-12",
      lastLogin: "2024-01-20",
      subjects: ["الكيمياء العضوية", "الكيمياء التحليلية", "الكيمياء الحيوية"],
      certifications: ["دكتوراه في الكيمياء", "دورة السلامة المختبرية"],
      lastPasswordChange: "2024-01-12",
    },
  ]);

  // Filter teachers based on search and filters
  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.specialization.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialization =
      specializationFilter === "" ||
      teacher.specialization === specializationFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && teacher.isActive) ||
      (statusFilter === "inactive" && !teacher.isActive) ||
      (statusFilter === "verified" && teacher.isVerified) ||
      (statusFilter === "unverified" && !teacher.isVerified);

    const matchesExperience =
      experienceFilter === "all" ||
      (experienceFilter === "junior" && teacher.experience < 3) ||
      (experienceFilter === "mid" &&
        teacher.experience >= 3 &&
        teacher.experience < 8) ||
      (experienceFilter === "senior" && teacher.experience >= 8);

    return (
      matchesSearch &&
      matchesSpecialization &&
      matchesStatus &&
      matchesExperience
    );
  });

  // Get unique specializations for filter
  const uniqueSpecializations = [
    ...new Set(teachers.map((t) => t.specialization)),
  ];

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleAddTeacher = () => {
    if (
      newTeacher.name &&
      newTeacher.email &&
      newTeacher.phone &&
      newTeacher.specialization
    ) {
      const teacher: Teacher = {
        id: Date.now(),
        name: newTeacher.name,
        email: newTeacher.email,
        phone: newTeacher.phone,
        password: newTeacher.password || generatePassword(),
        specialization: newTeacher.specialization,
        experience: newTeacher.experience || 0,
        qualification: newTeacher.qualification || "",
        bio: newTeacher.bio || "",
        location: newTeacher.location || "",
        isActive: newTeacher.isActive || false,
        isVerified: newTeacher.isVerified || false,
        rating: 0,
        studentsCount: 0,
        coursesCount: 0,
        joinDate: new Date().toISOString().split("T")[0],
        lastLogin: "",
        subjects: newTeacher.subjects || [],
        certifications: newTeacher.certifications || [],
        lastPasswordChange: new Date().toISOString().split("T")[0],
      };

      setTeachers([...teachers, teacher]);
      setNewTeacher({
        name: "",
        email: "",
        phone: "",
        password: "",
        specialization: "",
        experience: 0,
        qualification: "",
        bio: "",
        location: "",
        isActive: true,
        isVerified: false,
        subjects: [],
        certifications: [],
      });
      setShowAddModal(false);
    }
  };

  //   const handleEditTeacher = () => {
  //     console.log("edit");
  //     if (
  //       selectedTeacher &&
  //       selectedTeacher.name &&
  //       selectedTeacher.email &&
  //       selectedTeacher.phone
  //     ) {
  //       setTeachers(
  //         teachers.map((teacher) =>
  //           teacher.id === selectedTeacher.id ? selectedTeacher : teacher
  //         )
  //       );
  //       setShowEditModal(false);
  //       setSelectedTeacher(null);
  //     }
  //   };

  const handleDeleteTeacher = (id: number) => {
    if (
      confirm(
        "هل أنت متأكد من حذف هذا المعلم؟ سيتم حذف جميع الدورات المرتبطة به."
      )
    ) {
      setTeachers(teachers.filter((teacher) => teacher.id !== id));
    }
  };

  const toggleTeacherStatus = (
    id: number,
    field: "isActive" | "isVerified"
  ) => {
    setTeachers(
      teachers.map((teacher) =>
        teacher.id === id ? { ...teacher, [field]: !teacher[field] } : teacher
      )
    );
  };

  const resetPassword = (id: number) => {
    const newPassword = generatePassword();
    setTeachers(
      teachers.map((teacher) =>
        teacher.id === id
          ? {
              ...teacher,
              password: newPassword,
              lastPasswordChange: new Date().toISOString().split("T")[0],
            }
          : teacher
      )
    );
    alert(`تم إعادة تعيين كلمة المرور الجديدة: ${newPassword}`);
  };

  const exportToExcel = () => {
    const csvContent = [
      [
        "الاسم",
        "البريد الإلكتروني",
        "الهاتف",
        "التخصص",
        "الخبرة",
        "المؤهل",
        "الحالة",
        "مؤكد",
        "التقييم",
        "الطلاب",
        "الدورات",
      ],
      ...filteredTeachers.map((teacher) => [
        teacher.name,
        teacher.email,
        teacher.phone,
        teacher.specialization,
        teacher.experience,
        teacher.qualification,
        teacher.isActive ? "نشط" : "غير نشط",
        teacher.isVerified ? "مؤكد" : "غير مؤكد",
        teacher.rating,
        teacher.studentsCount,
        teacher.coursesCount,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `teachers-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  // const teachersStatistics = useCustomQuery(
  //   "account/admin/teachers-statistics/",
  //   ["teachers-statistics"]
  // );

  const TeacherCard = ({ teacher }: { teacher: Teacher }) => (
    <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-orange-100/50 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={
                teacher.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  teacher.name
                )}&background=ffffff&color=f97316&size=64`
              }
              alt={teacher.name}
              className="w-16 h-16 rounded-full border-2 border-white/20"
            />
            <div
              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                teacher.isActive ? "bg-green-500" : "bg-gray-400"
              }`}
            ></div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">{teacher.name}</h3>
            <p className="text-orange-100 text-sm">{teacher.specialization}</p>
            <div className="flex items-center gap-2 mt-2">
              {teacher.isVerified && (
                <span className="bg-green-400/20 text-green-100 px-2 py-1 rounded-full text-xs font-medium">
                  مؤكد
                </span>
              )}
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  teacher.isActive
                    ? "bg-green-400/20 text-green-100"
                    : "bg-red-400/20 text-red-100"
                }`}
              >
                {teacher.isActive ? "نشط" : "غير نشط"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">
              {teacher.studentsCount}
            </div>
            <div className="text-xs text-gray-500">طالب</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {teacher.coursesCount}
            </div>
            <div className="text-xs text-gray-500">دورة</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {teacher.rating.toFixed(1)}
            </div>
            <div className="text-xs text-gray-500">تقييم</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {teacher.experience}
            </div>
            <div className="text-xs text-gray-500">سنة خبرة</div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone size={14} />
            <span>{teacher.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail size={14} />
            <span className="truncate">{teacher.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={14} />
            <span>{teacher.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <GraduationCap size={14} />
            <span>{teacher.qualification}</span>
          </div>
        </div>

        {/* Subjects */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-800 mb-3">المواد التي يدرسها</h4>
          <div className="flex flex-wrap gap-1">
            {teacher.subjects.slice(0, 3).map((subject) => (
              <span
                key={subject}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
              >
                {subject}
              </span>
            ))}
            {teacher.subjects.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                +{teacher.subjects.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleTeacherStatus(teacher.id, "isActive")}
              className={`p-2 rounded-lg transition-colors ${
                teacher.isActive
                  ? "text-green-600 bg-green-50 hover:bg-green-100"
                  : "text-gray-400 bg-gray-50 hover:bg-gray-100"
              }`}
              title={teacher.isActive ? "إلغاء تفعيل المعلم" : "تفعيل المعلم"}
            >
              {teacher.isActive ? <UserCheck size={16} /> : <UserX size={16} />}
            </button>

            <button
              onClick={() => toggleTeacherStatus(teacher.id, "isVerified")}
              className={`p-2 rounded-lg transition-colors ${
                teacher.isVerified
                  ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
                  : "text-gray-400 bg-gray-50 hover:bg-gray-100"
              }`}
              title={teacher.isVerified ? "إلغاء التحقق" : "تأكيد المعلم"}
            >
              {teacher.isVerified ? (
                <CheckCircle size={16} />
              ) : (
                <XCircle size={16} />
              )}
            </button>

            <button
              onClick={() => resetPassword(teacher.id)}
              className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              title="إعادة تعيين كلمة المرور"
            >
              <RefreshCw size={16} />
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setSelectedTeacher(teacher);
                setShowDetailsModal(true);
              }}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="عرض التفاصيل"
            >
              <Eye size={16} />
            </button>

            <button
              onClick={() => {
                setSelectedTeacher(teacher);
                setShowEditModal(true);
              }}
              className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
              title="تعديل المعلم"
            >
              <Edit size={16} />
            </button>

            <button
              onClick={() => handleDeleteTeacher(teacher.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="حذف المعلم"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const AddTeacherModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">إضافة معلم جديد</h2>
            <button
              onClick={() => setShowAddModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">
                المعلومات الشخصية
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  value={newTeacher.name || ""}
                  onChange={(e) =>
                    setNewTeacher({ ...newTeacher, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="أدخل الاسم الكامل..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني *
                </label>
                <input
                  type="email"
                  value={newTeacher.email || ""}
                  onChange={(e) =>
                    setNewTeacher({ ...newTeacher, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="example@domain.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهاتف *
                </label>
                <input
                  type="tel"
                  value={newTeacher.phone || ""}
                  onChange={(e) =>
                    setNewTeacher({ ...newTeacher, phone: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="07XXXXXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  كلمة المرور
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTeacher.password || ""}
                    onChange={(e) =>
                      setNewTeacher({ ...newTeacher, password: e.target.value })
                    }
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="اتركها فارغة للتوليد التلقائي"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setNewTeacher({
                        ...newTeacher,
                        password: generatePassword(),
                      })
                    }
                    className="px-4 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    title="توليد كلمة مرور"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الموقع
                </label>
                <input
                  type="text"
                  value={newTeacher.location || ""}
                  onChange={(e) =>
                    setNewTeacher({ ...newTeacher, location: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="المدينة، البلد"
                />
              </div>
            </div>

            {/* Professional Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">
                المعلومات المهنية
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التخصص *
                </label>
                <input
                  type="text"
                  value={newTeacher.specialization || ""}
                  onChange={(e) =>
                    setNewTeacher({
                      ...newTeacher,
                      specialization: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="مثل: الرياضيات، الفيزياء، اللغة العربية"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  سنوات الخبرة
                </label>
                <input
                  type="number"
                  value={newTeacher.experience || ""}
                  onChange={(e) =>
                    setNewTeacher({
                      ...newTeacher,
                      experience: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المؤهل العلمي
                </label>
                <select
                  value={newTeacher.qualification || ""}
                  onChange={(e) =>
                    setNewTeacher({
                      ...newTeacher,
                      qualification: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                >
                  <option value="">اختر المؤهل</option>
                  <option value="دبلوم">دبلوم</option>
                  <option value="بكالوريوس">بكالوريوس</option>
                  <option value="ماجستير">ماجستير</option>
                  <option value="دكتوراه">دكتوراه</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نبذة شخصية
                </label>
                <textarea
                  value={newTeacher.bio || ""}
                  onChange={(e) =>
                    setNewTeacher({ ...newTeacher, bio: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
                  placeholder="نبذة مختصرة عن المعلم وخبراته..."
                />
              </div>

              {/* Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">نشط</p>
                    <p className="text-sm text-gray-500">يمكنه تسجيل الدخول</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={newTeacher.isActive || false}
                    onChange={(e) =>
                      setNewTeacher({
                        ...newTeacher,
                        isActive: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">مؤكد</p>
                    <p className="text-sm text-gray-500">تم التحقق من الهوية</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={newTeacher.isVerified || false}
                    onChange={(e) =>
                      setNewTeacher({
                        ...newTeacher,
                        isVerified: e.target.checked,
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
              onClick={() => setShowAddModal(false)}
              className="px-6 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={handleAddTeacher}
              disabled={
                !newTeacher.name ||
                !newTeacher.email ||
                !newTeacher.phone ||
                !newTeacher.specialization
              }
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              إضافة المعلم
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const TeacherDetailsModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {selectedTeacher && (
          <>
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      selectedTeacher.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        selectedTeacher.name
                      )}&background=f97316&color=ffffff&size=64`
                    }
                    alt={selectedTeacher.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {selectedTeacher.name}
                    </h2>
                    <p className="text-gray-600">
                      {selectedTeacher.specialization}
                    </p>
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
                        <p className="font-medium">{selectedTeacher.email}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">
                          رقم الهاتف
                        </span>
                        <p className="font-medium">{selectedTeacher.phone}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">الموقع</span>
                        <p className="font-medium">
                          {selectedTeacher.location}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">
                          المؤهل العلمي
                        </span>
                        <p className="font-medium">
                          {selectedTeacher.qualification}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">
                          سنوات الخبرة
                        </span>
                        <p className="font-medium">
                          {selectedTeacher.experience} سنة
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Security Info */}
                  <div className="bg-blue-50 rounded-xl p-6 mb-6">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Shield size={20} />
                      معلومات الأمان
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500">
                          آخر تغيير لكلمة المرور
                        </span>
                        <p className="font-medium">
                          {selectedTeacher.lastPasswordChange}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">آخر دخول</span>
                        <p className="font-medium">
                          {selectedTeacher.lastLogin || "لم يسجل دخول بعد"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">
                          تاريخ الانضمام
                        </span>
                        <p className="font-medium">
                          {selectedTeacher.joinDate}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="bg-orange-50 rounded-xl p-6">
                    <h3 className="font-bold text-gray-800 mb-4">الإحصائيات</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">التقييم</span>
                        <div className="flex items-center gap-1">
                          <Star size={16} className="text-yellow-500" />
                          <span className="font-medium">
                            {selectedTeacher.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">عدد الطلاب</span>
                        <span className="font-medium">
                          {selectedTeacher.studentsCount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">عدد الدورات</span>
                        <span className="font-medium">
                          {selectedTeacher.coursesCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Info */}
                <div className="lg:col-span-2">
                  {/* Bio */}
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-800 mb-4">نبذة شخصية</h3>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <p className="text-gray-600 leading-relaxed">
                        {selectedTeacher.bio || "لم يتم إضافة نبذة شخصية بعد."}
                      </p>
                    </div>
                  </div>

                  {/* Subjects */}
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-800 mb-4">
                      المواد التي يدرسها
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTeacher.subjects.map((subject) => (
                        <span
                          key={subject}
                          className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium"
                        >
                          {subject}
                        </span>
                      ))}
                      {selectedTeacher.subjects.length === 0 && (
                        <p className="text-gray-500">لم يتم تحديد مواد بعد.</p>
                      )}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-800 mb-4">
                      الشهادات والدورات
                    </h3>
                    <div className="space-y-2">
                      {selectedTeacher.certifications.map((cert, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-3 bg-green-50 rounded-lg"
                        >
                          <Award size={16} className="text-green-600" />
                          <span className="text-green-800 font-medium">
                            {cert}
                          </span>
                        </div>
                      ))}
                      {selectedTeacher.certifications.length === 0 && (
                        <p className="text-gray-500">
                          لم يتم إضافة شهادات بعد.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <h3 className="font-bold text-gray-800 mb-4">الحالة</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800">
                            حالة الحساب
                          </p>
                          <p className="text-sm text-gray-500">
                            {selectedTeacher.isActive
                              ? "نشط - يمكنه تسجيل الدخول"
                              : "معطل - لا يمكنه تسجيل الدخول"}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            selectedTeacher.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {selectedTeacher.isActive ? "نشط" : "معطل"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800">
                            حالة التحقق
                          </p>
                          <p className="text-sm text-gray-500">
                            {selectedTeacher.isVerified
                              ? "تم التحقق من الهوية"
                              : "لم يتم التحقق بعد"}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            selectedTeacher.isVerified
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {selectedTeacher.isVerified ? "مؤكد" : "غير مؤكد"}
                        </span>
                      </div>
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
          <h1 className="text-2xl font-bold text-gray-800">إدارة المعلمين</h1>
          <p className="text-gray-600 text-sm">
            إدارة شاملة لجميع المعلمين في المنصة
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportToExcel}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-all duration-300 flex items-center gap-2 text-sm"
          >
            <Download size={16} />
            تصدير Excel
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2 text-sm"
          >
            <Plus size={16} />
            إضافة معلم
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">إجمالي المعلمين</p>
              <p className="text-3xl font-bold text-gray-800">
                {teachers.length}
              </p>
            </div>
            <Users className="w-12 h-12 text-orange-500" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">المعلمين النشطون</p>
              <p className="text-3xl font-bold text-green-600">
                {teachers.filter((t) => t.isActive).length}
              </p>
            </div>
            <UserCheck className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">المعلمين المؤكدون</p>
              <p className="text-3xl font-bold text-blue-600">
                {teachers.filter((t) => t.isVerified).length}
              </p>
            </div>
            <CheckCircle className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">متوسط التقييم</p>
              <p className="text-3xl font-bold text-orange-600">
                {teachers.length > 0
                  ? (
                      teachers.reduce((sum, t) => sum + t.rating, 0) /
                      teachers.length
                    ).toFixed(1)
                  : 0}
              </p>
            </div>
            <Star className="w-12 h-12 text-orange-500" />
          </div>
        </div>
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
              placeholder="البحث في المعلمين..."
              className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
            />
          </div>

          {/* Specialization Filter */}
          <select
            value={specializationFilter}
            onChange={(e) => setSpecializationFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
          >
            <option value="">جميع التخصصات</option>
            {uniqueSpecializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>

          {/* Status Filter */}
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

          {/* Experience Filter */}
          <select
            value={experienceFilter}
            onChange={(e) => setExperienceFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
          >
            <option value="all">جميع مستويات الخبرة</option>
            <option value="junior">مبتدئ (أقل من 3 سنوات)</option>
            <option value="mid">متوسط (3-8 سنوات)</option>
            <option value="senior">خبير (أكثر من 8 سنوات)</option>
          </select>

          {/* View Mode */}
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

          {/* Results Count */}
          <div className="flex items-center justify-center bg-gray-50 rounded-lg px-4 py-2">
            <span className="text-sm text-gray-600">
              {filteredTeachers.length} من {teachers.length} معلم
            </span>
          </div>
        </div>
      </div>

      {/* Teachers Grid/Table */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}

          {filteredTeachers.length === 0 && (
            <div className="col-span-full bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-orange-100/50">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                {searchTerm ||
                specializationFilter ||
                statusFilter !== "all" ||
                experienceFilter !== "all"
                  ? "لا توجد نتائج"
                  : "لا يوجد معلمين"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ||
                specializationFilter ||
                statusFilter !== "all" ||
                experienceFilter !== "all"
                  ? "لم يتم العثور على معلمين تطابق المعايير المحددة"
                  : "ابدأ بإضافة معلمين جدد للمنصة"}
              </p>
              {!searchTerm &&
                !specializationFilter &&
                statusFilter === "all" &&
                experienceFilter === "all" && (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2 mx-auto"
                  >
                    <Plus size={16} />
                    إضافة معلم جديد
                  </button>
                )}
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
                    المعلم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التخصص
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الخبرة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التقييم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الطلاب
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الدورات
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
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            teacher.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              teacher.name
                            )}&background=f97316&color=ffffff&size=40`
                          }
                          alt={teacher.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="font-medium text-gray-900">
                            {teacher.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {teacher.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {teacher.specialization}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {teacher.experience} سنة
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-500" />
                        <span className="text-sm font-medium">
                          {teacher.rating.toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {teacher.studentsCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {teacher.coursesCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            teacher.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {teacher.isActive ? "نشط" : "غير نشط"}
                        </span>
                        {teacher.isVerified && (
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
                            setSelectedTeacher(teacher);
                            setShowDetailsModal(true);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="عرض التفاصيل"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTeacher(teacher);
                            setShowEditModal(true);
                          }}
                          className="p-1 text-gray-400 hover:text-orange-600 transition-colors"
                          title="تعديل"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteTeacher(teacher.id)}
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
      {showAddModal && <AddTeacherModal />}
      {showDetailsModal && <TeacherDetailsModal />}
    </div>
  );
};

export default TeachersPage;
