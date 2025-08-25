import { useState } from "react";
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
const CourseContent = ({
  setAllLessons,
  allLessons,
}: // setSemesters,
{
  setAllLessons: any;
  allLessons: any;
  setSemesters: any;
  courseData: any;
}) => {
  const queryClient = useQueryClient();
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState("content");
  const currentLessonIndex = useLesson((state) => state.currentLessonIndex);
  const setCurrentLesson = useLesson((state) => state.setCurrentLesson);
  const isExamMode = useExam((state) => state.isExamMode);
  const setIsExamMode = useExam((state) => state.setIsExamMode);
  const setCurrentLessonIndex = useLesson(
    (state) => state.setCurrentLessonIndex
  );
  // const currentLesson = useLesson((state) => state.currentLesson);
  const { mutateAsync: completeMutateAsync } = useCustomPost(
    "/training/students/lesson/complete/",
    ["complete"]
  );

  const navigateLesson = (direction: "prev" | "next") => {
    if (direction === "prev" && currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      const prevLesson = allLessons[currentLessonIndex - 1];
      console.log("prevLesson", prevLesson);

      prevLesson?.type == "video" ? setIsExamMode(false) : setIsExamMode(true);
    } else if (
      direction === "next" &&
      currentLessonIndex < allLessons.length - 1
    ) {
      const nextLesson = allLessons[currentLessonIndex + 1];
      console.log("nextLesson", nextLesson);
      setCurrentLessonIndex(currentLessonIndex + 1);
      nextLesson?.type == "video" ? setIsExamMode(false) : setIsExamMode(true);
    }
  };

  const markLessonComplete = () => {
    const updatedLessons = [...allLessons];
    const updatedLesson = {
      ...updatedLessons[currentLessonIndex],
      is_completed: true,
    };

    updatedLessons[currentLessonIndex] = updatedLesson;

    // 1. Update CoursePage state
    setAllLessons(updatedLessons);

    // 2. Update Zustand directly right away
    setCurrentLesson(updatedLessons[currentLessonIndex]);

    // 3. Fire mutation
    completeMutateAsync({ lesson_id: updatedLesson.id });

    // 4. Background refetch
    queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
  };
  // exam
  //     const startExam = () => {
  //     setIsExamMode(true);
  //     // setCurrentExam(sampleExam);
  //     setCurrentQuestionIndex(0);
  //     setSelectedAnswers({});
  //     // setTimeRemaining(sampleExam.duration * 60);
  //     setExamSubmitted(false);
  //     setExamResults(null);
  //   };
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
                <span>{tab?.title}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "content" && (
          <div className="space-y-8">
            {/* Main Content */}
            {
              isExamMode ? (
                <Exam
                // markLessonComplete={markLessonComplete}
                />
              ) : (
                <VideoPlayer markLessonComplete={markLessonComplete} />
              )
              //  : (
              //   <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              //     <p className="text-gray-500">نوع الدرس غير مدعوم</p>
              //   </div>
              // )
            }

            {/* Navigation Controls */}
            <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg p-6">
              <button
                onClick={() => navigateLesson("prev")}
                disabled={currentLessonIndex === 0}
                className="flex items-center space-x-2 px-6 py-3 cursor-pointer border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="flex items-center space-x-2 cursor-pointer px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
        {activeTab === "questions" && <QuestionsTab />}
      </div>
    </>
  );
};

export default CourseContent;
