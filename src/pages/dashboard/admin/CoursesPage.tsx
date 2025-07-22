import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ArrowLeft,
  BookOpen,
  Users,
  CheckCircle,
  BarChart3,
  PieChart,
  Star,
  Save,
  Play,
  Pause,
  Folder,
} from "lucide-react";
import CourseContentPage from "@/components/dashboard/admin/courses/CourseContentPage";

export interface Course {
  id: number;
  title: string;
  description: string;
  shortDescription: string;
  teacherId: number;
  teacherName: string;
  teacherAvatar?: string;
  price: number;
  isFree: boolean;
  isPublished: boolean;
  isActive: boolean;
  isFeatured: boolean;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  language: string;
  duration: number; // in hours
  studentsCount: number;
  rating: number;
  reviewsCount: number;
  thumbnail: string;
  previewVideo?: string;
  targetedSections: number[];
  targetedSubsections: number[];
  tags: string[];
  requirements: string[];
  whatYouWillLearn: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  startDate?: string;
  endDate?: string;
  maxStudents?: number;
  chapters: Chapter[];
  files: CourseFile[];
  exams: CourseExam[];
  enrollments: CourseEnrollment[];
  reviews: CourseReview[];
}

export interface Chapter {
  id: number;
  courseId: number;
  title: string;
  description: string;
  order: number;
  isPublished: boolean;
  isFree: boolean;
  estimatedDuration: number;
  units: Unit[];
  files: CourseFile[];
  exams: CourseExam[];
}

export interface Unit {
  id: number;
  chapterId: number;
  title: string;
  description: string;
  order: number;
  isPublished: boolean;
  isFree: boolean;
  estimatedDuration: number;
  lessons: Lesson[];
  files: CourseFile[];
  exams: CourseExam[];
}

export interface Lesson {
  id: number;
  unitId: number;
  title: string;
  description: string;
  order: number;
  isPublished: boolean;
  isFree: boolean;
  estimatedDuration: number;
  sessions: Session[];
  files: CourseFile[];
  exams: CourseExam[];
}

export interface Session {
  id: number;
  lessonId: number;
  title: string;
  description: string;
  type: "video" | "text" | "interactive" | "assignment" | "exam";
  content: string; // URL for video, text content, or exam ID
  order: number;
  isPublished: boolean;
  isFree: boolean;
  estimatedDuration: number;
  files: CourseFile[];
  exams: CourseExam[];
}

