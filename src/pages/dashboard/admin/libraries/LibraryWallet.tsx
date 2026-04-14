import { useParams } from "react-router";
import { Trash2, User } from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";
import DetailsPageSkeleton from "@/components/dashboard/skeletons/DetailsPageSkeleton";
import { Library } from "./LibrariesPage";
import toast from "react-hot-toast";
import { useCustomPost, useCustomRemove } from "@/hooks/useMutation";
import { useState } from "react";

interface Payment {
  id: string;
  payer: string;
  to: string;
  old_balance: string;
  new_balance: string;
  amount: string;
}

export default function LibraryWalletPage() {
  const { id } = useParams();
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const { data, isLoading } = useCustomQuery(`account/admin/libraries/${id}/`, [
    "library",
    id,
  ]);

  const { data: paymentData } = useCustomQuery(
    `/account/admin/payments/?to=${id}`,
    ["payment", id],
  );

  const [showAddCredit, setShowAddCredit] = useState(false);
  const [amount, setAmount] = useState<number | "">("");

  const addPayment = useCustomPost("/account/admin/payments/", [
    "payment",
    id as string,
  ]);

  const selectedLibrary: Library = data?.data;
  const payments: Payment[] = paymentData?.data;

  const deletePayment = useCustomRemove(
    `/account/admin/payments/${selectedPayment?.id}/`,
    ["payment", id as string],
  );

  const handleSaveCredit = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error("من فضلك أدخل مبلغ صحيح");
      return;
    }
    try {
      const res = await addPayment.mutateAsync({
        to: id,
        amount: Number(amount),
      });
      if (res?.status) {
        toast.success("تم إضافة الرصيد بنجاح");
        setShowAddCredit(false);
        setAmount("");
      } else {
        toast.error("فشل في إضافة الرصيد");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء إضافة الرصيد");
    }
  };

  const handleDeletePayment = async () => {
    try {
      const res = await deletePayment.mutateAsync();
      if (res?.status) {
        toast.success("تم حذف المحفظة بنجاح");
      } else {
        toast.error("فشل في حذف المحفظة");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء حذف المحفظة");
    }
  };

  if (isLoading) {
    return (
      <DetailsPageSkeleton
        withTopHeader={false}
        subtitleWidthClassName="w-40"
        sectionsPx={[320]}
      />
    );
  }
  if (!selectedLibrary) {
    return (
      <div className="text-center mt-10 text-red-500">
        لم يتم العثور على المكتبة.
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full p-6">
        <div className="flex items-center justify-between mb-6 border-b pb-4 border-gray-200">
          <div className="flex items-center gap-4">
            {selectedLibrary?.image ? (
              <img
                src={selectedLibrary?.image}
                alt={selectedLibrary?.name}
                className="w-16 h-16 rounded-full border-2 border-white/20"
              />
            ) : (
              <User className="w-16 h-16 rounded-full border-2 border-white/20 p-3" />
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedLibrary?.name}
              </h2>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">بيانات المحفظة</h2>
        </div>

        <div className="space-y-7.5">
          {/* Personal Info */}
          {payments?.length && payments?.length > 0 ? (
            <div className="grid grid-col-1 lg:grid-cols-3 gap-x-2.5 gap-y-2.5">
              {payments
                .sort((a, b) => +a.old_balance - +b.old_balance)
                .map((payment, index) => {
                  return (
                    <div
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-blue-50"
                      } rounded-xl p-6 mb-6 h-full flex flex-col items-start`}
                      key={payment.id}
                    >
                      <h3 className="font-bold text-gray-800 mb-4">
                        العملية رقم {index + 1}
                      </h3>
                      <div className="space-y-3">
                        <Info
                          label="مدفوع من"
                          value={payment?.payer ?? "غير معروف"}
                        />
                        <Info label="الي" value={payment?.to ?? "غير معروف"} />
                        <Info
                          label="الرصيد السابق"
                          value={payment?.old_balance ?? "0.00"}
                        />
                        <Info
                          label={
                            index === payments.length - 1
                              ? "الرصيد الحالي"
                              : "الرصيد الجديد"
                          }
                          value={payment?.new_balance ?? "0.00"}
                        />
                        <Info
                          label="المبلغ المضاف"
                          value={payment?.amount ?? "0.00"}
                        />
                      </div>
                      <button
                        onClick={() => {
                          setSelectedPayment(payment);
                          handleDeletePayment();
                        }}
                        className="w-40 mt-4 self-center whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                      >
                        <Trash2 size={16} />
                        حذف العملية
                      </button>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="flex items-center justify-center">
              لا يوجد رصيد حالي
            </div>
          )}

          <div>
            {!showAddCredit ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowAddCredit(true)}
                  className="w-40 whitespace-nowrap cursor-pointer bg-(--brand) text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
                >
                  اضافة رصيد
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  lang="en"
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value ? Number(e.target.value) : "")
                  }
                  placeholder="أدخل المبلغ"
                  className="px-3 py-2 border rounded-lg w-40 focus:ring-2 focus:ring-(--brand) [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  onKeyDown={(e) => {
                    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                      e.preventDefault();
                    }
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSaveCredit();
                    }
                  }}
                />
                <button
                  onClick={handleSaveCredit}
                  className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  حفظ
                </button>
                <button
                  onClick={() => {
                    setShowAddCredit(false);
                    setAmount("");
                  }}
                  className="cursor-pointer bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  إلغاء
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const Info = ({ label, value }: { label: string; value: string }) => (
  <div>
    <span className="text-sm text-gray-500">{label}</span>
    <p className="font-medium">{value}</p>
  </div>
);
