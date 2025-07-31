import {
  BarChart3,
  CheckCircle,
  Target,
} from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";
import { useParams } from "react-router";
const ProgressTab = () => {
  const {courseId} = useParams()
  const { data } = useCustomQuery(`/training/students/course/${courseId}/progress/`,["progress"])
  
  const courseProgress = data?.data
  return (
        <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">تقدمك في الدورة</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <BarChart3 className="w-8 h-8" />
            <div>
              <div className="text-3xl font-bold">
                {/* {getProgressPercentage()}% */}
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
                {/* {allLessons.filter((l: any) => l.isCompleted).length} */}
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
                {/* {allLessons.length -
                  allLessons.filter((l: any) => l.isCompleted).length} */}
              </div>
              <div className="text-orange-100">دروس متبقية</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">تفاصيل التقدم</h3>
        {/* {chapters.map((chapter) => (
          <div
            key={chapter.id}
            className="border border-gray-200 rounded-xl p-4"
          >
            <h4 className="font-semibold text-gray-900 mb-3">
              {chapter.title}
            </h4>
            {chapter.units.map((unit: any) => {
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
            })}
          </div>
        ))} */}
      </div>
    </div>
  )
}

export default ProgressTab
