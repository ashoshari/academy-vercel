import {
  BookOpen,
  Image,
  Users,
  QrCode,
  CheckCircle2,
  Wallet,
} from "lucide-react";
import StatisticsCards, {
  StatItem,
} from "@/components/dashboard/admin/dashboard/StatisticsCards";
import { useCustomQuery } from "@/hooks/useQuery";
import RevenueChart from "@/components/dashboard/admin/dashboard/RevenueChart";
import RecentActivities from "@/components/dashboard/admin/dashboard/RecentActivities";
import { readUserFromStorage, roleOf } from "@/services/auth";

interface AdminMainStatistics {
  total_students: number;
  active_courses: number;
  total_teachers: number;
  resources: number;
}

interface LibraryMainStatistics {
  number_of_active_generated_codes: number;
  number_of_used_generated_codes: number;
  total_income: number;
  current_balance: number;
}

type MainStatistics = AdminMainStatistics | LibraryMainStatistics;

const Dashboard = () => {
  const user = readUserFromStorage();
  const role = roleOf(user);

  const { data, isLoading } = useCustomQuery(
    "/account/admin/main-statistics/",
    ["main-statistics", role, user?.type?.id],
    undefined,
    !!role,
  );

  const mainStatistics: MainStatistics | undefined = data?.data;

  let items: ReadonlyArray<StatItem<any>> = [];

  if (mainStatistics && "total_students" in mainStatistics) {
    items = [
      {
        key: "total_students",
        label: "إجمالي الطلاب",
        icon: Users,
        variant: "primary",
      },
      { key: "active_courses", label: "الدورات النشطة", icon: BookOpen },
      { key: "total_teachers", label: "المعلمين", icon: Users },
      { key: "resources", label: "الموارد", icon: Image },
    ] as const;
  } else if (
    mainStatistics &&
    "number_of_active_generated_codes" in mainStatistics
  ) {
    items = [
      {
        key: "number_of_active_generated_codes",
        label: "أكواد مفعّلة",
        icon: QrCode,
        variant: "primary",
      },
      {
        key: "number_of_used_generated_codes",
        label: "أكواد مستعملة",
        icon: CheckCircle2,
      },
      {
        key: "total_income",
        label: "إجمالي الدخل",
        icon: Wallet,
      },
      {
        key: "current_balance",
        label: "الرصيد الحالي",
        icon: Wallet,
      },
    ] as const;
  } else {
    items = [
      {
        key: "number_of_courses",
        label: "عدد الدورات",
        icon: BookOpen,
        variant: "primary",
      },
      {
        key: "total_payed_money",
        label: "إجمالي المدفوعات",
        icon: Wallet,
      },
    ] as const;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-(--brand)">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          مرحبًا بك في لوحة التحكم
        </h1>
        <p className="text-gray-600 text-sm">
          من هنا يمكنك إدارة جميع جوانب المنصة التعليمية بسهولة وفعالية
        </p>
      </div>

      <StatisticsCards
        role={role ?? undefined}
        data={mainStatistics}
        items={items}
        loading={isLoading}
        emptyLabel="لا توجد إحصاءات متاحة"
      />
      <RevenueChart />

      <RecentActivities />
    </div>
  );
};

export default Dashboard;
