import { useState, useEffect } from "react";
import Sidebar from "./sidebar.";
import Header from "./header";
import { useParams } from "react-router";
import { useCustomQuery } from "@/hooks/platform/usePlatformQuery";
import CourseContent from "./courseContent";
import { useLesson } from "@/store/platform/useLesson";
import errorIllustation from "@/assets/illustration/Error_illustration.svg";
const CoursePage = () => {
  const [allLessons, setAllLessons] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [_, setSemesters] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const setCurrentLessonIndex = useLesson(
    (state) => state.setCurrentLessonIndex
  );
  const currentLessonIndex = useLesson((state) => state.currentLessonIndex);
  const setCurrentLesson = useLesson((state) => state.setCurrentLesson);
  const currentLesson = useLesson((state) => state.currentLesson);
  const token = window.localStorage.getItem("platform_auth_tokens");
  const { courseId } = useParams();
  const { data, error } = useCustomQuery(
    `/training/students/course/${courseId}/`,
    ["courses", courseId],
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const courseData = data?.data;
  const sidebarCollapseHandler = (state: boolean) => {
    setSidebarCollapsed(state);
  };
  useEffect(() => {
    if (courseData?.semesters) {
      const initialized = courseData?.semesters?.map((semester: any) => ({
        ...semester,
        isExpanded: false,
        units:
          semester.units?.map((unit: any) => ({
            ...unit,
            isExpanded: false,
            topics:
              unit.topics?.map((topic: any) => ({
                ...topic,
                isExpanded: false,
              })) || [],
          })) || [],
      }));
      setSemesters(initialized);
    }
  }, [courseData]);

  useEffect(() => {
    const activeLesson = allLessons[currentLessonIndex];
    console.log("allLessons", allLessons);
    console.log("[currentLessonIndex]", currentLessonIndex);
    if (activeLesson) {
      console.log(courseData);
      console.log(activeLesson);
      setCurrentLesson(activeLesson);
    }
  }, [currentLessonIndex, allLessons]);

  useEffect(() => {
    const lessons: any = [];
    courseData?.semesters?.forEach((semester: any) => {
      semester.units.forEach((unit: any) => {
        unit.topics.forEach((topic: any) => {
          lessons.push(...topic.lessons); // 👈 Flattened
        });
      });
    });
    console.log(courseData);
    setAllLessons(lessons);
  }, [courseData]);
  // const markLessonComplete = () => {
  //   const updatedLessons = [...allLessons];
  //   updatedLessons[currentLessonIndex].isCompleted = true;

  //   // Unlock next lesson
  //   if (currentLessonIndex + 1 < updatedLessons.length) {
  //     updatedLessons[currentLessonIndex + 1].isLocked = false;
  //   }

  //   setAllLessons(updatedLessons);

  //   // Update chapters state
  //   setSemesters((prev: any) =>
  //     prev.map((semester: any) => ({
  //       ...semester,
  //       units: semester.units.map((unit: any) => ({
  //         ...unit,
  //         lessons: unit.lessons.map((lesson: any) => {
  //           const updatedLesson = updatedLessons.find(
  //             (l) => l.id === lesson.id
  //           );
  //           return updatedLesson || lesson;
  //         }),
  //       })),
  //     }))
  //   );
  // };
  console.log("error", error);
  // if (!!error === null) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
  //         <p className="text-gray-600">جاري تحميل الدورة...</p>
  //       </div>
  //     </div>
  //   );
  // } else
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <img
          loading="lazy"
            src={errorIllustation}
            alt="404"
            className="w-[200px] h-[200px] mx-auto mb-4"
          />
          <p className="text-gray-600">ليس لديك الصلاحيات لمشاهدة الدورة</p>
        </div>
      </div>
    );
  } else if (allLessons.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <img
          loading="lazy"
            src={errorIllustation}
            alt="404"
            className="w-[200px] h-[200px] mx-auto mb-4"
          />
          <p className="text-gray-600">لا يوجد محتوى لهذه الدورة</p>
        </div>
      </div>
    );
  }
  return (
    <div
      className={`transition-all duration-300 ${
        sidebarVisible ? (sidebarCollapsed ? "md:ml-16" : "md:ml-80") : "ml-0"
      }`}
    >
      {/* Mobile Sidebar Overlay */}
      {sidebarVisible && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarVisible(false)}
        />
      )}
      <Header
        setSidebarVisible={setSidebarVisible}
        sidebarVisible={sidebarVisible}
        courseData={courseData}
      />
      <Sidebar
        setSidebarVisible={setSidebarVisible}
        sidebarVisible={sidebarVisible}
        sidebarCollapsed={sidebarCollapsed}
        sidebarCollapseHandler={sidebarCollapseHandler}
        setCurrentLessonIndex={setCurrentLessonIndex}
        courseData={courseData}
      />
      <CourseContent
        allLessons={allLessons}
        courseData={courseData}
        setAllLessons={setAllLessons}
        setSemesters={setSemesters}
      />
    </div>
  );
};

export default CoursePage;
