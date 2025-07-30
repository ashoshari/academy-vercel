import { useState, useEffect } from "react";
import {
  ArrowRight,
  Play,
  FileText,
  Monitor,
  CheckCircle,
  Lock,
  Clock,
  ChevronRight,
  ChevronDown,
  Download,
  MessageSquare,
  BarChart3,
  Menu,
  X,
  ChevronLeft,
  Award,
  Target,
  BookOpen,
  Users,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  ThumbsUp,
  CheckCircle2,
  StickyNote,
  FolderOpen,
  Reply,
  Trash2,
} from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";
import { useParams } from "react-router";

// interface Lesson {
//   id: number;
//   title: string;
//   type: "video" | "exam" | "file";
//   duration?: string;
//   videoUrl?: string;
//   isCompleted: boolean;
//   isLocked: boolean;
//   description?: string;
//   files?: Array<{
//     id: number;
//     name: string;
//     type: string;
//     size: string;
//     url: string;
//   }>;
// }

// interface Unit {
//   id: number;
//   title: string;
//   lessons: Lesson[];
//   isExpanded: boolean;
// }

// interface Chapter {
//   id: number;
//   title: string;
//   units: Unit[];
//   isExpanded: boolean;
// }

// interface Question {
//   id: number;
//   question: string;
//   options: string[];
//   correctAnswer: number;
//   explanation: string;
// }

// interface Exam {
//   id: number;
//   title: string;
//   duration: number; // in minutes
//   questions: Question[];
//   passingScore: number;
// }

// interface CourseFile {
//   id: number;
//   name: string;
//   type: string;
//   size: string;
//   uploadDate: string;
//   downloads: number;
//   description: string;
//   url: string;
// }

// interface Note {
//   id: number;
//   content: string;
//   timestamp: string;
//   lessonId?: number;
//   lessonTitle?: string;
// }

// interface Answer {
//   id: number;
//   content: string;
//   author: string;
//   timestamp: string;
//   likes: number;
//   dislikes: number;
//   isApproved: boolean;
//   isTeacherApproved: boolean;
// }

// interface CourseQuestion {
//   id: number;
//   title: string;
//   content: string;
//   author: string;
//   timestamp: string;
//   lessonId?: number;
//   lessonTitle?: string;
//   answers: Answer[];
//   isResolved: boolean;
// }

