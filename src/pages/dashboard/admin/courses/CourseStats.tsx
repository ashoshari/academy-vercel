import DashboardStatCard, {
  DASHBOARD_STATS_GRID_4,
} from "@/components/dashboard/admin/cards/DashboardStatCard";
import StatsCardsSkeleton from "@/components/dashboard/skeletons/StatsCardsSkeleton";
import { useCustomQuery } from "@/hooks/useQuery";
import { BookOpen, CheckCircle, Users, XCircle } from "lucide-react";

function CourseStats({ role }: { role: string }) {
  const { data: coursesStats, isLoading: isLoadingCourseStats } =
    useCustomQuery("/training/admin/courses-statistics/", [
      "courses-stats",
      role,
    ]);
  const courseStatsData = coursesStats?.data;
  return isLoadingCourseStats ? (
    <StatsCardsSkeleton count={4} gridClassName={DASHBOARD_STATS_GRID_4} />
  ) : (
    <div className={DASHBOARD_STATS_GRID_4}>
      <DashboardStatCard
        label="إجمالي الدورات"
        value={courseStatsData?.total_courses ?? "-"}
        icon={BookOpen}
        valueClassName="text-gray-800"
        iconClassName="text-(--brand)"
      />
      <DashboardStatCard
        label="الدورات النشطة"
        value={courseStatsData?.active_courses ?? "-"}
        icon={CheckCircle}
        valueClassName="text-green-600"
        iconClassName="text-green-500"
      />
      <DashboardStatCard
        label="الدورات الغير نشطة"
        value={courseStatsData?.inactive_courses ?? "-"}
        icon={XCircle}
        valueClassName="text-red-600"
        iconClassName="text-red-500"
      />
      <DashboardStatCard
        label="إجمالي الطلاب"
        value={courseStatsData?.total_students_in_enrolled_courses ?? "-"}
        icon={Users}
        valueClassName="text-(--brand-secondary)"
        iconClassName="text-blue-500"
      />
    </div>
  );
}

export default CourseStats;
