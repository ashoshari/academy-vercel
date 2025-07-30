import { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronDown,
  X,
  BookOpen,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";
import { useParams } from "react-router";

const Sidebar = () => {
  const token = window.localStorage.getItem("accessToken");
  const { courseId } = useParams();
  const { data } = useCustomQuery(
    `/training/students/course/${courseId}/`,
    ["courses"],
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const courseData = data?.data;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [semesters, setSemesters] = useState([]);
  //   console.log("courseData", courseData);
  useEffect(() => {
    if (courseData?.semesters) {
      const initialized = courseData.semesters.map((semester: any) => ({
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
      console.log("initialized", initialized);
    }
  }, [courseData]);
  const toggleSemester = (semsterId: any) => {
    setSemesters((prev: any) =>
      prev.map((sm: any) =>
        sm.id === semsterId ? { ...sm, isExpanded: !sm.isExpanded } : sm
      )
    );
  };

  //   console.log("semesters", semesters);
  const toggleUnit = (semesterId: any, unitId: any) => {
    setSemesters((prev: any) =>
      prev.map((sm: any) =>
        sm.id === semesterId
          ? {
              ...sm,
              units: sm.units.map((unit: any) =>
                unit.id === unitId
                  ? { ...unit, isExpanded: !unit.isExpanded }
                  : unit
              ),
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
              units: sm.units.map((unit: any) =>
                unit.id === unitId
                  ? {
                      ...unit,
                      topics: unit.topics.map((topic: any) =>
                        topic.id === topicId
                          ? { ...topic, isExpanded: !topic.isExpanded }
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
        {semesters?.map((semester: any) => (
          <div key={semester?.id} className="mb-2">
            <button
              onClick={() => !sidebarCollapsed && toggleSemester(semester?.id)}
              className={`w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 ${
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
                        className="w-full flex items-center justify-between p-2 rounded hover:bg-gray-100"
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
                                className="w-full flex items-center justify-between p-2 rounded hover:bg-gray-100"
                              >
                                <span className="text-xs">{topic.title}</span>
                                {topic.isExpanded ? (
                                  <ChevronDown className="w-4 h-4 text-gray-500" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-gray-500" />
                                )}
                              </button>

                              {topic.isExpanded &&
                                topic.lessons?.length > 0 && (
                                  <div className="my-[10px] flex-col text-start w-full">
                                    {topic.lessons.map((lesson: any) => (
                                      <button
                                        //   onClick={}
                                        key={lesson.id}
                                        className="my-[10px] px-[10px] h-[50px] w-full flex items-center text-[0.8rem] text-gray-700 bg-gradient-to-r from-blue-500 to-purple-500 py-1 hover:bg-gray-50 rounded"
                                      >
                                        {lesson.title}
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