const CoursePageOld: React.FC = () => {
  const token = window.localStorage.getItem("accessToken");
  const { courseId } = useParams();
  const { data, isLoading } = useCustomQuery(
    `/training/students/course/${courseId}/`,
    ["courses"],
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const courseData = data?.data;
  // if (isLoading) {
  //   console.log("isLoading...");
  // } else {
  //   console.log(courseData);
  // }

  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const isExpanded = Object.keys(courseData?.semesters || {}).length > 0;

  const [chapters, setChapters] = useState<any[]>([]);

  useEffect(() => {
  if (courseData?.semesters) {
    const initialized = courseData.semesters.map((semester: any) => ({
      ...semester,
      isExpanded: false,
      units: semester.units?.map((unit: any) => ({
        ...unit,
        isExpanded: false,
      })) || [],
    }));
    setChapters(initialized);
  }
}, [courseData]);

  const [allLessons, setAllLessons] = useState<any>([]);
  const [activeTab, setActiveTab] = useState("content");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  // Course files state
  const [courseFiles, setCourseFiles] = useState<any>([]);

  // Notes state
  const [notes, setNotes] = useState<any>([]);
  const [newNote, setNewNote] = useState("");
  const [showAddNote, setShowAddNote] = useState(false);

  // Questions state
  const [courseQuestions, setCourseQuestions] = useState<any>([]);
  const [newQuestionTitle, setNewQuestionTitle] = useState("");
  const [newQuestionContent, setNewQuestionContent] = useState("");
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [newAnswer, setNewAnswer] = useState("");

  // Exam states
  const [isExamMode, setIsExamMode] = useState(false);
  const [currentExam, setCurrentExam] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<any>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examResults, setExamResults] = useState<any>(null);

  // Sample course data
  const courseContent = {
    id: 0,
    title: "دورة الرياضيات الشاملة - الجبر والهندسة",
    instructor: "أ. محمد الأحمد",
    description: "دورة شاملة تغطي جميع فروع الرياضيات للتوجيهي العلمي",
    totalLessons: 45,
    duration: "3 أشهر",
    rating: 4.9,
    students: 320,
  };

  // Sample exam data
  const sampleExam: any = {
    id: 1,
    title: "امتحان الوحدة الأولى - الجبر",
    duration: 30,
    passingScore: 70,
    questions: [
      {
        id: 1,
        question: "ما هو ناتج حل المعادلة: 2x + 5 = 13؟",
        options: ["x = 3", "x = 4", "x = 5", "x = 6"],
        correctAnswer: 1,
        explanation: "نطرح 5 من الطرفين: 2x = 8، ثم نقسم على 2: x = 4",
      },
      {
        id: 2,
        question: "أي من التالي يمثل معادلة خط مستقيم؟",
        options: ["y = x²", "y = 2x + 3", "y = √x", "y = 1/x"],
        correctAnswer: 1,
        explanation:
          "المعادلة y = 2x + 3 هي معادلة خط مستقيم بالصيغة y = mx + b",
      },
      {
        id: 3,
        question: "ما هو ناتج (x + 2)(x - 3)؟",
        options: ["x² - x - 6", "x² + x - 6", "x² - x + 6", "x² + x + 6"],
        correctAnswer: 0,
        explanation: "نضرب: x² - 3x + 2x - 6 = x² - x - 6",
      },
      {
        id: 4,
        question: "إذا كان f(x) = 2x + 1، فما قيمة f(3)؟",
        options: ["5", "6", "7", "8"],
        correctAnswer: 2,
        explanation: "نعوض x = 3: f(3) = 2(3) + 1 = 6 + 1 = 7",
      },
      {
        id: 5,
        question: "ما هو مجال الدالة f(x) = √(x - 2)؟",
        options: ["x ≥ 0", "x ≥ 2", "x ≤ 2", "جميع الأعداد الحقيقية"],
        correctAnswer: 1,
        explanation: "لكي يكون الجذر معرفاً، يجب أن يكون x - 2 ≥ 0، أي x ≥ 2",
      },
    ],
  };

  useEffect(() => {
    // Initialize course data
    const initialChapters = [
      {
        id: 1,
        title: "الفصل الأول - الجبر الأساسي",
        isExpanded: true,
        units: [
          {
            id: 1,
            title: "الوحدة الأولى - المعادلات الخطية",
            isExpanded: true,
            lessons: [
              {
                id: 1,
                title: "مقدمة في المعادلات الخطية",
                type: "video",
                duration: "15 دقيقة",
                videoUrl: "dQw4w9WgXcQ",
                isCompleted: false,
                isLocked: false,
                description: "تعلم أساسيات المعادلات الخطية وكيفية حلها",
                files: [
                  {
                    id: 1,
                    name: "ملخص الدرس.pdf",
                    type: "pdf",
                    size: "2.1 MB",
                    url: "#",
                  },
                  {
                    id: 2,
                    name: "أمثلة إضافية.doc",
                    type: "doc",
                    size: "1.5 MB",
                    url: "#",
                  },
                ],
              },
              {
                id: 2,
                title: "حل المعادلات بخطوة واحدة",
                type: "video",
                duration: "20 دقيقة",
                videoUrl: "dQw4w9WgXcQ",
                isCompleted: false,
                isLocked: true,
                description: "طرق حل المعادلات البسيطة",
                files: [
                  {
                    id: 3,
                    name: "تمارين الدرس.pdf",
                    type: "pdf",
                    size: "1.8 MB",
                    url: "#",
                  },
                ],
              },
              {
                id: 3,
                title: "امتحان الوحدة الأولى",
                type: "exam",
                duration: "30 دقيقة",
                isCompleted: false,
                isLocked: true,
                description: "اختبار شامل على المعادلات الخطية",
              },
            ],
          },
          {
            id: 2,
            title: "الوحدة الثانية - المعادلات التربيعية",
            isExpanded: false,
            lessons: [
              {
                id: 4,
                title: "مقدمة في المعادلات التربيعية",
                type: "video",
                duration: "18 دقيقة",
                videoUrl: "dQw4w9WgXcQ",
                isCompleted: false,
                isLocked: true,
                description: "فهم المعادلات التربيعية وخصائصها",
              },
              {
                id: 5,
                title: "طرق حل المعادلات التربيعية",
                type: "video",
                duration: "25 دقيقة",
                videoUrl: "dQw4w9WgXcQ",
                isCompleted: false,
                isLocked: true,
                description: "التحليل والقانون العام",
              },
            ],
          },
        ],
      },
      {
        id: 2,
        title: "الفصل الثاني - الهندسة التحليلية",
        isExpanded: false,
        units: [
          {
            id: 3,
            title: "الوحدة الأولى - النقاط والمستقيمات",
            isExpanded: false,
            lessons: [
              {
                id: 6,
                title: "النظام الإحداثي",
                type: "video",
                duration: "22 دقيقة",
                videoUrl: "dQw4w9WgXcQ",
                isCompleted: false,
                isLocked: true,
                description: "فهم النظام الإحداثي الديكارتي",
              },
            ],
          },
        ],
      },
    ];

    if (!courseData?.semesters) return;

    const hasSemesters = Object.keys(courseData.semesters).length > 0;

    const enrichedChapters = Object.values(courseData.semesters).map(
      (semester: any) => ({
        ...semester,
        isExpanded: hasSemesters,
        units:
          semester.units?.map((unit: any) => ({
            ...unit,
            isExpanded: hasSemesters,
          })) || [],
      })
    );

    // setChapters(enrichedChapters);
    // if (isLoading) {
    //   console.log("isLoading...");
    // } else {
    //   console.log("courseData:", chapters);
    // }

    // Flatten all lessons for easy navigation
    const lessons: any = [];
    courseData?.semesters?.forEach((lesson: any) => {
      lesson.units.forEach((lesson: any) => {
        console.log(lesson?.topics.map((topic: any) => topic.lessons));
        lessons.push(lesson?.topics.map((topic: any) => topic.lessons));
      });
    });
    setAllLessons(lessons);

    // Initialize course files
    const initialCourseFiles: any = [
      {
        id: 1,
        name: "دليل الدورة الشامل.pdf",
        type: "pdf",
        size: "5.2 MB",
        uploadDate: "2025-01-01",
        downloads: 1250,
        description:
          "دليل شامل يحتوي على جميع المواضيع والقوانين المهمة في الدورة",
        url: "#",
      },
      {
        id: 2,
        name: "جدول القوانين المهمة.pdf",
        type: "pdf",
        size: "1.8 MB",
        uploadDate: "2025-01-05",
        downloads: 980,
        description: "جدول مرجعي لجميع القوانين الرياضية المستخدمة في الدورة",
        url: "#",
      },
      {
        id: 3,
        name: "نماذج امتحانات سابقة.zip",
        type: "zip",
        size: "12.5 MB",
        uploadDate: "2025-01-10",
        downloads: 750,
        description: "مجموعة من نماذج الامتحانات للسنوات السابقة مع الحلول",
        url: "#",
      },
      {
        id: 4,
        name: "برنامج الآلة الحاسبة العلمية.exe",
        type: "exe",
        size: "8.3 MB",
        uploadDate: "2025-01-12",
        downloads: 420,
        description: "برنامج آلة حاسبة علمية متقدمة للمساعدة في حل المسائل",
        url: "#",
      },
    ];
    setCourseFiles(initialCourseFiles);

    // Initialize sample notes
    const initialNotes: any = [
      {
        id: 1,
        content:
          "تذكر: عند حل المعادلات الخطية، يجب دائماً التحقق من الحل بالتعويض",
        timestamp: "2025-01-15 14:30",
        lessonId: 1,
        lessonTitle: "مقدمة في المعادلات الخطية",
      },
      {
        id: 2,
        content:
          "ملاحظة مهمة: القوانين الأساسية للجبر ستحتاجها في جميع الوحدات القادمة",
        timestamp: "2025-01-16 10:15",
      },
    ];
    setNotes(initialNotes);

    // Initialize sample questions
    const initialQuestions: any = [
      {
        id: 1,
        title: "كيفية التعامل مع المعادلات المعقدة؟",
        content:
          "أواجه صعوبة في حل المعادلات التي تحتوي على كسور. هل يمكن توضيح الطريقة الصحيحة؟",
        author: "أحمد محمد",
        timestamp: "2025-01-14 16:20",
        lessonId: 1,
        lessonTitle: "مقدمة في المعادلات الخطية",
        isResolved: true,
        answers: [
          {
            id: 1,
            content:
              "الطريقة الأفضل هي ضرب جميع الحدود في المضاعف المشترك الأصغر للمقامات لإزالة الكسور أولاً",
            author: "سارة أحمد",
            timestamp: "2025-01-14 17:45",
            likes: 8,
            dislikes: 0,
            isApproved: true,
            isTeacherApproved: true,
          },
          {
            id: 2,
            content:
              "يمكنك أيضاً التعامل مع كل كسر على حدة، لكن الطريقة الأولى أسرع وأقل عرضة للأخطاء",
            author: "محمد علي",
            timestamp: "2025-01-14 18:10",
            likes: 5,
            dislikes: 1,
            isApproved: true,
            isTeacherApproved: false,
          },
        ],
      },
      {
        id: 2,
        title: "سؤال حول الامتحان القادم",
        content: "هل سيشمل الامتحان جميع أنواع المعادلات أم فقط الخطية؟",
        author: "فاطمة خالد",
        timestamp: "2025-01-16 09:30",
        isResolved: false,
        answers: [
          {
            id: 3,
            content:
              "حسب ما فهمت من الدرس، سيركز على المعادلات الخطية فقط في هذه الوحدة",
            author: "عمر حسن",
            timestamp: "2025-01-16 11:15",
            likes: 3,
            dislikes: 0,
            isApproved: true,
            isTeacherApproved: false,
          },
        ],
      },
    ];
    setCourseQuestions(initialQuestions);
  }, [courseData]);

  // Timer effect for exams
  useEffect(() => {
    let timer: any;
    if (isExamMode && timeRemaining > 0 && !examSubmitted) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleExamSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isExamMode, timeRemaining, examSubmitted]);

  const toggleChapter = (chapterId: any) => {
    setChapters((prev) =>
      prev.map((ch) =>
        ch.id === chapterId ? { ...ch, isExpanded: !ch.isExpanded } : ch
      )
    );
  };

  const toggleUnit = (chapterId: any, unitId: any) => {
    setChapters((prev) =>
      prev.map((ch) =>
        ch.id === chapterId
          ? {
              ...ch,
              units: ch.units.map((unit: any) =>
                unit.id === unitId
                  ? { ...unit, isExpanded: !unit.isExpanded }
                  : unit
              ),
            }
          : ch
      )
    );
  };

  const handleLessonClick = (lessonIndex: any) => {
    const lesson = allLessons[lessonIndex];
    if (!lesson.isLocked) {
      setCurrentLessonIndex(lessonIndex);
      if (lesson.type === "exam") {
        startExam();
      } else {
        setIsExamMode(false);
      }
    }
  };

  const markLessonComplete = () => {
    const updatedLessons = [...allLessons];
    updatedLessons[currentLessonIndex].isCompleted = true;

    // Unlock next lesson
    if (currentLessonIndex + 1 < updatedLessons.length) {
      updatedLessons[currentLessonIndex + 1].isLocked = false;
    }

    setAllLessons(updatedLessons);

    // Update chapters state
    setChapters((prev) =>
      prev.map((chapter) => ({
        ...chapter,
        units: chapter.units.map((unit: any) => ({
          ...unit,
          lessons: unit.lessons.map((lesson: any) => {
            const updatedLesson = updatedLessons.find(
              (l) => l.id === lesson.id
            );
            return updatedLesson || lesson;
          }),
        })),
      }))
    );
  };

  const navigateLesson = (direction: "prev" | "next") => {
    if (direction === "prev" && currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      setIsExamMode(false);
    } else if (
      direction === "next" &&
      currentLessonIndex < allLessons.length - 1
    ) {
      const nextLesson = allLessons[currentLessonIndex + 1];
      if (!nextLesson.isLocked) {
        setCurrentLessonIndex(currentLessonIndex + 1);
        if (nextLesson.type === "exam") {
          startExam();
        } else {
          setIsExamMode(false);
        }
      }
    }
  };

  const startExam = () => {
    setIsExamMode(true);
    setCurrentExam(sampleExam);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setTimeRemaining(sampleExam.duration * 60);
    setExamSubmitted(false);
    setExamResults(null);
  };

  const handleAnswerSelect = (questionId: any, answerIndex: any) => {
    setSelectedAnswers((prev: any) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const handleExamSubmit = () => {
    if (!currentExam) return;

    setExamSubmitted(true);

    let correctAnswers = 0;
    const answerDetails: any = {};

    currentExam.questions.forEach((question: any) => {
      const selectedAnswer = selectedAnswers[question.id];
      const isCorrect = selectedAnswer === question.correctAnswer;
      if (isCorrect) correctAnswers++;

      answerDetails[question.id] = {
        selected: selectedAnswer ?? -1,
        correct: question.correctAnswer,
      };
    });

    const score = Math.round(
      (correctAnswers / currentExam.questions.length) * 100
    );
    const passed = score >= currentExam.passingScore;

    setExamResults({
      score,
      passed,
      answers: answerDetails,
    });

    if (passed) {
      markLessonComplete();
    }
  };

  const retryExam = () => {
    startExam();
  };

  const exitExam = () => {
    setIsExamMode(false);
    setCurrentExam(null);
    setExamResults(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getProgressPercentage = () => {
    console.log(allLessons[0]);
    const completedLessons = allLessons.filter(
      (lesson: any) => lesson.isCompleted
    ).length;
    return Math.round((completedLessons / allLessons.length) * 100);
    // return progress_bar
  };

  // Notes functions
  const handleAddNote = () => {
    if (newNote.trim()) {
      const note: any = {
        id: Date.now(),
        content: newNote,
        timestamp: new Date().toLocaleString("ar-EG"),
        lessonId: allLessons[currentLessonIndex]?.id,
        lessonTitle: allLessons[currentLessonIndex]?.title,
      };
      setNotes((prev: any) => [note, ...prev]);
      setNewNote("");
      setShowAddNote(false);
    }
  };

  const handleDeleteNote = (noteId: any) => {
    setNotes((prev: any) => prev.filter((note: any) => note.id !== noteId));
  };

  // Questions functions
  const handleAddQuestion = () => {
    if (newQuestionTitle.trim() && newQuestionContent.trim()) {
      const question: any = {
        id: Date.now(),
        title: newQuestionTitle,
        content: newQuestionContent,
        author: "أنت", // In real app, this would be the current user
        timestamp: new Date().toLocaleString("ar-EG"),
        lessonId: allLessons[currentLessonIndex]?.id,
        lessonTitle: allLessons[currentLessonIndex]?.title,
        answers: [],
        isResolved: false,
      };
      setCourseQuestions((prev: any) => [question, ...prev]);
      setNewQuestionTitle("");
      setNewQuestionContent("");
      setShowAddQuestion(false);
    }
  };

  const handleAddAnswer = (questionId: any) => {
    if (newAnswer.trim()) {
      const answer: any = {
        id: Date.now(),
        content: newAnswer,
        author: "أنت", // In real app, this would be the current user
        timestamp: new Date().toLocaleString("ar-EG"),
        likes: 0,
        dislikes: 0,
        isApproved: true,
        isTeacherApproved: false,
      };

      setCourseQuestions((prev: any) =>
        prev.map((q: any) =>
          q.id === questionId ? { ...q, answers: [...q.answers, answer] } : q
        )
      );
      setNewAnswer("");
      setSelectedQuestion(null);
    }
  };

  const handleLikeAnswer = (questionId: number, answerId: number) => {
    setCourseQuestions((prev: any) =>
      prev.map((q: any) =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers.map((a: any) =>
                a.id === answerId ? { ...a, likes: a.likes + 1 } : a
              ),
            }
          : q
      )
    );
  };

  const handleApproveAnswer = (questionId: any, answerId: any) => {
    setCourseQuestions((prev: any) =>
      prev.map((q: any) =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers.map((a: any) =>
                a.id === answerId
                  ? { ...a, isTeacherApproved: !a.isTeacherApproved }
                  : a
              ),
              isResolved: true,
            }
          : q
      )
    );
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📝";
      case "ppt":
      case "pptx":
        return "📊";
      case "zip":
      case "rar":
        return "📦";
      case "exe":
        return "⚙️";
      case "mp4":
      case "avi":
        return "🎥";
      default:
        return "📁";
    }
  };

  const currentLesson = allLessons[currentLessonIndex];
  // console.log(currentLesson?.[0][0].link);
  // console.log(allLessons);

  const renderSidebar = () => (
    <div
      className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        sidebarCollapsed ? "w-16" : "w-80"
      } ${
        sidebarVisible ? "translate-x-0" : "-translate-x-full"
      } fixed left-0 top-[8vh] h-full z-40 overflow-y-auto`}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-sm line-clamp-2">
                {courseData?.name}
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                {courseData?.teacher?.name}
              </p>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors duration-200"
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => setSidebarVisible(false)}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors duration-200 md:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!sidebarCollapsed && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
              <span>التقدم</span>
              <span>{courseData?.progress_bar}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${courseData?.progress_bar}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className="p-2">
        {chapters.map((semester: any) => (
          <div key={semester?.id} className="mb-2">
            <button
              onClick={() => !sidebarCollapsed && toggleChapter(semester.id)}
              className={`w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 ${
                sidebarCollapsed ? "justify-center" : ""
              }`}
            >
              {!sidebarCollapsed && (
                <>
              <span className="font-semibold text-gray-900 text-sm text-right flex-1">
                {semester?.title}
              </span>
                  {semester?.units?.length > 0 ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </>
              )}
              {sidebarCollapsed && (
                <BookOpen className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {semester?.units?.length > 0 && !sidebarCollapsed && (
              <div className="ml-4 mt-2 space-y-1">
                {chapters.map((chapter) => (
                  <div key={chapter.id}>
                    <button onClick={() => toggleChapter(chapter.id)}>
                    </button>

                    {chapter.isExpanded && (
                      <div className="units">
                        {chapter.units.map((unit: any) => (
                          <div key={unit.id}>
                            <button
                              onClick={() => toggleUnit(chapter.id, unit.id)}
                            >
                              {unit.title}
                            </button>

                            {unit.isExpanded && (
                              <div className="lessons">
                                {unit.lessons?.map((lesson: any) => (
                                  <div key={lesson.id}>{lesson.title}</div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderVideoPlayer = () => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="aspect-video bg-black rounded-t-2xl overflow-hidden">
        <iframe
          width="100%"
          height="100%"
          src={currentLesson?.[0][0].link}
          title={currentLesson?.[0][0].title}
          frameBorder="0"
          allow="accelerometer clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentLesson?.[0][0].title}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {currentLesson?.[0][0].description}
            </p>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{currentLesson?.[0][0].time_in_minutes} دقيقة</span>
            </div>
          </div>
        </div>

        {/* Lesson Files */}
        {currentLesson.files && currentLesson.files.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              ملفات الدرس
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentLesson.files.map((file: any) => (
                <div
                  key={file.id}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                >
                  <FileText className="w-5 h-5 text-blue-500" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">
                      {file.name}
                    </div>
                    <div className="text-xs text-gray-500">{file.size}</div>
                  </div>
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mark Complete Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={markLessonComplete}
            disabled={currentLesson.isCompleted}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
              currentLesson.isCompleted
                ? "bg-green-100 text-green-800 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transform hover:scale-105"
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            <span>
              {currentLesson.isCompleted ? "مكتمل" : "وضع علامة مكتمل"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderFileContent = () => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentLesson.title}
                </h2>
                <p className="text-gray-600">{currentLesson.description}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{currentLesson.duration}</span>
            </div>
          </div>
        </div>

        {/* Lesson Files */}
        {currentLesson.files && currentLesson.files.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              ملفات الدرس
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentLesson.files.map((file: any) => (
                <div
                  key={file.id}
                  className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 border border-gray-200"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{file.name}</div>
                    <div className="text-sm text-gray-500">
                      {file.type.toUpperCase()} • {file.size}
                    </div>
                  </div>
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="mb-8 p-6 bg-gray-50 rounded-xl">
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              محتوى الدرس
            </h3>
            <p className="text-gray-500 mb-4">
              قم بتحميل الملفات المرفقة لمراجعة محتوى الدرس
            </p>
          </div>
        </div>

        {/* Mark Complete Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={markLessonComplete}
            disabled={currentLesson.isCompleted}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
              currentLesson.isCompleted
                ? "bg-green-100 text-green-800 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transform hover:scale-105"
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            <span>
              {currentLesson.isCompleted ? "مكتمل" : "وضع علامة مكتمل"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderExam = () => {
    if (!currentExam) return null;

    if (examResults) {
      return (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                examResults.passed ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {examResults.passed ? (
                <Award className="w-10 h-10 text-green-600" />
              ) : (
                <Target className="w-10 h-10 text-red-600" />
              )}
            </div>
            <h2 className="text-3xl font-bold mb-2">
              {examResults.passed ? "🎉 تهانينا!" : "😔 لم تنجح هذه المرة"}
            </h2>
            <p className="text-xl text-gray-600 mb-4">
              درجتك:{" "}
              <span
                className={`font-bold ${
                  examResults.passed ? "text-green-600" : "text-red-600"
                }`}
              >
                {examResults.score}%
              </span>
            </p>
            <p className="text-gray-600">
              {examResults.passed
                ? `أحسنت! لقد تجاوزت الحد الأدنى للنجاح (${currentExam.passingScore}%)`
                : `تحتاج إلى ${currentExam.passingScore}% للنجاح`}
            </p>
          </div>

          {/* Detailed Results */}
          <div className="space-y-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900">مراجعة الإجابات</h3>
            {currentExam.questions.map((question: any, index: any) => {
              const userAnswer = examResults.answers[question.id];
              const isCorrect = userAnswer.selected === userAnswer.correct;

              return (
                <div
                  key={question.id}
                  className={`p-6 rounded-xl border-2 ${
                    isCorrect
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex items-start space-x-3 mb-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        isCorrect ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        {question.question}
                      </h4>
                      <div className="space-y-2">
                        {question.options.map(
                          (option: any, optionIndex: any) => (
                            <div
                              key={optionIndex}
                              className={`p-3 rounded-lg border ${
                                optionIndex === userAnswer.correct
                                  ? "border-green-500 bg-green-100 text-green-800"
                                  : optionIndex === userAnswer.selected &&
                                    !isCorrect
                                  ? "border-red-500 bg-red-100 text-red-800"
                                  : "border-gray-200 bg-white"
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                {optionIndex === userAnswer.correct && (
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                )}
                                {optionIndex === userAnswer.selected &&
                                  !isCorrect && (
                                    <X className="w-5 h-5 text-red-600" />
                                  )}
                                <span>{option}</span>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <h5 className="font-semibold text-blue-900 mb-2">
                          الشرح:
                        </h5>
                        <p className="text-blue-800">{question.explanation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center space-x-4">
            {!examResults.passed && (
              <button
                onClick={retryExam}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
              >
                إعادة المحاولة
              </button>
            )}
            <button
              onClick={exitExam}
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
            >
              {examResults.passed ? "متابعة" : "الخروج"}
            </button>
          </div>
        </div>
      );
    }

    const currentQuestion = currentExam.questions[currentQuestionIndex];
    const progress =
      ((currentQuestionIndex + 1) / currentExam.questions.length) * 100;

    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {/* Exam Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {currentExam.title}
            </h2>
            <p className="text-gray-600">
              السؤال {currentQuestionIndex + 1} من{" "}
              {currentExam.questions.length}
            </p>
          </div>
          <div className="text-center">
            <div
              className={`text-3xl font-bold mb-2 ${
                timeRemaining < 300 ? "text-red-600" : "text-blue-600"
              }`}
            >
              {formatTime(timeRemaining)}
            </div>
            <div className="text-sm text-gray-500">الوقت المتبقي</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>التقدم</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            {currentQuestion.question}
          </h3>
          <div className="space-y-3">
            {currentQuestion.options.map((option: any, index: any) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                className={`w-full p-4 text-right rounded-xl border-2 transition-all duration-200 ${
                  selectedAnswers[currentQuestion.id] === index
                    ? "border-blue-500 bg-blue-50 text-blue-900"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswers[currentQuestion.id] === index
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedAnswers[currentQuestion.id] === index && (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="flex-1 font-medium">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() =>
              setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
            }
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <ChevronRight className="w-5 h-5" />
            <span>السابق</span>
          </button>

          <div className="text-center">
            <div className="text-sm text-gray-600 mb-2">
              تم الإجابة على {Object.keys(selectedAnswers).length} من{" "}
              {currentExam.questions.length} أسئلة
            </div>
          </div>

          {currentQuestionIndex === currentExam.questions.length - 1 ? (
            <button
              onClick={handleExamSubmit}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <CheckCircle className="w-5 h-5" />
              <span>تسليم الامتحان</span>
            </button>
          ) : (
            <button
              onClick={() =>
                setCurrentQuestionIndex(
                  Math.min(
                    currentExam.questions.length - 1,
                    currentQuestionIndex + 1
                  )
                )
              }
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center space-x-2"
            >
              <span>التالي</span>
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderProgressTab = () => (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">تقدمك في الدورة</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <BarChart3 className="w-8 h-8" />
            <div>
              <div className="text-3xl font-bold">
                {getProgressPercentage()}%
              </div>
              <div className="text-blue-100">نسبة الإكمال</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="w-8 h-8" />
            <div>
              <div className="text-3xl font-bold">
                {allLessons.filter((l: any) => l.isCompleted).length}
              </div>
              <div className="text-green-100">دروس مكتملة</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <Target className="w-8 h-8" />
            <div>
              <div className="text-3xl font-bold">
                {allLessons.length -
                  allLessons.filter((l: any) => l.isCompleted).length}
              </div>
              <div className="text-orange-100">دروس متبقية</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">تفاصيل التقدم</h3>
        {chapters.map((chapter) => (
          <div
            key={chapter.id}
            className="border border-gray-200 rounded-xl p-4"
          >
            <h4 className="font-semibold text-gray-900 mb-3">
              {chapter.title}
            </h4>
            {chapter.units.map((unit: any) => {
              const unitLessons = unit?.lessons;
              const completedInUnit = unitLessons?.filter(
                (l: any) => l.isCompleted
              ).length;
              const unitProgress =
                (completedInUnit / unitLessons?.length) * 100;

              return (
                <div key={unit.id} className="mb-4 last:mb-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 font-medium">
                      {unit.title}
                    </span>
                    <span className="text-sm text-gray-500">
                      {completedInUnit}/{unitLessons?.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${unitProgress}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  const renderFilesTab = () => (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">ملفات الدورة</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <FolderOpen className="w-4 h-4" />
          <span>{courseFiles.length} ملف</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courseFiles.map((file: any) => (
          <div
            key={file.id}
            className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex items-start space-x-4 mb-4">
              <div className="text-4xl">{getFileIcon(file.type)}</div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                  {file.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {file.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{file.size}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Download className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{file.downloads} تحميل</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{file.uploadDate}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">{file.type.toUpperCase()}</span>
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center space-x-2">
              <Download className="w-5 h-5" />
              <span>تحميل الملف</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNotesTab = () => (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">ملاحظاتي</h2>
        <button
          onClick={() => setShowAddNote(true)}
          className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-xl font-semibold hover:from-green-600 hover:to-teal-600 transition-all duration-300 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة ملاحظة</span>
        </button>
      </div>

      {/* Add Note Form */}
      {showAddNote && (
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            إضافة ملاحظة جديدة
          </h3>
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="اكتب ملاحظتك هنا..."
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all duration-300 resize-none"
            rows={4}
          />
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
              {currentLesson && (
                <span>سيتم ربط الملاحظة بالدرس: {currentLesson.title}</span>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-2 rounded-xl font-semibold hover:from-green-600 hover:to-teal-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                حفظ
              </button>
              <button
                onClick={() => {
                  setShowAddNote(false);
                  setNewNote("");
                }}
                className="border border-gray-300 text-gray-700 px-6 py-2 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes List */}
      <div className="space-y-4">
        {notes.length === 0 ? (
          <div className="text-center py-12">
            <StickyNote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">لا توجد ملاحظات بعد</p>
          </div>
        ) : (
          notes.map((note: any) => (
            <div
              key={note.id}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-gray-900 leading-relaxed mb-3">
                    {note.content}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{note.timestamp}</span>
                    </div>
                    {note.lessonTitle && (
                      <div className="flex items-center space-x-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{note.lessonTitle}</span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderQuestionsTab = () => (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">الأسئلة والمناقشات</h2>
        <button
          onClick={() => setShowAddQuestion(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>اطرح سؤالاً</span>
        </button>
      </div>

      {/* Add Question Form */}
      {showAddQuestion && (
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">طرح سؤال جديد</h3>
          <div className="space-y-4">
            <input
              type="text"
              value={newQuestionTitle}
              onChange={(e) => setNewQuestionTitle(e.target.value)}
              placeholder="عنوان السؤال"
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300"
            />
            <textarea
              value={newQuestionContent}
              onChange={(e) => setNewQuestionContent(e.target.value)}
              placeholder="تفاصيل السؤال..."
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 resize-none"
              rows={4}
            />
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
              {currentLesson && (
                <span>سيتم ربط السؤال بالدرس: {currentLesson.title}</span>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleAddQuestion}
                disabled={
                  !newQuestionTitle.trim() || !newQuestionContent.trim()
                }
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                نشر السؤال
              </button>
              <button
                onClick={() => {
                  setShowAddQuestion(false);
                  setNewQuestionTitle("");
                  setNewQuestionContent("");
                }}
                className="border border-gray-300 text-gray-700 px-6 py-2 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-6">
        {courseQuestions.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">لا توجد أسئلة بعد</p>
          </div>
        ) : (
          courseQuestions.map((question: any) => (
            <div
              key={question.id}
              className="border border-gray-200 rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {question.title}
                    </h3>
                    {question.isResolved && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        محلول
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-3">{question.content}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>بواسطة: {question.author}</span>
                    <span>{question.timestamp}</span>
                    {question.lessonTitle && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg">
                        {question.lessonTitle}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Answers */}
              <div className="space-y-4 mb-4">
                {question.answers.map((answer: any) => (
                  <div
                    key={answer.id}
                    className={`p-4 rounded-xl border ${
                      answer.isTeacherApproved
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="text-gray-900 mb-2">{answer.content}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>بواسطة: {answer.author}</span>
                          <span>{answer.timestamp}</span>
                          {answer.isTeacherApproved && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>معتمد من الأستاذ</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleLikeAnswer(question.id, answer.id)}
                        className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{answer.likes}</span>
                      </button>
                      <button
                        onClick={() =>
                          handleApproveAnswer(question.id, answer.id)
                        }
                        className={`flex items-center space-x-1 transition-colors duration-200 ${
                          answer.isTeacherApproved
                            ? "text-green-600 hover:text-green-700"
                            : "text-gray-600 hover:text-green-600"
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>
                          {answer.isTeacherApproved ? "معتمد" : "اعتماد"}
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Answer */}
              <div className="border-t border-gray-200 pt-4">
                {selectedQuestion?.id === question.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={newAnswer}
                      onChange={(e) => setNewAnswer(e.target.value)}
                      placeholder="اكتب إجابتك..."
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 resize-none"
                      rows={3}
                    />
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleAddAnswer(question.id)}
                        disabled={!newAnswer.trim()}
                        className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-xl font-semibold hover:from-green-600 hover:to-teal-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        إرسال الإجابة
                      </button>
                      <button
                        onClick={() => {
                          setSelectedQuestion(null);
                          setNewAnswer("");
                        }}
                        className="border border-gray-300 text-gray-700 px-4 py-2 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedQuestion(question)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors duration-200"
                  >
                    <Reply className="w-4 h-4" />
                    <span>إضافة إجابة</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // Early return if currentLesson is not available
  if (!currentLesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الدورة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Mobile Sidebar Overlay */}
      {sidebarVisible && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarVisible(false)}
        />
      )}

      {/* Sidebar */}
      {renderSidebar()}

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarVisible ? (sidebarCollapsed ? "md:ml-16" : "md:ml-80") : "ml-0"
        }`}
      >
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => window.history.back()}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors duration-200"
                >
                  <ArrowRight className="w-5 h-5 text-gray-600" />
                </button>

                <button
                  onClick={() => setSidebarVisible(!sidebarVisible)}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors duration-200"
                >
                  <Menu className="w-5 h-5 text-gray-600" />
                </button>

                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {courseData?.name}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {courseData?.teacher.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>
                      {courseData?.total_number_of_enrolled_students} طالب
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {[
              { id: "content", title: "المحتوى", icon: Play },
              { id: "progress", title: "التقدم", icon: BarChart3 },
              { id: "files", title: "ملفات الدورة", icon: FolderOpen },
              { id: "notes", title: "الملاحظات", icon: StickyNote },
              { id: "questions", title: "الأسئلة", icon: MessageSquare },
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.title}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          {activeTab === "content" && (
            <div className="space-y-8">
              {/* Main Content */}
              {isExamMode ? (
                renderExam()
              ) : currentLesson?.[0][0].link ? (
                renderVideoPlayer()
              ) : currentLesson.type === "file" ? (
                renderFileContent()
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                  <p className="text-gray-500">نوع الدرس غير مدعوم</p>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg p-6">
                <button
                  onClick={() => navigateLesson("prev")}
                  disabled={currentLessonIndex === 0}
                  className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                  <span>الدرس السابق</span>
                </button>

                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">
                    الدرس {currentLessonIndex + 1} من {allLessons.length}
                  </div>
                  <div className="w-48 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          ((currentLessonIndex + 1) / allLessons.length) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <button
                  onClick={() => navigateLesson("next")}
                  disabled={
                    currentLessonIndex === allLessons.length - 1 ||
                    allLessons[currentLessonIndex + 1]?.isLocked
                  }
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>الدرس التالي</span>
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {activeTab === "progress" && renderProgressTab()}
          {activeTab === "files" && renderFilesTab()}
          {activeTab === "notes" && renderNotesTab()}
          {activeTab === "questions" && renderQuestionsTab()}
        </div>
      </div>
    </div>
  );
};

export default CoursePageOld;
