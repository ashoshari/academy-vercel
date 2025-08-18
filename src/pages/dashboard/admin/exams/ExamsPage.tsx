/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  // Trash2,
  Eye,
  EyeOff,
  ArrowLeft,
  BookOpen,
  Users,
  Clock,
  Award,
  CheckCircle,
  FileText,
  Download,
  BarChart3,
  Hash,
  Save,
  // Play,
  // Pause,
} from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";
import { useCustomPost, useCustomUpdate } from "@/hooks/useMutation";
import toast from "react-hot-toast";
import handleErrorAlerts from "@/utils/showErrorMessages";
import ExamQuestionsPage from "./questions/QuestionsPage";

export interface Exam {
  id: number;
  title: string;
  description: string;
  material: string;
  level: string;
  time_in_minutes: number; // in minutes
  number_of_questions: number;
  total_marks: number;
  passing_marks: number;
  is_published: boolean;
  is_free: boolean;
  teacher: string;
  price?: number;
  type: string;
  enable_countdown: boolean;
  show_correct_answers: boolean;
  shuffle_questions: boolean;
  shuffle_answers: boolean;
}

export interface Question {
  id: number;
  examId: number;
  type:
    | "multiple_choice"
    | "true_false"
    | "short_answer"
    | "essay"
    | "fill_blank";
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  marks: number;
  order: number;
  level: string;
  tags: string[];
  image?: string;
  enable_countdown?: number;
}

export interface QuestionType {
  type: Question["type"];
  count: number;
  marksPerQuestion: number;
}

export interface ExamAttempt {
  id: number;
  examId: number;
  studentId: number;
  studentName: string;
  startTime: string;
  endTime?: string;
  duration: number; // actual time taken in minutes
  score: number;
  percentage: number;
  status: "in_progress" | "completed" | "abandoned" | "expired";
  answers: StudentAnswer[];
  submittedAt?: string;
}

export interface StudentAnswer {
  questionId: number;
  answer: string | string[];
  isCorrect: boolean;
  marksAwarded: number;
  timeSpent: number; // in seconds
}

export interface ExamStatistics {
  totalAttempts: number;
  completedAttempts: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  averageTime: number;
  passRate: number;
  questionStats: QuestionStatistics[];
}

export interface QuestionStatistics {
  questionId: number;
  correctAnswers: number;
  incorrectAnswers: number;
  averageTime: number;
  difficultyRating: number;
}

