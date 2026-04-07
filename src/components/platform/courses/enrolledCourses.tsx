import React from "react";
import { Play, Clock, BookOpen, ChevronRight, ChevronLeft } from "lucide-react";
import useTokenStore from "@/store/platform/useToken";
import { useNavigate } from "react-router";
import { useCustomQuery } from "@/hooks/platform/usePlatformQuery";
import { formatDateTimeSimple } from "@/utils/formatDateTime";
import { isArray } from "lodash";

const EnrolledCourses: React.FC = () => {
  const isLoggedIn = useTokenStore((state) => state.isLoggedIn);
  const navigate = useNavigate();
  const numberOfCourses = 3;

  // GET MY COURSES
  const { data, error } = useCustomQuery(
    `/training/students/my-courses/?page_size=${numberOfCourses}`,
    ["myCourses", numberOfCourses],
  );
  if (!isLoggedIn) {
    return null;
  }
  const myCoursesData = data?.my_courses?.data;
  const myCoursesStats = data?.statistics;

  return (
    <>
      {!error && (
        <section className="py-16 bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
          {/* Background Decorations */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-bl from-blue-100/20 to-purple-100/20 rounded-full translate-x-48 -translate-y-48 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-linear-to-tr from-indigo-100/20 to-blue-100/20 rounded-full -translate-x-36 translate-y-36 animate-pulse delay-1000"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-linear-to-r from-(--brand-secondary) to-(--brand-secondary-dark) rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    دوراتي{" "}
                    <span className="bg-linear-to-r from-(--brand-secondary) to-(--brand-secondary-dark) bg-clip-text text-transparent">
                      الحالية
                    </span>
                  </h2>
                  <p className="text-gray-600">
                    تابع تقدمك واستكمل رحلتك التعليمية
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate("/all-courses")}
                className="cursor-pointer hidden md:flex items-center space-x-2 text-(--brand-secondary) hover:text-(--brand-secondary-dark) font-medium transition-colors duration-200"
              >
                <span>عرض الكل</span>
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid sm:grid-cols-3 grid-cols-1 gap-4 mb-8">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <div className="text-2xl font-bold text-(--brand-secondary) mb-1">
                  {myCoursesStats?.number_of_completed_lessons}
                </div>
                <div className="text-sm text-gray-600">دروس مكتملة</div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {myCoursesStats?.percentage_of_completed_lessons_for_all_enrolled_courses.toFixed(
                    2,
                  )}
                  %
                </div>
                <div className="text-sm text-gray-600">متوسط التقدم</div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {myCoursesStats?.number_of_active_enrolled_courses}
                </div>
                <div className="text-sm text-gray-600">دورات نشطة</div>
              </div>
            </div>

            {/* Courses Grid - Compact Design */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCoursesData?.map((course: any, index: number) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 group transform hover:scale-105"
                  //   onClick={() => onCourseClick(course.id)}
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {isArray(course?.specialization_material) ? (
                            course?.specialization_material?.map(
                              (material: any, index: number) => (
                                <span
                                  key={index}
                                  className="bg-blue-100 text-(--brand-secondary) px-2 py-1 rounded-lg text-xs font-medium"
                                >
                                  {material?.name}
                                </span>
                              ),
                            )
                          ) : (
                            <span className="bg-blue-100 text-(--brand-secondary) px-2 py-1 rounded-lg text-xs font-medium">
                              {course?.specialization_material?.name || "-"}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-(--brand-secondary) transition-colors duration-300">
                          {course?.course_name || "-"}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {course?.teacher || "-"}
                        </p>
                      </div>

                      {/* Circular Progress */}
                      <div className="relative w-12 h-12 shrink-0">
                        <svg
                          className="w-12 h-12 transform -rotate-90"
                          viewBox="0 0 48 48"
                        >
                          <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="#e5e7eb"
                            strokeWidth="4"
                            fill="none"
                          />
                          <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="#3b82f6"
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={2 * Math.PI * 20}
                            strokeDashoffset={
                              (1 - course?.progress / 100) * (2 * Math.PI * 20)
                            }
                            strokeLinecap="round"
                            className="transition-all duration-500"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-bold text-(--brand-secondary)">
                            {course?.progress}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Details */}
                    <div className="bg-gray-50 rounded-xl p-3 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">التقدم</span>
                        <span className="text-sm font-medium text-gray-900">
                          {course?.total_number_of_completed_lessons}/
                          {course?.total_lessons}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-linear-to-r from-(--brand-secondary) to-(--brand-secondary-dark) h-2 rounded-full transition-all duration-500"
                          style={{ width: `${course?.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Next Lesson */}
                    <div className="bg-linear-to-r from-blue-50 to-purple-50 rounded-xl p-3 mb-4">
                      <div className="flex items-center space-x-2 mb-1">
                        <Play className="w-4 h-4 text-(--brand-secondary)" />
                        <span className="text-sm font-medium text-gray-900">
                          الدرس التالي:
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                        {course?.next_lesson || "لا يوجد"}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-3 mb-4 text-xs justify-between">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-600">
                          {formatDateTimeSimple(course?.enrollment_created_at)}
                        </span>
                      </div>
                    </div>

                    {/* Continue Button */}
                    <button
                      onClick={() =>
                        navigate(`/coursePage/${course?.course_id}`)
                      }
                      className="w-full cursor-pointer bg-linear-to-r from-(--brand-secondary) to-(--brand-secondary-dark) text-white py-2.5 px-4 rounded-xl font-semibold hover:from-(--brand-secondary-dark) hover:to-(--brand-secondary) transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center space-x-2 text-sm"
                    >
                      <Play className="w-4 h-4" />
                      <span>متابعة التعلم</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Button - Mobile */}
            <div className="text-center mt-8 md:hidden">
              <button
                onClick={() => navigate("/all-courses")}
                className="cursor-pointer bg-linear-to-r from-(--brand-secondary) to-(--brand-secondary-dark) text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto"
              >
                <BookOpen className="w-5 h-5" />
                <span>عرض جميع دوراتي</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default EnrolledCourses;
