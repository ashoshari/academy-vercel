import DashboardStatCard, {
  DASHBOARD_STATS_GRID_3,
} from "@/components/dashboard/admin/cards/DashboardStatCard";
import { CreditCard, LucideIcon, ShoppingCart, Wallet } from "lucide-react";

type SalesStatKey =
  | "total_sales"
  | "total_teacher_share"
  | "total_card_revenue";
const SALES_STAT_ITEMS: ReadonlyArray<{
  key: SalesStatKey;
  label: string;
  icon: LucideIcon;
  valueClassName: string;
  iconClassName: string;
}> = [
  {
    key: "total_sales",
    label: "إجمالي المبيعات",
    icon: ShoppingCart,
    valueClassName: "text-gray-800",
    iconClassName: "text-orange-500",
  },
  {
    key: "total_teacher_share",
    label: "إجمالي حصة المعلم",
    icon: Wallet,
    valueClassName: "text-green-600",
    iconClassName: "text-green-500",
  },
  {
    key: "total_card_revenue",
    label: "إجمالي إيرادات البطاقات",
    icon: CreditCard,
    valueClassName: "text-(--brand-secondary)",
    iconClassName: "text-blue-500",
  },
];

function SalesStats({ stats }: { stats: any }) {
  return (
    <div className={DASHBOARD_STATS_GRID_3}>
      {SALES_STAT_ITEMS.map(
        ({ key, label, icon, valueClassName, iconClassName }) => (
          <DashboardStatCard
            key={key}
            label={label}
            value={stats?.[key] ?? "—"}
            icon={icon}
            valueClassName={valueClassName}
            iconClassName={iconClassName}
          />
        ),
      )}
    </div>
  );
}

export default SalesStats;
