import { UAParser } from "ua-parser-js";
import { useState } from "react";
import {
  Plus,
  Search,
  Eye,
  EyeOff,
  Hash,
  Calendar,
  ToggleLeft,
  ToggleRight,
  CreditCard,
  Copy,
  CheckCircle,
  User,
  Clock,
  // MapPin,
  Smartphone,
  Target,
  Globe,
  Folder,
  FolderTree,
  ChevronDown,
  ChevronUp,
  Users,
} from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";
import { useCustomPost, useCustomUpdate } from "@/hooks/useMutation";
import toast from "react-hot-toast";
import GenerateModal from "@/components/card-codes/GenerateModal";
import handleErrorAlerts from "@/utils/showErrorMessages";
import Pagination from "@/components/dashboard/core/Pagination";
import Spinner from "@/components/dashboard/Spinner";
import { formatDate } from "@/services/date";

export interface CardCode {
  id: number;
  code: string;
  card: string;
  price: number;
  isUsed: boolean;
  isActive: boolean;
  usedBy?: string;
  usedAt?: string;
  createdAt: string;
  batchId: string;
  // NEW: Subsection targeting
  targetedSubsections: number[]; // Empty array means all subsections
}

export interface CodeBatch {
  id: string;
  card: string;
  price: number;
  totalCodes: number;
  usedCodes: number;
  activeCodes: number;
  createdAt: string;
  isActive: boolean;
  // Security and admin info
  createdBy: string;
  createdByRole: string;
  createdFromIP: string;
  createdFromDevice: string;
  lastModified?: string;
  lastModifiedBy?: string;
  notes?: string;
  // NEW: Subsection targeting
  targetedSubsections: number[]; // Empty array means all subsections
  targetingType: "all" | "specific"; // 'all' for all subsections, 'specific' for selected ones
}

