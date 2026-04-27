import { Plus } from "lucide-react";

function Header({
  canAddCode,
  setShowGenerateModal,
}: {
  canAddCode: boolean;
  setShowGenerateModal: any;
}) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          إدارة كودات البطاقات
        </h1>
        <p className="text-gray-600 text-sm">
          إنشاء وإدارة كودات تفعيل البطاقات مع استهداف الأقسام وتتبع أمني شامل
        </p>
      </div>

      {canAddCode && (
        <button
          onClick={() => setShowGenerateModal(true)}
          className="btn-brand-slide px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 text-sm"
        >
          <Plus size={16} />
          إضافة كودات
        </button>
      )}
    </div>
  );
}

export default Header;
