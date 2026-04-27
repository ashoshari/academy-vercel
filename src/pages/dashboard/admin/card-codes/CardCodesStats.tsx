import StatsCardsSkeleton from "@/components/dashboard/skeletons/StatsCardsSkeleton";
import { useCustomQuery } from "@/hooks/useQuery";
import { CheckCircle, CreditCard, Hash } from "lucide-react";

function CardCodesStats() {
  const cardCodesStatistics = useCustomQuery("cards/codes-statistics/", [
    "card-codes-statistics",
  ]);
  return cardCodesStatistics?.isPending ? (
    <StatsCardsSkeleton
      count={3}
      gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    />
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-(--brand)">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">إجمالي الكودات</p>
            <p className="text-3xl font-bold text-gray-800">
              {cardCodesStatistics?.data?.data?.total_generated_codes ?? "-"}
            </p>
          </div>
          <Hash className="w-12 h-12 text-(--brand)" />
        </div>
      </div>

      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-(--brand)">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">الكودات المستخدمة</p>
            <p className="text-3xl font-bold text-red-600">
              {cardCodesStatistics?.data?.data?.used_generated_codes ?? "-"}
            </p>
          </div>
          <CheckCircle className="w-12 h-12 text-red-500" />
        </div>
      </div>

      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-(--brand)">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">الكودات المتاحة</p>
            <p className="text-3xl font-bold text-green-600">
              {cardCodesStatistics?.data?.data?.unused_generated_codes ?? "-"}
            </p>
          </div>
          <CreditCard className="w-12 h-12 text-green-500" />
        </div>
      </div>
    </div>
  );
}

export default CardCodesStats;
