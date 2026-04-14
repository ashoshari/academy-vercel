// import { Slider } from "@/pages/dashboard/admin/sliders/SliderPage";
import { Edit, X } from "lucide-react";

interface ModalProps {
  setShowDetailsModal: (s: boolean) => void;
  setShowEditModal: (s: boolean) => void;
  selectedSlide: any;
}

export default function ShowSliderModal({
  setShowDetailsModal,
  setShowEditModal,
  selectedSlide,
}: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {selectedSlide && (
          <>
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">
                  تفاصيل السلايد
                </h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Media Preview */}
              <div className="mb-6">
                <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-video">
                  {selectedSlide.type === "image" ? (
                    <img
                      src={selectedSlide.image}
                      alt={selectedSlide.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={selectedSlide.image}
                      className="w-full h-full object-cover"
                      controls
                      poster="https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=800"
                    />
                  )}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedSlide.type === "image"
                          ? "bg-blue-100 text-(--brand-secondary)"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {selectedSlide.type === "image" ? "صورة" : "فيديو"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">العنوان</h3>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {selectedSlide.header}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">
                      العنوان الرئيسي
                    </h3>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {selectedSlide.title}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">
                      العنوان الفرعي
                    </h3>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {selectedSlide.subtitle}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">
                      معلومات السلايد
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">الترتيب</span>
                        <span className="font-medium">
                          #{selectedSlide.order}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">الرابط</span>
                        <span className="font-medium">
                          {selectedSlide.link ? selectedSlide.link : "لا يوجد"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">تاريخ الإنشاء</span>
                        <span className="font-medium">
                          {/* {selectedSlide.createdAt} */}
                          {new Date().toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">الحالة</span>
                        <div className="flex gap-2">
                          {/* <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              selectedSlide.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {selectedSlide.isActive ? "نشط" : "غير نشط"}
                          </span> */}
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              selectedSlide.is_published
                                ? "bg-blue-100 text-(--brand-secondary)"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {selectedSlide.is_published ? "مفعل" : "معطل"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setShowEditModal(true);
                }}
                className="btn-brand-slide px-6 py-2 rounded-lg transition-all flex items-center gap-2"
              >
                <Edit size={16} />
                تعديل السلايد
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
