import { useState } from "react";
import {
  Users,
  BookOpen,
  Monitor,
  Clock,
  Play,
  CheckCircle,
  CreditCard,
  Lock,
  Timer,
  Target,
  TrendingUp,
  Smile,
  Zap,
  File,
  ArrowRight,
  FileText,
  Download,
  FileArchive,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useCustomQuery } from "@/hooks/useQuery";
import useTokenStore from "@/store/platform/useToken";
import errorIllustation from "@/assets/illustration/Error_illustration.svg";
import AuthModal from "@/layout/platform/navbar/authModal";
import { toast } from "react-hot-toast";
import { formatDateTimeSimple } from "@/utils/formatDateTime";
import { useCustomPost } from "@/hooks/useMutation";

const TeacherProfile: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = useTokenStore((state) => state.isLoggedIn);
  const [activeTab, setActiveTab] = useState("free_courses");
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [activationCode, setActivationCode] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Get Teacher
  const { data, isLoading } = useCustomQuery(
    "/training/students/teacher/0bc3c31f-f4c8-4cc9-8e6e-006707650544/",
    ["teachers"]
  );
  // Handle Download
  const { mutateAsync: downloadFiles } = useCustomPost(
    "/training/students/resources-download/",
    ["downloadFiles"]
  );
  const handleDownload = async (resourceId: any) => {
    try {
      await downloadFiles({
        resource_id: resourceId,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleLogin = () => {
    setShowAuthModal(false);
  };
  const handleLoginClick = () => {
    setShowAuthModal(true);
  };
  const teacherData = data?.data;
  const freeCoursesData = data?.data?.free_courses;
  const coursesData = data?.data?.courses;
  const filesData = data?.data?.resources;
  const freeExamsData = data?.data?.free_exams;

  const isMoblieOrTablet = /Mobi|Android|iPhone|iPad|iPod|Tablet/i.test(
    navigator.userAgent
  );

  const tabs = [
    {
      id: "free_courses",
      title: "الدورات المجانية",
      icon: BookOpen,
      count: coursesData?.length,
    },
    // { id: "sessions", title: "الحصص", icon: Video, count: sessions.length },
    {
      id: "courses",
      title: "الدورات المدفوعة",
      icon: BookOpen,
      count: freeCoursesData?.length,
    },
    {
      id: "files",
      title: "الملفات",
      icon: File,
      count: filesData?.length || 0,
    },
    {
      id: "free_exams",
      title: "الامتحانات المجانية",
      icon: Monitor,
      count: freeExamsData?.length,
    },
    // { id: "free", title: "حصص مجانية", icon: Gift, count: freeSessions.length },
  ];

  const handleCourseActivation = (course: any) => {
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
  const handleCourseClick = (course: any) => {
    if (course?.is_enrolled || course?.is_free) {
      if (!isMoblieOrTablet) {
        if (isLoggedIn) {
          navigate(`/coursePage/${course?.id}`);
        } else {
          toast.error("لعرض المحتوى قم بتسجيل الدخول");
          handleLoginClick();
        }
      } else {
        navigate(`/phone-user`);
      }
    } else {
      handleCourseActivation(course);
    }
  };
  const handleExamsClick = (exam: any) => {
    if (isLoggedIn) {
      navigate(`/exam/${exam?.id}`);
    } else {
      toast.error("لعرض المحتوى قم بتسجيل الدخول");
      handleLoginClick();
    }
  };

  // const getFileIcon = (type: string) => {
  //   switch (type) {
  //     case "pdf":
  //       return "📄";
  //     case "doc":
  //       return "📝";
  //     case "ppt":
  //       return "📊";
  //     case "video":
  //       return "🎥";
  //     default:
  //       return "📁";
  //   }
  // };

  // const getDifficultyColor = (difficulty: string) => {
  //   switch (difficulty) {
  //     case "easy":
  //       return "bg-green-100 text-green-800";
  //     case "medium":
  //       return "bg-yellow-100 text-yellow-800";
  //     case "hard":
  //       return "bg-red-100 text-red-800";
  //     default:
  //       return "bg-gray-100 text-gray-800";
  //   }
  // };

  // const getDifficultyText = (difficulty: string) => {
  //   switch (difficulty) {
  //     case "easy":
  //       return "سهل";
  //     case "medium":
  //       return "متوسط";
  //     case "hard":
  //       return "صعب";
  //     default:
  //       return "غير محدد";
  //   }
  // };

  const renderFreeCourseCard = (course: any) => (
    <div
      key={course?.id}
      className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
    >
      <div className="relative">
        <img
          src={
            course?.image ||
            "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1200"
          }
          alt={course?.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
            <Smile className="w-4 h-4" />
            <span>مجانا</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col p-6">
        <div className="flex flex-col space-between mb-4 h-[100px]">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {course?.name}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            {course?.level?.name && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg">
                {course?.level?.name}
              </span>
            )}
            {course?.subsection?.title && (
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-lg">
                {course?.subsection?.title}
              </span>
            )}
            {course?.material?.name && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-lg">
                {course?.material?.name}
              </span>
            )}
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {course?.short_description}
        </p>
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{course?.time_in_hours} ساعة</span>
          </div>
          <div className="flex items-center space-x-2">
            <Play className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">
              {course?.total_number_of_lessons} درس
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">
              {course?.total_number_of_enrolled_students} طالب
            </span>
          </div>
        </div>

        <button
          onClick={() => handleCourseClick(course)}
          className="w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transform hover:scale-105"
        >
          <Play className="w-5 h-5" />
          <span>دخول الدورة</span>
        </button>
      </div>
    </div>
  );
  const renderCourseCard = (course: any) => (
    <div
      key={course?.id}
      className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
    >
      <div className="relative">
        <img
          src={
            course?.image ||
            "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1200"
          }
          alt={course?.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          {course?.is_enrolled ? (
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
          {course?.price} دينار
        </div>
      </div>

      <div className="flex flex-col p-6">
        <div className="flex flex-col space-between mb-4 h-[100px]">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {course?.name}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            {course?.level?.name && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg">
                {course?.level?.name}
              </span>
            )}
            {course?.subsection?.title && (
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-lg">
                {course?.subsection?.title}
              </span>
            )}
            {course?.material?.name && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-lg">
                {course?.material?.name}
              </span>
            )}
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {course?.short_description}
        </p>
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{course?.time_in_hours} ساعة</span>
          </div>
          <div className="flex items-center space-x-2">
            <Play className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">
              {course?.total_number_of_lessons} درس
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">
              {course?.total_number_of_enrolled_students} طالب
            </span>
          </div>
        </div>

        <button
          onClick={() => handleCourseClick(course)}
          className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
            course?.is_enrolled
              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transform hover:scale-105"
              : "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 transform hover:scale-105"
          }`}
        >
          {course?.is_enrolled ? (
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
  const renderFileCard = (file: any) => (
    <div
      key={file.id}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 group"
    >
      <div className="flex items-center space-x-4 mb-4">
        <File className="w-12 h-12 text-gray-500" />
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">
            {file?.title || "عنوان"}
          </h3>
          <p className="text-gray-600 text-sm">{file?.description || "وصف"}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">
            {(file?.file_size / 1024).toFixed(1) || 0} MB
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Download className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">{file?.downloads || 0} تحميل</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">
            {formatDateTimeSimple(file?.created_at) || "date"}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <FileArchive className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">{file?.file_type || "File"}</span>
        </div>
      </div>

      <div className="flex w-full items-center justify-start">
        <a
          href={file?.file}
          target="_blank"
          onClick={() => handleDownload(file?.id)}
          download
          className="bg-gradient-to-r w-full justify-center from-green-500 to-teal-500 text-white px-6 py-2 rounded-xl font-semibold hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform group-hover:scale-105 flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <p className="">تحميل</p>
        </a>
      </div>
    </div>
  );

  const renderExamCard = (exam: any) => (
    <div
      key={exam?.id}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {exam?.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3">{exam?.description}</p>
        </div>
        <div className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {exam?.type?.name}
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mb-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{exam?.material?.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Timer className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{exam?.time_in_minutes} دقيقة</span>
          </div>
          <div className="flex items-center space-x-2">
            <Monitor className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">
              {exam?.number_of_questions} سؤال
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">
              {(exam?.passing_marks / exam?.total_marks) * 100}% للنجاح
            </span>
          </div>
        </div>
      </div>

      {/* number of tries and price */}
      {/* <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Eye className="w-4 h-4" />
          <span>{exam.attempts} محاولة</span>
        </div>
        <span className="text-xl font-bold text-purple-600">
          {exam.price} دينار
        </span>
      </div> */}

      <button
        onClick={() => handleExamsClick(exam)}
        className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center space-x-2"
      >
        <Zap className="w-5 h-5" />
        <span>ابدأ الامتحان</span>
      </button>
    </div>
  );

  return (
    <section>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => window.history.length > 1 ? navigate(-1) : navigate("/")}
                className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all duration-200 group"
              >
                <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>

            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
              <div className="relative">
                <img
                  src={
                    teacherData?.image ||
                    "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  }
                  alt={teacherData?.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>

              <div className="flex-1 text-center md:text-right text-white">
                <h1 className="text-4xl font-bold mb-2">{teacherData?.name}</h1>
                {teacherData?.materials?.map(
                  (material: any, index: number, array: []) => (
                    <p key={index} className="text-xl text-blue-100 mb-4">
                      {material.name}
                      {index + 1 !== array.length && " ، "}
                    </p>
                  )
                )}

                <p className="text-blue-100 leading-relaxed max-w-2xl">
                  {teacherData?.about_me}
                </p>
              </div>

              <div className="flex gap-6 text-center text-white">
                <div>
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    <Users className="w-6 h-6 text-blue-300" />
                    <span className="text-3xl font-bold">
                      {teacherData?.total_enrolled_students}
                    </span>
                  </div>
                  <p className="text-blue-100">طالب</p>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start">
              {teacherData?.tags.map((tag: any, index: number) => (
                <div
                  key={index}
                  className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium"
                >
                  🏆 {tag.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-between space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
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
            {activeTab === "free_courses" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {!isLoading && freeCoursesData?.length > 0 ? (
                  freeCoursesData?.map(renderFreeCourseCard)
                ) : (
                  <div className="col-span-3 relative flex flex-col items-center">
                    <img
                      className="absolute top-0 w-[400px] h-[350px] z-0"
                      src={errorIllustation}
                      alt="error"
                    />
                    <h1 className="pt-[80px] absolute text-[2rem] top-[200px] z-[1]">
                      لا يوجد محتوى لعرضه
                    </h1>
                  </div>
                )}
              </div>
            )}

            {activeTab === "courses" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {!isLoading && coursesData?.length > 0 ? (
                  coursesData?.map(renderCourseCard)
                ) : (
                  <div className="col-span-3 relative flex flex-col items-center">
                    <img
                      className="absolute top-0 w-[400px] h-[350px] z-0"
                      src={errorIllustation}
                      alt="error"
                    />
                    <h1 className="pt-[80px] absolute text-[2rem] top-[200px] z-[1]">
                      لا يوجد محتوى لعرضه
                    </h1>
                  </div>
                )}
              </div>
            )}

            {activeTab === "files" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {!isLoading && filesData?.length > 0 ? (
                  filesData?.map(renderFileCard)
                ) : (
                  <div className="col-span-3 relative flex flex-col items-center">
                    <img
                      className="absolute top-0 w-[400px] h-[350px] z-0"
                      src={errorIllustation}
                      alt="error"
                    />
                    <h1 className="pt-[80px] absolute text-[2rem] top-[200px] z-[1]">
                      لا يوجد محتوى لعرضه
                    </h1>
                  </div>
                )}
              </div>
            )}

            {activeTab === "free_exams" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {!isLoading && freeExamsData?.length > 0 ? (
                  freeExamsData?.map(renderExamCard)
                ) : (
                  <div className="col-span-3 relative flex flex-col items-center">
                    <img
                      className="absolute top-0 w-[400px] h-[350px] z-0"
                      src={errorIllustation}
                      alt="error"
                    />
                    <h1 className="pt-[50px] absolute text-[2rem] top-[200px] z-[1]">
                      لا يوجد محتوى لعرضه
                    </h1>
                  </div>
                )}
              </div>
            )}

            {/* {activeTab === "sessions" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {sessions.map(renderSessionCard)}
            </div>
          )} */}
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
                <p className="text-gray-600">{selectedCourse?.title}</p>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-700 font-medium">سعر الدورة:</span>
                  <span className="text-2xl font-bold text-orange-600">
                    {selectedCourse?.price} دينار
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>• {selectedCourse?.lessons} درس تفاعلي</p>
                  <p>• مدة الدورة: {selectedCourse?.duration}</p>
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
    </section>
  );
};

export default TeacherProfile;
