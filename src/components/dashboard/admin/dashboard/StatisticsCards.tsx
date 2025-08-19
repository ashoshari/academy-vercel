import { useCustomQuery } from "@/hooks/useQuery";
import { BookOpen, Image, Users } from "lucide-react";

interface MainStatistics {
  total_students: number;
  active_courses: number;
  total_teachers: number;
  resources: number;
}

export default function StatisticsCards() {
  const data = useCustomQuery("/account/admin/main-statistics/", [
    "main-statistics",
  ]);

  const mainStatistics: MainStatistics = data?.data?.data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm">إجمالي الطلاب</p>
            <p className="text-3xl font-bold">
              {mainStatistics?.total_students}
            </p>
          </div>
          <Users className="w-12 h-12 text-orange-200" />
        </div>
      </div>

      <div className="bg-white/95 backdrop-blur-xl rounded-xl p-6 shadow-lg border border-orange-100/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">الدورات النشطة</p>
            <p className="text-3xl font-bold text-gray-800">
              {mainStatistics?.active_courses}
            </p>
          </div>
          <BookOpen className="w-12 h-12 text-orange-500" />
        </div>
      </div>

      <div className="bg-white/95 backdrop-blur-xl rounded-xl p-6 shadow-lg border border-orange-100/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">المعلمين</p>
            <p className="text-3xl font-bold text-gray-800">
              {mainStatistics?.total_teachers}
            </p>
          </div>
          <Users className="w-12 h-12 text-orange-500" />
        </div>
      </div>

      <div className="bg-white/95 backdrop-blur-xl rounded-xl p-6 shadow-lg border border-orange-100/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">الموارد</p>
            <p className="text-3xl font-bold text-gray-800">
              {mainStatistics?.resources}
            </p>
          </div>
          <Image className="w-12 h-12 text-orange-500" />
        </div>
      </div>
    </div>
  );
}
