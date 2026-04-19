import { useState } from "react";
import { Plus, CreditCard, Trash2, Edit } from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";
import { useCustomRemove } from "@/hooks/useMutation";
import toast from "react-hot-toast";
import Pagination from "@/components/dashboard/core/Pagination";
import { ConfirmationModal } from "@/components/dashboard/core/ConfirmationModal";
import TableSkeleton from "@/components/dashboard/skeletons/TableSkeleton";
import AddInstallmentPlan from "./AddInstallmentPlan";
import EditInstallmentPlan from "./EditInstallmentPlan";

const InstallmentPlansPage = () => {
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);

  const { data, isLoading } = useCustomQuery(`/cards/installments/`, [
    "installments",
    page,
  ]);

  const plansData = data?.data;
  const paginationData = data?.pagination;

  const { mutateAsync: removePlan, isPending: isRemoving } = useCustomRemove(
    () => `/cards/installments/${planToDelete}/`,
    ["installments"],
  );

  const handleDeleteConfirm = async () => {
    if (!planToDelete) return;
    try {
      await removePlan();
      toast.success("تم حذف خطة التقسيط بنجاح");
      setPlanToDelete(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "حدث خطأ أثناء الحذف");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex md:flex-row flex-col items-center gap-5 justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            إدارة خطط التقسيط
          </h1>
          <p className="text-gray-600 text-sm">
            إدارة وإضافة خطط التقسيط للبطاقات
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-brand-slide px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 text-sm"
          >
            <Plus size={16} />
            إضافة خطة جديدة
          </button>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <TableSkeleton rows={10} header={true} />
      ) : !plansData || plansData.length === 0 ? (
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-(--brand)">
          <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            لا توجد خطط تقسيط
          </h3>
          <p className="text-gray-500 mb-6">ابدأ بإضافة خطة تقسيط جديدة</p>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn-brand-slide px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <Plus size={16} />
            إضافة خطة جديدة
          </button>
        </div>
      ) : (
        <>
          <div className="w-full max-w-50 min-w-full pb-6 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-(--brand) overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      اسم الخطة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      عدد الدفعات
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      تفاصيل الدفعات
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {plansData.map((plan: any) => (
                    <tr key={plan.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {plan.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {plan.number_of_installments} دفعات
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 min-w-50">
                        <div className="flex flex-col gap-1 max-w-xs">
                          {plan.installment_types?.map(
                            (line: any, idx: number) => (
                              <div
                                key={line.id || idx}
                                className="text-xs bg-(--brand) text-white p-1 rounded"
                              >
                                {line.name} - {line.amount} د.أ (بعد{" "}
                                {line.due_after_days} أيام)
                              </div>
                            ),
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedPlan(plan);
                              setShowEditModal(true);
                            }}
                            className="p-2 text-gray-400 hover:text-(--brand) hover:bg-blue-50 rounded-lg transition-colors"
                            title="تعديل"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => setPlanToDelete(plan.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="حذف"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination
            currentPage={page}
            count={paginationData?.count || plansData.length}
            onPageChange={setPage}
          />
        </>
      )}

      {/* Modals */}
      {showAddModal && <AddInstallmentPlan setShowAddModal={setShowAddModal} />}
      {showEditModal && selectedPlan && (
        <EditInstallmentPlan
          selectedPlan={selectedPlan}
          setShowEditModal={setShowEditModal}
        />
      )}

      {planToDelete && (
        <ConfirmationModal
          open
          onClose={() => !isRemoving && setPlanToDelete(null)}
          onConfirm={handleDeleteConfirm}
          title="حذف خطة التقسيط"
          variant="danger"
          confirmLabel="نعم، احذف"
          isPending={isRemoving}
          description="هل أنت متأكد من رغبتك في حذف هذه الخطة؟ لا يمكن التراجع عن هذا الإجراء."
        />
      )}
    </div>
  );
};

export default InstallmentPlansPage;