const CardCodesPage = () => {
  const cardPricing: any = [];

  const [page, setPage] = useState(1);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // const [
  //   selectedPriceFilter,
  //   // , setSelectedPriceFilter
  // ] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isUsed, setIsUsed] = useState<"all" | "true" | "false">("all");
  const [codesFilter, setCodesFilter] = useState();
  const [statusFilter, setStatusFilter] = useState<"all" | "true" | "false">(
    "all"
  );
  const [codeBatches, setCodeBatches] = useState<any>();

  const cardCodesStatistics = useCustomQuery("cards/codes-statistics/", [
    "card-codes-statistics",
  ]);

  const cardCodes = useCustomQuery("cards/codes/", ["card-codes"]);
  const subsections = useCustomQuery("training/admin/subsections/", [
    "subsections",
  ]);

  const queryParams = new URLSearchParams();
  if (searchTerm) queryParams.append("code_string", searchTerm);
  if (codesFilter) queryParams.append("code_name", codesFilter);
  if (isUsed !== null && isUsed !== undefined)
    queryParams.append("is_used", isUsed);
  if (statusFilter) queryParams.append("is_active", statusFilter);
  if (page) queryParams.append("page", page.toString());

  const queryString = queryParams.toString();

  const generateCodes = useCustomQuery(
    `cards/codes-generated/?${queryString}`,
    ["codes-generated", searchTerm, codesFilter, isUsed, statusFilter, page]
  );

  const cards = useCustomQuery("cards/", ["cards"]);

  const toggleCodeState = useCustomUpdate(`cards/codes/${codeBatches}/`, [
    "card-codes",
    "card-codes-statistics",
    "codes-generated",
  ]);

  const toggleGeneratedCodeState = useCustomUpdate(
    `cards/codes-generated/${codeBatches}/`,
    ["card-codes", "card-codes-statistics", "codes-generated"]
  );

  const addCode = useCustomPost(`/cards/codes/`, [
    "card-codes",
    "card-codes-statistics",
    "codes-generated",
  ]);

  const [generateForm, setGenerateForm] = useState({
    name: "",
    card: "",
    quantity: 0,
    prefix: "",
    notes: "",
    targetingType: "all" as "all" | "specific",
    subsections: [],
    subsubsections: [],
    specializations: [],
    specialization_material: [],
  });

  // Build tree structure for subsection selection
  const buildSubsectionTree = (
    items: any[],
    parentId: number | null = null
  ): any[] => {
    return items
      ?.filter((item) => item.order === parentId)
      .sort((a, b) => a.title.localeCompare(b.title))
      .map((item) => ({
        ...item,
        children: buildSubsectionTree(items, item.id),
      })) as any[];
  };

  // const subsectionTree = buildSubsectionTree(subsections?.data?.data);
  const subsectionTree = subsections?.data?.data;

  // const generateRandomCode = (prefix: string, price: number) => {
  //   const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  //   let result = "";
  //   for (let i = 0; i < 6; i++) {
  //     result += chars.charAt(Math.floor(Math.random() * chars.length));
  //   }
  //   return `${prefix}-${price}-${result}`;
  // };

  // const getCurrentUserInfo = () => {
  //   // Simulate getting current user info
  //   return {
  //     name: "المدير الحالي",
  //     role: "مدير النظام",
  //     ip: "192.168.1.100",
  //     device: "Windows 11 - Chrome",
  //   };
  // };

  const getSubsectionName = (id: number) => {
    const subsection = subsections?.data?.data?.find((s: any) => s.id === id);
    return subsection ? subsection.title : `قسم ${id}`;
  };

  const getTargetingDisplay = (
    targetedSubsections: number[],
    targetingType: string
  ) => {
    if (targetingType === "all" || targetedSubsections?.length === 0) {
      return {
        type: "all",
        display: "جميع الأقسام",
        icon: Globe,
        color: "text-blue-600",
      };
    }

    if (targetedSubsections?.length === 1) {
      return {
        type: "specific",
        display: getSubsectionName(targetedSubsections[0]),
        icon: Target,
        color: "text-orange-600",
      };
    }

    return {
      type: "specific",
      display: `${targetedSubsections?.length} أقسام محددة`,
      icon: Target,
      color: "text-orange-600",
    };
  };

  const cleanObject = (obj: any) => {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => {
        if (Array.isArray(v)) return v.length > 0;
        return v !== null && v !== undefined && v !== "";
      })
    );
  };

  const getClientInfo = () => {
    const parser = new UAParser();
    const result = parser.getResult();
    return {
      // 🧠 عام
      ua: result.ua, // user-agent string

      // 💻 الجهاز
      device: {
        model: result.device.model || "unknown",
        type: result.device.type || "desktop",
        vendor: result.device.vendor || "unknown",
      },

      // 💽 نظام التشغيل
      os: {
        name: result.os.name || "unknown",
        version: result.os.version || "unknown",
      },

      // 🌐 المتصفح
      browser: {
        name: result.browser.name || "unknown",
        version: result.browser.version || "unknown",
        major: result.browser.major || "unknown",
      },

      // ⚙️ محرك التصفح (Rendering Engine)
      engine: {
        name: result.engine.name || "unknown",
        version: result.engine.version || "unknown",
      },

      // 🧱 منصة التشغيل (CPU architecture)
      cpu: {
        architecture: result.cpu.architecture || "unknown",
      },
    };
  };
  const handleGenerateCodes = () => {
    const rawData = {
      name: generateForm.name,
      card: generateForm.card,
      number_of_codes: generateForm.quantity,
      prefix: generateForm.prefix,
      subsections: generateForm?.subsections,
      subsubsections: generateForm?.subsubsections,
      specializations: generateForm?.specializations,
      specialization_material: generateForm?.specialization_material,
      note: generateForm.notes,
      security_information: getClientInfo(),
    };

    const data = cleanObject(rawData);
    addCode
      .mutateAsync(data)
      .then((res) => {
        if (res.status) {
          setGenerateForm({
            name: "",
            card: "",
            quantity: 0,
            prefix: "",
            notes: "",
            targetingType: "all",
            subsections: [],
            subsubsections: [],
            specializations: [],
            specialization_material: [],
          });
          setShowGenerateModal(false);
          toast.success("تم تحديث حالة البطاقة بنجاح");
        } else {
          toast.error("حدث خطاء في تحديث حالة البطاقة");
        }
      })
      .catch((error) => {
        handleErrorAlerts(
          error?.response?.data?.error || "حدث خطأ أثناء تحديث حالة البطاقة"
        );
      });
  };

  const toggleCodeStatus = (id: string) => {
    setCodeBatches(id);

    toggleGeneratedCodeState.mutateAsync({}).then((res) => {
      if (res) {
        toast.success("تم تحديث حالة البطاقة بنجاح");
      } else {
        toast.error("حدث خطأ أثناء تحديث حالة البطاقة");
      }
    });
  };

  const toggleBatchStatus = (batchId: string) => {
    setCodeBatches(batchId);

    toggleCodeState.mutateAsync({}).then((res) => {
      if (res) {
        toast.success("تم تحديث حالة البطاقة بنجاح");
      } else {
        toast.error("حدث خطأ أثناء تحديث حالة البطاقة");
      }
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // const exportToExcel = () => {
  //   // Enhanced CSV export with batch info and targeting
  //   const csvContent = [
  //     [
  //       "الكود",
  //       "السعر",
  //       "الحالة",
  //       "مستخدم",
  //       "تاريخ الاستخدام",
  //       "تاريخ الإنشاء",
  //       "المجموعة",
  //       "منشئ المجموعة",
  //       "الاستهداف",
  //     ],
  //     ...filteredCodes.map((code) => {
  //       const batch = codeBatches.find((b) => b.id === code.batchId);
  //       const targeting = getTargetingDisplay(
  //         code.targetedSubsections,
  //         batch?.targetingType || "all"
  //       );
  //       return [
  //         code.code,
  //         code.price,
  //         code.isUsed ? "مستخدم" : "غير مستخدم",
  //         code.usedBy || "-",
  //         code.usedAt || "-",
  //         code.createdAt,
  //         code.batchId,
  //         batch?.createdBy || "-",
  //         targeting.display,
  //       ];
  //     }),
  //   ]
  //     .map((row) => row.join(","))
  //     .join("\n");

  //   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  //   const link = document.createElement("a");
  //   link.href = URL.createObjectURL(blob);
  //   link.download = `card-codes-${new Date().toISOString().split("T")[0]}.csv`;
  //   link.click();
  // };

  // const exportToPDF = () => {
  //   // Simulate PDF export
  //   alert("سيتم تصدير البيانات إلى PDF قريباً");
  // };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            إدارة كودات البطاقات
          </h1>
          <p className="text-gray-600 text-sm">
            إنشاء وإدارة كودات تفعيل البطاقات مع استهداف الأقسام وتتبع أمني شامل
          </p>
        </div>
        <div className="flex gap-3">
          {/* <button
            onClick={exportToExcel}
            className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-all duration-300 flex items-center gap-2 text-sm"
          >
            <FileSpreadsheet size={16} />
            تصدير Excel
          </button>
          <button
            onClick={exportToPDF}
            className="cursor-pointer bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-all duration-300 flex items-center gap-2 text-sm"
          >
            <FileText size={16} />
            تصدير PDF
          </button> */}
          <button
            onClick={() => setShowGenerateModal(true)}
            className="cursor-pointer bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2 text-sm"
          >
            <Plus size={16} />
            إضافة كودات
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">إجمالي الكودات</p>
              <p className="text-3xl font-bold text-gray-800">
                {cardCodesStatistics?.data?.data?.total_generated_codes || "-"}
              </p>
            </div>
            <Hash className="w-12 h-12 text-orange-500" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">الكودات المستخدمة</p>
              <p className="text-3xl font-bold text-red-600">
                {cardCodesStatistics?.data?.data?.used_generated_codes || "-"}
              </p>
            </div>
            <CheckCircle className="w-12 h-12 text-red-500" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">الكودات المتاحة</p>
              <p className="text-3xl font-bold text-green-600">
                {cardCodesStatistics?.data?.data?.unused_generated_codes || "-"}
              </p>
            </div>
            <CreditCard className="w-12 h-12 text-green-500" />
          </div>
        </div>
      </div>

      {/* Enhanced Batches Section with Targeting Info */}
      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-orange-100/50">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="cursor-pointer p-6 hover:bg-gray-50 w-full flex justify-between"
        >
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-orange-600" />
            مجموعات الكودات مع الاستهداف ومعلومات الأمان
          </h2>
          {isExpanded ? <ChevronDown /> : <ChevronUp />}
        </button>
        <div
          className={`${
            !cardCodes?.data?.data || cardCodes?.data?.data?.length === 0
              ? "hidden"
              : "block"
          } ${isExpanded ? "block" : "hidden"} p-6`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {cardCodes?.data?.data?.map((batch: any) => {
              const targeting = getTargetingDisplay(
                batch.subsubsections,
                "specific"
              );
              // batch.targetingType

              return (
                <div
                  key={batch.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg">
                        {batch?.name || "-"}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          batch.card.is_active
                            ? "bg-green-400/20 text-green-100"
                            : "bg-red-400/20 text-red-100"
                        }`}
                      >
                        {batch?.is_active ? "مفعل" : "معطل"}
                      </span>
                    </div>
                    <div className="text-2xl font-bold">
                      {batch?.card?.price} د.أ
                    </div>
                  </div>

                  {/* Targeting Info */}
                  <div className="flex flex-col justify-center items-center p-4 bg-gradient-to-r from-blue-50 to-orange-50 h-22">
                    <div className="flex items-center gap-2 text-sm">
                      <targeting.icon size={16} className={targeting.color} />
                      <span className={`font-medium ${targeting.color}`}>
                        الأقسام المحددة: {batch.subsubsections.length}
                      </span>
                    </div>
                    {/* {batch.targetingType === "specific" && */}
                    {true && batch?.subsubsections?.length >= 1 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {batch?.subsubsections?.slice(0, 3).map((sec: any) => (
                          <span
                            key={sec.id}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-white/60 rounded-full text-xs"
                          >
                            <Folder size={10} />
                            {sec.title}
                          </span>
                        ))}
                        {batch?.subsubsections?.length > 3 && (
                          <span className="px-2 py-1 bg-white/60 rounded-full text-xs">
                            +{batch?.subsubsections?.length - 3} أخرى
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="p-4 bg-gray-50">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800">
                          {batch.total_generated_codes}
                        </div>
                        <div className="text-gray-600">إجمالي</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {batch.total_used_generated_codes}
                        </div>
                        <div className="text-gray-600">مستخدم</div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>معدل الاستخدام</span>
                        <span>{Math.round(batch.avg_usage * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${batch.avg_usage * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Security Info */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <span className="font-medium text-gray-800">
                          {batch.generated_by.name}
                        </span>
                        <span className="text-gray-500 text-xs block">
                          {batch.generated_by.type.name}
                        </span>
                      </div>
                    </div>
                    {/* Location */}
                    {/* <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 font-mono text-xs">
                        {batch?.security_information?.ip || "-"}
                      </span>
                    </div> */}

                    {/* Device Info */}
                    <div className="flex items-center gap-2 text-sm">
                      <Smartphone className="w-4 h-4 text-gray-400" />
                      <span>
                        {batch?.security_information?.device?.vendor}
                        {" - "}
                        {batch?.security_information?.device?.model}
                        {" - "}
                        {batch?.security_information?.device?.type}
                        {" - "}
                        {batch?.security_information?.browser?.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {formatDate(batch.created_at)}
                      </span>
                    </div>

                    {batch.updated_at && (
                      <div className="pt-2 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>
                            آخر تعديل: {formatDate(batch.updated_at)}{" "}
                            {/* بواسطة {batch.updated_at} */}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="flex flex-col gap-y-[10px] min-h-20 overflow-y-auto">
                      {batch.note && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="text-xs text-blue-600 font-medium mb-1">
                            ملاحظات:
                          </div>
                          <div className="text-sm text-blue-800 mb-4 break-words">
                            {batch.note}
                          </div>
                        </div>
                      )}

                      {/* {batch.security_information && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="text-xs text-blue-600 font-medium mb-1">
                            معلومات الأمان :
                          </div>
                          <div className="text-xs text-blue-700 space-y-1">
                            <div className="flex items-center gap-2">
                              <User size={12} />
                              <span>
                                المنشئ: {batch?.generated_by?.name}
                                {" - "}
                                {batch?.generated_by?.type?.name}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Smartphone size={12} />
                              <span>
                                الجهاز:{" "}
                                {batch?.security_information?.device?.vendor}
                                {" - "}
                                {batch?.security_information?.device?.model}
                                {" - "}
                                {batch?.security_information?.device?.type}
                                {" - "}
                                {batch?.security_information?.browser?.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock size={12} />
                              <span>
                                التاريخ: {formatDate(batch.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )} */}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                    <button
                      onClick={() => toggleBatchStatus(batch.id)}
                      className={`cursor-pointer p-2 rounded-lg transition-colors ${
                        batch.is_active
                          ? "text-green-600 bg-green-50 hover:bg-green-100"
                          : "text-gray-400 bg-gray-50 hover:bg-gray-100"
                      }`}
                      title={
                        batch.is_active ? "تعطيل المجموعة" : "تفعيل المجموعة"
                      }
                    >
                      {batch.is_active ? (
                        <ToggleRight size={20} />
                      ) : (
                        <ToggleLeft size={20} />
                      )}
                    </button>

                    {/* <button
                      onClick={() => deleteBatch(batch.id)}
                      className="cursor-pointer p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="حذف المجموعة"
                    >
                      <Trash2 size={16} />
                    </button> */}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-3">
          {/* Search */}
          <div className="relative col-span-1 lg:col-span-2">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="البحث في الكودات..."
              className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
            />
          </div>

          {/* Group Filter */}
          <select
            value={codesFilter}
            onChange={(e) => setCodesFilter(e.target.value as any)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
          >
            <option value="">جميع المجموعات</option>
            {cardCodes?.data?.data.map((card: any) => (
              <option key={card.id} value={card.name}>
                {card.name || "-"}
              </option>
            ))}
          </select>

          {/* Batch Filter */}
          <select
            value={isUsed || ""}
            onChange={(e) => setIsUsed(e.target.value as any)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
          >
            <option value="all">جميع حالات الاستخدام</option>
            <option value="false">متاح</option>
            <option value="true">مستخدم</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
          >
            <option value="all">جميع حالات التفعيل</option>
            <option value="true">مفعل</option>
            <option value="false">غير مفعل</option>
            {/* <option value="active">مفعل</option>
            <option value="inactive">معطل</option> */}
          </select>

          {/* Results Count */}
          <div className="flex items-center justify-center bg-gray-50 rounded-lg px-4 py-2">
            <span className="text-sm text-gray-600">
              {generateCodes?.data?.pagination?.count} كود
            </span>
          </div>
        </div>
      </div>

      {/* Enhanced Codes Table */}
      {generateCodes?.isLoading ? (
        <div className="flex justify-center">
          <Spinner size={40} thickness={4} className="text-orange-500" />
        </div>
      ) : !generateCodes?.data?.data ||
        generateCodes?.data?.data?.length === 0 ? (
        <div className="col-span-full bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-orange-100/50">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            لا توجد نتائج
          </h3>
          <p className="text-gray-500 mb-6">ابدأ بإضافة كودات جديدة للمنصة</p>

          <button
            onClick={() => setShowGenerateModal(true)}
            className="cursor-pointer bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <Plus size={16} />
            إضافة كودات جديدة
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-orange-100/50 w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">قائمة الكودات</h2>
            </div>
            {/* Responsive Table */}
            <div className="w-full max-w-[300px] min-w-full overflow-auto pb-6">
              <table className="min-w-[1000px] w-full text-sm bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">
                      الكود
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">
                      السعر
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">
                      المجموعة
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
                  {generateCodes?.data?.data?.map((code: any) => {
                    return (
                      <tr key={code.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-medium text-gray-900 truncate max-w-[100px]">
                              {code.code_string}
                            </span>
                            <button
                              onClick={() => copyToClipboard(code.code_string)}
                              className="cursor-pointer p-1 text-gray-400 hover:text-orange-600 transition-colors"
                              title="نسخ الكود"
                            >
                              <Copy size={14} />
                            </button>
                          </div>
                        </td>

                        <td className="px-4 py-3 text-gray-900">
                          {code.code.card.price} د.أ
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {code.code.name}
                          </div>

                          {/* <div className="text-xs text-gray-500">
                            بواسطة: {code.code.generated_by}
                          </div> */}
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
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {code.is_active ? "مفعل" : "معطل"}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-900">
                          {code.used_by?.user?.name ?? "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {code.used_by?.user?.created_at
                            ? formatDate(code.used_by?.user?.created_at)
                            : "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {formatDate(code.created_at)}
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleCodeStatus(code.id)}
                              className={`cursor-pointer p-1 rounded transition-colors ${
                                code.is_active
                                  ? "text-green-600 hover:bg-green-50"
                                  : "text-gray-400 hover:bg-gray-50"
                              }`}
                              title={
                                code.is_active ? "تعطيل الكود" : "تفعيل الكود"
                              }
                            >
                              {code.is_active ? (
                                <Eye size={16} />
                              ) : (
                                <EyeOff size={16} />
                              )}
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
          <Pagination
            count={generateCodes?.data?.pagination?.count}
            currentPage={page}
            onPageChange={setPage}
          />
        </>
      )}

      {/* Generate Modal */}
      {showGenerateModal && (
        <GenerateModal
          cardPricing={cardPricing}
          cards={cards}
          generateForm={generateForm}
          getSubsectionName={getSubsectionName}
          handleGenerateCodes={handleGenerateCodes}
          // renderSubsectionTree={renderSubsectionTree}
          setShowGenerateModal={setShowGenerateModal}
          setGenerateForm={setGenerateForm}
          subsectionTree={subsectionTree}
          loading={addCode.isPending}
        />
      )}
    </div>
  );
};

export default CardCodesPage;
