import { useState } from "react";
import {
  Star,
  Users,
  Award,
  BookOpen,
  Video,
  FileText,
  Monitor,
  Gift,
  Clock,
  Play,
  Download,
  CheckCircle,
  CreditCard,
  Lock,
  Calendar,
  Eye,
  FileDown,
  Timer,
  Target,
  TrendingUp,
  Zap,
  ArrowRight,
} from "lucide-react";
import { useParams, useNavigate } from "react-router";

interface Course {
  id: number;
  title: string;
  grade: string;
  subject: string;
  description: string;
  price: number;
  duration: string;
  lessons: number;
  students: number;
  rating: number;
  image: string;
  isActive: boolean;
}

interface Session {
  id: number;
  title: string;
  date: string;
  time: string;
  duration: string;
  type: "live" | "recorded";
  students: number;
  price: number;
  description: string;
}

interface File {
  id: number;
  title: string;
  type: "pdf" | "doc" | "ppt" | "video";
  size: string;
  downloads: number;
  uploadDate: string;
  description: string;
  price: number;
}

interface Exam {
  id: number;
  title: string;
  subject: string;
  duration: string;
  questions: number;
  attempts: number;
  difficulty: "easy" | "medium" | "hard";
  price: number;
  description: string;
  passingScore: number;
}

interface FreeSession {
  id: number;
  title: string;
  date: string;
  time: string;
  duration: string;
  topic: string;
  registered: number;
  maxStudents: number;
  description: string;
}

