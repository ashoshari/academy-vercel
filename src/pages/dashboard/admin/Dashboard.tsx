import RecentActivities from "@/components/dashboard/admin/dashboard/RecentActivities";
import RevenueChart from "@/components/dashboard/admin/dashboard/RevenueChart";
import StatisticsCards from "@/components/dashboard/admin/dashboard/StatisticsCards";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          مرحبًا بك في لوحة التحكم
        </h1>
        <p className="text-gray-600 text-sm">
          من هنا يمكنك إدارة جميع جوانب المنصة التعليمية بسهولة وفعالية
        </p>
      </div>

      <StatisticsCards />

      <RevenueChart />

      <RecentActivities />
    </div>
  );
};

export default Dashboard;
