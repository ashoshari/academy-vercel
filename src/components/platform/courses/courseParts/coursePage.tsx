import { useState, useEffect } from "react";
import Sidebar from "./sidebar.";
import Header from "./header";
import { useParams } from "react-router";
import { useCustomQuery } from "@/hooks/platform/usePlatformQuery";
import CourseContent from "./courseContent";
import { useLesson } from "@/store/platform/useLesson";
import EmptyState from "@/components/core/EmptyState";
const CoursePage = () => {
  const [allLessons, setAllLessons] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [_, setSemesters] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const setCurrentLessonIndex = useLesson(
    (state) => state.setCurrentLessonIndex,
  );
  useEffect(() => {
    if (window.innerWidth < 770) {
      setSidebarVisible(false);
    }
  }, []);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      if (
        window.outerWidth - window.innerWidth > 150 ||
        window.outerHeight - window.innerHeight > 150
      ) {
        document.body.innerHTML = "Access Denied";
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        document.body.style.filter = "blur(20px)";
      } else {
        document.body.style.filter = "none";
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);
  const currentLessonIndex = useLesson((state) => state.currentLessonIndex);
  const setCurrentLesson = useLesson((state) => state.setCurrentLesson);
  // const currentLesson = useLesson((state) => state.currentLesson);
  const { courseId } = useParams();
  const { data, error } = useCustomQuery(
    `/training/students/course/${courseId}/`,
    ["courses", courseId],
  );
  const courseData = data?.data;
  const hasImportOffers = Boolean(courseData?.import_offers?.length);
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
    if (activeLesson) {
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
    setAllLessons(lessons);
  }, [courseData]);
  const typedError = error as any;
  if (
    typedError &&
    typedError?.response?.data?.error != "لا يوجد عنصر بهذا المعرف"
  ) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-white flex items-center justify-center">
        <EmptyState
          title="ليس لديك الصلاحيات لمشاهدة الدورة"
          description="إذا كنت تعتقد أن هذا خطأ، تواصل مع الدعم."
          tone="warning"
          fullHeight
        />
      </div>
    );
  } else if (allLessons.length === 0 && !hasImportOffers) {
    return (
      <div className="min-h-screen bg-linear-to-br px-2 from-gray-50 to-white flex items-center justify-center">
        <EmptyState
          title="لا يوجد محتوى لهذه الدورة"
          description="سيتم إضافة المحتوى قريباً."
          tone="neutral"
          fullHeight
        />
      </div>
    );
  }
  return (
    <div
      className={`transition-all duration-300 ${
        sidebarVisible ? (sidebarCollapsed ? "md:ml-16" : "md:ml-80") : "ml-0"
      }`}
      onContextMenu={(e) => e.preventDefault()}
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
        <CourseContent courseData={courseData} allLessons={allLessons} />
      </div>
  );
};

export default CoursePage;
