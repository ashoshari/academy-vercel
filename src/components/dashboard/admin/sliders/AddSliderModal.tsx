import { FileImage, Save, ToggleLeft, ToggleRight, X } from "lucide-react";
import { useMemo } from "react";

interface ModalProps {
  setShowAddModal: (s: boolean) => void;
  setNewSlide: (slide: any) => void;
  handleAddSlide: () => any;
  setSelectedImageFile: (f: File | null) => void;
  selectedImageFile: File | null;
  newSlide: any;
}

export default function AddSliderModal({
  setShowAddModal,
  setNewSlide,
  handleAddSlide,
  setSelectedImageFile,
  selectedImageFile,
  newSlide,
}: ModalProps) {
  const previewUrl = useMemo(() => {
    if (selectedImageFile) return URL.createObjectURL(selectedImageFile);
    return newSlide?.image || "";
  }, [selectedImageFile, newSlide?.image]);
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              إضافة سلايد جديد
            </h2>
            <button
              onClick={() => {
                setNewSlide({
                  type: "image",
                  is_published: true,
                });
                setShowAddModal(false);
              }}
              className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Media Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              نوع الوسائط
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setNewSlide({ ...newSlide, type: "image" })}
                className={`cursor-pointer flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  newSlide.type === "image"
                    ? "border-(--brand) text-(--brand)"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <FileImage size={20} />
                <span>صورة</span>
              </button>
              {/* <button
                onClick={() => setNewSlide({ ...newSlide, type: "video" })}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  newSlide.type === "video"
                    ? "border-(--brand) bg-orange-50 text-(--brand)"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <FileVideo size={20} />
                <span>فيديو</span>
              </button> */}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              العنوان *
            </label>
            <input
              type="text"
              value={newSlide.header || ""}
              onChange={(e) =>
                setNewSlide({ ...newSlide, header: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
              placeholder="أدخل العنوان..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              العنوان الرئيسي *
            </label>
            <input
              type="text"
              value={newSlide.title || ""}
              onChange={(e) =>
                setNewSlide({ ...newSlide, title: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
              placeholder="أدخل العنوان الرئيسي..."
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              العنوان الفرعي
            </label>
            <textarea
              value={newSlide.subtitle || ""}
              onChange={(e) =>
                setNewSlide({ ...newSlide, subtitle: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all resize-none"
              placeholder="أدخل العنوان الفرعي أو الوصف..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الرابط
            </label>
            <input
              type="url"
              value={newSlide.link ?? ""}
              onChange={(e) =>
                setNewSlide({
                  ...newSlide,
                  link: e.target.value,
                })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
              placeholder="أدخل رابط..."
            />
          </div>

          {/* Media */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اختر صورة
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setSelectedImageFile(e.target.files?.[0] ?? null)
              }
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-(--brand) hover:file:bg-blue-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الترتيب
            </label>
            <input
              type="number"
              value={newSlide.order ?? ""}
              onChange={(e) =>
                setNewSlide({
                  ...newSlide,
                  order: e.target.value,
                })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
              placeholder="أدخل الترتيب..."
            />
          </div>
          {newSlide.image && !selectedImageFile && (
            <div className="mt-2">
              <p className="text-sm text-gray-700 mb-2">الصورة الحالية:</p>
              <div className="w-full max-w-sm rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                <img
                  src={newSlide.image}
                  alt="current"
                  className="w-full h-40 object-cover"
                />
              </div>
            </div>
          )}

          {selectedImageFile && (
            <div className="mt-2">
              <p className="text-sm text-gray-700 mb-2">
                معاينة الصورة الجديدة:
              </p>
              <div className="w-full max-w-sm rounded-lg overflow-hidden border border-(--brand) bg-(--brand)">
                <img
                  src={previewUrl}
                  alt="preview"
                  className="w-full h-40 object-cover"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                لن تُرفع حتى تضغط “حفظ التغييرات”.
              </p>
            </div>
          )}

          {/* Status Toggles */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">مفعل</p>
                <p className="text-sm text-gray-500">متاح للعرض</p>
              </div>
              <button
                onClick={() =>
                  setNewSlide({
                    ...newSlide,
                    is_published: !newSlide.is_published,
                  })
                }
                className={`cursor-pointer p-1 rounded-full transition-colors ${
                  newSlide.is_published ? "text-green-600" : "text-gray-400"
                }`}
              >
                {newSlide.is_published ? (
                  <ToggleRight size={24} />
                ) : (
                  <ToggleLeft size={24} />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
          <button
            onClick={() => {
              setNewSlide({
                type: "image",
                is_published: false,
              });
              setShowAddModal(false);
            }}
            className="cursor-pointer px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </button>
          <button
            disabled={!newSlide.title || !newSlide.header}
            onClick={handleAddSlide}
            className="btn-brand-slide px-6 py-2 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            حفظ السلايد
          </button>
        </div>
      </div>
    </div>
  );
}