const TeacherProfile: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("courses");
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activationCode, setActivationCode] = useState("");

  // Sample teacher data
  const teacher = {
    id: 0,
    name: "أ. محمد الأحمد",
    subject: "الرياضيات",
    rating: 4.9,
    students: 1200,
    experience: 15,
    image:
      "https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?auto=compress&cs=tinysrgb&w=200",
    bio: "أستاذ الرياضيات مع خبرة 15 سنة في تدريس التوجيهي. حاصل على ماجستير في الرياضيات التطبيقية. ساعدت آلاف الطلاب في تحقيق أحلامهم الجامعية.",
    achievements: [
      "أفضل مدرس رياضيات 2023",
      "95% نسبة نجاح طلابه",
      "مؤلف 5 كتب تعليمية",
    ],
  };

  // Sample courses data
  const courses: Course[] = [
    {
      id: 1,
      title: "دورة الرياضيات الشاملة - الجبر والهندسة",
      grade: "التوجيهي العلمي",
      subject: "الرياضيات",
      description:
        "دورة شاملة تغطي جميع فروع الرياضيات للتوجيهي العلمي مع التركيز على الجبر والهندسة التحليلية والتفاضل والتكامل",
      price: 50,
      duration: "3 أشهر",
      lessons: 45,
      students: 320,
      rating: 4.9,
      image:
        "https://images.pexels.com/photos/6238050/pexels-photo-6238050.jpeg?auto=compress&cs=tinysrgb&w=400",
      isActive: false,
    },
    {
      id: 2,
      title: "دورة التأسيس في الرياضيات",
      grade: "التوجيهي الأدبي",
      subject: "الرياضيات",
      description:
        "دورة تأسيسية للطلاب الذين يحتاجون تقوية في أساسيات الرياضيات مع شرح مبسط وأمثلة كثيرة",
      price: 20,
      duration: "شهرين",
      lessons: 24,
      students: 180,
      rating: 4.8,
      image:
        "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=400",
      isActive: true,
    },
    {
      id: 3,
      title: "مراجعة نهائية - رياضيات التوجيهي",
      grade: "التوجيهي العلمي",
      subject: "الرياضيات",
      description:
        "مراجعة مكثفة لجميع المواضيع المهمة في امتحان التوجيهي مع حل أسئلة وزارية وتوقعات الامتحان",
      price: 20,
      duration: "شهر واحد",
      lessons: 16,
      students: 450,
      rating: 4.9,
      image:
        "https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=400",
      isActive: false,
    },
  ];

  // Sample sessions data
  const sessions: Session[] = [
    {
      id: 1,
      title: "حصة مباشرة - التفاضل والتكامل",
      date: "2025-01-20",
      time: "19:00",
      duration: "90 دقيقة",
      type: "live",
      students: 45,
      price: 15,
      description:
        "شرح مفصل لقوانين التفاضل والتكامل مع حل أمثلة متنوعة وأسئلة الطلاب المباشرة",
    },
    {
      id: 2,
      title: "حصة مسجلة - الهندسة التحليلية",
      date: "2025-01-18",
      time: "متاح دائماً",
      duration: "75 دقيقة",
      type: "recorded",
      students: 120,
      price: 10,
      description:
        "شرح شامل للهندسة التحليلية والمعادلات الخطية مع أمثلة تطبيقية",
    },
    {
      id: 3,
      title: "حصة مباشرة - حل المعادلات التربيعية",
      date: "2025-01-22",
      time: "20:00",
      duration: "60 دقيقة",
      type: "live",
      students: 38,
      price: 12,
      description:
        "طرق متنوعة لحل المعادلات التربيعية والتطبيقات العملية عليها",
    },
    {
      id: 4,
      title: "حصة مسجلة - الإحصاء والاحتمالات",
      date: "2025-01-15",
      time: "متاح دائماً",
      duration: "85 دقيقة",
      type: "recorded",
      students: 95,
      price: 10,
      description:
        "مقدمة شاملة في الإحصاء والاحتمالات مع حل مسائل متدرجة الصعوبة",
    },
  ];

  // Sample files data
  const files: File[] = [
    {
      id: 1,
      title: "ملخص شامل - الجبر والمعادلات",
      type: "pdf",
      size: "2.5 MB",
      downloads: 450,
      uploadDate: "2025-01-10",
      description: "ملخص مركز لجميع قوانين الجبر والمعادلات مع أمثلة محلولة",
      price: 5,
    },
    {
      id: 2,
      title: "أوراق عمل - التفاضل والتكامل",
      type: "doc",
      size: "1.8 MB",
      downloads: 320,
      uploadDate: "2025-01-08",
      description: "مجموعة أوراق عمل تفاعلية لممارسة مسائل التفاضل والتكامل",
      price: 8,
    },
    {
      id: 3,
      title: "عرض تقديمي - الهندسة التحليلية",
      type: "ppt",
      size: "4.2 MB",
      downloads: 280,
      uploadDate: "2025-01-05",
      description:
        "عرض تقديمي تفاعلي يشرح مفاهيم الهندسة التحليلية بالرسوم البيانية",
      price: 10,
    },
    {
      id: 4,
      title: "فيديو شرح - المتتاليات والمتسلسلات",
      type: "video",
      size: "150 MB",
      downloads: 200,
      uploadDate: "2025-01-03",
      description: "فيديو شرح مفصل للمتتاليات والمتسلسلات مع حل أمثلة متنوعة",
      price: 15,
    },
    {
      id: 5,
      title: "بنك أسئلة - رياضيات التوجيهي",
      type: "pdf",
      size: "3.1 MB",
      downloads: 600,
      uploadDate: "2025-01-01",
      description: "مجموعة شاملة من الأسئلة المتنوعة مع الحلول النموذجية",
      price: 12,
    },
  ];

  // Sample exams data
  const exams: Exam[] = [
    {
      id: 1,
      title: "امتحان شامل - الوحدة الأولى",
      subject: "الجبر والمعادلات",
      duration: "90 دقيقة",
      questions: 25,
      attempts: 180,
      difficulty: "medium",
      price: 8,
      description:
        "امتحان شامل يغطي جميع مواضيع الوحدة الأولى مع تقييم فوري ونصائح للتحسين",
      passingScore: 70,
    },
    {
      id: 2,
      title: "اختبار سريع - التفاضل",
      subject: "التفاضل والتكامل",
      duration: "45 دقيقة",
      questions: 15,
      attempts: 220,
      difficulty: "easy",
      price: 5,
      description: "اختبار سريع لقياس فهم أساسيات التفاضل والقوانين الأساسية",
      passingScore: 60,
    },
    {
      id: 3,
      title: "امتحان متقدم - الهندسة التحليلية",
      subject: "الهندسة التحليلية",
      duration: "120 دقيقة",
      questions: 30,
      attempts: 95,
      difficulty: "hard",
      price: 12,
      description: "امتحان متقدم للطلاب المتميزين يتضمن مسائل تحليلية معقدة",
      passingScore: 75,
    },
    {
      id: 4,
      title: "محاكاة امتحان التوجيهي",
      subject: "رياضيات شاملة",
      duration: "180 دقيقة",
      questions: 40,
      attempts: 150,
      difficulty: "medium",
      price: 15,
      description:
        "محاكاة كاملة لامتحان التوجيهي الحقيقي مع نفس التوقيت والصعوبة",
      passingScore: 65,
    },
  ];

  // Sample free sessions data
  const freeSessions: FreeSession[] = [
    {
      id: 1,
      title: "ورشة مجانية - نصائح للنجاح في التوجيهي",
      date: "2025-01-25",
      time: "18:00",
      duration: "60 دقيقة",
      topic: "استراتيجيات الدراسة",
      registered: 85,
      maxStudents: 100,
      description:
        "ورشة تفاعلية تقدم أهم النصائح والاستراتيجيات للنجاح في امتحان التوجيهي",
    },
    {
      id: 2,
      title: "جلسة أسئلة وأجوبة مجانية",
      date: "2025-01-28",
      time: "19:30",
      duration: "45 دقيقة",
      topic: "حل الشكوك والاستفسارات",
      registered: 62,
      maxStudents: 80,
      description:
        "جلسة مفتوحة للإجابة على جميع أسئلة الطلاب حول مادة الرياضيات",
    },
    {
      id: 3,
      title: "حصة تجريبية - التفاضل للمبتدئين",
      date: "2025-01-30",
      time: "20:00",
      duration: "75 دقيقة",
      topic: "مقدمة في التفاضل",
      registered: 45,
      maxStudents: 60,
      description: "حصة تجريبية مجانية لتعريف الطلاب بأساسيات التفاضل وأهميته",
    },
    {
      id: 4,
      title: "ورشة حل المسائل الصعبة",
      date: "2025-02-02",
      time: "17:00",
      duration: "90 دقيقة",
      topic: "تقنيات حل المسائل المعقدة",
      registered: 38,
      maxStudents: 50,
      description:
        "ورشة متخصصة لتعليم تقنيات حل المسائل الصعبة والمعقدة في الرياضيات",
    },
    {
      id: 5,
      title: "لقاء تحفيزي - طريق النجاح",
      date: "2025-02-05",
      time: "18:30",
      duration: "30 دقيقة",
      topic: "التحفيز والدافعية",
      registered: 120,
      maxStudents: 150,
      description:
        "لقاء تحفيزي لرفع معنويات الطلاب وتقوية دافعيتهم للدراسة والنجاح",
    },
  ];

  const tabs = [
    { id: "courses", title: "الدورات", icon: BookOpen, count: courses.length },
    { id: "sessions", title: "الحصص", icon: Video, count: sessions.length },
    { id: "files", title: "الملفات", icon: FileText, count: files.length },
    { id: "exams", title: "الامتحانات", icon: Monitor, count: exams.length },
    { id: "free", title: "حصص مجانية", icon: Gift, count: freeSessions.length },
  ];

  const handleCourseActivation = (course: Course) => {
    setSelectedCourse(course);
    setShowActivationModal(true);
  };

  const handleActivationSubmit = () => {
    if (activationCode.trim()) {
      // Simulate activation
      setShowActivationModal(false);
      setActivationCode("");
      alert("تم تفعيل الدورة بنجاح! 🎉");
    }
  };
    const handleCourseClick = (course: Course) => {
      if (course.isActive) {
        navigate(`/coursePage/${course.id}`);
        // onCourseClick();
      } else {
        handleCourseActivation(course);
      }
    };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return "📄";
      case "doc":
        return "📝";
      case "ppt":
        return "📊";
      case "video":
        return "🎥";
      default:
        return "📁";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "سهل";
      case "medium":
        return "متوسط";
      case "hard":
        return "صعب";
      default:
        return "غير محدد";
    }
  };

  const renderCourseCard = (course: Course) => (
    <div
      key={course.id}
      className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
    >
      <div className="relative">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          {course.isActive ? (
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
              <CheckCircle className="w-4 h-4" />
              <span>مفعلة</span>
            </div>
          ) : (
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
              <Lock className="w-4 h-4" />
              <span>غير مفعلة</span>
            </div>
          )}
        </div>
        <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          {course.price} دينار
        </div>
      </div>

      <div className="flex flex-col p-6">
        <div className="flex flex-col space-between mb-4 h-[100px]">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {course.title}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg">
              {course.grade}
            </span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-lg">
              {course.subject}
            </span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {course.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{course.duration}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Play className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{course.lessons} درس</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{course.students} طالب</span>
          </div>
        </div>

        <button
          onClick={() => handleCourseClick(course)}
          className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
            course.isActive
              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transform hover:scale-105"
              : "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 transform hover:scale-105"
          }`}
        >
          {course.isActive ? (
            <>
              <Play className="w-5 h-5" />
              <span>دخول الدورة</span>
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              <span>تفعيل الدورة</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderSessionCard = (session: Session) => (
    <div
      key={session.id}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {session.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3">{session.description}</p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            session.type === "live"
              ? "bg-red-100 text-red-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {session.type === "live" ? "🔴 مباشر" : "📹 مسجل"}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">{session.date}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">{session.time}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Timer className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">{session.duration}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">{session.students} طالب</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-orange-600">
          {session.price} دينار
        </span>
        <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform group-hover:scale-105">
          {session.type === "live" ? "احجز مكانك" : "شاهد الآن"}
        </button>
      </div>
    </div>
  );

  const renderFileCard = (file: File) => (
    <div
      key={file.id}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 group"
    >
      <div className="flex items-start space-x-4 mb-4">
        <div className="text-4xl">{getFileIcon(file.type)}</div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{file.title}</h3>
          <p className="text-gray-600 text-sm mb-3">{file.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="flex items-center space-x-2">
          <FileDown className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">{file.size}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Download className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">{file.downloads} تحميل</span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">{file.uploadDate}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">{file.type.toUpperCase()}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xl font-bold text-green-600">
          {file.price} دينار
        </span>
        <button className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-2 rounded-xl font-semibold hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform group-hover:scale-105 flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>تحميل</span>
        </button>
      </div>
    </div>
  );

  const renderExamCard = (exam: Exam) => (
    <div
      key={exam.id}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{exam.title}</h3>
          <p className="text-gray-600 text-sm mb-3">{exam.description}</p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
            exam.difficulty
          )}`}
        >
          {getDifficultyText(exam.difficulty)}
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mb-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{exam.subject}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Timer className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{exam.duration}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Monitor className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{exam.questions} سؤال</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{exam.passingScore}% للنجاح</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Eye className="w-4 h-4" />
          <span>{exam.attempts} محاولة</span>
        </div>
        <span className="text-xl font-bold text-purple-600">
          {exam.price} دينار
        </span>
      </div>

      <button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center space-x-2">
        <Zap className="w-5 h-5" />
        <span>ابدأ الامتحان</span>
      </button>
    </div>
  );

  const renderFreeSessionCard = (session: FreeSession) => (
    <div
      key={session.id}
      className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-green-200 p-6 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Gift className="w-5 h-5 text-green-600" />
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
              مجاني
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {session.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3">{session.description}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 mb-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{session.date}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{session.time}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Timer className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{session.duration}</span>
          </div>
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{session.topic}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="w-24 bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(session.registered / session.maxStudents) * 100}%`,
            }}
          ></div>
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-medium">{session.registered}</span> من{" "}
          <span className="font-medium">{session.maxStudents}</span> مسجل
        </div>
      </div>

      <button className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center space-x-2">
        <Gift className="w-5 h-5" />
        <span>سجل مجاناً</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => window.history.back()}
              className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all duration-200 group"
            >
              <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            <div className="relative">
              <img
                src={teacher.image}
                alt={teacher.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>

            <div className="flex-1 text-center md:text-right text-white">
              <h1 className="text-4xl font-bold mb-2">{teacher.name}</h1>
              <p className="text-xl text-blue-100 mb-4">{teacher.subject}</p>
              <p className="text-blue-100 leading-relaxed max-w-2xl">
                {teacher.bio}
              </p>
            </div>

            <div className="flex gap-6 text-center text-white">
              <div>
                <div className="flex items-center justify-center space-x-1 mb-2">
                  <Users className="w-6 h-6 text-blue-300" />
                  <span className="text-3xl font-bold">{teacher.students}</span>
                </div>
                <p className="text-blue-100">طالب</p>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start">
            {teacher.achievements.map((achievement, index) => (
              <div
                key={index}
                className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium"
              >
                🏆 {achievement}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{tab.title}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    activeTab === tab.id ? "bg-white/20" : "bg-gray-200"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="min-h-96">
          {activeTab === "courses" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map(renderCourseCard)}
            </div>
          )}

          {activeTab === "sessions" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {sessions.map(renderSessionCard)}
            </div>
          )}

          {activeTab === "files" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {files.map(renderFileCard)}
            </div>
          )}

          {activeTab === "exams" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {exams.map(renderExamCard)}
            </div>
          )}

          {activeTab === "free" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {freeSessions.map(renderFreeSessionCard)}
            </div>
          )}
        </div>
      </div>

      {/* Activation Modal */}
      {showActivationModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                تفعيل الدورة
              </h3>
              <p className="text-gray-600">{selectedCourse.title}</p>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-700 font-medium">سعر الدورة:</span>
                <span className="text-2xl font-bold text-orange-600">
                  {selectedCourse.price} دينار
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <p>• {selectedCourse.lessons} درس تفاعلي</p>
                <p>• مدة الدورة: {selectedCourse.duration}</p>
                <p>• دعم فني مستمر</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  كود تفعيل البطاقة
                </label>
                <input
                  type="text"
                  value={activationCode}
                  onChange={(e) => setActivationCode(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300"
                  placeholder="أدخل كود التفعيل"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleActivationSubmit}
                  disabled={!activationCode.trim()}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  تفعيل الدورة
                </button>
                <button
                  onClick={() => {
                    setShowActivationModal(false);
                    setActivationCode("");
                  }}
                  className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherProfile;
