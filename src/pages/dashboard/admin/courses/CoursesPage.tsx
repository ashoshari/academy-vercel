import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit,
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
  ArrowRight,
} from "lucide-react";
import CourseContentPage from "@/components/dashboard/admin/courses/CourseContentPage";
import { useCustomQuery } from "@/hooks/useQuery";
import { useCustomPost, useCustomUpdate } from "@/hooks/useMutation";
import toast from "react-hot-toast";
import { formToJSON } from "axios";
import { formatDate } from "@/services/date";

// export interface Course {
//   id: number;
//   title: string;
//   description: string;
//   shortDescription: string;
//   teacherId: number;
//   teacherName: string;
//   teacherAvatar?: string;
//   price: number;
//   isFree: boolean;
//   isPublished: boolean;
//   isActive: boolean;
//   isFeatured: boolean;
//   category: string;
//   level: "beginner" | "intermediate" | "advanced";
//   language: string;
//   duration: number; // in hours
//   studentsCount: number;
//   rating: number;
//   reviewsCount: number;
//   thumbnail: string;
//   previewVideo?: string;
//   targetedSections: number[];
//   targetedSubsections: number[];
//   tags: string[];
//   requirements: string[];
//   whatYouWillLearn: string[];
//   createdAt: string;
//   updatedAt: string;
//   publishedAt?: string;
//   startDate?: string;
//   endDate?: string;
//   maxStudents?: number;
//   chapters: Chapter[];
//   files: CourseFile[];
//   exams: CourseExam[];
//   enrollments: CourseEnrollment[];
//   reviews: CourseReview[];
// }

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
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [teacherFilter, setTeacherFilter] = useState<any>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft" | "active" | "inactive"
  >("all");
  const [levelFilter] = useState<
    "all" | "beginner" | "intermediate" | "advanced"
  >("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [courseId, setCourseId] = useState<any>(null);

  // Sample courses data
  // const [courses, setCourses] = useState<Course[]>([
  //   {
  //     id: 1,
  //     title: "دورة الرياضيات المتقدمة",
  //     description:
  //       "دورة شاملة في الرياضيات المتقدمة تغطي التفاضل والتكامل والجبر الخطي مع تطبيقات عملية وأمثلة متنوعة لطلاب التوجيهي العلمي.",
  //     shortDescription: "دورة شاملة في الرياضيات المتقدمة للتوجيهي العلمي",
  //     teacherId: 1,
  //     teacherName: "د. أحمد محمد",
  //     teacherAvatar:
  //       "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
  //     price: 150.0,
  //     isFree: false,
  //     isPublished: true,
  //     isActive: true,
  //     isFeatured: true,
  //     category: "الرياضيات",
  //     level: "advanced",
  //     language: "العربية",
  //     duration: 40,
  //     studentsCount: 156,
  //     rating: 4.8,
  //     reviewsCount: 89,
  //     thumbnail:
  //       "https://images.pexels.com/photos/6238050/pexels-photo-6238050.jpeg?auto=compress&cs=tinysrgb&w=800",
  //     previewVideo:
  //       "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
  //     targetedSections: [1],
  //     targetedSubsections: [2, 3],
  //     tags: ["رياضيات", "تفاضل", "تكامل", "توجيهي"],
  //     requirements: ["معرفة أساسيات الجبر", "إتقان العمليات الحسابية الأساسية"],
  //     whatYouWillLearn: [
  //       "إتقان مفاهيم التفاضل والتكامل",
  //       "حل المسائل المعقدة في الرياضيات",
  //       "تطبيق المفاهيم الرياضية في الحياة العملية",
  //       "الاستعداد لامتحانات التوجيهي",
  //     ],
  //     createdAt: "2024-01-15",
  //     updatedAt: "2024-01-20",
  //     publishedAt: "2024-01-18",
  //     startDate: "2024-02-01",
  //     endDate: "2024-05-30",
  //     maxStudents: 200,
  //     chapters: [
  //       {
  //         id: 1,
  //         courseId: 1,
  //         title: "مقدمة في التفاضل",
  //         description: "أساسيات التفاضل والمشتقات",
  //         order: 1,
  //         isPublished: true,
  //         isFree: true,
  //         estimatedDuration: 120,
  //         units: [
  //           {
  //             id: 1,
  //             chapterId: 1,
  //             title: "تعريف المشتقة",
  //             description: "مفهوم المشتقة وتطبيقاتها",
  //             order: 1,
  //             isPublished: true,
  //             isFree: true,
  //             estimatedDuration: 60,
  //             lessons: [
  //               {
  //                 id: 1,
  //                 unitId: 1,
  //                 title: "المشتقة الأولى",
  //                 description: "تعلم كيفية حساب المشتقة الأولى",
  //                 order: 1,
  //                 isPublished: true,
  //                 isFree: true,
  //                 estimatedDuration: 30,
  //                 sessions: [
  //                   {
  //                     id: 1,
  //                     lessonId: 1,
  //                     title: "شرح المشتقة الأولى",
  //                     description: "فيديو تعليمي عن المشتقة الأولى",
  //                     type: "video",
  //                     content:
  //                       "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
  //                     order: 1,
  //                     isPublished: true,
  //                     isFree: true,
  //                     estimatedDuration: 25,
  //                     files: [],
  //                     exams: [],
  //                   },
  //                   {
  //                     id: 2,
  //                     lessonId: 1,
  //                     title: "اختبار المشتقة الأولى",
  //                     description: "اختبار تقييمي على المشتقة الأولى",
  //                     type: "exam",
  //                     content: "1", // exam ID
  //                     order: 2,
  //                     isPublished: true,
  //                     isFree: false,
  //                     estimatedDuration: 5,
  //                     files: [],
  //                     exams: [],
  //                   },
  //                 ],
  //                 files: [],
  //                 exams: [],
  //               },
  //             ],
  //             files: [],
  //             exams: [],
  //           },
  //         ],
  //         files: [],
  //         exams: [],
  //       },
  //     ],
  //     files: [],
  //     exams: [],
  //     enrollments: [],
  //     reviews: [],
  //   },
  //   {
  //     id: 2,
  //     title: "أساسيات الفيزياء",
  //     description:
  //       "دورة تأسيسية في الفيزياء تغطي الميكانيكا والكهرباء والمغناطيسية مع تجارب عملية وحلول مفصلة للمسائل.",
  //     shortDescription: "دورة تأسيسية شاملة في الفيزياء",
  //     teacherId: 3,
  //     teacherName: "م. خالد سالم",
  //     teacherAvatar:
  //       "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150",
  //     price: 120.0,
  //     isFree: false,
  //     isPublished: true,
  //     isActive: true,
  //     isFeatured: false,
  //     category: "الفيزياء",
  //     level: "intermediate",
  //     language: "العربية",
  //     duration: 35,
  //     studentsCount: 89,
  //     rating: 4.6,
  //     reviewsCount: 67,
  //     thumbnail:
  //       "https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=800",
  //     targetedSections: [1],
  //     targetedSubsections: [2, 3],
  //     tags: ["فيزياء", "ميكانيكا", "كهرباء", "توجيهي"],
  //     requirements: [
  //       "معرفة أساسيات الرياضيات",
  //       "فهم المفاهيم العلمية الأساسية",
  //     ],
  //     whatYouWillLearn: [
  //       "فهم قوانين الفيزياء الأساسية",
  //       "حل مسائل الميكانيكا والكهرباء",
  //       "تطبيق المفاهيم الفيزيائية عملياً",
  //       "الاستعداد للامتحانات النهائية",
  //     ],
  //     createdAt: "2024-01-12",
  //     updatedAt: "2024-01-19",
  //     publishedAt: "2024-01-16",
  //     startDate: "2024-02-15",
  //     endDate: "2024-06-15",
  //     maxStudents: 150,
  //     chapters: [],
  //     files: [],
  //     exams: [],
  //     enrollments: [],
  //     reviews: [],
  //   },
  //   {
  //     id: 3,
  //     title: "اللغة العربية والأدب",
  //     description:
  //       "دورة متخصصة في اللغة العربية والأدب تشمل النحو والصرف والبلاغة مع دراسة النصوص الأدبية الكلاسيكية والحديثة.",
  //     shortDescription: "دورة متخصصة في اللغة العربية والأدب",
  //     teacherId: 2,
  //     teacherName: "أ. فاطمة أحمد",
  //     teacherAvatar:
  //       "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150",
  //     price: 0,
  //     isFree: true,
  //     isPublished: false,
  //     isActive: false,
  //     isFeatured: false,
  //     category: "اللغة العربية",
  //     level: "intermediate",
  //     language: "العربية",
  //     duration: 30,
  //     studentsCount: 0,
  //     rating: 0,
  //     reviewsCount: 0,
  //     thumbnail:
  //       "https://images.pexels.com/photos/159581/dictionary-reference-book-learning-meaning-159581.jpeg?auto=compress&cs=tinysrgb&w=800",
  //     targetedSections: [1],
  //     targetedSubsections: [2, 3],
  //     tags: ["عربي", "نحو", "أدب", "بلاغة"],
  //     requirements: ["إتقان القراءة والكتابة", "معرفة أساسيات النحو"],
  //     whatYouWillLearn: [
  //       "إتقان قواعد النحو والصرف",
  //       "فهم وتحليل النصوص الأدبية",
  //       "تطوير مهارات الكتابة والتعبير",
  //       "الاستعداد لامتحانات اللغة العربية",
  //     ],
  //     createdAt: "2024-01-10",
  //     updatedAt: "2024-01-17",
  //     startDate: "2024-03-01",
  //     endDate: "2024-07-01",
  //     maxStudents: 100,
  //     chapters: [],
  //     files: [],
  //     exams: [],
  //     enrollments: [],
  //     reviews: [],
  //   },
  // ]);

  // GET courses
  const { data } = useCustomQuery("/training/admin/courses/", ["courses"]);
  const courseData = data?.data;
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
  const { data: specializations } = useCustomQuery(
    "/training/admin/specializations/",
    ["specializations"]
  );

  // GET Specializations_material
  const { data: specializations_material } = useCustomQuery(
    "/training/admin/specialization-materials/",
    ["specializations_material"]
  );

  const specializationData = specializations?.data;
  const specialization_materialData = specializations_material?.data;

  const [courses, setCourses] = useState<any>(courseData?.data);
  useEffect(() => {
    setCourses(courseData?.data);
  }, [courseData]);
  const courseStatsData = coursesStats?.data;

  const [newCourse, setNewCourse] = useState<any>({});

  // PUT Course
  const { mutateAsync: editCourse } = useCustomUpdate(
    `/training/admin/courses/${courseId}/`,
    ["editcourses", courseId]
  );
  // Filter courses
  const filteredCourses = courses?.filter((course: any) => {
    const matchesSearch =
      course?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course?.short_description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      course?.teacher?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTeacher =
      teacherFilter === null || course?.teacher?.id === teacherFilter;
    const matchesCategory =
      categoryFilter === "" || course?.specialization?.name === categoryFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && course?.is_published) ||
      (statusFilter === "draft" && !course?.is_published);
    // (statusFilter === "active" && course.isActive) ||
    // (statusFilter === "inactive" && !course.isActive);
    const matchesLevel = levelFilter === "all" || course.level === levelFilter;

    return (
      matchesSearch &&
      matchesTeacher &&
      matchesCategory &&
      matchesStatus &&
      matchesLevel
    );
  });
  const uniqueCategories = [
    ...new Set(courses?.data?.map((c: any) => c.category)),
  ];

  // POST New Course
  const { mutateAsync: createCourse } = useCustomPost(
    "/training/admin/courses/",
    ["postCourses"]
  );
  const handleCreateCourse = async () => {
    try {
      const res = await createCourse(newCourse);
      toast.success(res.message ?? "تم الحفظ بنجاح");
      setCurrentView("list");
    } catch (err: any) {
      toast.error(err?.response?.data?.error);
    }
  };
  const handleEditCourse = async () => {
    try {
      const res = await editCourse(newCourse);
      toast.success(res.message ?? "تم الحفظ بنجاح");
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
        <div className="absolute top-4 left-4 flex gap-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(
              course?.level?.name
            )}`}
          >
            {course?.level?.name || "غير محدد"}
          </span>
        </div>

        {/* Level Badge */}
        <div className="absolute bottom-4 right-4">
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
            {course?.specialization?.name || "غير محدد"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
            {course?.name}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {course.short_description}
          </p>
        </div>

        {/* Teacher */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src={
              course?.teacher?.image ||
              "https://www.malvernbh.com/wp-content/uploads/2023/02/shutterstock_1079701271-1-min-1010x673.jpg"
            }
            alt={course?.teacher?.name}
            className="w-8 h-8 rounded-full"
          />
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
              {course?.maximum_number_of_students}
            </div>
            <div className="text-xs text-gray-500">طالب</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {course?.time_in_hours}h
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
              {course.is_free ? "مجاني" : `${course?.price} د.أ`}
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

            {/* <button
              onClick={() => toggleCourseStatus(course?.id, "isActive")}
              className={`p-2 rounded-lg transition-colors ${
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
              className={`p-2 rounded-lg transition-colors ${
                course?.is_Published
                  ? "text-green-600 bg-green-50 hover:bg-green-100"
                  : "text-gray-400 bg-gray-50 hover:bg-gray-100"
              }`}
              title={course?.is_Published ? "إلغاء النشر" : "نشر الدورة"}
            >
              {course?.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>

            {/* Raiting */}
            {/* <button
              onClick={() => toggleCourseStatus(course.id, "isFeatured")}
              className={`p-2 rounded-lg transition-colors ${
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
                setCurrentView("edit");
              }}
              className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
              title="تعديل الدورة"
            >
              <Edit size={16} />
            </button>

            {/* <button
              onClick={() => handleDeleteCourse(course.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
              setCurrentView("list");
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
                  وصف مختصر *
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
                  الوصف التفصيلي *
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
                <div>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    التصنيف
                  </label>
                  <input
                    type="text"
                    value={newCourse?.category || ""}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, category: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="مثل: علمي ، ادبي"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المستوى
                  </label>
                  <select
                    value={
                      newCourse?.level || "d72e95dd-dc4c-4495-8ec5-cea7e7c5a0c3"
                    }
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        level: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  >
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
                    value={newCourse.time_in_hours || ""}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        time_in_hours: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="40"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
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
                  التسعير
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="pricing"
                      checked={newCourse.is_free === true}
                      onChange={() =>
                        setNewCourse({ ...newCourse, is_free: true, price: 0 })
                      }
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span>دورة مجانية</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="pricing"
                      checked={newCourse.is_free === false}
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
                    <input
                      type="number"
                      value={newCourse?.price || ""}
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
                    value={newCourse?.start_date || ""}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, start_date: e.target.value })
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
                    value={newCourse.end_date || ""}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, end_date: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              {/* Max Students */}
              {/* <div>
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
              </div> */}

              {/* Targeted Sections */}
              <div>
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
                        type="checkbox"
                        checked={
                          newCourse.specialization?.includes(
                            specialization?.id
                          ) || false
                        }
                        onChange={(e) => {
                          const currentcurrentSpecialization =
                            newCourse.specialization || [];
                          if (e.target.checked) {
                            setNewCourse({
                              ...newCourse,
                              specialization: [
                                ...currentcurrentSpecialization,
                                specialization?.id,
                              ],
                            });
                          } else {
                            setNewCourse({
                              ...newCourse,
                              specialization:
                                currentcurrentSpecialization.filter(
                                  (id: any) => id !== specialization?.id
                                ),
                            });
                          }
                        }}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm">{specialization?.name}</span>
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
                  {specialization_materialData?.map(
                    (specialization_material: any) => (
                      <label
                        key={specialization_material?.id}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          checked={
                            newCourse.specialization?.includes(
                              specialization_material?.id
                            ) || false
                          }
                          onChange={(e) => {
                            const currentSpecialization_material =
                              newCourse.specialization_material || [];
                            if (e.target.checked) {
                              setNewCourse({
                                ...newCourse,
                                specialization_material: [
                                  ...currentSpecialization_material,
                                  specialization_material?.id,
                                ],
                              });
                            } else {
                              setNewCourse({
                                ...newCourse,
                                specialization:
                                  currentSpecialization_material.filter(
                                    (id: any) =>
                                      id !== specialization_material?.id
                                  ),
                              });
                            }
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
                    checked={newCourse.is_published || false}
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
              className="px-6 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={handleCreateCourse}
              disabled={
                !newCourse.name ||
                !newCourse.short_description ||
                !newCourse.long_description ||
                !newCourse.teacher
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
                  وصف مختصر *
                </label>
                <input
                  type="text"
                  value={selectedCourse?.short_description}
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
                  value={selectedCourse?.long_description}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المعلم *
                  </label>
                  <select
                    value={selectedCourse?.teacher}
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
                      ?.filter((t: any) => t.is_active)
                      .map((teacher: any) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.name}
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
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المستوى
                  </label>
                  <select
                    value={selectedCourse?.level}
                    onChange={(e) =>
                      setSelectedCourse({
                        ...selectedCourse,
                        level: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  >
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
                        time_in_hours: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
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

              {/* <div>
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
              </div> */}

              {/* <div>
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
              </div> */}
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
                      checked={selectedCourse?.is_free === true}
                      onChange={() =>
                        setSelectedCourse({
                          ...selectedCourse,
                          is_free: true,
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
                    <input
                      type="number"
                      value={selectedCourse?.price}
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

              {/* Maximum Students */}
              <div>
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
              className="px-6 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={handleEditCourse}
              disabled={
                !selectedCourse?.name ||
                !selectedCourse?.short_description ||
                !selectedCourse?.long_description ||
                !selectedCourse?.teacher
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">إجمالي الدورات</p>
              <p className="text-3xl font-bold text-gray-800">
                {courseStatsData?.total_courses || 0}
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
                {courseStatsData?.active_courses || 0}
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
                {courseStatsData?.total_students_in_enrolled_courses || 0}
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
              className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
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
          <select
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
            {/* <option value="active">نشط</option>
            <option value="inactive">معطل</option> */}
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
          {filteredCourses?.map((course: any) => (
            <CourseCard key={course.id} course={course} />
          ))}

          {courseData?.length === 0 && (
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
                  {/* <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التقييم
                  </th> */}
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
                {filteredCourses?.map((course: any) => (
                  <tr key={course?.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            course?.image ||
                            "https://www.malvernbh.com/wp-content/uploads/2023/02/shutterstock_1079701271-1-min-1010x673.jpg"
                          }
                          alt={course?.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-medium text-gray-900 line-clamp-1">
                            {course?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {course?.time_in_hours}h • {course?.level?.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            course?.teacher?.image ||
                            "https://www.malvernbh.com/wp-content/uploads/2023/02/shutterstock_1079701271-1-min-1010x673.jpg"
                          }
                          alt={course?.teacher?.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-sm text-gray-900">
                          {course?.teacher?.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course?.specialization?.name || "غير محدد"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course?.maximum_number_of_students}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-500" />
                        <span className="text-sm font-medium">2</span>
                      </div>
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course?.is_free ? "مجاني" : `${course?.price} د.أ`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                            toggleCourseStatus(course?.id);
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            course?.is_Published
                              ? "text-green-600 bg-green-50 hover:bg-green-100"
                              : "text-gray-400 bg-gray-50 hover:bg-gray-100"
                          }`}
                          title={
                            course?.is_Published ? "إلغاء النشر" : "نشر الدورة"
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
                          }}
                          className="p-1 text-gray-400 hover:text-orange-600 transition-colors"
                          title="تعديل"
                        >
                          <Edit size={16} />
                        </button>
                        {/* <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
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
      )}
    </div>
  );
};

export default CoursesPage;
