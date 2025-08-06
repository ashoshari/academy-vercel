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
import toast from "react-hot-toast";
import { useCustomPost } from "@/hooks/useMutation";
import { useLesson } from "@/store/platform/useLesson";
import { useExam } from "@/store/platform/useExam";
import ProgressTab from "./tabs/progressTab";
import FilesTab from "./tabs/filesTab";
import NotesTab from "./tabs/notesTab";
import QuestionsTab from "./tabs/questionsTab";
import Exam from "./content/exam";
const CourseContent = ({
  setAllLessons,
  allLessons,
  setSemesters,
}: {
  setAllLessons: any;
  allLessons: any;
  setSemesters: any;
  courseData: any;
}) => {
  const [activeTab, setActiveTab] = useState("content");
  const currentLessonIndex = useLesson((state) => state.currentLessonIndex);
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

  // useEffect(() => {
  //   const completeLesson = async () => {
  //     try {
  //       const response = await fetch("/training/students/lesson/complete/", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${window.localStorage.getItem(
  //             "accessToken"
  //           )}`,
  //         },
  //         body: JSON.stringify({
  //           lesson_id: currentLesson.id,
  //         }),
  //       });

  //       if (!response.ok) {
  //         const errorData = await response.json();
  //         throw new Error(errorData.message || "Request failed");
  //       }

  //       const result = await response.json();
  //       console.log("Lesson completion success:", result);
  //     } catch (error) {
  //       console.error("Error completing lesson:", error);
  //       // Optional: toast.error("فشل إرسال الطلب");
  //     }
  //   };

  //   completeLesson();
  // }, []);

  // exam
  // const [_, setIsExamMode] = useState(false);
  // const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // const [selectedAnswers, setSelectedAnswers] = useState({});
  // const [timeRemaining, setTimeRemaining] = useState(0);
  // const [examSubmitted, setExamSubmitted] = useState(false);
  // const [examResults, setExamResults] = useState(null);
  // const [currentExam, setCurrentExam] = useState(null);
  console.log("allLessons", allLessons);
  const navigateLesson = (direction: "prev" | "next") => {
    if (direction === "prev" && currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      const prevLesson = allLessons[currentLessonIndex - 1];
      prevLesson?.type == "video" ? setIsExamMode(false) : setIsExamMode(true);
    } else if (
      direction === "next" &&
      currentLessonIndex < allLessons.length - 1
    ) {
      const nextLesson = allLessons[currentLessonIndex + 1];
      if (nextLesson.is_completed) {
        setCurrentLessonIndex(currentLessonIndex + 1);
        nextLesson?.type == "video"
          ? setIsExamMode(false)
          : setIsExamMode(true);
      } else {
        toast.error("الدرس غير مكتمل");
      }
    }
  };
  const markLessonComplete = () => {
    const updatedLessons = [...allLessons];
    updatedLessons[currentLessonIndex].isCompleted = true;
    completeMutateAsync(updatedLessons[currentLessonIndex].id);

    // Unlock next lesson
    if (currentLessonIndex + 1 < updatedLessons.length) {
      updatedLessons[currentLessonIndex + 1].is_completed = true;
      completeMutateAsync(updatedLessons[currentLessonIndex + 1].id);
    }
    setAllLessons(updatedLessons);

    // Update chapters state
    setSemesters((prev: any) =>
      prev.map((semester: any) => ({
        ...semester,
        units: semester?.units?.map((unit: any) => ({
          ...unit,
          lessons: unit?.lessons?.map((lesson: any) => {
            const updatedLesson = updatedLessons.find(
              (l) => l.id === lesson.id
            );
            return updatedLesson || lesson;
          }),
        })),
      }))
    );
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

      {activeTab === "progress" && <ProgressTab />}
      {activeTab === "files" && <FilesTab />}
      {activeTab === "notes" && <NotesTab />}
      {activeTab === "questions" && <QuestionsTab />}
    </div>
  );
};

export default CourseContent;
