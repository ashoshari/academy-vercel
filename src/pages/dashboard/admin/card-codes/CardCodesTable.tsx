import { formatDateTimeSimple } from "@/utils/formatDateTime";
import { offerLinesFromGeneratedCode } from "./utils";
import StatusToggleButton from "@/components/dashboard/core/StatusToggleButton";
import { Download, Hash, Info } from "lucide-react";

type Id = string | number;
type Role = "admin" | "library" | "teacher" | string;

type OfferActivationCard = {
  id?: Id;
  price?: number | string | null;
};

type OfferLine = {
  id?: Id;
  activation_card?: OfferActivationCard | null;
};

type GeneratedCodeRow = {
  id: Id;
  code_string: string;
  created_at: string;
  is_used?: boolean;
  is_active?: boolean;
  is_downloaded?: boolean;
  used_by?: {
    user?: {
      name?: string;
      created_at?: string;
    } | null;
  } | null;
  code?: {
    name?: string;
    card?: {
      price?: number | string | null;
    } | null;
    installment?: {
      name?: string;
    } | null;
  } | null;
};

type GenerateCodesQuery = {
  data?: {
    data?: GeneratedCodeRow[];
  };
  isLoading?: boolean;
};

type CardCodesBatchesQuery = {
  data?: {
    data?: {
      generated_codes?: GeneratedCodeRow[];
    };
  };
};

export type CardCodesTableProps = {
  cardCodes: CardCodesBatchesQuery | undefined;
  generateCodes: GenerateCodesQuery | undefined;
  role: Role;
  requestCodeStatusToggle: (code: GeneratedCodeRow) => void;
  handleCodeDownload: (codeId: string) => void | Promise<void>;
};

function CardCodesTable({
  cardCodes,
  generateCodes,
  role,
  requestCodeStatusToggle,
  handleCodeDownload,
}: CardCodesTableProps) {
  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-(--brand) w-full">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-800">قائمة الكودات</h2>
      </div>
      {/* Responsive Table */}
      <div className="w-full max-w-75 min-w-full overflow-auto pb-6">
        <table className="min-w-250 w-full text-sm bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">
                السعر
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">
                الكود
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">
                خطة التقسيط
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">
                الحالة
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">
                مستخدم بواسطة
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">
                تاريخ الاستخدام
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">
                تاريخ الإنشاء
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {generateCodes?.data?.data?.map((code) => {
              const offerLines = offerLinesFromGeneratedCode(
                code,
              ) as OfferLine[];

              return (
                <tr key={code.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">
                    <div className="flex flex-col gap-2 min-w-0 max-w-56">
                      <span className="text-sm font-semibold tabular-nums text-gray-900">
                        {code.code?.card?.price} د.أ
                      </span>
                      {offerLines.length > 0 && (
                        <div className="flex flex-col gap-1 w-full">
                          <span className="text-[0.65rem] text-gray-500 font-medium">
                            بطاقات العرض الإضافيّة
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {offerLines.map((line) => (
                              <span
                                key={line.id ?? line.activation_card?.id}
                                className="inline-flex rounded-md bg-(--brand)/10 text-(--brand) px-2 py-0.5 text-xs font-semibold tabular-nums"
                              >
                                {line.activation_card?.price} د.أ
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-900">
                    {code.code_string.split("-")[0]}
                  </td>
                  <td className="px-4 py-3 text-gray-900">
                    {code.code?.installment?.name || "—"}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          code.is_used
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {code.is_used ? "مستخدم" : "متاح"}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          code.is_active
                            ? "bg-blue-100 text-(--brand-secondary)"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {code.is_active ? "مفعل" : "معطل"}
                      </span>
                      {code?.is_downloaded && (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium
                                  bg-gray-100 text-(--brand)
                              `}
                        >
                          تم التحميل
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-900">
                    {code.used_by?.user?.name ?? "-"}
                  </td>
                  <td
                    dir="ltr"
                    className="px-4 py-3 text-end text-sm text-gray-900"
                  >
                    {code.used_by?.user?.created_at
                      ? formatDateTimeSimple(code.used_by?.user?.created_at)
                      : "-"}
                  </td>
                  <td
                    dir="ltr"
                    className="px-4 py-3 text-end text-sm w-fit text-gray-900"
                  >
                    {code.created_at
                      ? formatDateTimeSimple(code.created_at)
                      : "-"}
                  </td>

                  <td className="px-4 py-3 align-middle whitespace-nowrap">
                    <div className="flex items-center">
                      {role === "admin" && (
                        <StatusToggleButton
                          isOn={Boolean(code.is_active)}
                          onToggle={() => requestCodeStatusToggle(code)}
                          titleOn="تعطيل الكود"
                          titleOff="تفعيل الكود"
                        />
                      )}
                      <button
                        onClick={() =>
                          handleCodeDownload(String(code?.id ?? ""))
                        }
                        className={`cursor-pointer p-1 rounded transition-colors ${
                          code.is_downloaded
                            ? "text-(--brand-secondary) hover:bg-green-50"
                            : "text-gray-400 hover:bg-gray-50"
                        }`}
                        title={"تحميل الكود"}
                      >
                        <Download size={16} />
                      </button>
                      <button
                        className="cursor-pointer p-1 rounded transition-colors"
                        title={code?.code?.name}
                      >
                        <Info size={16} className="text-gray-300" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {cardCodes?.data?.data?.generated_codes?.length === 0 && (
          <div className="text-center py-12">
            <Hash className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              لا توجد كودات
            </h3>
            <p className="text-gray-500">
              لم يتم العثور على كودات تطابق المعايير المحددة
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CardCodesTable;
