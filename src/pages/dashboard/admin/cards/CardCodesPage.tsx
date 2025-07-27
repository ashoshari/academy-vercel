import { useState } from "react";
import {
  Plus,
  Search,
  FileText,
  FileSpreadsheet,
  Eye,
  EyeOff,
  Trash2,
  Hash,
  Calendar,
  ToggleLeft,
  ToggleRight,
  X,
  Save,
  CreditCard,
  Copy,
  CheckCircle,
  AlertCircle,
  User,
  Shield,
  Clock,
  MapPin,
  Smartphone,
  Target,
  Globe,
  Folder,
  FolderTree,
} from "lucide-react";

export interface CardCode {
  id: number;
  code: string;
  priceId: number;
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
  priceId: number;
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

  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPriceFilter, setSelectedPriceFilter] = useState<number | null>(
    null
  );
  const [selectedBatchFilter, setSelectedBatchFilter] = useState<string | null>(
    null
  );
  const [statusFilter, setStatusFilter] = useState<
    "all" | "used" | "unused" | "active" | "inactive"
  >("all");

  // Sample subsections data (in real app, this would come from props or context)
  const subsections: any[] = [
    {
      id: 1,
      name: "التوجيهي",
      description: "المرحلة الثانوية العامة - التوجيهي",
      parentId: null,
      level: 1,
      linkedSections: [1, 2, 3],
      studentsCount: 856,
      itemsCount: 234,
      isExpanded: true,
      createdAt: "2024-01-10",
    },
    {
      id: 2,
      name: "توجيهي 2007",
      description: "منهاج التوجيهي للعام 2007",
      parentId: 1,
      level: 2,
      linkedSections: [1, 2],
      studentsCount: 312,
      itemsCount: 89,
      isExpanded: false,
      createdAt: "2024-01-10",
    },
    {
      id: 3,
      name: "توجيهي 2008",
      description: "منهاج التوجيهي للعام 2008",
      parentId: 1,
      level: 2,
      linkedSections: [1, 2, 3],
      studentsCount: 287,
      itemsCount: 76,
      isExpanded: false,
      createdAt: "2024-01-10",
    },
    {
      id: 4,
      name: "الصفوف الأساسية",
      description: "المرحلة الأساسية من الصف الأول إلى العاشر",
      parentId: null,
      level: 1,
      linkedSections: [4],
      studentsCount: 1243,
      itemsCount: 456,
      isExpanded: true,
      createdAt: "2024-01-08",
    },
    {
      id: 5,
      name: "الصف الأول",
      description: "المنهاج الدراسي للصف الأول الأساسي",
      parentId: 4,
      level: 2,
      linkedSections: [4],
      studentsCount: 156,
      itemsCount: 45,
      isExpanded: false,
      createdAt: "2024-01-08",
    },
    {
      id: 6,
      name: "الصف الثاني",
      description: "المنهاج الدراسي للصف الثاني الأساسي",
      parentId: 4,
      level: 2,
      linkedSections: [4],
      studentsCount: 134,
      itemsCount: 38,
      isExpanded: false,
      createdAt: "2024-01-08",
    },
    {
      id: 7,
      name: "الصف العاشر",
      description: "المنهاج الدراسي للصف العاشر الأساسي",
      parentId: 4,
      level: 2,
      linkedSections: [1, 4],
      studentsCount: 298,
      itemsCount: 87,
      isExpanded: false,
      createdAt: "2024-01-08",
    },
  ];

  // Sample data for card codes with subsection targeting
  const [cardCodes, setCardCodes] = useState<CardCode[]>([
    {
      id: 1,
      code: "CARD-50-ABC123",
      priceId: 2,
      price: 50.0,
      isUsed: false,
      isActive: true,
      createdAt: "2024-01-15",
      batchId: "BATCH-001",
      targetedSubsections: [], // All subsections
    },
    {
      id: 2,
      code: "CARD-50-DEF456",
      priceId: 2,
      price: 50.0,
      isUsed: true,
      isActive: true,
      usedBy: "أحمد محمد",
      usedAt: "2024-01-18",
      createdAt: "2024-01-15",
      batchId: "BATCH-001",
      targetedSubsections: [], // All subsections
    },
    {
      id: 3,
      code: "CARD-20-GHI789",
      priceId: 1,
      price: 20.0,
      isUsed: false,
      isActive: true,
      createdAt: "2024-01-16",
      batchId: "BATCH-002",
      targetedSubsections: [2, 3], // Only توجيهي 2007 & 2008
    },
    {
      id: 4,
      code: "CARD-50-JKL012",
      priceId: 2,
      price: 50.0,
      isUsed: true,
      isActive: true,
      usedBy: "فاطمة أحمد",
      usedAt: "2024-01-19",
      createdAt: "2024-01-15",
      batchId: "BATCH-001",
      targetedSubsections: [], // All subsections
    },
    {
      id: 5,
      code: "CARD-20-MNO345",
      priceId: 1,
      price: 20.0,
      isUsed: false,
      isActive: true,
      createdAt: "2024-01-16",
      batchId: "BATCH-002",
      targetedSubsections: [5, 6, 7], // Primary grades only
    },
  ]);

  // Enhanced sample data for batches with subsection targeting
  const [codeBatches, setCodeBatches] = useState<CodeBatch[]>([
    {
      id: "BATCH-001",
      priceId: 2,
      price: 50.0,
      totalCodes: 500,
      usedCodes: 45,
      activeCodes: 500,
      createdAt: "2024-01-15",
      isActive: true,
      createdBy: "أحمد المدير",
      createdByRole: "مدير النظام",
      createdFromIP: "192.168.1.100",
      createdFromDevice: "Windows 11 - Chrome",
      lastModified: "2024-01-18",
      lastModifiedBy: "سارة المشرفة",
      notes: "مجموعة للعرض الشتوي - خصم 20%",
      targetedSubsections: [], // All subsections
      targetingType: "all",
    },
    {
      id: "BATCH-002",
      priceId: 1,
      price: 20.0,
      totalCodes: 300,
      usedCodes: 12,
      activeCodes: 300,
      createdAt: "2024-01-16",
      isActive: true,
      createdBy: "محمد المساعد",
      createdByRole: "مساعد إداري",
      createdFromIP: "192.168.1.105",
      createdFromDevice: "MacOS - Safari",
      notes: "مجموعة للطلاب الجدد",
      targetedSubsections: [2, 3, 5, 6, 7], // Specific subsections
      targetingType: "specific",
    },
    {
      id: "BATCH-003",
      priceId: 4,
      price: 75.0,
      totalCodes: 100,
      usedCodes: 8,
      activeCodes: 100,
      createdAt: "2024-01-20",
      isActive: true,
      createdBy: "علي المطور",
      createdByRole: "مطور النظام",
      createdFromIP: "192.168.1.110",
      createdFromDevice: "Ubuntu - Firefox",
      notes: "مجموعة تجريبية للاختبار",
      targetedSubsections: [1, 4], // Main categories only
      targetingType: "specific",
    },
  ]);

  const [generateForm, setGenerateForm] = useState({
    priceId: 0,
    quantity: 100,
    prefix: "CARD",
    notes: "",
    targetingType: "all" as "all" | "specific",
    targetedSubsections: [] as number[],
  });

  // Build tree structure for subsection selection
  const buildSubsectionTree = (
    items: any[],
    parentId: number | null = null
  ): any[] => {
    return items
      .filter((item) => item.parentId === parentId)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((item) => ({
        ...item,
        children: buildSubsectionTree(items, item.id),
      })) as any[];
  };

  const subsectionTree = buildSubsectionTree(subsections);

  // Filter codes based on search and filters
  const filteredCodes = cardCodes.filter((code) => {
    const matchesSearch =
      code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.usedBy?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPrice =
      selectedPriceFilter === null || code.priceId === selectedPriceFilter;

    const matchesBatch =
      selectedBatchFilter === null || code.batchId === selectedBatchFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "used" && code.isUsed) ||
      (statusFilter === "unused" && !code.isUsed) ||
      (statusFilter === "active" && code.isActive) ||
      (statusFilter === "inactive" && !code.isActive);

    return matchesSearch && matchesPrice && matchesBatch && matchesStatus;
  });

  const generateRandomCode = (prefix: string, price: number) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${prefix}-${price}-${result}`;
  };

  const getCurrentUserInfo = () => {
    // Simulate getting current user info
    return {
      name: "المدير الحالي",
      role: "مدير النظام",
      ip: "192.168.1.100",
      device: "Windows 11 - Chrome",
    };
  };

  const getSubsectionName = (id: number) => {
    const subsection = subsections.find((s) => s.id === id);
    return subsection ? subsection.name : `قسم ${id}`;
  };

  const getTargetingDisplay = (
    targetedSubsections: number[],
    targetingType: string
  ) => {
    if (targetingType === "all" || targetedSubsections.length === 0) {
      return {
        type: "all",
        display: "جميع الأقسام",
        icon: Globe,
        color: "text-blue-600",
      };
    }

    if (targetedSubsections.length === 1) {
      return {
        type: "specific",
        display: getSubsectionName(targetedSubsections[0]),
        icon: Target,
        color: "text-orange-600",
      };
    }

    return {
      type: "specific",
      display: `${targetedSubsections.length} أقسام محددة`,
      icon: Target,
      color: "text-orange-600",
    };
  };

  const handleGenerateCodes = () => {
    if (generateForm.priceId && generateForm.quantity > 0) {
      const selectedPrice = cardPricing.find(
        (p: any) => p.id === generateForm.priceId
      );
      if (!selectedPrice) return;

      const userInfo = getCurrentUserInfo();
      const batchId = `BATCH-${Date.now()}`;
      const newCodes: CardCode[] = [];

      for (let i = 0; i < generateForm.quantity; i++) {
        newCodes.push({
          id: Date.now() + i,
          code: generateRandomCode(generateForm.prefix, selectedPrice.price),
          priceId: generateForm.priceId,
          price: selectedPrice.price,
          isUsed: false,
          isActive: true,
          createdAt: new Date().toISOString().split("T")[0],
          batchId,
          targetedSubsections:
            generateForm.targetingType === "all"
              ? []
              : generateForm.targetedSubsections,
        });
      }

      // Add new batch with security info and targeting
      const newBatch: CodeBatch = {
        id: batchId,
        priceId: generateForm.priceId,
        price: selectedPrice.price,
        totalCodes: generateForm.quantity,
        usedCodes: 0,
        activeCodes: generateForm.quantity,
        createdAt: new Date().toISOString().split("T")[0],
        isActive: true,
        createdBy: userInfo.name,
        createdByRole: userInfo.role,
        createdFromIP: userInfo.ip,
        createdFromDevice: userInfo.device,
        notes: generateForm.notes,
        targetedSubsections:
          generateForm.targetingType === "all"
            ? []
            : generateForm.targetedSubsections,
        targetingType: generateForm.targetingType,
      };

      setCardCodes([...cardCodes, ...newCodes]);
      setCodeBatches([...codeBatches, newBatch]);
      setShowGenerateModal(false);
      setGenerateForm({
        priceId: 0,
        quantity: 100,
        prefix: "CARD",
        notes: "",
        targetingType: "all",
        targetedSubsections: [],
      });
    }
  };

  const toggleCodeStatus = (id: number) => {
    setCardCodes(
      cardCodes.map((code) =>
        code.id === id ? { ...code, isActive: !code.isActive } : code
      )
    );
  };

  const toggleBatchStatus = (batchId: string) => {
    const userInfo = getCurrentUserInfo();

    setCodeBatches(
      codeBatches.map((batch) =>
        batch.id === batchId
          ? {
              ...batch,
              isActive: !batch.isActive,
              lastModified: new Date().toISOString().split("T")[0],
              lastModifiedBy: userInfo.name,
            }
          : batch
      )
    );

    // Update all codes in this batch
    setCardCodes(
      cardCodes.map((code) =>
        code.batchId === batchId ? { ...code, isActive: !code.isActive } : code
      )
    );
  };

  const deleteBatch = (batchId: string) => {
    if (
      confirm(
        "هل أنت متأكد من حذف هذه المجموعة؟ سيتم حذف جميع الكودات المرتبطة بها."
      )
    ) {
      setCodeBatches(codeBatches.filter((batch) => batch.id !== batchId));
      setCardCodes(cardCodes.filter((code) => code.batchId !== batchId));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportToExcel = () => {
    // Enhanced CSV export with batch info and targeting
    const csvContent = [
      [
        "الكود",
        "السعر",
        "الحالة",
        "مستخدم",
        "تاريخ الاستخدام",
        "تاريخ الإنشاء",
        "المجموعة",
        "منشئ المجموعة",
        "الاستهداف",
      ],
      ...filteredCodes.map((code) => {
        const batch = codeBatches.find((b) => b.id === code.batchId);
        const targeting = getTargetingDisplay(
          code.targetedSubsections,
          batch?.targetingType || "all"
        );
        return [
          code.code,
          code.price,
          code.isUsed ? "مستخدم" : "غير مستخدم",
          code.usedBy || "-",
          code.usedAt || "-",
          code.createdAt,
          code.batchId,
          batch?.createdBy || "-",
          targeting.display,
        ];
      }),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `card-codes-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const exportToPDF = () => {
    // Simulate PDF export
    alert("سيتم تصدير البيانات إلى PDF قريباً");
  };

  const renderSubsectionTree = (
    items: (any & { children?: any[] })[],
    depth: number = 0
  ) => {
    return items.map((item) => (
      <div key={item.id} className="space-y-1">
        <label
          className={`flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer ml-${
            depth * 4
          }`}
        >
          <input
            type="checkbox"
            checked={generateForm.targetedSubsections.includes(item.id)}
            onChange={(e) => {
              if (e.target.checked) {
                setGenerateForm({
                  ...generateForm,
                  targetedSubsections: [
                    ...generateForm.targetedSubsections,
                    item.id,
                  ],
                });
              } else {
                setGenerateForm({
                  ...generateForm,
                  targetedSubsections: generateForm.targetedSubsections.filter(
                    (id) => id !== item.id
                  ),
                });
              }
            }}
            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
          />
          <Folder size={16} className="text-orange-500" />
          <span className="text-sm">{item.name}</span>
          {item.level > 1 && (
            <span className="text-xs text-gray-500">({item.description})</span>
          )}
        </label>
        {item.children && item.children.length > 0 && (
          <div className="ml-4">
            {renderSubsectionTree(item.children, depth + 1)}
          </div>
        )}
      </div>
    ));
  };

  const GenerateModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              إنشاء كودات جديدة
            </h2>
            <button
              onClick={() => setShowGenerateModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Price Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              سعر البطاقة
            </label>
            <select
              value={generateForm.priceId}
              onChange={(e) =>
                setGenerateForm({
                  ...generateForm,
                  priceId: parseInt(e.target.value),
                })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            >
              <option value={0}>اختر سعر البطاقة</option>
              {cardPricing
                .filter((p: any) => p.isActive)
                .map((price: any) => (
                  <option key={price.id} value={price.id}>
                    {price.price} دينار أردني
                  </option>
                ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عدد الكودات
            </label>
            <input
              type="number"
              value={generateForm.quantity}
              onChange={(e) =>
                setGenerateForm({
                  ...generateForm,
                  quantity: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              placeholder="أدخل عدد الكودات..."
              min="1"
              max="10000"
            />
          </div>

          {/* Prefix */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              بادئة الكود
            </label>
            <input
              type="text"
              value={generateForm.prefix}
              onChange={(e) =>
                setGenerateForm({ ...generateForm, prefix: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              placeholder="CARD"
            />
          </div>

          {/* NEW: Targeting Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              استهداف الأقسام
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-orange-300 transition-colors">
                <input
                  type="radio"
                  name="targetingType"
                  value="all"
                  checked={generateForm.targetingType === "all"}
                  onChange={(e) =>
                    setGenerateForm({
                      ...generateForm,
                      targetingType: e.target.value as "all" | "specific",
                      targetedSubsections: [],
                    })
                  }
                  className="text-orange-600 focus:ring-orange-500"
                />
                <Globe className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-800">جميع الأقسام</div>
                  <div className="text-sm text-gray-500">
                    الكودات تعمل على كامل الأجيال والأقسام
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-orange-300 transition-colors">
                <input
                  type="radio"
                  name="targetingType"
                  value="specific"
                  checked={generateForm.targetingType === "specific"}
                  onChange={(e) =>
                    setGenerateForm({
                      ...generateForm,
                      targetingType: e.target.value as "all" | "specific",
                    })
                  }
                  className="text-orange-600 focus:ring-orange-500"
                />
                <Target className="w-5 h-5 text-orange-600" />
                <div>
                  <div className="font-medium text-gray-800">أقسام محددة</div>
                  <div className="text-sm text-gray-500">
                    اختيار أقسام فرعية معينة
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* NEW: Subsection Selection */}
          {generateForm.targetingType === "specific" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                اختيار الأقسام الفرعية (
                {generateForm.targetedSubsections.length} محدد)
              </label>
              <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
                {subsectionTree.length > 0 ? (
                  renderSubsectionTree(subsectionTree)
                ) : (
                  <p className="text-gray-500 text-sm text-center py-4">
                    لا توجد أقسام فرعية متاحة
                  </p>
                )}
              </div>
              {generateForm.targetedSubsections.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-600 mb-2">الأقسام المحددة:</p>
                  <div className="flex flex-wrap gap-1">
                    {generateForm.targetedSubsections.map((id) => (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs"
                      >
                        <Folder size={12} />
                        {getSubsectionName(id)}
                        <button
                          onClick={() =>
                            setGenerateForm({
                              ...generateForm,
                              targetedSubsections:
                                generateForm.targetedSubsections.filter(
                                  (sid) => sid !== id
                                ),
                            })
                          }
                          className="hover:bg-orange-200 rounded-full p-0.5"
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ملاحظات (اختياري)
            </label>
            <textarea
              value={generateForm.notes}
              onChange={(e) =>
                setGenerateForm({ ...generateForm, notes: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
              placeholder="أدخل ملاحظات حول هذه المجموعة..."
            />
          </div>

          {/* Preview */}
          {generateForm.priceId > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">مثال على الكود:</p>
              <p className="font-mono text-lg font-bold text-orange-600 mb-3">
                {generateForm.prefix}-
                {
                  cardPricing.find((p: any) => p.id === generateForm.priceId)
                    ?.price
                }
                -ABC123
              </p>

              <div className="flex items-center gap-2 text-sm">
                {generateForm.targetingType === "all" ? (
                  <>
                    <Globe size={16} className="text-blue-600" />
                    <span className="text-blue-600 font-medium">
                      يعمل على جميع الأقسام
                    </span>
                  </>
                ) : (
                  <>
                    <Target size={16} className="text-orange-600" />
                    <span className="text-orange-600 font-medium">
                      {generateForm.targetedSubsections.length === 0
                        ? "لم يتم اختيار أقسام بعد"
                        : `يعمل على ${generateForm.targetedSubsections.length} قسم محدد`}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Security Info Preview */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
              <Shield size={16} />
              معلومات الأمان
            </h4>
            <div className="text-xs text-blue-700 space-y-1">
              <div className="flex items-center gap-2">
                <User size={12} />
                <span>المنشئ: المدير الحالي (مدير النظام)</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={12} />
                <span>IP: 192.168.1.100</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone size={12} />
                <span>الجهاز: Windows 11 - Chrome</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={12} />
                <span>التاريخ: {new Date().toLocaleDateString("ar-JO")}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
          <button
            onClick={() => setShowGenerateModal(false)}
            className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleGenerateCodes}
            disabled={
              !generateForm.priceId ||
              generateForm.quantity <= 0 ||
              (generateForm.targetingType === "specific" &&
                generateForm.targetedSubsections.length === 0)
            }
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            إنشاء الكودات
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
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
          <button
            onClick={exportToExcel}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-all duration-300 flex items-center gap-2 text-sm"
          >
            <FileSpreadsheet size={16} />
            تصدير Excel
          </button>
          <button
            onClick={exportToPDF}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-all duration-300 flex items-center gap-2 text-sm"
          >
            <FileText size={16} />
            تصدير PDF
          </button>
          <button
            onClick={() => setShowGenerateModal(true)}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2 text-sm"
          >
            <Plus size={16} />
            إنشاء كودات
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">إجمالي الكودات</p>
              <p className="text-3xl font-bold text-gray-800">
                {cardCodes.length}
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
                {cardCodes.filter((c) => c.isUsed).length}
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
                {cardCodes.filter((c) => !c.isUsed && c.isActive).length}
              </p>
            </div>
            <CreditCard className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">المجموعات</p>
              <p className="text-3xl font-bold text-blue-600">
                {codeBatches.length}
              </p>
            </div>
            <AlertCircle className="w-12 h-12 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="البحث في الكودات..."
              className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
            />
          </div>

          {/* Price Filter */}
          <select
            value={selectedPriceFilter || ""}
            onChange={(e) =>
              setSelectedPriceFilter(
                e.target.value ? parseInt(e.target.value) : null
              )
            }
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
          >
            <option value="">جميع الأسعار</option>
            {cardPricing.map((price: any) => (
              <option key={price.id} value={price.id}>
                {price.price} د.أ
              </option>
            ))}
          </select>

          {/* Batch Filter */}
          <select
            value={selectedBatchFilter || ""}
            onChange={(e) => setSelectedBatchFilter(e.target.value || null)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
          >
            <option value="">جميع المجموعات</option>
            {codeBatches.map((batch) => (
              <option key={batch.id} value={batch.id}>
                {batch.id} ({batch.price} د.أ)
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
          >
            <option value="all">جميع الحالات</option>
            <option value="used">مستخدم</option>
            <option value="unused">غير مستخدم</option>
            <option value="active">مفعل</option>
            <option value="inactive">معطل</option>
          </select>

          {/* Results Count */}
          <div className="flex items-center justify-center bg-gray-50 rounded-lg px-4 py-2">
            <span className="text-sm text-gray-600">
              {filteredCodes.length} من {cardCodes.length} كود
            </span>
          </div>
        </div>
      </div>

      {/* Enhanced Batches Section with Targeting Info */}
      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-orange-100/50">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-orange-600" />
            مجموعات الكودات مع الاستهداف ومعلومات الأمان
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {codeBatches.map((batch) => {
              const targeting = getTargetingDisplay(
                batch.targetedSubsections,
                batch.targetingType
              );

              return (
                <div
                  key={batch.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg">{batch.id}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          batch.isActive
                            ? "bg-green-400/20 text-green-100"
                            : "bg-red-400/20 text-red-100"
                        }`}
                      >
                        {batch.isActive ? "مفعل" : "معطل"}
                      </span>
                    </div>
                    <div className="text-2xl font-bold">{batch.price} د.أ</div>
                  </div>

                  {/* Targeting Info */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-orange-50">
                    <div className="flex items-center gap-2 text-sm">
                      <targeting.icon size={16} className={targeting.color} />
                      <span className={`font-medium ${targeting.color}`}>
                        {targeting.display}
                      </span>
                    </div>
                    {batch.targetingType === "specific" &&
                      batch.targetedSubsections.length > 1 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {batch.targetedSubsections.slice(0, 3).map((id) => (
                            <span
                              key={id}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-white/60 rounded-full text-xs"
                            >
                              <Folder size={10} />
                              {getSubsectionName(id)}
                            </span>
                          ))}
                          {batch.targetedSubsections.length > 3 && (
                            <span className="px-2 py-1 bg-white/60 rounded-full text-xs">
                              +{batch.targetedSubsections.length - 3} أخرى
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
                          {batch.totalCodes}
                        </div>
                        <div className="text-gray-600">إجمالي</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {batch.usedCodes}
                        </div>
                        <div className="text-gray-600">مستخدم</div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>معدل الاستخدام</span>
                        <span>
                          {Math.round(
                            (batch.usedCodes / batch.totalCodes) * 100
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${
                              (batch.usedCodes / batch.totalCodes) * 100
                            }%`,
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
                          {batch.createdBy}
                        </span>
                        <span className="text-gray-500 text-xs block">
                          {batch.createdByRole}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 font-mono text-xs">
                        {batch.createdFromIP}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Smartphone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 text-xs">
                        {batch.createdFromDevice}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{batch.createdAt}</span>
                    </div>

                    {batch.lastModified && (
                      <div className="pt-2 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>
                            آخر تعديل: {batch.lastModified} بواسطة{" "}
                            {batch.lastModifiedBy}
                          </span>
                        </div>
                      </div>
                    )}

                    {batch.notes && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-xs text-blue-600 font-medium mb-1">
                          ملاحظات:
                        </div>
                        <div className="text-sm text-blue-800">
                          {batch.notes}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                    <button
                      onClick={() => toggleBatchStatus(batch.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        batch.isActive
                          ? "text-green-600 bg-green-50 hover:bg-green-100"
                          : "text-gray-400 bg-gray-50 hover:bg-gray-100"
                      }`}
                      title={
                        batch.isActive ? "تعطيل المجموعة" : "تفعيل المجموعة"
                      }
                    >
                      {batch.isActive ? (
                        <ToggleRight size={20} />
                      ) : (
                        <ToggleLeft size={20} />
                      )}
                    </button>

                    <button
                      onClick={() => deleteBatch(batch.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="حذف المجموعة"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Enhanced Codes Table */}
      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-orange-100/50">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">قائمة الكودات</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الكود
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  السعر
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المجموعة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الاستهداف
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  مستخدم بواسطة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاريخ الاستخدام
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاريخ الإنشاء
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCodes.map((code) => {
                const batch = codeBatches.find((b) => b.id === code.batchId);
                const targeting = getTargetingDisplay(
                  code.targetedSubsections,
                  batch?.targetingType || "all"
                );

                return (
                  <tr key={code.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-medium text-gray-900">
                          {code.code}
                        </span>
                        <button
                          onClick={() => copyToClipboard(code.code)}
                          className="p-1 text-gray-400 hover:text-orange-600 transition-colors"
                          title="نسخ الكود"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {code.price} د.أ
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {code.batchId}
                        </div>
                        {batch && (
                          <div className="text-xs text-gray-500">
                            بواسطة: {batch.createdBy}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <targeting.icon size={14} className={targeting.color} />
                        <span
                          className={`text-xs font-medium ${targeting.color}`}
                        >
                          {targeting.display}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            code.isUsed
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {code.isUsed ? "مستخدم" : "متاح"}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            code.isActive
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {code.isActive ? "مفعل" : "معطل"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {code.usedBy || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {code.usedAt || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {code.createdAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleCodeStatus(code.id)}
                          className={`p-1 rounded transition-colors ${
                            code.isActive
                              ? "text-green-600 hover:bg-green-50"
                              : "text-gray-400 hover:bg-gray-50"
                          }`}
                          title={code.isActive ? "تعطيل الكود" : "تفعيل الكود"}
                        >
                          {code.isActive ? (
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

          {filteredCodes.length === 0 && (
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

      {/* Generate Modal */}
      {showGenerateModal && <GenerateModal />}
    </div>
  );
};

export default CardCodesPage;
