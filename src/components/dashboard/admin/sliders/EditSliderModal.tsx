/* eslint-disable @typescript-eslint/no-explicit-any */
// import { Slider } from "@/pages/dashboard/admin/sliders/SliderPage";
import {
  FileImage,
  // FileVideo,
  Save,
  ToggleLeft,
  ToggleRight,
  X,
} from "lucide-react";
import { useMemo } from "react";

// interface ModalProps {
//   setShowEditModal: (s: boolean) => void;
//   setSelectedSlide: (slide: any) => void;
//   handleEditSlide: () => any;
//   setSelectedImageFile: (f: File | null) => void;
//   selectedImageFile: File | null;
//   selectedSlide: any;
// }

export default function EditSliderModal({
  setShowEditModal,
  setSelectedSlide,
  handleEditSlide,
  setSelectedImageFile,
  selectedImageFile,
  selectedSlide,
}: any) {
  const previewUrl = useMemo(() => {
    if (selectedImageFile) return URL.createObjectURL(selectedImageFile);
    return selectedSlide?.image || "";
  }, [selectedImageFile, selectedSlide?.image]);
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">تعديل السلايد</h2>
            <button
              onClick={() => setShowEditModal(false)}
              className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {selectedSlide && (
          <div className="p-6 space-y-6">
            {/* Media Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                نوع الوسائط
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() =>
                    setSelectedSlide({ ...selectedSlide, type: "image" })
                  }
                  className={`cursor-pointer flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                    selectedSlide.type === "image"
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <FileImage size={20} />
                  <span>صورة</span>
                </button>
                {/* <button
                  onClick={() =>
                    setSelectedSlide({ ...selectedSlide, type: "video" })
                  }
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                    selectedSlide.type === "video"
                      ? "border-orange-500 bg-orange-50 text-orange-700"
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
                العنوان
              </label>
              <input
                type="text"
                value={selectedSlide.header}
                onChange={(e) =>
                  setSelectedSlide({ ...selectedSlide, header: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="أدخل العنوان..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                العنوان الرئيسي
              </label>
              <input
                type="text"
                value={selectedSlide.title}
                onChange={(e) =>
                  setSelectedSlide({ ...selectedSlide, title: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="أدخل العنوان الرئيسي..."
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                العنوان الفرعي
              </label>
              <textarea
                value={selectedSlide.subtitle}
                onChange={(e) =>
                  setSelectedSlide({
                    ...selectedSlide,
                    subtitle: e.target.value,
                  })
                }
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
                placeholder="أدخل العنوان الفرعي أو الوصف..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الرابط
              </label>
              <input
                type="url"
                value={selectedSlide.link ?? ""}
                onChange={(e) =>
                  setSelectedSlide({
                    ...selectedSlide,
                    link: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="أدخل رابط..."
              />
            </div>

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
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              />
            </div>

            {selectedSlide.image && !selectedImageFile && (
              <div className="mt-2">
                <p className="text-sm text-gray-700 mb-2">الصورة الحالية:</p>
                <div className="w-full max-w-sm rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  <img
                    src={selectedSlide.image}
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
                <div className="w-full max-w-sm rounded-lg overflow-hidden border border-orange-200 bg-orange-50">
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
              {/* <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">نشط</p>
                  <p className="text-sm text-gray-500">ظهور في السلايدر</p>
                </div>
                <button
                  onClick={() =>
                    setSelectedSlide({
                      ...selectedSlide,
                      isActive: !selectedSlide.isActive,
                    })
                  }
                  className={`p-1 rounded-full transition-colors ${
                    selectedSlide.isActive ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {selectedSlide.isActive ? (
                    <ToggleRight size={24} />
                  ) : (
                    <ToggleLeft size={24} />
                  )}
                </button>
              </div> */}

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">مفعل</p>
                  <p className="text-sm text-gray-500">متاح للعرض</p>
                </div>
                <button
                  onClick={() =>
                    setSelectedSlide({
                      ...selectedSlide,
                      is_published: !selectedSlide.is_published,
                    })
                  }
                  className={`cursor-pointer p-1 rounded-full transition-colors ${
                    selectedSlide.is_published
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  {selectedSlide.is_published ? (
                    <ToggleRight size={24} />
                  ) : (
                    <ToggleLeft size={24} />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
          <button
            onClick={() => setShowEditModal(false)}
            className="cursor-pointer px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleEditSlide}
            className="cursor-pointer px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2"
          >
            <Save size={16} />
            حفظ التغييرات
          </button>
        </div>
      </div>
    </div>
  );
}
