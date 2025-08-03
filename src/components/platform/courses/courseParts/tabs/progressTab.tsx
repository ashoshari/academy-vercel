import { BarChart3, CheckCircle, Target } from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";
import { useParams } from "react-router";
const ProgressTab = () => {
  const token = window.localStorage.getItem("accessToken");
  const { courseId } = useParams();
  const { data, isLoading } = useCustomQuery(
    `/training/students/course/${courseId}/progress/`,
    ["progress"],
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const courseProgress = data?.data;
  if (isLoading) {
    console.log("loading");
  } else {
    console.log("courseProgress:", courseProgress?.progress_details);
  }
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">تقدمك في الدورة</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <BarChart3 className="w-8 h-8" />
            <div>
              <div className="text-3xl font-bold">
                {courseProgress?.progress_percentage}%
              </div>
              <div className="text-blue-100">نسبة الإكمال</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="w-8 h-8" />
            <div>
              <div className="text-3xl font-bold">
                {courseProgress?.total_number_of_completed_lessons}
              </div>
              <div className="text-green-100">دروس مكتملة</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <Target className="w-8 h-8" />
            <div>
              <div className="text-3xl font-bold">
                {courseProgress?.total_number_of_not_completed_lessons}
              </div>
              <div className="text-orange-100">دروس متبقية</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">تفاصيل التقدم</h3>
        {courseProgress?.progress_details?.map((lesson: any) => (
          <div
            key={lesson?.id}
            className="border border-gray-200 rounded-xl p-4"
          >
            <h4 className="font-semibold text-gray-900 mb-3">{lesson?.title}</h4>
            <div className="flex items-center justify-between mb-2">
              {/* <span className="text-gray-700 font-medium">{unit.title}</span> */}
              <p className="text-sm text-gray-500">
                {lesson?.total_lessons}/{lesson?.completed_lessons}
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${lesson?.progress_percentage}%` }}
              ></div>
            </div>
            {/* {lesson.units.map((unit: any) => {
              const unitLessons = unit?.lessons;
              const completedInUnit = unitLessons?.filter(
                (l: any) => l.isCompleted
              ).length;
              const unitProgress =
                (completedInUnit / unitLessons?.length) * 100;

              return (
                <div key={unit.id} className="mb-4 last:mb-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 font-medium">
                      {unit.title}
                    </span>
                    <span className="text-sm text-gray-500">
                      {completedInUnit}/{unitLessons?.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${unitProgress}%` }}
                    ></div>
                  </div>
                </div>
              );
            })} */}
          </div>
        ))}
      </div>
    </div>
  );
};
  );
};

export default ProgressTab;
export default ProgressTab;
