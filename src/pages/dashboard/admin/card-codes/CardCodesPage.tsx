import { useEffect, useState } from "react";
import { Plus, Power, PowerOff } from "lucide-react";
import { readUserFromStorage, roleOf } from "@/services/auth";
import { useCustomQuery } from "@/hooks/useQuery";
import { useCustomPost } from "@/hooks/useMutation";
import toast from "react-hot-toast";
import GenerateModal from "@/components/card-codes/GenerateModal";
import handleErrorAlerts from "@/utils/showErrorMessages";
import Pagination from "@/components/dashboard/core/Pagination";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { edit, get } from "@/api";
import { ConfirmationModal } from "@/components/dashboard/core/ConfirmationModal";
import TableSkeleton from "@/components/dashboard/skeletons/TableSkeleton";
import EmptyState from "@/components/core/EmptyState";
import { PendingCodeStatusToggle } from "./types";
import { cleanObject, getClientInfo } from "./utils";
import Header from "./Header";
import CardCodesStats from "./CardCodesStats";
import CardCodesFilters from "./CardCodesFilters";
import CardCodesTable from "./CardCodesTable";

/** Must match Pagination `pageSize` and `page_size` query param for list APIs */
const CARD_CODES_PAGE_SIZE = 15;

const CardCodesPage = () => {
  const queryClient = useQueryClient();
  const cardPricing: any = [];
  const [page, setPage] = useState(1);
  const [codePage] = useState(1);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const user = readUserFromStorage();
  const role = roleOf(user) ?? "";
  const loadAdminReferenceLists = role !== "library";
  const canAddCode = import.meta.env.VITE_ADD_CODE === "true";
  const [isUsed, setIsUsed] = useState<"" | "all" | "true" | "false">("all");
  const [isCodeDownloaded, setisCodeDownloaded] = useState<
    "" | "all" | "true" | "false"
  >("all");
  const [codesFilter, setCodesFilter] = useState<string[]>([]);
  const [teachersFilter, setTeachersFilter] = useState<string[]>([]);
  const [librariesFilter, setLibrariesFilter] = useState<string[]>([]);
  const [installmentFilter, setInstallmentFilter] = useState<
    "" | "all" | "true" | "false"
  >("");
  const [statusFilter, setStatusFilter] = useState<
    "" | "all" | "true" | "false"
  >("all");
  const [pendingCodeStatusToggle, setPendingCodeStatusToggle] =
    useState<PendingCodeStatusToggle | null>(null);

  const cardCodes = useCustomQuery(
    `cards/codes/?page=${codePage}&page_size=${CARD_CODES_PAGE_SIZE}`,
    ["card-codes", codePage, CARD_CODES_PAGE_SIZE],
  );

  const installmentPlans = useCustomQuery(
    "/cards/installments/",
    ["installments"],
    undefined,
    loadAdminReferenceLists,
  );

  const queryParams = new URLSearchParams();
  if (searchTerm) queryParams.append("code_string", searchTerm);
  if (codesFilter && codesFilter.length > 0) {
    queryParams.append(
      "code",
      `${codesFilter?.map((id: string) => id).join(",")}`,
    );
  }
  queryParams.append("page_size", String(CARD_CODES_PAGE_SIZE));
  if (teachersFilter)
    queryParams.append(
      "generated_by",
      teachersFilter?.map((id: string) => id).join(","),
    );
  if (librariesFilter)
    queryParams.append(
      "generated_by",
      librariesFilter?.map((id: string) => id).join(","),
    );
  if (installmentFilter)
    queryParams.append("is_installment", installmentFilter);
  if (isUsed !== null && isUsed !== undefined) {
    queryParams.append("is_used", isUsed);
  }
  if (isCodeDownloaded !== null && isCodeDownloaded !== undefined) {
    queryParams.append("is_downloaded", isCodeDownloaded);
  }
  if (statusFilter) queryParams.append("is_active", statusFilter);
  if (page) queryParams.append("page", page.toString());

  const queryString = queryParams.toString();

  const generateCodes = useCustomQuery(
    `cards/codes-generated/?${queryString}`,
    [
      "codes-generated",
      searchTerm,
      codesFilter,
      teachersFilter,
      librariesFilter,
      installmentFilter,
      isUsed,
      isCodeDownloaded,
      statusFilter,
      page,
      CARD_CODES_PAGE_SIZE,
    ],
  );

  useEffect(() => {
    setPage(1);
  }, [
    searchTerm,
    codesFilter,
    teachersFilter,
    librariesFilter,
    installmentFilter,
    isUsed,
    isCodeDownloaded,
    statusFilter,
  ]);

  const cards = useCustomQuery("cards/", ["cards"]);

  const toggleGeneratedCodeMutation = useMutation({
    mutationFn: (id: string) => edit(`cards/codes-generated/${id}/`, {}),
    onSuccess: () => {
      ["card-codes", "card-codes-statistics", "codes-generated"].forEach(
        (key) => {
          queryClient.resetQueries({ queryKey: [key] });
        },
      );
    },
  });

  const { mutateAsync: addCode, isPending } = useCustomPost(`/cards/codes/`, [
    "card-codes",
    "card-codes-statistics",
    "codes-generated",
    "main-statistics",
  ]);
  const [generateForm, setGenerateForm] = useState({
    // name: "",
    card: "",
    quantity: 0,
    // prefix: "M",
    notes: "",
    targetingType: "all" as "all" | "specific",
    is_installment: false,
    installment: "",
    is_offer: false,
    offer_activation_cards: [] as string[],
    subsections: [],
    subsubsections: [],
    specializations: [],
    specialization_material: [],
  });

  const handleGenerateCodes = () => {
    const offerLines =
      generateForm.is_offer && generateForm.offer_activation_cards?.length
        ? generateForm.offer_activation_cards.map((id: string) => ({
            activation_card: id,
          }))
        : null;

    const rawData = {
      card: generateForm.card,
      number_of_codes: generateForm.quantity,
      is_installment: generateForm.is_installment,
      ...(generateForm.is_installment && generateForm.installment
        ? { installment: generateForm.installment }
        : {}),
      is_offer: generateForm.is_offer,
      ...(offerLines ? { offer_lines: offerLines } : {}),
      subsections: generateForm?.subsections,
      subsubsections: generateForm?.subsubsections,
      specializations: generateForm?.specializations,
      specialization_material: generateForm?.specialization_material,
      note: generateForm.notes,
      security_information: getClientInfo(),
    };

    const data = cleanObject(rawData);
    addCode(data)
      .then((res) => {
        if (res.status) {
          setGenerateForm({
            card: "",
            quantity: 0,
            notes: "",
            targetingType: "all",
            is_installment: false,
            installment: "",
            is_offer: false,
            offer_activation_cards: [],
            subsections: [],
            subsubsections: [],
            specializations: [],
            specialization_material: [],
          });
          setShowGenerateModal(false);
          toast.success(res?.data || "تم تحديث حالة البطاقة بنجاح");
        } else {
          toast.error("حدث خطاء في تحديث حالة البطاقة");
        }
      })
      .catch((error) => {
        handleErrorAlerts(
          error?.response?.data?.error || "حدث خطأ أثناء تحديث حالة البطاقة",
        );
      });
  };

  const requestCodeStatusToggle = (row: {
    id: string | number;
    is_active?: boolean;
    code_string?: string;
  }) => {
    const raw = String(row.code_string ?? "");
    const codePrefix = raw.split("-")[0] || raw || "—";
    setPendingCodeStatusToggle({
      id: String(row.id),
      isActive: Boolean(row.is_active),
      codePrefix,
    });
  };

  const confirmCodeStatusToggle = async () => {
    if (!pendingCodeStatusToggle) return;
    const { id } = pendingCodeStatusToggle;
    try {
      const res = await toggleGeneratedCodeMutation.mutateAsync(id);
      if (res?.status) {
        toast.success("تم تحديث حالة البطاقة بنجاح");
        setPendingCodeStatusToggle(null);
      } else {
        handleErrorAlerts(res?.error ?? "حدث خطأ أثناء تحديث حالة البطاقة");
      }
    } catch (err: unknown) {
      const anyErr = err as {
        response?: { data?: { error?: string; message?: string } };
        message?: string;
      };
      const msg =
        anyErr?.response?.data?.error ??
        anyErr?.response?.data?.message ??
        anyErr?.message ??
        "حدث خطأ أثناء تحديث حالة البطاقة";
      handleErrorAlerts(msg);
    }
  };
  const handleCodeDownload = async (codeId: string) => {
    try {
      // Download Codes File
      const res = await get(`/cards/codes-generated/${codeId}/?export=pdf`, {
        responseType: "blob",
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([res]));
      // Create a hidden <a> element and click it
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `code_${codeId}.pdf`);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
      queryClient.invalidateQueries({
        queryKey: [
          "codes-generated",
          searchTerm,
          codesFilter,
          teachersFilter,
          librariesFilter,
          installmentFilter,
          isUsed,
          isCodeDownloaded,
          statusFilter,
          page,
        ],
      });
    } catch (error: any) {
      console.error("Download failed:", error);
      toast.error(error?.response?.data?.error ?? "فشل تحميل الكود");
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <Header
        canAddCode={canAddCode}
        setShowGenerateModal={setShowGenerateModal}
      />

      {/* Stats Cards */}
      <CardCodesStats />

      {/* Enhanced Filters */}
      <CardCodesFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        codesFilter={codesFilter}
        setCodesFilter={setCodesFilter}
        teachersFilter={teachersFilter}
        setTeachersFilter={setTeachersFilter}
        librariesFilter={librariesFilter}
        setLibrariesFilter={setLibrariesFilter}
        installmentFilter={installmentFilter}
        setInstallmentFilter={setInstallmentFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        loadAdminReferenceLists={loadAdminReferenceLists}
        cardCodes={cardCodes}
        isUsed={isUsed}
        setIsUsed={setIsUsed}
        isCodeDownloaded={isCodeDownloaded}
        setisCodeDownloaded={setisCodeDownloaded}
        generateCodes={generateCodes}
      />

      {/* Enhanced Codes Table */}
      {generateCodes?.isLoading ? (
        <TableSkeleton rows={10} />
      ) : !generateCodes?.data?.data ||
        generateCodes?.data?.data?.length === 0 ? (
        <div className="col-span-full bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-(--brand)">
          <EmptyState
            title="لا توجد نتائج"
            description="ابدأ بإضافة كودات جديدة للمنصة"
            size="md"
            action={
              canAddCode && (
                <button
                  onClick={() => setShowGenerateModal(true)}
                  className="btn-brand-slide px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 mx-auto"
                >
                  <Plus size={16} />
                  إضافة كودات جديدة
                </button>
              )
            }
          />
        </div>
      ) : (
        <>
          <CardCodesTable
            cardCodes={cardCodes}
            handleCodeDownload={handleCodeDownload}
            requestCodeStatusToggle={requestCodeStatusToggle}
            generateCodes={generateCodes}
            role={role}
          />
          <Pagination
            small={true}
            count={generateCodes?.data?.pagination?.count}
            currentPage={page}
            onPageChange={setPage}
            pageSize={CARD_CODES_PAGE_SIZE}
          />
        </>
      )}

      {/* Generate Modal */}
      {showGenerateModal && (
        <GenerateModal
          cardPricing={cardPricing}
          cards={cards}
          generateForm={generateForm}
          handleGenerateCodes={handleGenerateCodes}
          setShowGenerateModal={setShowGenerateModal}
          setGenerateForm={setGenerateForm}
          installmentPlans={installmentPlans}
          loading={isPending}
        />
      )}

      {pendingCodeStatusToggle && (
        <ConfirmationModal
          open
          onClose={() =>
            !toggleGeneratedCodeMutation.isPending &&
            setPendingCodeStatusToggle(null)
          }
          onConfirm={confirmCodeStatusToggle}
          title="تأكيد تغيير حالة الكود"
          variant={pendingCodeStatusToggle.isActive ? "danger" : "success"}
          icon={pendingCodeStatusToggle.isActive ? PowerOff : Power}
          confirmLabel={
            pendingCodeStatusToggle.isActive
              ? "نعم، تعطيل الكود"
              : "نعم، تفعيل الكود"
          }
          isPending={toggleGeneratedCodeMutation.isPending}
          description={
            <>
              <p className="text-base">
                هل أنت متأكد أنك تريد{" "}
                <span className="font-bold text-gray-900">
                  {pendingCodeStatusToggle.isActive ? "تعطيل" : "تفعيل"}
                </span>{" "}
                هذا الكود؟
              </p>
              <p className="text-sm text-gray-600">
                الكود
                <span
                  className="font-mono font-semibold text-(--brand-secondary)"
                  dir="ltr"
                >
                  {pendingCodeStatusToggle.codePrefix}
                </span>
              </p>
              {pendingCodeStatusToggle.isActive ? (
                <p className="text-sm text-amber-900/90 bg-amber-50 border border-amber-100 rounded-xl p-3">
                  لن يعمل الكود لتفعيل البطاقة بعد التعطيل حتى تقوم بإعادة
                  تفعيله.
                </p>
              ) : (
                <p className="text-sm text-emerald-900/90 bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                  بعد التفعيل يمكن استخدام هذا الكود لتفعيل البطاقة وفقاً
                  لإعداداته.
                </p>
              )}
            </>
          }
        />
      )}
    </div>
  );
};

export default CardCodesPage;