const ExamsPage = () => {
  const [currentView, setCurrentView] = useState<
    "list" | "create" | "edit" | "questions" | "results"
  >("list");
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  //   const [searchTerm, setSearchTerm] = useState("");
  //   const [subjectFilter, setSubjectFilter] = useState<string>("");
  //   const [difficultyFilter, setDifficultyFilter] = useState<
  //     "all" | "easy" | "medium" | "hard"
  //   >("all");
  //   const [typeFilter, setTypeFilter] = useState<
  //     "all" | "practice" | "assessment" | "final" | "quiz"
  //   >("all");
  //   const [statusFilter, setStatusFilter] = useState<
  //     "all" | "published" | "draft" | "active" | "inactive"
  //   >("all");
  //   const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const [newExam, setNewExam] = useState<Partial<Exam>>({
    title: "",
    description: "",
    material: "",
    level: "",
    time_in_minutes: 60,
    number_of_questions: 10,
    total_marks: 50,
    passing_marks: 30,
    is_published: true,
    is_free: true,
    teacher: "",
    type: "",
    enable_countdown: false,
    show_correct_answers: false,
    shuffle_questions: false,
    shuffle_answers: false,
  });

  const dataStatistcs = useCustomQuery("training/admin/exams-statistics/", [
    "exams-statistics",
  ]);

  const data = useCustomQuery("training/admin/exams/", ["exams"]);
  const materials = useCustomQuery("core/materials/", ["materials"]);
  const levels = useCustomQuery("core/exam-levels/", ["levels"]);
  const types = useCustomQuery("/core/exam-types/", ["exam-types"]);
  const teachers = useCustomQuery("account/admin/teachers/", ["teachers"]);
  console.log(data?.data?.data);
  const addExam = useCustomPost("training/admin/exams/", [
    "exams",
    "exams-statistics",
  ]);

  const updateExam = useCustomUpdate(
    `training/admin/exams/${selectedExam?.id}/`,
    ["exams"]
  );

  const singleExam = useCustomQuery(
    `training/admin/exams/${selectedExam?.id}/`,
    ["exam", selectedExam?.id],
    {},
    !!selectedExam
  );

  useEffect(() => {
    if (singleExam?.data?.data) {
      const exam = singleExam?.data?.data;
      setNewExam({
        title: exam.title,
        description: exam.description,
        material: exam.material?.id,
        level: exam.level?.id,
        type: exam.type?.id,
        time_in_minutes: exam.time_in_minutes,
        number_of_questions: exam.number_of_questions,
        total_marks: exam.total_marks,
        passing_marks: exam.passing_marks,
        teacher: exam.teacher?.id,
        is_free: exam.is_free,
        enable_countdown: exam.enable_countdown,
        show_correct_answers: exam.show_correct_answers,
        shuffle_questions: exam.shuffle_questions,
        shuffle_answers: exam.shuffle_answers,
        is_published: exam.is_published,
      });
    }
  }, [singleExam?.data?.data]);

  const handleCreateExam = () => {
    console.log("first", newExam);

    addExam
      .mutateAsync(newExam)
      .then((res) => {
        console.log("res", res);
        if (res?.status) {
          toast.success("تمإضافة الاختبار بنجاح");
          // navigate("/dashboard/admin/exams");
          setCurrentView("list");
        } else {
          handleErrorAlerts(res?.error);
        }
      })
      .catch((error: any) => {
        handleErrorAlerts(
          error?.response?.data?.error || "حدث خطاء اثناء اضافة الاختبار"
        );
      });
  };

  // const handleDeleteExam = (id: number) => {
  //   if (
  //     confirm(
  //       "هل أنت متأكد من حذف هذا الامتحان؟ سيتم حذف جميع الأسئلة والمحاولات المرتبطة به."
  //     )
  //   ) {
  //     setExams(exams.filter((exam) => exam.id !== id));
  //   }
  // };

  const toggleExamStatus = (status: boolean) => {
    updateExam
      .mutateAsync({
        is_published: !status,
      })
      .then((res) => {
        console.log("res", res);
        if (res?.status) {
          toast.success("تم تحديث حالة الاختبار بنجاح");
          // navigate("/dashboard/admin/exams");
          // setCurrentView("list");
        } else {
          handleErrorAlerts(res?.error);
        }
      })
      .catch((error: any) => {
        handleErrorAlerts(error?.response?.data?.error);
      });

    // setExams(
    //   exams.map((exam) =>
    //     exam.id === id
    //       ? {
    //           ...exam,
    //           [field]: !exam[field],
    //           updatedAt: new Date().toISOString().split("T")[0],
    //         }
    //       : exam
    //   )
    // );
  };

  const getDifficultyColor = (difficulty: any) => {
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

  const getTypeColor = (type: any) => {
    switch (type) {
      case "practice":
        return "bg-blue-100 text-blue-800";
      case "assessment":
        return "bg-purple-100 text-purple-800";
      case "final":
        return "bg-red-100 text-red-800";
      case "quiz":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const ExamCard = ({ exam }: { exam: any }) => (
    <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-orange-100/50 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2 line-clamp-2">
              {exam.title}
            </h3>
            <p className="text-blue-100 text-sm line-clamp-2">
              {exam.description}
            </p>
          </div>
          <div className="flex gap-2 ml-4">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                exam.examType
              )}`}
            >
              {exam?.type?.name}
            </span>
            {exam.isFree && (
              <span className="bg-green-400/20 text-green-100 px-2 py-1 rounded-full text-xs font-medium">
                مجاني
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <BookOpen size={14} />
            <span>{exam?.material?.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{exam.time_in_minutes} دقيقة</span>
          </div>
          <div className="flex items-center gap-1">
            <Hash size={14} />
            <span>{exam.number_of_questions} سؤال</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Difficulty & Settings */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
              exam.level
            )}`}
          >
            {exam?.level?.name}
          </span>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            {/* <span>المحاولات: {exam.attemptsAllowed}</span> */}
            {/* <span>•</span> */}
            <span>النجاح: {exam.passing_marks}%</span>
          </div>
        </div>

        {/* Status */}
        <div className="flex gap-2 mb-4">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              exam.is_published
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {exam.is_published ? "منشور" : "مسودة"}
          </span>
          {/* <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              exam.isActive
                ? "bg-blue-100 text-blue-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {exam.isActive ? "نشط" : "معطل"}
          </span> */}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setSelectedExam(exam);
                setCurrentView("questions");
              }}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="إدارة الأسئلة"
            >
              <FileText size={16} />
            </button>
            {/* 
            <button
              onClick={() => {
                setSelectedExam(exam);
                setCurrentView("results");
              }}
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="النتائج والإحصائيات"
            >
              <BarChart3 size={16} />
            </button> */}

            {/* <button
              onClick={() => toggleExamStatus(exam.id, "isActive")}
              className={`p-2 rounded-lg transition-colors ${
                exam.isActive
                  ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
                  : "text-gray-400 bg-gray-50 hover:bg-gray-100"
              }`}
              title={exam.isActive ? "تعطيل الامتحان" : "تفعيل الامتحان"}
            >
              {exam.isActive ? <Pause size={16} /> : <Play size={16} />}
            </button> */}

            <button
              onClick={() => {
                setSelectedExam(exam);
                toggleExamStatus(exam.is_published);
              }}
              className={`p-2 rounded-lg transition-colors ${
                exam.is_published
                  ? "text-green-600 bg-green-50 hover:bg-green-100"
                  : "text-gray-400 bg-gray-50 hover:bg-gray-100"
              }`}
              title={exam.is_published ? "إلغاء النشر" : "نشر الامتحان"}
            >
              {exam.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setSelectedExam(exam);
                setCurrentView("edit");
              }}
              className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
              title="تعديل الامتحان"
            >
              <Edit size={16} />
            </button>

            {/* <button
              onClick={() => handleDeleteExam(exam.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="حذف الامتحان"
            >
              <Trash2 size={16} />
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );

  // Render different views
  if (currentView === "create") {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentView("list")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="rtl:rotate-180" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              إنشاء امتحان جديد
            </h1>
            <p className="text-gray-600 text-sm">أضف امتحان جديد للمنصة</p>
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
                  عنوان الامتحان *
                </label>
                <input
                  type="text"
                  value={newExam.title || ""}
                  onChange={(e) =>
                    setNewExam({ ...newExam, title: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="أدخل عنوان الامتحان..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف الامتحان *
                </label>
                <textarea
                  value={newExam.description || ""}
                  onChange={(e) =>
                    setNewExam({ ...newExam, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
                  placeholder="وصف تفصيلي للامتحان..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المادة *
                  </label>

                  <select
                    value={newExam.material}
                    onChange={(e) =>
                      setNewExam({
                        ...newExam,
                        material: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  >
                    <option value="">اختر مادة</option>
                    {materials?.data?.data?.map((material: any) => (
                      <option key={material.id} value={material.id}>
                        {material.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    مستوى الصعوبة
                  </label>
                  <select
                    value={newExam.level}
                    onChange={(e) =>
                      setNewExam({
                        ...newExam,
                        level: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  >
                    <option value=""> اختر مستوى </option>
                    {levels?.data?.data?.map((level: any) => (
                      <option key={level.id} value={level.id}>
                        {level.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع الامتحان
                  </label>
                  <select
                    value={newExam.type}
                    onChange={(e) =>
                      setNewExam({
                        ...newExam,
                        type: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  >
                    <option value="">اختر نوع الامتحان</option>
                    {types?.data?.data?.map((type: any) => (
                      <option value={type.id} key={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المدة (بالدقائق)
                  </label>
                  <input
                    type="number"
                    value={newExam.time_in_minutes || ""}
                    onChange={(e) =>
                      setNewExam({
                        ...newExam,
                        time_in_minutes: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="60"
                    min="1"
                  />
                </div>
              </div>
            </div>

            {/* Exam Settings */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">
                إعدادات الامتحان
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عدد الأسئلة
                  </label>
                  <input
                    type="number"
                    value={newExam.number_of_questions || ""}
                    onChange={(e) =>
                      setNewExam({
                        ...newExam,
                        number_of_questions: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="10"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    إجمالي الدرجات
                  </label>
                  <input
                    type="number"
                    value={newExam.total_marks || ""}
                    onChange={(e) =>
                      setNewExam({
                        ...newExam,
                        total_marks: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="50"
                    min="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    درجة النجاح
                  </label>
                  <input
                    type="number"
                    value={newExam.passing_marks || ""}
                    onChange={(e) =>
                      setNewExam({
                        ...newExam,
                        passing_marks: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="30"
                    min="1"
                  />
                </div>
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عدد المحاولات المسموحة
                  </label>
                  <input
                    type="number"
                    value={newExam.attemptsAllowed || ""}
                    onChange={(e) =>
                      setNewExam({
                        ...newExam,
                        attemptsAllowed: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="3"
                    min="1"
                  />
                </div> */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اختر استاذ
                  </label>
                  <select
                    value={newExam.teacher}
                    onChange={(e) =>
                      setNewExam({
                        ...newExam,
                        teacher: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  >
                    <option value="">اختر استاذ</option>
                    {teachers?.data?.data?.map((type: any) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

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
                      checked={newExam.is_free === true}
                      onChange={() =>
                        setNewExam({
                          ...newExam,
                          is_free: true,
                          price: undefined,
                        })
                      }
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span>امتحان مجاني</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="pricing"
                      checked={newExam.is_free === false}
                      onChange={() =>
                        setNewExam({ ...newExam, is_free: false })
                      }
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span>امتحان مدفوع</span>
                  </label>
                </div>
                {newExam.is_free === false && (
                  <div className="mt-3">
                    <input
                      type="number"
                      value={newExam.price || ""}
                      onChange={(e) =>
                        setNewExam({
                          ...newExam,
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

              {/* Advanced Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">تحديد الوقت</p>
                    <p className="text-sm text-gray-500">تفعيل العد التنازلي</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={newExam.enable_countdown || false}
                    onChange={(e) =>
                      setNewExam({
                        ...newExam,
                        enable_countdown: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">إظهار النتائج</p>
                    <p className="text-sm text-gray-500">
                      عرض النتيجة فور الانتهاء
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={newExam.show_correct_answers || false}
                    onChange={(e) =>
                      setNewExam({
                        ...newExam,
                        show_correct_answers: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">خلط الأسئلة</p>
                    <p className="text-sm text-gray-500">
                      ترتيب عشوائي للأسئلة
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={newExam.shuffle_questions || false}
                    onChange={(e) =>
                      setNewExam({
                        ...newExam,
                        shuffle_questions: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">خلط الإجابات</p>
                    <p className="text-sm text-gray-500">
                      ترتيب عشوائي للخيارات
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={newExam.shuffle_answers || false}
                    onChange={(e) =>
                      setNewExam({
                        ...newExam,
                        shuffle_answers: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800"> مفعل؟ </p>
                    {/* <p className="text-sm text-gray-500">
                      ترتيب عشوائي للخيارات
                    </p> */}
                  </div>
                  <input
                    type="checkbox"
                    checked={newExam.is_published}
                    onChange={(e) =>
                      setNewExam({
                        ...newExam,
                        is_published: e.target.checked,
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
              onClick={handleCreateExam}
              disabled={
                !newExam.title || !newExam.description || !newExam.material
              }
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              إنشاء الامتحان
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === "questions" && selectedExam) {
    return (
      <ExamQuestionsPage
        exam={selectedExam}
        onBack={() => {
          setCurrentView("list");
        }}
      />
    );
  }

  if (currentView === "results" && selectedExam) {
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
              نتائج وإحصائيات الامتحان
            </h1>
            <p className="text-gray-600 text-sm">{selectedExam.title}</p>
          </div>
        </div>

        {/* Results and Statistics */}
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-8 border border-orange-100/50">
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              النتائج والإحصائيات
            </h3>
            <p className="text-gray-500 mb-6">
              سيتم تطوير واجهة عرض النتائج والإحصائيات التفصيلية في التحديث
              القادم
            </p>
            <div className="flex gap-4 justify-center">
              <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all flex items-center gap-2">
                <Download size={16} />
                تصدير النتائج
              </button>
              <button className="border border-gray-200 text-gray-600 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <BarChart3 size={16} />
                عرض الإحصائيات
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render different views
  if (currentView === "edit") {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentView("list")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="rtl:rotate-180" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">تعديل الامتحان</h1>
            <p className="text-gray-600 text-sm">
              قم بتعديل بيانات الامتحان الحالي
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
                  عنوان الامتحان *
                </label>
                <input
                  type="text"
                  value={singleExam?.data?.data?.title || ""}
                  onChange={(e) =>
                    setNewExam({ ...newExam, title: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="أدخل عنوان الامتحان..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف الامتحان *
                </label>
                <textarea
                  value={singleExam?.data?.data?.description || ""}
                  onChange={(e) =>
                    setNewExam({ ...newExam, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
                  placeholder="وصف تفصيلي للامتحان..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المادة *
                  </label>

                  <select
                    value={newExam.material}
                    onChange={(e) =>
                      setNewExam({
                        ...newExam,
                        material: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  >
                    <option value="">اختر مادة</option>
                    {materials?.data?.data?.map((material: any) => (
                      <option key={material.id} value={material.id}>
                        {material.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    مستوى الصعوبة
                  </label>
                  <select
                    value={newExam.level}
                    onChange={(e) =>
                      setNewExam({
                        ...newExam,
                        level: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  >
                    <option value=""> اختر مستوى </option>
                    {levels?.data?.data?.map((level: any) => (
                      <option key={level.id} value={level.id}>
                        {level.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع الامتحان
                  </label>
                  <select
                    value={newExam.type}
                    onChange={(e) =>
                      setNewExam({
                        ...newExam,
                        type: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  >
                    <option value="">اختر نوع الامتحان</option>
                    {types?.data?.data?.map((type: any) => (
                      <option value={type.id} key={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المدة (بالدقائق)
                  </label>
                  <input
                    type="number"
                    value={newExam.time_in_minutes || ""}
                    onChange={(e) =>
                      setNewExam({
                        ...newExam,
                        time_in_minutes: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="60"
                    min="1"
                  />
                </div>
              </div>
            </div>

            {/* Exam Settings */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">
                إعدادات الامتحان
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عدد الأسئلة
                  </label>
                  <input
                    type="number"
                    value={newExam.number_of_questions || ""}
                    onChange={(e) =>
                      setNewExam({
                        ...newExam,
                        number_of_questions: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="10"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    إجمالي الدرجات
                  </label>
                  <input
                    type="number"
                    value={newExam.total_marks || ""}
                    onChange={(e) =>
                      setNewExam({
                        ...newExam,
                        total_marks: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="50"
                    min="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    درجة النجاح
                  </label>
                  <input
                    type="number"
                    value={newExam.passing_marks || ""}
                    onChange={(e) =>
                      setNewExam({
                        ...newExam,
                        passing_marks: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="30"
                    min="1"
                  />
                </div>
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عدد المحاولات المسموحة
                  </label>
                  <input
                    type="number"
                    value={newExam.attemptsAllowed || ""}
                    onChange={(e) =>
                      setNewExam({
                        ...newExam,
                        attemptsAllowed: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="3"
                    min="1"
                  />
                </div> */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اختر استاذ
                  </label>
                  <select
                    value={newExam.teacher}
                    onChange={(e) =>
                      setNewExam({
                        ...newExam,
                        teacher: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  >
                    <option value="">اختر استاذ</option>
                    {teachers?.data?.data?.map((type: any) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

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
                      checked={newExam.is_free === true}
                      onChange={() =>
                        setNewExam({
                          ...newExam,
                          is_free: true,
                          price: undefined,
                        })
                      }
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span>امتحان مجاني</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="pricing"
                      checked={newExam.is_free === false}
                      onChange={() =>
                        setNewExam({ ...newExam, is_free: false })
                      }
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span>امتحان مدفوع</span>
                  </label>
                </div>
                {newExam.is_free === false && (
                  <div className="mt-3">
                    <input
                      type="number"
                      value={newExam.price || ""}
                      onChange={(e) =>
                        setNewExam({
                          ...newExam,
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

              {/* Advanced Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">تحديد الوقت</p>
                    <p className="text-sm text-gray-500">تفعيل العد التنازلي</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={newExam.enable_countdown || false}
                    onChange={(e) =>
                      setNewExam({
                        ...newExam,
                        enable_countdown: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">إظهار النتائج</p>
                    <p className="text-sm text-gray-500">
                      عرض النتيجة فور الانتهاء
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={newExam.show_correct_answers || false}
                    onChange={(e) =>
                      setNewExam({
                        ...newExam,
                        show_correct_answers: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">خلط الأسئلة</p>
                    <p className="text-sm text-gray-500">
                      ترتيب عشوائي للأسئلة
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={newExam.shuffle_questions || false}
                    onChange={(e) =>
                      setNewExam({
                        ...newExam,
                        shuffle_questions: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">خلط الإجابات</p>
                    <p className="text-sm text-gray-500">
                      ترتيب عشوائي للخيارات
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={newExam.shuffle_answers || false}
                    onChange={(e) =>
                      setNewExam({
                        ...newExam,
                        shuffle_answers: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800"> مفعل؟ </p>
                    {/* <p className="text-sm text-gray-500">
                      ترتيب عشوائي للخيارات
                    </p> */}
                  </div>
                  <input
                    type="checkbox"
                    checked={newExam.is_published}
                    onChange={(e) =>
                      setNewExam({
                        ...newExam,
                        is_published: e.target.checked,
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
              onClick={handleCreateExam}
              disabled={
                !newExam.title || !newExam.description || !newExam.material
              }
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              تعديل الامتحان
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
          <h1 className="text-2xl font-bold text-gray-800">إدارة الامتحانات</h1>
          <p className="text-gray-600 text-sm">
            إدارة شاملة لجميع الامتحانات والاختبارات في المنصة
          </p>
        </div>
        <button
          onClick={() => setCurrentView("create")}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2 text-sm"
        >
          <Plus size={16} />
          إنشاء امتحان جديد
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">إجمالي الامتحانات</p>
              <p className="text-3xl font-bold text-gray-800">
                {dataStatistcs?.data?.data?.total_exams}
              </p>
            </div>
            <FileText className="w-12 h-12 text-orange-500" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">الامتحانات النشطة</p>
              <p className="text-3xl font-bold text-green-600">
                {dataStatistcs?.data?.data?.active_exams}
              </p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">إجمالي المحاولات</p>
              <p className="text-3xl font-bold text-blue-600">
                {dataStatistcs?.data?.data?.total_attempts}
              </p>
            </div>
            <Users className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm"> الاختبارات غير النشطة </p>
              <p className="text-3xl font-bold text-orange-600">
                {dataStatistcs?.data?.data?.inactive_exams}
              </p>
            </div>
            <Award className="w-12 h-12 text-orange-500" />
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
              placeholder="البحث في الامتحانات..."
              className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
            />
          </div>

          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
          >
            <option value="">جميع المواد</option>
            {uniqueSubjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>

          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
          >
            <option value="all">جميع المستويات</option>
            <option value="easy">سهل</option>
            <option value="medium">متوسط</option>
            <option value="hard">صعب</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
          >
            <option value="all">جميع الأنواع</option>
            <option value="practice">تدريب</option>
            <option value="quiz">اختبار سريع</option>
            <option value="assessment">تقييم</option>
            <option value="final">نهائي</option>
          </select>

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
      </div> */}

      {/* Exams Grid/Table */}
      {true ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data?.data?.map((exam: any) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}

          {data?.data?.data?.length === 0 && (
            <div className="col-span-full bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-orange-100/50">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                لا توجد امتحانات
              </h3>

              <button
                onClick={() => setCurrentView("create")}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2 mx-auto"
              >
                e <Plus size={16} />
                إنشاء امتحان جديد
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
                    الامتحان
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المادة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    النوع
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المحاولات
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    متوسط الدرجات
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    معدل النجاح
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
                {data?.data?.data.map((exam: any) => (
                  <tr key={exam.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900 line-clamp-1">
                          {exam.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {exam.totalQuestions} سؤال • {exam.duration} دقيقة
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {exam.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                          exam.examType
                        )}`}
                      >
                        {exam.examType === "practice"
                          ? "تدريب"
                          : exam.examType === "assessment"
                          ? "تقييم"
                          : exam.examType === "final"
                          ? "نهائي"
                          : "اختبار"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {exam.statistics.totalAttempts}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {exam.statistics.averageScore.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {exam.statistics.passRate.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            exam.isPublished
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {exam.isPublished ? "منشور" : "مسودة"}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            exam.isActive
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {exam.isActive ? "نشط" : "معطل"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedExam(exam);
                            setCurrentView("questions");
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="إدارة الأسئلة"
                        >
                          <FileText size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedExam(exam);
                            setCurrentView("results");
                          }}
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                          title="النتائج"
                        >
                          <BarChart3 size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedExam(exam);
                            setCurrentView("edit");
                          }}
                          className="p-1 text-gray-400 hover:text-orange-600 transition-colors"
                          title="تعديل"
                        >
                          <Edit size={16} />
                        </button>
                        {/* <button
                          onClick={() => handleDeleteExam(exam.id)}
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

export default ExamsPage;
