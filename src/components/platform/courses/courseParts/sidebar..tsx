import { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronDown,
  X,
  BookOpen,
  PanelLeftClose,
  PanelLeftOpen,
  Play,
  CheckCircle,
} from "lucide-react";
// import toast from "react-hot-toast";
import { useExam } from "@/store/platform/useExam";
import { useLesson } from "@/store/platform/useLesson";

const Sidebar = ({
  setSidebarVisible,
  sidebarVisible,
  sidebarCollapsed,
  sidebarCollapseHandler,
  // setCurrentLessonIndex,
  courseData,
}: {
  setSidebarVisible: any;
  sidebarVisible: any;
  sidebarCollapsed: any;
  sidebarCollapseHandler: any;
  setCurrentLessonIndex: any;
  courseData: any;
}) => {
  const [semesters, setSemesters] = useState([]);
  const setIsExamMode = useExam((state) => state.setIsExamMode);
  const setStartExam = useExam((state) => state.setStartExam);
  const currentLesson = useLesson((state) => state.currentLesson);
  // const currentLessonIndex = useLesson((state) => state.currentLessonIndex);
  const [course, setCourse] = useState(courseData);
  useEffect(() => {
    if (courseData) {
      setCourse(courseData);
    }
  }, [courseData]);
  const setCurrentLesson = useLesson((state) => state.setCurrentLesson);
  useEffect(() => {
    if (courseData?.semesters) {
      const initialized = courseData?.semesters?.map((semester: any) => ({
        ...semester,
        isExpanded: false,
        units:
          semester?.units?.map((unit: any) => ({
            ...unit,
            isExpanded: false,
            topics:
              unit?.topics?.map((topic: any) => ({
                ...topic,
                isExpanded: false,
              })) || [],
          })) || [],
      }));
      setSemesters(initialized);
    }
  }, [courseData]);

  function getFirstIncompleteLesson(course: any) {
    for (const semester of course?.semesters || []) {
      for (const unit of semester?.units || []) {
        for (const topic of unit?.topics || []) {
          for (let i = 0; i < topic?.lessons?.length; i++) {
            const lesson = topic?.lessons[i];
            if (!lesson?.is_completed) {
              return lesson;
            }
          }
        }
      }
    }
    return null;
  }
  useEffect(() => {
    const lesson = getFirstIncompleteLesson(courseData);
    if (lesson) {
      lesson?.type == "exam" ? setIsExamMode(true) : setIsExamMode(false);
      setCurrentLesson(lesson || 0);
    }
  }, [courseData]);
  const toggleSemester = (semesterId: any) => {
    setSemesters((prev: any) =>
      prev.map((sm: any) => {
        if (sm.id === semesterId) {
          const isExpanding = !sm.isExpanded;
          return {
            ...sm,
            isExpanded: isExpanding,
            units: sm.units.map((unit: any) => ({
              ...unit,
              isExpanded: isExpanding ? unit.isExpanded : false,
              topics: unit.topics.map((topic: any) => ({
                ...topic,
                isExpanded: isExpanding ? topic.isExpanded : false,
              })),
            })),
          };
        }
        return sm;
      })
    );
  };
  const toggleUnit = (semesterId: any, unitId: any) => {
    setSemesters((prev: any) =>
      prev.map((sm: any) =>
        sm.id === semesterId
          ? {
              ...sm,
              units: sm.units.map((unit: any) => {
                if (unit.id === unitId) {
                  const isExpanding = !unit.isExpanded;
                  return {
                    ...unit,
                    isExpanded: isExpanding,
                    topics: unit.topics.map((topic: any) => ({
                      ...topic,
                      isExpanded: isExpanding ? topic.isExpanded : false,
                    })),
                  };
                }
                return unit;
              }),
            }
          : sm
      )
    );
  };
  const toggleTopic = (semesterId: any, unitId: any, topicId: any) => {
    setSemesters((prev: any) =>
      prev.map((sm: any) =>
        sm.id === semesterId
          ? {
              ...sm,
              units: sm?.units.map((unit: any) =>
                unit?.id === unitId
                  ? {
                      ...unit,
                      topics: unit?.topics.map((topic: any) =>
                        topic?.id === topicId
                          ? { ...topic, isExpanded: !topic?.isExpanded }
                          : topic
                      ),
                    }
                  : unit
              ),
            }
          : sm
      )
    );
  };
  const handleLessonClick = (lesson: any) => {
    // if (lesson?.is_completed) {
    setCurrentLesson(lesson);
    // setActive(lessonIndex);
    if (lesson?.type != "exam") {
      setIsExamMode(false);
    } else {
      setIsExamMode(true);
      setStartExam(true);
    }
    // } else {
    //   toast.error("يجب استكمال الدروس السابق");
    // }
  };
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
                {course?.name}
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                {course?.teacher?.name}
              </p>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => sidebarCollapseHandler(!sidebarCollapsed)}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors duration-200 cursor-pointer"
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => setSidebarVisible(false)}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors duration-200 md:hidden cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!sidebarCollapsed && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
              <span>التقدم</span>
              <span>{course?.progress_bar}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${course?.progress_bar}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className="p-2">
        {semesters?.map((semester: any) => (
          <div key={semester?.id} className="mb-2">
            <button
              onClick={() => !sidebarCollapsed && toggleSemester(semester?.id)}
              className={`w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer${
                sidebarCollapsed ? "justify-center" : ""
              }`}
            >
              {!sidebarCollapsed ? (
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
              ) : (
                <BookOpen className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {semester?.units?.length > 0 &&
              !sidebarCollapsed &&
              semester.isExpanded && (
                <div className="ml-4 mt-2 space-y-1">
                  {semester.units.map((unit: any) => (
                    <div key={unit.id}>
                      <button
                        onClick={() => toggleUnit(semester.id, unit.id)}
                        className="w-full flex items-center justify-between p-2 rounded hover:bg-gray-100 cursor-pointer"
                      >
                        <span className="text-sm">{unit.title}</span>
                        {unit.isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                        )}
                      </button>

                      {unit.isExpanded && unit.topics?.length > 0 && (
                        <div className="ml-4">
                          {unit.topics.map((topic: any) => (
                            <div key={topic.id}>
                              <button
                                onClick={() =>
                                  toggleTopic(semester.id, unit.id, topic.id)
                                }
                                className="w-full flex items-center justify-between p-2 rounded hover:bg-gray-100 cursor-pointer"
                              >
                                <span className="text-xs">{topic.title}</span>

                                {topic.lessons.length > 0 ? (
                                  topic.isExpanded ? (
                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 text-gray-500" />
                                  )
                                ) : null}
                              </button>

                              {topic.isExpanded &&
                                topic.lessons?.length > 0 && (
                                  <div className="my-[10px] flex-col text-start w-full">
                                    {topic?.lessons?.map((lesson: any) => (
                                      <button
                                        onClick={() =>
                                          handleLessonClick(lesson)
                                        }
                                        key={lesson?.id}
                                        className={`my-[10px] px-[10px] h-[50px] w-full flex items-center text-[0.8rem] cursor-pointer text-gray-700 
                                             ${
                                               lesson?.is_completed &&
                                               "bg-green-100 text-green-600 hover:bg-green-200 duration-[0.5s]"
                                             } py-1 hover:bg-gray-50 rounded ${
                                          currentLesson?.id == lesson?.id &&
                                          "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                                        }`}
                                      >
                                        <div className="flex justify-between items-center p-[5px] w-full">
                                          <div className="text-start">
                                            <h6 className="">
                                              {lesson?.title}
                                            </h6>
                                            <p className="text-[0.7rem]">
                                              {lesson.time_in_minutes} دقيقة
                                            </p>
                                          </div>
                                          {currentLesson?.id == lesson?.id ? (
                                            <Play className="w-4 h-4" />
                                          ) : (
                                            lesson?.is_completed && (
                                              <CheckCircle className="w-4 h-4" />
                                            )
                                          )}
                                        </div>
                                      </button>
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
  return renderSidebar();
};
export default Sidebar;
