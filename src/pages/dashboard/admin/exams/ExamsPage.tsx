import { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Search,
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
  Rows,
  Grid,
  ArrowRight,
} from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";
import {
  useCustomPost,
  // useCustomRemove,
  useCustomUpdate,
} from "@/hooks/useMutation";
import toast from "react-hot-toast";
import handleErrorAlerts from "@/utils/showErrorMessages";
import ExamQuestionsPage from "./questions/QuestionsPage";
import Spinner from "@/components/dashboard/Spinner";
import Pagination from "@/components/dashboard/core/Pagination";
import { useQueryClient } from "@tanstack/react-query";
import { readUserFromStorage, roleOf } from "@/services/auth";
import { isArray } from "lodash";
export interface Exam {
  id: string;
  title: string;
  description: string;
  material: string;
  level: string;
  time_in_minutes: number;
  subsection: string;
  subsubsection: string;
  specialization: string;
  specialization_material: string;
  number_of_questions: number;
  total_marks: number;
  passing_marks: number;
  is_published: boolean;
  is_free: boolean;
  teacher?: string;
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
  const user = readUserFromStorage();
  const role = roleOf(user) ?? "";
  const [currentView, setCurrentView] = useState<
    "table" | "grid" | "create" | "edit" | "questions" | "results"
  >("table");
  const queryClient = useQueryClient();
  // const [examId, setExamId] = useState();
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [materialFilter, setMaterialFilter] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [newExam, setNewExam] = useState<any>({
    title: "",
    description: "",
    time_in_minutes: 0,
    number_of_questions: 10,
    subsection: "",
    subsubsection: "",
    specialization: "",
    specialization_material: "",
    total_marks: 50,
    passing_marks: 30,
    is_published: true,
    is_free: true,
    ...(role !== "teacher" && { teacher: "" }),
    enable_countdown: false,
    show_correct_answers: false,
    shuffle_questions: false,
    shuffle_answers: false,
  });

  const queryParams = new URLSearchParams();
  if (searchTerm) queryParams.append("search", searchTerm);
  if (materialFilter) queryParams.append("material", materialFilter);
  if (page) queryParams.append("page", page.toString());
  const queryString = queryParams.toString();
  const data = useCustomQuery(`/training/admin/exams/?${queryString}`, [
    "exams",
    searchTerm,
    materialFilter,
  ]);
  const paginationData = data?.data?.pagination;
  const dataStatistcs = useCustomQuery("/training/admin/exams-statistics/", [
    "exams-statistics",
  ]);
  const materials = useCustomQuery("/core/materials/", ["materials"]);

  const materialsData = materials?.data?.data;
  const teachers = useCustomQuery("account/admin/teachers/?page_size=9999", [
    "teachers",
  ]);
  const addExam = useCustomPost("training/admin/exams/", [
    "addExams",
    "exams-statistics",
  ]);

  // PUT Exams
  const { mutateAsync: putExam } = useCustomUpdate(
    `/training/admin/exams/${selectedExam?.id}/`,
    ["putExams"],
  );
  // DELETE Exams
  // const { mutateAsync: deleteExam } = useCustomRemove(
  //   `/training/admin/exams/${examId}/`,
  //   ["deleteExams"]
  // );
  // GET Codes
  // const { data: cards } = useCustomQuery("/cards/", ["cards"]);
  // const cardsData = cards?.data;
  const updateExam = useCustomUpdate(
    `/training/admin/exams/${selectedExam?.id}/`,
    ["exams"],
  );

