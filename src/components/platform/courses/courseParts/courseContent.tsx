import { useEffect, useState } from "react";
import {
  Play,
  BarChart3,
  FolderOpen,
  StickyNote,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import VideoPlayer from "./content/videoPlayer";
// import toast from "react-hot-toast";
import { useCustomPost } from "@/hooks/platform/usePlatformMutation";
import { useLesson } from "@/store/platform/useLesson";
import { useExam } from "@/store/platform/useExam";
import ProgressTab from "./tabs/progressTab";
import FilesTab from "./tabs/filesTab";
import NotesTab from "./tabs/notesTab";
import QuestionsTab from "./tabs/questionsTab";
import Exam from "./content/exam";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import toast from "react-hot-toast";

interface teacher {
  id: string;
  name: string;
  image: string;
}
interface CourseData {
  id: string;
  is_show_general_questions: boolean;
  is_special: boolean;
  name: string;
  notes: [];
  progress_bar: number;
  questions: [];
  resources: [];
  semesters: [];
  teacher: teacher;
  total_number_of_enrolled_students: number;
}
interface CourseContnetProps {
  allLessons: any[];
  courseData: CourseData;
}
const CourseContent = ({ allLessons, courseData }: CourseContnetProps) => {
  const queryClient = useQueryClient();
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState("content");
  const currentLesson = useLesson((state) => state.currentLesson);
  const currentLessonIndex = useLesson((state) => state.currentLessonIndex);
  const isExamMode = useExam((state) => state.isExamMode);
  const setIsExamMode = useExam((state) => state.setIsExamMode);
  const setCurrentLessonIndex = useLesson(
    (state) => state.setCurrentLessonIndex,
  );
  useEffect(() => {
    if (currentLesson?.type == "video") {
      setIsExamMode(false);
    } else {
      setIsExamMode(true);
    }
  }, [isExamMode, currentLesson]);
  const { mutateAsync: completeMutateAsync } = useCustomPost(
    "/training/students/lesson/complete/",
    ["complete"],
  );
  const navigateLesson = (direction: "prev" | "next") => {
    if (direction === "prev" && currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      const prevLesson = allLessons[currentLessonIndex - 1];
      if (prevLesson?.type == "video") {
        setIsExamMode(false);
      } else {
        setIsExamMode(true);
      }
    } else if (
      direction === "next" &&
      currentLessonIndex < allLessons.length - 1
    ) {
      const nextLesson = allLessons[currentLessonIndex + 1];
      setCurrentLessonIndex(currentLessonIndex + 1);
      if (nextLesson?.type == "video") {
        setIsExamMode(false);
      } else {
        setIsExamMode(true);
      }
    }
  };

  const markLessonComplete = async () => {
    try {
      await completeMutateAsync({
        lesson_id: currentLesson?.id,
      });
      queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "حدث خطأ أثناء إكمال الدرس");
    }
  };
  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: "content", title: "المحتوى", icon: Play },
            { id: "progress", title: "التقدم", icon: BarChart3 },
            { id: "files", title: "ملفات الدورة", icon: FolderOpen },
            { id: "notes", title: "الملاحظات", icon: StickyNote },
            { id: "questions", title: "الأسئلة", icon: MessageSquare },
          ]
            .filter(
              (tab) =>
                tab.id !== "questions" || courseData?.is_show_general_questions,
            )
            ?.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`cursor-pointer flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-linear-to-r from-(--brand-secondary) to-(--brand-secondary-dark) text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab?.title}</span>
                </button>
              );
            })}
        </div>

        {/* Tab Content */}
        {activeTab === "content" && (
          <div className="space-y-8">
            {/* Main Content */}
            {isExamMode ? (
              <Exam markLessonComplete={markLessonComplete} />
            ) : (
              <VideoPlayer markLessonComplete={markLessonComplete} />
            )}

            {/* Navigation Controls */}
            <div
              className={`flex flex-col lg:flex-row gap-5 items-center justify-between bg-white rounded-2xl shadow-lg p-6`}
            >
              <button
                onClick={() => navigateLesson("prev")}
                disabled={currentLessonIndex === 0}
                className="flex items-center w-full md:w-fit justify-center space-x-2 px-6 py-3 cursor-pointer border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
                <span>الدرس السابق</span>
              </button>

              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">
                  الدرس {currentLessonIndex + 1} من {allLessons.length}
                </div>
                <div className="w-full md:w-48 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-linear-to-r justify-center from-(--brand-secondary) to-(--brand-secondary-dark) h-2 rounded-full transition-all duration-300"
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
                className="flex items-center w-full md:w-fit justify-center space-x-2 cursor-pointer px-6 py-3 bg-linear-to-r from-(--brand-secondary) to-(--brand-secondary-dark) text-white rounded-xl font-semibold hover:from(--brand-secondary-dark) hover:to-(--brand-secondary) transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>الدرس التالي</span>
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {activeTab === "progress" && <ProgressTab />}
        {activeTab === "files" && <FilesTab />}
        {activeTab === "notes" && <NotesTab />}
        {courseData?.is_show_general_questions && activeTab === "questions" && (
          <QuestionsTab />
        )}
      </div>
    </>
  );
};

export default CourseContent;
