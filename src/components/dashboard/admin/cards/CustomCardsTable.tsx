/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Plus, Edit, Users, Grid, Rows, CreditCard } from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";
import { useNavigate } from "react-router";
import Pagination from "@/components/dashboard/core/Pagination";
import Spinner from "@/components/dashboard/Spinner";
import { CustomCard } from "@/pages/dashboard/admin/cards/CardCustomPrice";
import PriceCard from "./PriceCard";
import EditCustomCard from "./EditCustomCard";
import AddCustomCard from "./AddCustomCard";

const CustomCardTable = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CustomCard | null>(null);

  const navigate = useNavigate();
  // filter
  const [filters, setFilters] = useState({
    page: 1,
    page_size: 5,
  });

  const [viewMode, setViewMode] = useState<"grid" | "table">("table");

  const queryParams = new URLSearchParams();
  queryParams.append("page", filters.page?.toString());
  queryParams.append("page_size", String(filters.page_size));

  const dataUserCardPrices = useCustomQuery(
    `/cards/user-card-prices/?${queryParams.toString()}`,
    ["user-card-prices", filters]
  );

  return (
    <div
      className="space-y-6 flex flex-col items-start justify-start w-full"
      dir="rtl"
    >
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            إدارة البطاقات المخصصة
          </h1>
          <p className="text-gray-600 text-sm">
            إدارة شاملة لجميع البطاقات المخصصة في المنصة
          </p>
        </div>
        <button
          onClick={() => {
            setShowAddModal(true);
          }}
          className="cursor-pointer bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2 text-sm"
        >
          <Plus size={16} />
          إضافة سعر مخصص
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">إجمالي البطاقات المخصصة</p>
              <p className="text-3xl font-bold text-gray-800">
                {dataUserCardPrices?.data?.data?.length || "-"}
              </p>
            </div>
            <CreditCard className="w-12 h-12 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50 w-full">
        <div className="grid grid-cols-5 gap-4">
          {/* View Mode + Count */}
          <div className="flex justify-between items-center gap-3 mt-1 w-full">
            {/* View Mode */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("table")}
                className={`cursor-pointer p-2 rounded-lg transition-colors ${
                  viewMode === "table"
                    ? "bg-orange-100 text-orange-600"
                    : "text-gray-400 hover:bg-gray-100"
                }`}
              >
                <Rows size={16} />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`cursor-pointer p-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-orange-100 text-orange-600"
                    : "text-gray-400 hover:bg-gray-100"
                }`}
              >
                <Grid size={16} />
              </button>
            </div>

            {/* Results Count */}
            <div className="bg-gray-50 rounded-lg px-4 py-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">
                {dataUserCardPrices?.data?.pagination?.count} بطاقة
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* libraries Grid/Table */}
      {dataUserCardPrices?.isLoading ? (
        <div className="flex justify-center w-full">
          <Spinner size={40} thickness={4} className="text-orange-500" />
        </div>
      ) : !dataUserCardPrices?.data?.data ||
        dataUserCardPrices?.data?.data?.length === 0 ? (
        <div className="col-span-full bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-orange-100/50">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            لا توجد نتائج
          </h3>
          <p className="text-gray-500 mb-6">
            ابدأ بإضافة اسعار جديدة مخصصة للبطافات
          </p>

          <button
            onClick={() => navigate("/dashboard/libraries/add")}
            className="cursor-pointer bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <Plus size={16} />
            إضافة سعر مخصص جديد
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {dataUserCardPrices?.data?.data?.map((card: CustomCard) => (
              <PriceCard
                key={card.id}
                priceCard={card}
                setSelectedCard={setSelectedCard}
                setShowEditModal={setShowEditModal}
              />
            ))}

            {dataUserCardPrices?.data?.data?.length === 0 && (
              <div className="col-span-full bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-orange-100/50">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  لا يوجد اسعار مخصصة
                </h3>

                {
                  <button
                    onClick={() => navigate("/dashboard/libraries/add")}
                    className="cursor-pointer bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2 mx-auto"
                  >
                    <Plus size={16} />
                    إضافة سعر مخصص جديد
                  </button>
                }
              </div>
            )}
          </div>
          <Pagination
            currentPage={filters.page}
            onPageChange={(page: any) =>
              setFilters((prev) => ({ ...prev, page }))
            }
            count={dataUserCardPrices?.data?.pagination?.count}
            pageSize={filters.page_size}
          />
        </>
      ) : (
        <>
          {/* Table View */}
          <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-orange-100/50 w-full">
            <div className="w-full max-w-[300px] min-w-full overflow-auto pb-6">
              <table className="min-w-[1000px] w-full text-sm bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs whitespace-nowrap font-medium text-gray-500 uppercase tracking-wider">
                      نوع المستخدم
                    </th>
                    <th className="px-6 py-3 text-right text-xs whitespace-nowrap font-medium text-gray-500 uppercase tracking-wider">
                      الاسم
                    </th>
                    <th className="px-6 py-3 text-right text-xs whitespace-nowrap font-medium text-gray-500 uppercase tracking-wider">
                      رقم الهاتف
                    </th>
                    <th className="px-6 py-3 text-right text-xs whitespace-nowrap font-medium text-gray-500 uppercase tracking-wider">
                      سعر البطاقة الاساسي
                    </th>
                    <th className="px-6 py-3 text-right text-xs whitespace-nowrap font-medium text-gray-500 uppercase tracking-wider">
                      سعر البطاقة الافتراضي
                    </th>
                    <th className="px-6 py-3 text-right text-xs whitespace-nowrap font-medium text-gray-500 uppercase tracking-wider">
                      سعر البطاقة المخصص
                    </th>
                    <th className="px-6 py-3 text-right text-xs whitespace-nowrap font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dataUserCardPrices?.data?.data?.map((card: CustomCard) => (
                    <tr key={card?.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="font-medium text-gray-900">
                            {card?.user?.type?.name === "library"
                              ? "مكتبة"
                              : "معلم"}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="font-medium text-gray-900">
                            {card?.user?.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {card?.user?.mobile_number || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {card?.card?.price || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {card?.user?.type?.name === "library"
                          ? card?.card?.default_library_price
                          : card?.card?.default_teacher_price || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {card?.price || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedCard(card);
                              setShowEditModal(true);
                            }}
                            className="cursor-pointer p-1 text-gray-400 hover:text-orange-600 transition-colors"
                            title="تعديل"
                          >
                            <Edit size={16} />
                          </button>
                          {/* <button
                          onClick={() => handleDeletecard()}
                          className="cursor-pointer p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="حذف"
                        >
                          <Trash2 size={16} />
                        </button> */}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination
            currentPage={filters.page}
            onPageChange={(page: any) =>
              setFilters((prev) => ({ ...prev, page }))
            }
            count={dataUserCardPrices?.data?.pagination?.count}
            pageSize={filters.page_size}
          />
        </>
      )}
      {showEditModal && (
        <EditCustomCard
          card={selectedCard as CustomCard}
          setShowEditModal={setShowEditModal}
        />
      )}
      {showAddModal && <AddCustomCard setShowAddModal={setShowAddModal} />}
    </div>
  );
};

export default CustomCardTable;