  const singleExam = useCustomQuery(
    `/training/admin/exams/${selectedExam?.id}/`,
    ["exam", selectedExam?.id],
    {},
    !!selectedExam,
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
        ...(role !== "teacher" && { teacher: exam.teacher?.id }),
        is_free: exam.is_free,
        enable_countdown: exam.enable_countdown,
        show_correct_answers: exam.show_correct_answers,
        shuffle_questions: exam.shuffle_questions,
        shuffle_answers: exam.shuffle_answers,
        is_published: exam.is_published,
      });
    }
  }, [singleExam?.data?.data]);

  // GET SubSection
  const { data: subsections } = useCustomQuery(
    "/training/admin/subsections-ids/",
    ["subsections"],
  );
  const subsectionData = subsections?.data;

  const [editSections, setEditSections] = useState(false);
  const [selectedSubSection, setSelectedSubSection] = useState<string>("");
  const [selectedSubSub, setSelectedSubSub] = useState<string>("");
  const [selectedSpec, setSelectedSpec] = useState<string>("");
  const subSection = subsectionData?.find(
    (s: any) => s.id === selectedSubSection,
  );
  const subsub = subSection?.subsubsections?.find(
    (ss: any) => ss.id === selectedSubSub,
  );
  const spec = subsub?.specializations?.find(
    (sp: any) => sp.id === selectedSpec,
  );
  const handleCreateExam = () => {
    addExam
      .mutateAsync(newExam)
      .then((res) => {
        if (res?.status) {
          toast.success("تم إضافة الاختبار بنجاح");
          setCurrentView("table");
          setSelectedExam(null);
          setSelectedSubSection("");
          setSelectedSubSub("");
          setSelectedSpec("");
          setNewExam({
            title: "",
            description: "",
            time_in_minutes: 0,
            number_of_questions: 10,
            subsection: "",
            subsubsection: "",
            specialization: "",
            specialization_material: "",
            total_marks: 50,
            passing_marks: 30,
            is_published: true,
            is_free: true,
            ...(role !== "teacher" && { teacher: "" }),
            enable_countdown: false,
            show_correct_answers: false,
            shuffle_questions: false,
            shuffle_answers: false,
          });
          queryClient.invalidateQueries({ queryKey: ["exams"] });
        } else {
          handleErrorAlerts(res?.error);
        }
      })
      .catch((error: any) => {
        handleErrorAlerts(
          error?.response?.data?.error || "حدث خطا اثناء اضافة الاختبار",
        );
      });
  };
  const handleEditExam = () => {
    selectedExam.teacher = selectedExam?.teacher?.id;
    selectedExam.subsection = selectedExam?.subsection?.id;
    selectedExam.subsubsection = selectedExam?.subsubsection?.id;
    selectedExam.specialization = selectedExam?.specialization?.id;
    selectedExam.specialization_material =
      selectedExam?.specialization_material?.id;
    putExam(selectedExam)
      .then((res: any) => {
        if (res?.status) {
          toast.success("تم تحديث الاختبار بنجاح");
          setCurrentView("table");
          setSelectedExam(null);
          queryClient.invalidateQueries({ queryKey: ["exams"] });
          queryClient.invalidateQueries({ queryKey: ["exams-statistics"] });
          setSelectedSubSection("");
          setSelectedSubSub("");
          setSelectedSpec("");
          setEditSections(false);
        } else {
          handleErrorAlerts(res?.error);
        }
      })
      .catch((error: any) => {
        handleErrorAlerts(
          error?.response?.data?.error || "حدث خطا اثناء تحديث الاختبار",
        );
      });
  };
  const toggleExamStatus = (status: boolean) => {
    updateExam
      .mutateAsync({
        is_published: !status,
      })
      .then((res) => {
        if (res?.status) {
          toast.success("تم تحديث حالة الاختبار بنجاح");
          setNewExam(null);
          queryClient.invalidateQueries({
            queryKey: ["exams"],
          });
          queryClient.invalidateQueries({
            queryKey: ["exams-statistics"],
          });
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
      <div className="p-6 bg-linear-to-r from-blue-500 to-blue-600 text-white">
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
                exam.examType,
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
              exam.level,
            )}`}
          >
            {exam?.level?.name}
          </span>
          <div className="flex items-center gap-2 text-xs text-gray-500">
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
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setSelectedExam(exam);
                setCurrentView("questions");
              }}
              className="cursor-pointer p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="إدارة الأسئلة"
            >
              <FileText size={16} />
            </button>

            <button
              onClick={() => {
                setSelectedExam(exam);
                toggleExamStatus(exam.is_published);
              }}
              className={`cursor-pointer p-2 rounded-lg transition-colors ${
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
              className="cursor-pointer p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
              title="تعديل الامتحان"
            >
              <Edit size={16} />
            </button>
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
            onClick={() => {
              setSelectedSubSection("");
              setSelectedSubSub("");
              setSelectedSpec("");
              setCurrentView("table");
              setNewExam({});
            }}
            className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowRight size={20} />
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
                  value={newExam?.title}
                  onChange={(e) =>
                    setNewExam({ ...newExam, title: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="أدخل عنوان الامتحان..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف الامتحان
                </label>
                <textarea
                  value={newExam?.description}
                  onChange={(e) =>
                    setNewExam({
                      ...newExam,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
                  placeholder="وصف تفصيلي للامتحان..."
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Teachers */}
                {role !== "teacher" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اختر استاذ *
                    </label>
                    <select
                      value={newExam?.teacher}
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
                )}
                {/* SubSections */}
                <div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      القسم *
                    </label>
                    <select
                      value={selectedSubSection}
                      onChange={(e) => {
                        setSelectedSubSection(e.target.value);
                        setSelectedSubSub("");
                        setSelectedSpec("");
                        setNewExam({
                          ...newExam,
                          subsection: e.target.value,
                          subsubsection: "",
                          specialization: "",
                          specialization_material: "",
                        });
                      }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    >
                      <option value="">اختر القسم</option>
                      {subsectionData?.map((subSection: any) => (
                        <option key={subSection.id} value={subSection.id}>
                          {subSection?.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* SubSubSection */}
                {subSection?.subsubsections.length > 0 && (
                  <div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الصف *
                      </label>
                      <select
                        value={selectedSubSub}
                        onChange={(e) => {
                          setSelectedSubSub(e.target.value);
                          setSelectedSpec("");
                          setNewExam({
                            ...newExam,
                            subsubsection: e.target.value,
                            specialization: "",
                            specialization_material: "",
                          });
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      >
                        <option value="">اختر الصف</option>
                        {subSection?.subsubsections?.map(
                          (subSubSection: any) => (
                            <option
                              key={subSubSection.id}
                              value={subSubSection.id}
                            >
                              {subSubSection?.title}
                            </option>
                          ),
                        )}
                      </select>
                    </div>
                  </div>
                )}

                {/* Specialization */}
                {subsub?.specializations.length > 0 && (
                  <div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        التخصص *
                      </label>
                      <select
                        value={selectedSpec}
                        onChange={(e) => {
                          setSelectedSpec(e.target.value);
                          setNewExam({
                            ...newExam,
                            specialization: e.target.value,
                            specialization_material: "",
                          });
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      >
                        <option value="">اختر قسم فرعي</option>
                        {subsub?.specializations?.map((specialization: any) => (
                          <option
                            key={specialization.id}
                            value={specialization.id}
                          >
                            {specialization?.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Specialization Material */}
                {selectedSubSub &&
                  subsub?.specialization_materials.length == 0 &&
                  subsub?.specializations.length == 0 && (
                    <p className="col-span-1 lg:col-span-2 text-center text-md text-red-600 font-semibold">
                      لا يوجد مواد تخصص لعرضها برجاء اختيار مسار صحيح
                    </p>
                  )}
                {(spec?.specialization_materials.length > 0 ||
                  (subsub?.specializations?.length == 0 &&
                    subsub?.specialization_materials?.length > 0)) && (
                  <div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        مادة التخصص *
                      </label>
                      <select
                        value={newExam?.specialization_material}
                        onChange={(e) => {
                          setNewExam({
                            ...newExam,
                            specialization_material: e.target.value,
                          });
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      >
                        <option value="">اختر مادة التخصص</option>
                        {(spec?.specialization_materials.length > 0
                          ? spec?.specialization_materials
                          : subsub?.specialization_materials
                        ).map((specialization_material: any) => (
                          <option
                            key={specialization_material.id}
                            value={specialization_material.id}
                          >
                            {specialization_material?.material}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Exam Settings */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">
                إعدادات الامتحان
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عدد الأسئلة *
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*"
                    lang="en"
                    value={newExam?.number_of_questions || ""}
                    onChange={(e) =>
                      setNewExam({
                        ...newExam,
                        number_of_questions: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="10"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    إجمالي الدرجات *
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*"
                    lang="en"
                    value={newExam?.total_marks}
                    onChange={(e) =>
                      setNewExam({
                        ...newExam,
                        total_marks: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="50"
                    min="1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    درجة النجاح *
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*"
                    lang="en"
                    value={newExam?.passing_marks || ""}
                    onChange={(e) =>
                      setNewExam({
                        ...newExam,
                        passing_marks: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="30"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المدة (بالدقائق)
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*"
                    lang="en"
                    value={newExam?.time_in_minutes || ""}
                    onChange={(e) =>
                      setNewExam({
                        ...newExam,
                        time_in_minutes: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="60"
                    min="1"
                  />
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">مفعل</p>
                    <p className="text-sm text-gray-500">تفعيل الامتحان</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={newExam?.is_published ?? true}
                    onChange={(e) =>
                      setNewExam({
                        ...newExam,
                        is_published: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">مجاني</p>
                    <p className="text-sm text-gray-500">
                      تحديد هل الامتحان مجاني أم مدفوع
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={newExam?.is_free ?? true}
                    onChange={(e) =>
                      setNewExam({
                        ...newExam,
                        is_free: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">تحديد الوقت</p>
                    <p className="text-sm text-gray-500">تفعيل العد التنازلي</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={newExam?.enable_countdown || false}
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
                    checked={newExam?.show_correct_answers || false}
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
                    checked={newExam?.shuffle_questions || false}
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
                    checked={newExam?.shuffle_answers || false}
                    onChange={(e) =>
                      setNewExam({
                        ...newExam,
                        shuffle_answers: e.target.checked,
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
              onClick={() => {
                setCurrentView("table");
                setSelectedSubSection("");
                setSelectedSubSub("");
                setSelectedSpec("");
                setNewExam({});
              }}
              className="cursor-pointer px-6 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={handleCreateExam}
              disabled={
                !newExam?.title ||
                (role !== "teacher" && !newExam?.teacher) ||
                !newExam.subsection ||
                !newExam.subsubsection ||
                (subsub?.specializations.length > 0
                  ? !newExam.specialization
                  : false) ||
                !newExam.specialization_material ||
                !newExam?.number_of_questions ||
                !newExam?.total_marks ||
                !newExam?.passing_marks
              }
              className="cursor-pointer px-6 py-3 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
          setCurrentView("table");
          setNewExam({});
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
            onClick={() => setCurrentView("table")}
            className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              نتائج وإحصائيات الامتحان
            </h1>
            <p className="text-gray-600 text-sm">{selectedExam?.title}</p>
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
              <button className="cursor-pointer bg-linear-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all flex items-center gap-2">
                <Download size={16} />
                تصدير النتائج
              </button>
              <button className="cursor-pointer border border-gray-200 text-gray-600 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
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
            onClick={() => {
              setCurrentView("table");
              setSelectedSubSection("");
              setSelectedSubSub("");
              setSelectedSpec("");
              setEditSections(false);
              setSelectedExam(null);
            }}
            className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
                  value={selectedExam?.title}
                  onChange={(e) =>
                    setSelectedExam({ ...selectedExam, title: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="أدخل عنوان الامتحان..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف الامتحان
                </label>
                <textarea
                  value={selectedExam?.description || ""}
                  onChange={(e) =>
                    setSelectedExam({
                      ...selectedExam,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
                  placeholder="وصف تفصيلي للامتحان..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Teachers */}
                {role !== "teacher" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اختر استاذ *
                    </label>
                    <select
                      value={selectedExam?.teacher?.id}
                      onChange={(e) =>
                        setSelectedExam({
                          ...selectedExam,
                          teacher: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    >
                      <option value="">اختر استاذ</option>
                      {teachers?.data?.data?.map((teacher: any) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* SubSections */}
                {!editSections ? (
                  <div className="flex justify-start items-end w-full">
                    <button
                      onClick={() => setEditSections(!editSections)}
                      className="cursor-pointer w-full justify-center h-14.5 px-6 py-3 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2"
                    >
                      تعديل الأقسام
                    </button>
                  </div>
                ) : (
                  <>
                    <div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          القسم *
                        </label>
                        <select
                          value={selectedSubSection}
                          onChange={(e) => {
                            setSelectedSubSection(e.target.value);
                            setSelectedSubSub("");
                            setSelectedSpec("");
                            setSelectedExam({
                              ...selectedExam,
                              subsection: e.target.value,
                              subsubsection: "",
                              specialization: "",
                              specialization_material: "",
                            });
                          }}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                        >
                          <option value="">اختر القسم</option>
                          {subsectionData?.map((subSection: any) => (
                            <option key={subSection.id} value={subSection.id}>
                              {subSection?.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {/* SubSubSection */}
                    {subSection?.subsubsections.length > 0 && (
                      <div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            الصف *
                          </label>
                          <select
                            value={selectedSubSub}
                            onChange={(e) => {
                              setSelectedSubSub(e.target.value);
                              setSelectedSpec("");
                              setSelectedExam({
                                ...selectedExam,
                                subsubsection: e.target.value,
                                specialization: "",
                                specialization_material: "",
                              });
                            }}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                          >
                            <option value="">اختر الصف</option>
                            {subSection?.subsubsections?.map(
                              (subSubSection: any) => (
                                <option
                                  key={subSubSection.id}
                                  value={subSubSection.id}
                                >
                                  {subSubSection?.title}
                                </option>
                              ),
                            )}
                          </select>
                        </div>
                      </div>
                    )}
                    {/* Specialization */}
                    {subsub?.specializations.length > 0 && (
                      <div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            التخصص *
                          </label>
                          <select
                            value={selectedSpec}
                            onChange={(e) => {
                              setSelectedSpec(e.target.value);
                              setSelectedExam({
                                ...selectedExam,
                                specialization: e.target.value,
                                specialization_material: "",
                              });
                            }}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                          >
                            <option value="">اختر قسم فرعي</option>
                            {subsub?.specializations?.map(
                              (specialization: any) => (
                                <option
                                  key={specialization.id}
                                  value={specialization.id}
                                >
                                  {specialization?.name}
                                </option>
                              ),
                            )}
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Specialization Material */}
                    {selectedSubSub &&
                      subsub?.specialization_materials.length == 0 &&
                      subsub?.specializations.length == 0 && (
                        <p className="col-span-1 lg:col-span-2 text-center text-md text-red-600 font-semibold">
                          لا يوجد مواد تخصص لعرضها برجاء اختيار مسار صحيح
                        </p>
                      )}
                    {(spec?.specialization_materials.length > 0 ||
                      (subsub?.specializations?.length == 0 &&
                        subsub?.specialization_materials?.length > 0)) && (
                      <div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            مادة التخصص *
                          </label>
                          <select
                            value={
                              selectedExam?.specialization_material?.id
                                ? selectedExam?.specialization_material.id
                                : selectedExam?.specialization_material
                            }
                            onChange={(e) => {
                              setSelectedExam({
                                ...selectedExam,
                                specialization_material: e.target.value,
                              });
                            }}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                          >
                            <option value="">اختر مادة التخصص</option>
                            {(spec?.specialization_materials.length > 0
                              ? spec?.specialization_materials
                              : subsub?.specialization_materials
                            ).map((specialization_material: any) => (
                              <option
                                key={specialization_material.id}
                                value={specialization_material.id}
                              >
                                {specialization_material?.material}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </>
                )}
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
                    عدد الأسئلة *
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*"
                    lang="en"
                    value={selectedExam?.number_of_questions}
                    onChange={(e) =>
                      setSelectedExam({
                        ...selectedExam,
                        number_of_questions: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="10"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    إجمالي الدرجات *
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*"
                    lang="en"
                    value={selectedExam?.total_marks}
                    onChange={(e) =>
                      setSelectedExam({
                        ...selectedExam,
                        total_marks: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="50"
                    min="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    درجة النجاح *
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*"
                    lang="en"
                    value={selectedExam?.passing_marks}
                    onChange={(e) =>
                      setSelectedExam({
                        ...selectedExam,
                        passing_marks: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="30"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المدة (بالدقائق)
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*"
                    lang="en"
                    value={selectedExam?.time_in_minutes}
                    onChange={(e) =>
                      setSelectedExam({
                        ...selectedExam,
                        time_in_minutes: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="60"
                    min="1"
                  />
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">مفعل</p>
                    <p className="text-sm text-gray-500">تفعيل الامتحان</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedExam?.is_published ?? true}
                    onChange={(e) =>
                      setSelectedExam({
                        ...selectedExam,
                        is_published: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">مجاني</p>
                    <p className="text-sm text-gray-500">
                      تحديد هل الامتحان مجاني أم مدفوع
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedExam?.is_free ?? true}
                    onChange={(e) =>
                      setSelectedExam({
                        ...selectedExam,
                        is_free: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">تحديد الوقت</p>
                    <p className="text-sm text-gray-500">تفعيل العد التنازلي</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedExam?.enable_countdown}
                    onChange={(e) =>
                      setSelectedExam({
                        ...selectedExam,
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
                    checked={selectedExam?.show_correct_answers}
                    onChange={(e) =>
                      setSelectedExam({
                        ...selectedExam,
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
                    checked={selectedExam?.shuffle_questions}
                    onChange={(e) =>
                      setSelectedExam({
                        ...selectedExam,
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
                    checked={selectedExam?.shuffle_answers}
                    onChange={(e) =>
                      setSelectedExam({
                        ...selectedExam,
                        shuffle_answers: e.target.checked,
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
              onClick={() => {
                setCurrentView("table");
                setSelectedSubSection("");
                setSelectedSubSub("");
                setSelectedSpec("");
              }}
              className="cursor-pointer px-6 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={handleEditExam}
              disabled={
                !selectedExam?.title ||
                (role !== "teacher" && !selectedExam?.teacher) ||
                !selectedExam.subsection ||
                !selectedExam.subsubsection ||
                (subsub?.specializations.length > 0
                  ? !selectedExam.specialization
                  : false) ||
                !selectedExam.specialization_material ||
                !selectedExam?.number_of_questions ||
                !selectedExam?.total_marks ||
                !selectedExam?.passing_marks
              }
              className="cursor-pointer px-6 py-3 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              تعديل الامتحان
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default grid View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex md:flex-row flex-col gap-5 items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">إدارة الامتحانات</h1>
          <p className="text-gray-600 text-sm">
            إدارة شاملة لجميع الامتحانات والاختبارات في المنصة
          </p>
        </div>
        <button
          onClick={() => setCurrentView("create")}
          className="cursor-pointer bg-linear-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2 text-sm"
        >
          <Plus size={16} />
          إنشاء امتحان جديد
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">إجمالي الامتحانات</p>
              <p className="text-3xl font-bold text-gray-800">
                {dataStatistcs?.data?.data?.total_exams ?? "-"}
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
                {dataStatistcs?.data?.data?.active_exams ?? "-"}
              </p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm"> الامتحانات الغير نشطة </p>
              <p className="text-3xl font-bold text-red-600">
                {dataStatistcs?.data?.data?.inactive_exams ?? "-"}
              </p>
            </div>
            <Award className="w-12 h-12 text-red-500" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">إجمالي المحاولات</p>
              <p className="text-3xl font-bold text-blue-600">
                {dataStatistcs?.data?.data?.total_attempts ?? "-"}
              </p>
            </div>
            <Users className="w-12 h-12 text-blue-500" />
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
              placeholder="البحث في الامتحانات..."
              className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
            />
          </div>

          {/* Material */}
          <select
            value={materialFilter}
            onChange={(e) => setMaterialFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
          >
            <option value="">جميع المواد</option>
            {materialsData?.map((material: any) => (
              <option key={material?.id} value={material?.id}>
                {material?.name}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView("table")}
              className={`cursor-pointer p-2 rounded-lg transition-colors ${
                currentView === "table"
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-400 hover:bg-gray-100"
              }`}
            >
              <Rows size={16} />
            </button>
            <button
              onClick={() => setCurrentView("grid")}
              className={`cursor-pointer p-2 rounded-lg transition-colors ${
                currentView === "grid"
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-400 hover:bg-gray-100"
              }`}
            >
              <Grid size={16} />
            </button>
          </div>
        </div>
      </div>

      {data?.isLoading ? (
        <div className="flex justify-center">
          <Spinner size={40} thickness={4} className="text-orange-500" />
        </div>
      ) : !data?.data?.data || data?.data?.data?.length === 0 ? (
        <div className="col-span-full bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-orange-100/50">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            لا توجد نتائج
          </h3>
          <p className="text-gray-500 mb-6">
            ابدأ بإضافة امتحانات جديدة للمنصة
          </p>

          <button
            onClick={() => setCurrentView("create")}
            className="cursor-pointer bg-linear-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <Plus size={16} />
            إضافة امتحان جديد
          </button>
        </div>
      ) : currentView == "grid" ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.data?.data?.map((exam: any) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
          <Pagination
            currentPage={page}
            count={paginationData?.count}
            onPageChange={setPage}
          />

          {/* {data?.data?.data?.length === 0 && (
            <div className="col-span-full bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-orange-100/50">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                لا توجد امتحانات
              </h3>

              <button
                onClick={() => setCurrentView("create")}
                className="cursor-pointer bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2 mx-auto"
              >
                e <Plus size={16} />
                إنشاء امتحان جديد
              </button>
            </div>
          )} */}
        </div>
      ) : (
        <>
          {/* Table View */}
          <div className="w-full max-w-50 min-w-full pb-6 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-orange-100/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      اسم الامتحان
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      مادة التخصص
                    </th>
                    {role !== "teacher" && (
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        المعلم
                      </th>
                    )}
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      مدة الامتحان
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      عدد الأسئلة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      إجمالي الدرجات
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      درجات النجاح
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className=" divide-y divide-gray-200">
                  {data?.data?.data?.map((exam: any) => (
                    <tr key={exam?.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900 line-clamp-1">
                            {exam?.title}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {isArray(exam?.specialization_material)
                          ? exam?.specialization_material?.map(
                              (m: any, index: number, array: any) =>
                                `${m.title}${
                                  index === array.length - 1 ? "" : ", "
                                }`,
                            )
                          : ((exam?.specialization_material?.title ||
                              exam?.specialization_material?.name) ??
                            "-")}
                      </td>
                      {role !== "teacher" && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {exam?.teacher?.name ?? "-"}
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {exam?.time_in_minutes} دقيقة
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {exam?.number_of_questions}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {exam?.total_marks}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {exam?.passing_marks}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              exam.is_published
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {exam.is_published ? "منشور" : "مسودة"}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              exam.is_free
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {exam.is_free ? "مجاني" : "مدفوع"}
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
                            className="cursor-pointer p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="إدارة الأسئلة"
                          >
                            <FileText size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedExam(exam);
                              setCurrentView("results");
                            }}
                            className="cursor-pointer p-1 text-gray-400 hover:text-green-600 transition-colors"
                            title="النتائج"
                          >
                            <BarChart3 size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedExam(exam);
                              setCurrentView("edit");
                            }}
                            className="cursor-pointer p-1 text-gray-400 hover:text-orange-600 transition-colors"
                            title="تعديل"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedExam(exam);
                              toggleExamStatus(exam.is_published);
                            }}
                            className="cursor-pointer p-1 text-gray-400 hover:text-orange-600 transition-colors"
                            title={
                              exam.is_published ? "إلغاء النشر" : "نشر الامتحان"
                            }
                          >
                            {exam.is_published ? (
                              <Eye size={16} />
                            ) : (
                              <EyeOff size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination
            currentPage={page}
            count={paginationData?.count}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
};

export default ExamsPage;