export interface CourseFile {
  id: number;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface CourseExam {
  id: number;
  title: string;
  description: string;
  examId: number; // Reference to exam in ExamsPage
  isRequired: boolean;
  passingScore: number;
  maxAttempts: number;
}

export interface CourseEnrollment {
  id: number;
  studentId: number;
  studentName: string;
  enrolledAt: string;
  completedAt?: string;
  progress: number;
  status: "active" | "completed" | "dropped" | "paused";
}

export interface CourseReview {
  id: number;
  studentId: number;
  studentName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const CoursesPage = () => {
  const [currentView, setCurrentView] = useState<
    "list" | "create" | "edit" | "content"
  >("list");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [teacherFilter, setTeacherFilter] = useState<number | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft" | "active" | "inactive"
  >("all");
  const [levelFilter] = useState<
    "all" | "beginner" | "intermediate" | "advanced"
  >("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Sample courses data
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 1,
      title: "دورة الرياضيات المتقدمة",
      description:
        "دورة شاملة في الرياضيات المتقدمة تغطي التفاضل والتكامل والجبر الخطي مع تطبيقات عملية وأمثلة متنوعة لطلاب التوجيهي العلمي.",
      shortDescription: "دورة شاملة في الرياضيات المتقدمة للتوجيهي العلمي",
      teacherId: 1,
      teacherName: "د. أحمد محمد",
      teacherAvatar:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
      price: 150.0,
      isFree: false,
      isPublished: true,
      isActive: true,
      isFeatured: true,
      category: "الرياضيات",
      level: "advanced",
      language: "العربية",
      duration: 40,
      studentsCount: 156,
      rating: 4.8,
      reviewsCount: 89,
      thumbnail:
        "https://images.pexels.com/photos/6238050/pexels-photo-6238050.jpeg?auto=compress&cs=tinysrgb&w=800",
      previewVideo:
        "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
      targetedSections: [1],
      targetedSubsections: [2, 3],
      tags: ["رياضيات", "تفاضل", "تكامل", "توجيهي"],
      requirements: ["معرفة أساسيات الجبر", "إتقان العمليات الحسابية الأساسية"],
      whatYouWillLearn: [
        "إتقان مفاهيم التفاضل والتكامل",
        "حل المسائل المعقدة في الرياضيات",
        "تطبيق المفاهيم الرياضية في الحياة العملية",
        "الاستعداد لامتحانات التوجيهي",
      ],
      createdAt: "2024-01-15",
      updatedAt: "2024-01-20",
      publishedAt: "2024-01-18",
      startDate: "2024-02-01",
      endDate: "2024-05-30",
      maxStudents: 200,
      chapters: [
        {
          id: 1,
          courseId: 1,
          title: "مقدمة في التفاضل",
          description: "أساسيات التفاضل والمشتقات",
          order: 1,
          isPublished: true,
          isFree: true,
          estimatedDuration: 120,
          units: [
            {
              id: 1,
              chapterId: 1,
              title: "تعريف المشتقة",
              description: "مفهوم المشتقة وتطبيقاتها",
              order: 1,
              isPublished: true,
              isFree: true,
              estimatedDuration: 60,
              lessons: [
                {
                  id: 1,
                  unitId: 1,
                  title: "المشتقة الأولى",
                  description: "تعلم كيفية حساب المشتقة الأولى",
                  order: 1,
                  isPublished: true,
                  isFree: true,
                  estimatedDuration: 30,
                  sessions: [
                    {
                      id: 1,
                      lessonId: 1,
                      title: "شرح المشتقة الأولى",
                      description: "فيديو تعليمي عن المشتقة الأولى",
                      type: "video",
                      content:
                        "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
                      order: 1,
                      isPublished: true,
                      isFree: true,
                      estimatedDuration: 25,
                      files: [],
                      exams: [],
                    },
                    {
                      id: 2,
                      lessonId: 1,
                      title: "اختبار المشتقة الأولى",
                      description: "اختبار تقييمي على المشتقة الأولى",
                      type: "exam",
                      content: "1", // exam ID
                      order: 2,
                      isPublished: true,
                      isFree: false,
                      estimatedDuration: 5,
                      files: [],
                      exams: [],
                    },
                  ],
                  files: [],
                  exams: [],
                },
              ],
              files: [],
              exams: [],
            },
          ],
          files: [],
          exams: [],
        },
      ],
      files: [],
      exams: [],
      enrollments: [],
      reviews: [],
    },
    {
      id: 2,
      title: "أساسيات الفيزياء",
      description:
        "دورة تأسيسية في الفيزياء تغطي الميكانيكا والكهرباء والمغناطيسية مع تجارب عملية وحلول مفصلة للمسائل.",
      shortDescription: "دورة تأسيسية شاملة في الفيزياء",
      teacherId: 3,
      teacherName: "م. خالد سالم",
      teacherAvatar:
        "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150",
      price: 120.0,
      isFree: false,
      isPublished: true,
      isActive: true,
      isFeatured: false,
      category: "الفيزياء",
      level: "intermediate",
      language: "العربية",
      duration: 35,
      studentsCount: 89,
      rating: 4.6,
      reviewsCount: 67,
      thumbnail:
        "https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=800",
      targetedSections: [1],
      targetedSubsections: [2, 3],
      tags: ["فيزياء", "ميكانيكا", "كهرباء", "توجيهي"],
      requirements: [
        "معرفة أساسيات الرياضيات",
        "فهم المفاهيم العلمية الأساسية",
      ],
      whatYouWillLearn: [
        "فهم قوانين الفيزياء الأساسية",
        "حل مسائل الميكانيكا والكهرباء",
        "تطبيق المفاهيم الفيزيائية عملياً",
        "الاستعداد للامتحانات النهائية",
      ],
      createdAt: "2024-01-12",
      updatedAt: "2024-01-19",
      publishedAt: "2024-01-16",
      startDate: "2024-02-15",
      endDate: "2024-06-15",
      maxStudents: 150,
      chapters: [],
      files: [],
      exams: [],
      enrollments: [],
      reviews: [],
    },
    {
      id: 3,
      title: "اللغة العربية والأدب",
      description:
        "دورة متخصصة في اللغة العربية والأدب تشمل النحو والصرف والبلاغة مع دراسة النصوص الأدبية الكلاسيكية والحديثة.",
      shortDescription: "دورة متخصصة في اللغة العربية والأدب",
      teacherId: 2,
      teacherName: "أ. فاطمة أحمد",
      teacherAvatar:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150",
      price: 0,
      isFree: true,
      isPublished: false,
      isActive: false,
      isFeatured: false,
      category: "اللغة العربية",
      level: "intermediate",
      language: "العربية",
      duration: 30,
      studentsCount: 0,
      rating: 0,
      reviewsCount: 0,
      thumbnail:
        "https://images.pexels.com/photos/159581/dictionary-reference-book-learning-meaning-159581.jpeg?auto=compress&cs=tinysrgb&w=800",
      targetedSections: [1],
      targetedSubsections: [2, 3],
      tags: ["عربي", "نحو", "أدب", "بلاغة"],
      requirements: ["إتقان القراءة والكتابة", "معرفة أساسيات النحو"],
      whatYouWillLearn: [
        "إتقان قواعد النحو والصرف",
        "فهم وتحليل النصوص الأدبية",
        "تطوير مهارات الكتابة والتعبير",
        "الاستعداد لامتحانات اللغة العربية",
      ],
      createdAt: "2024-01-10",
      updatedAt: "2024-01-17",
      startDate: "2024-03-01",
      endDate: "2024-07-01",
      maxStudents: 100,
      chapters: [],
      files: [],
      exams: [],
      enrollments: [],
      reviews: [],
    },
  ]);

  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    title: "",
    description: "",
    shortDescription: "",
    teacherId: 0,
    price: 0,
    isFree: true,
    isPublished: false,
    isActive: false,
    isFeatured: false,
    category: "",
    level: "beginner",
    language: "العربية",
    duration: 0,
    thumbnail: "",
    previewVideo: "",
    targetedSections: [],
    targetedSubsections: [],
    tags: [],
    requirements: [],
    whatYouWillLearn: [],
    startDate: "",
    endDate: "",
    maxStudents: 100,
  });

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.teacherName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTeacher =
      teacherFilter === null || course.teacherId === teacherFilter;
    const matchesCategory =
      categoryFilter === "" || course.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && course.isPublished) ||
      (statusFilter === "draft" && !course.isPublished) ||
      (statusFilter === "active" && course.isActive) ||
      (statusFilter === "inactive" && !course.isActive);
    const matchesLevel = levelFilter === "all" || course.level === levelFilter;

    return (
      matchesSearch &&
      matchesTeacher &&
      matchesCategory &&
      matchesStatus &&
      matchesLevel
    );
  });

  const uniqueCategories = [...new Set(courses.map((c) => c.category))];

  // Sample data for teachers
  const [teachers] = useState<any[]>([
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

  const handleCreateCourse = () => {
    if (newCourse.title && newCourse.description && newCourse.teacherId) {
      const course: Course = {
        id: Date.now(),
        title: newCourse.title,
        description: newCourse.description,
        shortDescription: newCourse.shortDescription || "",
        teacherId: newCourse.teacherId,
        teacherName:
          teachers.find((t) => t.id === newCourse.teacherId)?.name || "",
        teacherAvatar: teachers.find((t) => t.id === newCourse.teacherId)
          ?.avatar,
        price: newCourse.price || 0,
        isFree: newCourse.isFree || false,
        isPublished: newCourse.isPublished || false,
        isActive: newCourse.isActive || false,
        isFeatured: newCourse.isFeatured || false,
        category: newCourse.category || "",
        level: newCourse.level || "beginner",
        language: newCourse.language || "العربية",
        duration: newCourse.duration || 0,
        studentsCount: 0,
        rating: 0,
        reviewsCount: 0,
        thumbnail:
          newCourse.thumbnail ||
          "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=800",
        previewVideo: newCourse.previewVideo,
        targetedSections: newCourse.targetedSections || [],
        targetedSubsections: newCourse.targetedSubsections || [],
        tags: newCourse.tags || [],
        requirements: newCourse.requirements || [],
        whatYouWillLearn: newCourse.whatYouWillLearn || [],
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
        publishedAt: newCourse.isPublished
          ? new Date().toISOString().split("T")[0]
          : undefined,
        startDate: newCourse.startDate,
        endDate: newCourse.endDate,
        maxStudents: newCourse.maxStudents || 100,
        chapters: [],
        files: [],
        exams: [],
        enrollments: [],
        reviews: [],
      };

      setCourses([...courses, course]);
      setNewCourse({
        title: "",
        description: "",
        shortDescription: "",
        teacherId: 0,
        price: 0,
        isFree: true,
        isPublished: false,
        isActive: false,
        isFeatured: false,
        category: "",
        level: "beginner",
        language: "العربية",
        duration: 0,
        thumbnail: "",
        previewVideo: "",
        targetedSections: [],
        targetedSubsections: [],
        tags: [],
        requirements: [],
        whatYouWillLearn: [],
        startDate: "",
        endDate: "",
        maxStudents: 100,
      });
      setCurrentView("list");
    }
  };

  // Sample data for main sections
  const [mainSections, __] = useState<any[]>([
    {
      id: 1,
      name: "امتحانات",
      description: "امتحانات تجريبية وتقييمية لجميع المواد الدراسية",
      icon: "BookOpen",
      color: "blue",
      isFree: true,
      isEnabled: true,
      studentsCount: 1247,
      itemsCount: 89,
      createdAt: "2024-01-10",
    },
    {
      id: 2,
      name: "أسئلة وزارية",
      description: "مجموعة شاملة من الأسئلة الوزارية للسنوات السابقة",
      icon: "FileText",
      color: "green",
      isFree: false,
      isEnabled: true,
      studentsCount: 892,
      itemsCount: 156,
      createdAt: "2024-01-08",
    },
    {
      id: 3,
      name: "دورات",
      description: "دورات تعليمية متخصصة مع شهادات معتمدة",
      icon: "GraduationCap",
      color: "purple",
      isFree: false,
      isEnabled: true,
      studentsCount: 634,
      itemsCount: 45,
      createdAt: "2024-01-05",
    },
    {
      id: 4,
      name: "بطاقات",
      description: "بطاقات تعليمية تفاعلية لتسهيل عملية الحفظ والمراجعة",
      icon: "CreditCard",
      color: "yellow",
      isFree: true,
      isEnabled: true,
      studentsCount: 423,
      itemsCount: 78,
      createdAt: "2024-01-03",
    },
  ]);

  // Sample data for subsections
  const [subsections, _] = useState<any[]>([
    {
      id: 1,
      name: "التوجيهي",
      description: "المرحلة الثانوية العامة - التوجيهي",
      parentId: null,
      level: 1,
      linkedSections: [1, 2, 3],
      studentsCount: 856,
      itemsCount: 234,
      isExpanded: true,
      createdAt: "2024-01-10",
    },
    {
      id: 2,
      name: "توجيهي 2007",
      description: "منهاج التوجيهي للعام 2007",
      parentId: 1,
      level: 2,
      linkedSections: [1, 2],
      studentsCount: 312,
      itemsCount: 89,
      isExpanded: false,
      createdAt: "2024-01-10",
    },
    {
      id: 3,
      name: "توجيهي 2008",
      description: "منهاج التوجيهي للعام 2008",
      parentId: 1,
      level: 2,
      linkedSections: [1, 2, 3],
      studentsCount: 287,
      itemsCount: 76,
      isExpanded: false,
      createdAt: "2024-01-10",
    },
    {
      id: 4,
      name: "الصفوف الأساسية",
      description: "المرحلة الأساسية من الصف الأول إلى العاشر",
      parentId: null,
      level: 1,
      linkedSections: [4],
      studentsCount: 1243,
      itemsCount: 456,
      isExpanded: true,
      createdAt: "2024-01-08",
    },
    {
      id: 5,
      name: "الصف الأول",
      description: "المنهاج الدراسي للصف الأول الأساسي",
      parentId: 4,
      level: 2,
      linkedSections: [4],
      studentsCount: 156,
      itemsCount: 45,
      isExpanded: false,
      createdAt: "2024-01-08",
    },
    {
      id: 6,
      name: "الصف الثاني",
      description: "المنهاج الدراسي للصف الثاني الأساسي",
      parentId: 4,
      level: 2,
      linkedSections: [4],
      studentsCount: 134,
      itemsCount: 38,
      isExpanded: false,
      createdAt: "2024-01-08",
    },
    {
      id: 7,
      name: "الصف العاشر",
      description: "المنهاج الدراسي للصف العاشر الأساسي",
      parentId: 4,
      level: 2,
      linkedSections: [1, 4],
      studentsCount: 298,
      itemsCount: 87,
      isExpanded: false,
      createdAt: "2024-01-08",
    },
  ]);

  const handleEditCourse = () => {
    if (
      selectedCourse &&
      selectedCourse.title &&
      selectedCourse.description &&
      selectedCourse.teacherId
    ) {
      setCourses(
        courses.map((course) =>
          course.id === selectedCourse.id
            ? {
                ...selectedCourse,
                updatedAt: new Date().toISOString().split("T")[0],
                teacherName:
                  teachers.find((t) => t.id === selectedCourse.teacherId)
                    ?.name || selectedCourse.teacherName,
                teacherAvatar:
                  teachers.find((t) => t.id === selectedCourse.teacherId)
                    ?.avatar || selectedCourse.teacherAvatar,
              }
            : course
        )
      );
      setCurrentView("list");
      setSelectedCourse(null);
    }
  };

  const handleDeleteCourse = (id: number) => {
    if (
      confirm(
        "هل أنت متأكد من حذف هذه الدورة؟ سيتم حذف جميع المحتوى المرتبط بها."
      )
    ) {
      setCourses(courses.filter((course) => course.id !== id));
    }
  };

  const toggleCourseStatus = (
    id: number,
    field: "isPublished" | "isActive" | "isFeatured"
  ) => {
    setCourses(
      courses.map((course) =>
        course.id === id
          ? {
              ...course,
              [field]: !course[field],
              updatedAt: new Date().toISOString().split("T")[0],
              publishedAt:
                field === "isPublished" && !course[field]
                  ? new Date().toISOString().split("T")[0]
                  : course.publishedAt,
            }
          : course
      )
    );
  };

  const getLevelColor = (level: Course["level"]) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const CourseCard = ({ course }: { course: Course }) => (
    <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-orange-100/50 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

        {/* Status Badges */}
        <div className="absolute top-4 right-4 flex gap-2">
          {course.isFeatured && (
            <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              مميز
            </span>
          )}
          {course.isFree && (
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              مجاني
            </span>
          )}
        </div>

        {/* Level Badge */}
        <div className="absolute bottom-4 right-4">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(
              course.level
            )}`}
          >
            {course.level === "beginner"
              ? "مبتدئ"
              : course.level === "intermediate"
              ? "متوسط"
              : "متقدم"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
            {course.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {course.shortDescription}
          </p>
        </div>

        {/* Teacher */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src={
              course.teacherAvatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                course.teacherName
              )}&background=f97316&color=ffffff&size=32`
            }
            alt={course.teacherName}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <p className="font-medium text-gray-800 text-sm">
              {course.teacherName}
            </p>
            <p className="text-gray-500 text-xs">{course.category}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-800">
              {course.studentsCount}
            </div>
            <div className="text-xs text-gray-500">طالب</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {course.duration}h
            </div>
            <div className="text-xs text-gray-500">ساعة</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Star size={14} className="text-yellow-500 fill-current" />
              <span className="text-lg font-bold text-gray-800">
                {course.rating.toFixed(1)}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              {course.reviewsCount} تقييم
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {course.isFree ? "مجاني" : `${course.price} د.أ`}
            </div>
            <div className="text-xs text-gray-500">السعر</div>
          </div>
        </div>

        {/* Status */}
        <div className="flex gap-2 mb-4">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              course.isPublished
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {course.isPublished ? "منشور" : "مسودة"}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              course.isActive
                ? "bg-blue-100 text-blue-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {course.isActive ? "نشط" : "معطل"}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setSelectedCourse(course);
                setCurrentView("content");
              }}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="إدارة المحتوى"
            >
              <Folder size={16} />
            </button>

            <button
              onClick={() => toggleCourseStatus(course.id, "isActive")}
              className={`p-2 rounded-lg transition-colors ${
                course.isActive
                  ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
                  : "text-gray-400 bg-gray-50 hover:bg-gray-100"
              }`}
              title={course.isActive ? "تعطيل الدورة" : "تفعيل الدورة"}
            >
              {course.isActive ? <Pause size={16} /> : <Play size={16} />}
            </button>

            <button
              onClick={() => toggleCourseStatus(course.id, "isPublished")}
              className={`p-2 rounded-lg transition-colors ${
                course.isPublished
                  ? "text-green-600 bg-green-50 hover:bg-green-100"
                  : "text-gray-400 bg-gray-50 hover:bg-gray-100"
              }`}
              title={course.isPublished ? "إلغاء النشر" : "نشر الدورة"}
            >
              {course.isPublished ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>

            <button
              onClick={() => toggleCourseStatus(course.id, "isFeatured")}
              className={`p-2 rounded-lg transition-colors ${
                course.isFeatured
                  ? "text-yellow-600 bg-yellow-50 hover:bg-yellow-100"
                  : "text-gray-400 bg-gray-50 hover:bg-gray-100"
              }`}
              title={course.isFeatured ? "إزالة من المميز" : "إضافة للمميز"}
            >
              <Star size={16} />
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setSelectedCourse(course);
                setCurrentView("edit");
              }}
              className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
              title="تعديل الدورة"
            >
              <Edit size={16} />
            </button>

            <button
              onClick={() => handleDeleteCourse(course.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="حذف الدورة"
            >
              <Trash2 size={16} />
            </button>
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
        onUpdateCourse={(updatedCourse) => {
          setCourses(
            courses.map((course) =>
              course.id === updatedCourse.id ? updatedCourse : course
            )
          );
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
            onClick={() => setCurrentView("list")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
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
                  value={newCourse.title || ""}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, title: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="أدخل عنوان الدورة..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف مختصر *
                </label>
                <input
                  type="text"
                  value={newCourse.shortDescription || ""}
                  onChange={(e) =>
                    setNewCourse({
                      ...newCourse,
                      shortDescription: e.target.value,
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
                  value={newCourse.description || ""}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
                  placeholder="وصف تفصيلي للدورة..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المعلم *
                  </label>
                  <select
                    value={newCourse.teacherId || ""}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        teacherId: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  >
                    <option value="">اختر المعلم</option>
                    {teachers
                      .filter((t) => t.isActive)
                      .map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.name} - {teacher.specialization}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    التصنيف
                  </label>
                  <input
                    type="text"
                    value={newCourse.category || ""}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, category: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="مثل: الرياضيات، الفيزياء"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المستوى
                  </label>
                  <select
                    value={newCourse.level || "beginner"}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        level: e.target.value as Course["level"],
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  >
                    <option value="beginner">مبتدئ</option>
                    <option value="intermediate">متوسط</option>
                    <option value="advanced">متقدم</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المدة (بالساعات)
                  </label>
                  <input
                    type="number"
                    value={newCourse.duration || ""}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        duration: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="40"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رابط الصورة المصغرة
                </label>
                <input
                  type="url"
                  value={newCourse.thumbnail || ""}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, thumbnail: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رابط فيديو المعاينة
                </label>
                <input
                  type="url"
                  value={newCourse.previewVideo || ""}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, previewVideo: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="https://example.com/preview.mp4"
                />
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
                  التسعير
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="pricing"
                      checked={newCourse.isFree === true}
                      onChange={() =>
                        setNewCourse({ ...newCourse, isFree: true, price: 0 })
                      }
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span>دورة مجانية</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="pricing"
                      checked={newCourse.isFree === false}
                      onChange={() =>
                        setNewCourse({ ...newCourse, isFree: false })
                      }
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span>دورة مدفوعة</span>
                  </label>
                </div>
                {newCourse.isFree === false && (
                  <div className="mt-3">
                    <input
                      type="number"
                      value={newCourse.price || ""}
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      placeholder="السعر بالدينار الأردني"
                      min="0"
                      step="0.01"
                    />
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
                    value={newCourse.startDate || ""}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, startDate: e.target.value })
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
                    value={newCourse.endDate || ""}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, endDate: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحد الأقصى للطلاب
                </label>
                <input
                  type="number"
                  value={newCourse.maxStudents || ""}
                  onChange={(e) =>
                    setNewCourse({
                      ...newCourse,
                      maxStudents: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="100"
                  min="1"
                />
              </div>

              {/* Targeted Sections */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  الأقسام الرئيسية المستهدفة
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {mainSections.map((section) => (
                    <label key={section.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={
                          newCourse.targetedSections?.includes(section.id) ||
                          false
                        }
                        onChange={(e) => {
                          const currentSections =
                            newCourse.targetedSections || [];
                          if (e.target.checked) {
                            setNewCourse({
                              ...newCourse,
                              targetedSections: [
                                ...currentSections,
                                section.id,
                              ],
                            });
                          } else {
                            setNewCourse({
                              ...newCourse,
                              targetedSections: currentSections.filter(
                                (id) => id !== section.id
                              ),
                            });
                          }
                        }}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm">{section.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Targeted Subsections */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  الأقسام الفرعية المستهدفة
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {subsections.map((subsection) => (
                    <label
                      key={subsection.id}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        checked={
                          newCourse.targetedSubsections?.includes(
                            subsection.id
                          ) || false
                        }
                        onChange={(e) => {
                          const currentSubsections =
                            newCourse.targetedSubsections || [];
                          if (e.target.checked) {
                            setNewCourse({
                              ...newCourse,
                              targetedSubsections: [
                                ...currentSubsections,
                                subsection.id,
                              ],
                            });
                          } else {
                            setNewCourse({
                              ...newCourse,
                              targetedSubsections: currentSubsections.filter(
                                (id) => id !== subsection.id
                              ),
                            });
                          }
                        }}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm">{subsection.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">منشور</p>
                    <p className="text-sm text-gray-500">متاح للطلاب</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={newCourse.isPublished || false}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        isPublished: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">مميز</p>
                    <p className="text-sm text-gray-500">يظهر في المميزة</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={newCourse.isFeatured || false}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        isFeatured: e.target.checked,
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
              className="px-6 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={handleCreateCourse}
              disabled={
                !newCourse.title ||
                !newCourse.description ||
                !newCourse.teacherId
              }
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">تعديل الدورة</h1>
            <p className="text-gray-600 text-sm">{selectedCourse.title}</p>
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
                  value={selectedCourse.title}
                  onChange={(e) =>
                    setSelectedCourse({
                      ...selectedCourse,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="أدخل عنوان الدورة..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف مختصر *
                </label>
                <input
                  type="text"
                  value={selectedCourse.shortDescription}
                  onChange={(e) =>
                    setSelectedCourse({
                      ...selectedCourse,
                      shortDescription: e.target.value,
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
                  value={selectedCourse.description}
                  onChange={(e) =>
                    setSelectedCourse({
                      ...selectedCourse,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
                  placeholder="وصف تفصيلي للدورة..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المعلم *
                  </label>
                  <select
                    value={selectedCourse.teacherId}
                    onChange={(e) =>
                      setSelectedCourse({
                        ...selectedCourse,
                        teacherId: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  >
                    <option value="">اختر المعلم</option>
                    {teachers
                      .filter((t) => t.isActive)
                      .map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.name} - {teacher.specialization}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    التصنيف
                  </label>
                  <input
                    type="text"
                    value={selectedCourse.category}
                    onChange={(e) =>
                      setSelectedCourse({
                        ...selectedCourse,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="مثل: الرياضيات، الفيزياء"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المستوى
                  </label>
                  <select
                    value={selectedCourse.level}
                    onChange={(e) =>
                      setSelectedCourse({
                        ...selectedCourse,
                        level: e.target.value as Course["level"],
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  >
                    <option value="beginner">مبتدئ</option>
                    <option value="intermediate">متوسط</option>
                    <option value="advanced">متقدم</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المدة (بالساعات)
                  </label>
                  <input
                    type="number"
                    value={selectedCourse.duration}
                    onChange={(e) =>
                      setSelectedCourse({
                        ...selectedCourse,
                        duration: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="40"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رابط الصورة المصغرة
                </label>
                <input
                  type="url"
                  value={selectedCourse.thumbnail}
                  onChange={(e) =>
                    setSelectedCourse({
                      ...selectedCourse,
                      thumbnail: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رابط فيديو المعاينة
                </label>
                <input
                  type="url"
                  value={selectedCourse.previewVideo || ""}
                  onChange={(e) =>
                    setSelectedCourse({
                      ...selectedCourse,
                      previewVideo: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="https://example.com/preview.mp4"
                />
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
                  التسعير
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="pricing"
                      checked={selectedCourse.isFree === true}
                      onChange={() =>
                        setSelectedCourse({
                          ...selectedCourse,
                          isFree: true,
                          price: 0,
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
                      checked={selectedCourse.isFree === false}
                      onChange={() =>
                        setSelectedCourse({ ...selectedCourse, isFree: false })
                      }
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span>دورة مدفوعة</span>
                  </label>
                </div>
                {selectedCourse.isFree === false && (
                  <div className="mt-3">
                    <input
                      type="number"
                      value={selectedCourse.price}
                      onChange={(e) =>
                        setSelectedCourse({
                          ...selectedCourse,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      placeholder="السعر بالدينار الأردني"
                      min="0"
                      step="0.01"
                    />
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
                    value={selectedCourse.startDate || ""}
                    onChange={(e) =>
                      setSelectedCourse({
                        ...selectedCourse,
                        startDate: e.target.value,
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
                    value={selectedCourse.endDate || ""}
                    onChange={(e) =>
                      setSelectedCourse({
                        ...selectedCourse,
                        endDate: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحد الأقصى للطلاب
                </label>
                <input
                  type="number"
                  value={selectedCourse.maxStudents || ""}
                  onChange={(e) =>
                    setSelectedCourse({
                      ...selectedCourse,
                      maxStudents: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="100"
                  min="1"
                />
              </div>

              {/* Status Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">منشور</p>
                    <p className="text-sm text-gray-500">متاح للطلاب</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedCourse.isPublished}
                    onChange={(e) =>
                      setSelectedCourse({
                        ...selectedCourse,
                        isPublished: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">نشط</p>
                    <p className="text-sm text-gray-500">يمكن التسجيل فيه</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedCourse.isActive}
                    onChange={(e) =>
                      setSelectedCourse({
                        ...selectedCourse,
                        isActive: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">مميز</p>
                    <p className="text-sm text-gray-500">يظهر في المميزة</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedCourse.isFeatured}
                    onChange={(e) =>
                      setSelectedCourse({
                        ...selectedCourse,
                        isFeatured: e.target.checked,
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
              className="px-6 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={handleEditCourse}
              disabled={
                !selectedCourse.title ||
                !selectedCourse.description ||
                !selectedCourse.teacherId
              }
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2 text-sm"
        >
          <Plus size={16} />
          إنشاء دورة جديدة
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">إجمالي الدورات</p>
              <p className="text-3xl font-bold text-gray-800">
                {courses.length}
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
                {courses.filter((c) => c.isActive && c.isPublished).length}
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
                {courses.reduce((sum, c) => sum + c.studentsCount, 0)}
              </p>
            </div>
            <Users className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">متوسط التقييم</p>
              <p className="text-3xl font-bold text-orange-600">
                {courses.length > 0
                  ? (
                      courses.reduce((sum, c) => sum + c.rating, 0) /
                      courses.length
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
              placeholder="البحث في الدورات..."
              className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
            />
          </div>

          {/* Teacher Filter */}
          <select
            value={teacherFilter || ""}
            onChange={(e) =>
              setTeacherFilter(e.target.value ? parseInt(e.target.value) : null)
            }
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
          >
            <option value="">جميع المعلمين</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
          >
            <option value="">جميع التصنيفات</option>
            {uniqueCategories.map((category) => (
              <option key={category} value={category}>
                {category}
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
            <option value="published">منشور</option>
            <option value="draft">مسودة</option>
            <option value="active">نشط</option>
            <option value="inactive">معطل</option>
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
        </div>
      </div>

      {/* Courses Grid/Table */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}

          {filteredCourses.length === 0 && (
            <div className="col-span-full bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-orange-100/50">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                {searchTerm ||
                teacherFilter ||
                categoryFilter ||
                statusFilter !== "all"
                  ? "لا توجد نتائج"
                  : "لا توجد دورات"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ||
                teacherFilter ||
                categoryFilter ||
                statusFilter !== "all"
                  ? "لم يتم العثور على دورات تطابق المعايير المحددة"
                  : "ابدأ بإنشاء دورة تعليمية جديدة"}
              </p>
              {!searchTerm &&
                !teacherFilter &&
                !categoryFilter &&
                statusFilter === "all" && (
                  <button
                    onClick={() => setCurrentView("create")}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2 mx-auto"
                  >
                    <Plus size={16} />
                    إنشاء دورة جديدة
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
                    الدورة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المعلم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التصنيف
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الطلاب
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التقييم
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
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-medium text-gray-900 line-clamp-1">
                            {course.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {course.duration}h • {course.level}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            course.teacherAvatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              course.teacherName
                            )}&background=f97316&color=ffffff&size=32`
                          }
                          alt={course.teacherName}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-sm text-gray-900">
                          {course.teacherName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course.studentsCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-500" />
                        <span className="text-sm font-medium">
                          {course.rating.toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course.isFree ? "مجاني" : `${course.price} د.أ`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            course.isPublished
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {course.isPublished ? "منشور" : "مسودة"}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            course.isActive
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {course.isActive ? "نشط" : "معطل"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedCourse(course);
                            setCurrentView("content");
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="إدارة المحتوى"
                        >
                          <Folder size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCourse(course);
                            setCurrentView("edit");
                          }}
                          className="p-1 text-gray-400 hover:text-orange-600 transition-colors"
                          title="تعديل"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
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
    </div>
  );
};

export default CoursesPage;
