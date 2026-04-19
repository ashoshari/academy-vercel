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
  Download,
} from "lucide-react";
import { useExam } from "@/store/platform/useExam";
import { useLesson } from "@/store/platform/useLesson";
import { useParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useCustomPost } from "@/hooks/platform/usePlatformMutation";
import toast from "react-hot-toast";
import { ConfirmationModal } from "@/components/dashboard/core/ConfirmationModal";

type ImportOffer = {
  id: string;
  name: string;
  short_description?: string;
  is_unlocked?: boolean;
  can_import?: boolean;
};

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
  const { courseId } = useParams();
  const queryClient = useQueryClient();
  const [coursesContent, setCoursesContent] = useState<any[]>([]);
  const [importConfirmOffer, setImportConfirmOffer] =
    useState<ImportOffer | null>(null);
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
  const {
    mutateAsync: importOfferMutateAsync,
    isPending: isImportOfferPending,
  } = useCustomPost(`/training/students/course/${courseId}/import-offer/`);

  const importOffers: ImportOffer[] = (courseData?.import_offers ?? []).filter(
    (offer: any) => offer.can_import !== false,
  );
  const hasImportOffers = importOffers.length > 0;

  const handleConfirmImportOffer = async () => {
    if (!importConfirmOffer?.id) return;
    try {
      await importOfferMutateAsync({
        target_course_id: importConfirmOffer.id,
      });
      queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
      toast.success("تم استيراد المحتوى بنجاح");
      setImportConfirmOffer(null);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || "تعذر استيراد الدورة، حاول مرة أخرى",
      );
    }
  };

  const initializeSemesters = (semesters: any[]) => {
    return (semesters || []).map((semester: any) => ({
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
  };

  useEffect(() => {
    if (courseData) {
      const mainCourse = {
        ...courseData,
        isMainCourse: true,
        semesters: initializeSemesters(courseData?.semesters),
      };

      const importedCourses = (courseData?.import_offers || [])
        .filter((offer: any) => offer.semesters && offer.semesters.length > 0)
        .map((offer: any) => ({
          ...offer,
          isMainCourse: false,
          semesters: initializeSemesters(offer?.semesters),
        }));

      setCoursesContent([mainCourse, ...importedCourses]);
    }
  }, [courseData]);

  function getFirstIncompleteLesson(course: any) {
    const allCourses = [course, ...(course?.import_offers || [])];
    for (const c of allCourses) {
      for (const semester of c?.semesters || []) {
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
    }
    return null;
  }
  useEffect(() => {
    const lesson = getFirstIncompleteLesson(courseData);
    if (lesson) {
      if (lesson?.type == "exam") {
        setIsExamMode(true);
      } else {
        setIsExamMode(false);
      }
      setCurrentLesson(lesson || 0);
    }
  }, [courseData]);
  const toggleSemester = (courseId: any, semesterId: any) => {
    setCoursesContent((prev: any) =>
      prev.map((course: any) => {
        if (course.id === courseId || (!course.id && course.isMainCourse)) {
          return {
            ...course,
            semesters: course.semesters.map((sm: any) => {
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
            }),
          };
        }
        return course;
      }),
    );
  };
  const toggleUnit = (courseId: any, semesterId: any, unitId: any) => {
    setCoursesContent((prev: any) =>
      prev.map((course: any) => {
        if (course.id === courseId || (!course.id && course.isMainCourse)) {
          return {
            ...course,
            semesters: course.semesters.map((sm: any) =>
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
                : sm,
            ),
          };
        }
        return course;
      }),
    );
  };
  const toggleTopic = (
    courseId: any,
    semesterId: any,
    unitId: any,
    topicId: any,
  ) => {
    setCoursesContent((prev: any) =>
      prev.map((course: any) => {
        if (course.id === courseId || (!course.id && course.isMainCourse)) {
          return {
            ...course,
            semesters: course.semesters.map((sm: any) =>
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
                                : topic,
                            ),
                          }
                        : unit,
                    ),
                  }
                : sm,
            ),
          };
        }
        return course;
      }),
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
      className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${
        sidebarCollapsed ? "w-16" : "w-80"
      } ${
        sidebarVisible ? "translate-x-0" : "-translate-x-full"
      } fixed left-0 top-20 h-[calc(100vh-80px)] z-40 overflow-y-auto`}
    >
      {/* Sidebar Header */}
      <div className="shrink-0 p-4 border-b border-gray-200 bg-linear-to-r from-blue-50 to-purple-50">
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
                className="bg-linear-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${course?.progress_bar}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Course Content — scroll; import block stays at bottom */}
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          {coursesContent?.map((courseItem: any) => (
            <div
              key={courseItem.id || "main"}
              className={`${!courseItem.isMainCourse ? "mt-4 pt-4 border-t border-gray-200" : ""}`}
            >
              {!courseItem.isMainCourse && !sidebarCollapsed && (
                <h4 className="font-bold text-gray-800 text-sm mb-3 px-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-(--brand)" />
                  {courseItem.name}
                </h4>
              )}
              {courseItem.semesters?.map((semester: any) => (
                <div key={semester?.id} className="mb-2">
                  <button
                    onClick={() =>
                      !sidebarCollapsed &&
                      toggleSemester(courseItem.id, semester?.id)
                    }
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
                              onClick={() =>
                                toggleUnit(courseItem.id, semester.id, unit.id)
                              }
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
                                        toggleTopic(
                                          courseItem.id,
                                          semester.id,
                                          unit.id,
                                          topic.id,
                                        )
                                      }
                                      className="w-full flex items-center justify-between p-2 rounded hover:bg-gray-100 cursor-pointer"
                                    >
                                      <span className="text-xs">
                                        {topic.title}
                                      </span>

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
                                        <div className="my-2.5 flex-col text-start w-full">
                                          {topic?.lessons?.map(
                                            (lesson: any) => (
                                              <button
                                                onClick={() =>
                                                  handleLessonClick(lesson)
                                                }
                                                key={lesson?.id}
                                                className={`my-2.5 px-2.5 h-12.5 w-full flex items-center text-[0.8rem] cursor-pointer text-gray-700 
                                                 ${
                                                   lesson?.is_completed &&
                                                   "bg-green-100 text-green-600 hover:bg-green-200 duration-500"
                                                 } py-1 hover:bg-gray-50 rounded ${
                                                   currentLesson?.id ==
                                                     lesson?.id &&
                                                   "bg-linear-to-r from-(--brand-secondary) to-(--brand-secondary-dark) text-white"
                                                 }`}
                                              >
                                                <div className="flex justify-between items-center p-1.25 w-full">
                                                  <div className="text-start">
                                                    <h6 className="">
                                                      {lesson?.title}
                                                    </h6>
                                                    <p className="text-[0.7rem]">
                                                      {lesson.time_in_minutes}{" "}
                                                      دقيقة
                                                    </p>
                                                  </div>
                                                  {currentLesson?.id ==
                                                  lesson?.id ? (
                                                    <Play className="w-4 h-4" />
                                                  ) : (
                                                    lesson?.is_completed && (
                                                      <CheckCircle className="w-4 h-4" />
                                                    )
                                                  )}
                                                </div>
                                              </button>
                                            ),
                                          )}
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
          ))}
        </div>

        {hasImportOffers && !sidebarCollapsed && (
          <div className="shrink-0 border-t border-gray-200 bg-linear-to-l from-orange-50/50 to-white p-3">
            <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold text-gray-900">
              <Download className="h-3.5 w-3.5 shrink-0 text-(--brand)" />
              استيراد الدورة
            </h3>
            <ul className="space-y-2">
              {importOffers.map((offer) => (
                <li
                  key={offer.id}
                  className="rounded-lg border border-gray-100 bg-white/90 p-2.5 shadow-sm"
                >
                  <div className="mb-2 min-w-0 text-right">
                    <div className="line-clamp-2 text-xs font-semibold text-gray-900">
                      {offer.name}
                    </div>
                    {offer.short_description ? (
                      <p className="mt-1 line-clamp-2 text-[0.65rem] leading-snug text-gray-600">
                        {offer.short_description}
                      </p>
                    ) : null}
                    {offer.can_import === false ? (
                      <p className="mt-1 text-[0.6rem] text-amber-700">
                        لا يمكن الاستيراد حالياً.
                      </p>
                    ) : null}
                    {offer.can_import && offer.is_unlocked === false ? (
                      <p className="mt-0.5 text-[0.6rem] text-gray-500">
                        قد تحتاج لإكمال متطلبات الفتح أولاً.
                      </p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    disabled={!offer.can_import}
                    onClick={() => setImportConfirmOffer(offer)}
                    className="w-full rounded-lg bg-linear-to-r from-(--brand-secondary) to-(--brand-secondary-dark) py-2 text-[0.7rem] font-semibold text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    استيراد الدورة
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <ConfirmationModal
        open={Boolean(importConfirmOffer)}
        onClose={() => setImportConfirmOffer(null)}
        onConfirm={handleConfirmImportOffer}
        title="تأكيد استيراد الدورة"
        description={
          <span>
            هل تريد استيراد محتوى الدورة{" "}
            <strong className="text-gray-900">
              {importConfirmOffer?.name}
            </strong>{" "}
            إلى الدورة الحالية؟ قد يستغرق الأمر لحظات.
          </span>
        }
        confirmLabel="تأكيد الاستيراد"
        variant="neutral"
        isPending={isImportOfferPending}
      />
    </div>
  );
  return renderSidebar();
};
export default Sidebar;
