import React, { useState } from "react";
import {
  Plus,
  Search,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  Video,
  Image as ImageIcon,
  FileImage,
  FileVideo,
  ToggleLeft,
  ToggleRight,
  Save,
  X,
} from "lucide-react";

export type SlideType = "image" | "video";

export interface SlideItem {
  id: number;
  type: SlideType;
  title: string;
  subtitle: string;
  mediaUrl: string;
  isActive: boolean;
  isEnabled: boolean;
  order: number;
  createdAt: string;
}

const SliderPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState<SlideItem | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [newSlide, setNewSlide] = useState<Partial<SlideItem>>({
    type: "image",
    title: "",
    subtitle: "",
    mediaUrl: "",
    isActive: true,
    isEnabled: true,
  });

  const [sliderItems, setSliderItems] = useState<SlideItem[]>([
    {
      id: 1,
      type: "image",
      title: "مرحباً بكم في منصتنا التعليمية",
      subtitle: "تعلم مع أفضل المعلمين والدورات المتخصصة في جميع المجالات",
      mediaUrl:
        "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=800",
      isActive: true,
      isEnabled: true,
      order: 1,
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      type: "video",
      title: "دورات متقدمة في جميع التخصصات",
      subtitle: "احصل على شهادات معتمدة من خبراء المجال مع تدريب عملي",
      mediaUrl:
        "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
      isActive: true,
      isEnabled: true,
      order: 2,
      createdAt: "2024-01-14",
    },
    {
      id: 3,
      type: "image",
      title: "تعلم في أي وقت ومن أي مكان",
      subtitle: "منصة تعليمية متاحة 24/7 لجميع الطلاب مع دعم فني متواصل",
      mediaUrl:
        "https://images.pexels.com/photos/4145190/pexels-photo-4145190.jpeg?auto=compress&cs=tinysrgb&w=800",
      isActive: false,
      isEnabled: true,
      order: 3,
      createdAt: "2024-01-13",
    },
    {
      id: 4,
      type: "video",
      title: "تقنيات التعلم الحديثة",
      subtitle: "استخدم أحدث التقنيات في التعلم التفاعلي والذكي",
      mediaUrl:
        "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
      isActive: true,
      isEnabled: false,
      order: 4,
      createdAt: "2024-01-12",
    },
  ]);

  // Filter slides based on search term
  const filteredSlides = sliderItems.filter(
    (slide) =>
      slide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slide.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSlide = () => {
    if (newSlide.title && newSlide.subtitle && newSlide.mediaUrl) {
      const slide: SlideItem = {
        id: Date.now(),
        type: newSlide.type as SlideType,
        title: newSlide.title,
        subtitle: newSlide.subtitle,
        mediaUrl: newSlide.mediaUrl,
        isActive: newSlide.isActive || false,
        isEnabled: newSlide.isEnabled || false,
        order: sliderItems.length + 1,
        createdAt: new Date().toISOString().split("T")[0],
      };

      setSliderItems([...sliderItems, slide]);
      setNewSlide({
        type: "image",
        title: "",
        subtitle: "",
        mediaUrl: "",
        isActive: true,
        isEnabled: true,
      });
      setShowAddModal(false);
    }
  };

  const handleEditSlide = () => {
    if (
      selectedSlide &&
      selectedSlide.title &&
      selectedSlide.subtitle &&
      selectedSlide.mediaUrl
    ) {
      setSliderItems(
        sliderItems.map((slide) =>
          slide.id === selectedSlide.id ? selectedSlide : slide
        )
      );
      setShowEditModal(false);
      setSelectedSlide(null);
    }
  };

  const handleDeleteSlide = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا السلايد؟")) {
      setSliderItems(sliderItems.filter((slide) => slide.id !== id));
    }
  };

  const toggleSlideStatus = (id: number, field: "isActive" | "isEnabled") => {
    setSliderItems(
      sliderItems.map((slide) =>
        slide.id === id ? { ...slide, [field]: !slide[field] } : slide
      )
    );
  };

  const moveSlide = (id: number, direction: "up" | "down") => {
    const slideIndex = sliderItems.findIndex((slide) => slide.id === id);
    if (
      (direction === "up" && slideIndex > 0) ||
      (direction === "down" && slideIndex < sliderItems.length - 1)
    ) {
      const newSlides = [...sliderItems];
      const targetIndex = direction === "up" ? slideIndex - 1 : slideIndex + 1;

      // Swap slides
      [newSlides[slideIndex], newSlides[targetIndex]] = [
        newSlides[targetIndex],
        newSlides[slideIndex],
      ];

      // Update order numbers
      newSlides.forEach((slide, index) => {
        slide.order = index + 1;
      });

      setSliderItems(newSlides);
    }
  };

  const AddSlideModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              إضافة سلايد جديد
            </h2>
            <button
              onClick={() => setShowAddModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
                className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  newSlide.type === "image"
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <FileImage size={20} />
                <span>صورة</span>
              </button>
              <button
                onClick={() => setNewSlide({ ...newSlide, type: "video" })}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  newSlide.type === "video"
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <FileVideo size={20} />
                <span>فيديو</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              العنوان الرئيسي
            </label>
            <input
              type="text"
              value={newSlide.title || ""}
              onChange={(e) =>
                setNewSlide({ ...newSlide, title: e.target.value })
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
              value={newSlide.subtitle || ""}
              onChange={(e) =>
                setNewSlide({ ...newSlide, subtitle: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
              placeholder="أدخل العنوان الفرعي أو الوصف..."
            />
          </div>

          {/* Media URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رابط {newSlide.type === "image" ? "الصورة" : "الفيديو"}
            </label>
            <input
              type="url"
              value={newSlide.mediaUrl || ""}
              onChange={(e) =>
                setNewSlide({ ...newSlide, mediaUrl: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              placeholder={`أدخل رابط ${
                newSlide.type === "image" ? "الصورة" : "الفيديو"
              }...`}
            />
          </div>

          {/* Status Toggles */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">نشط</p>
                <p className="text-sm text-gray-500">ظهور في السلايدر</p>
              </div>
              <button
                onClick={() =>
                  setNewSlide({ ...newSlide, isActive: !newSlide.isActive })
                }
                className={`p-1 rounded-full transition-colors ${
                  newSlide.isActive ? "text-green-600" : "text-gray-400"
                }`}
              >
                {newSlide.isActive ? (
                  <ToggleRight size={24} />
                ) : (
                  <ToggleLeft size={24} />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">مفعل</p>
                <p className="text-sm text-gray-500">متاح للعرض</p>
              </div>
              <button
                onClick={() =>
                  setNewSlide({ ...newSlide, isEnabled: !newSlide.isEnabled })
                }
                className={`p-1 rounded-full transition-colors ${
                  newSlide.isEnabled ? "text-green-600" : "text-gray-400"
                }`}
              >
                {newSlide.isEnabled ? (
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
            onClick={() => setShowAddModal(false)}
            className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleAddSlide}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2"
          >
            <Save size={16} />
            حفظ السلايد
          </button>
        </div>
      </div>
    </div>
  );

  const EditSlideModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">تعديل السلايد</h2>
            <button
              onClick={() => setShowEditModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                    selectedSlide.type === "image"
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <FileImage size={20} />
                  <span>صورة</span>
                </button>
                <button
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
                </button>
              </div>
            </div>

            {/* Title */}
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

            {/* Media URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رابط {selectedSlide.type === "image" ? "الصورة" : "الفيديو"}
              </label>
              <input
                type="url"
                value={selectedSlide.mediaUrl}
                onChange={(e) =>
                  setSelectedSlide({
                    ...selectedSlide,
                    mediaUrl: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder={`أدخل رابط ${
                  selectedSlide.type === "image" ? "الصورة" : "الفيديو"
                }...`}
              />
            </div>

            {/* Status Toggles */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">مفعل</p>
                  <p className="text-sm text-gray-500">متاح للعرض</p>
                </div>
                <button
                  onClick={() =>
                    setSelectedSlide({
                      ...selectedSlide,
                      isEnabled: !selectedSlide.isEnabled,
                    })
                  }
                  className={`p-1 rounded-full transition-colors ${
                    selectedSlide.isEnabled ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {selectedSlide.isEnabled ? (
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
            className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleEditSlide}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2"
          >
            <Save size={16} />
            حفظ التغييرات
          </button>
        </div>
      </div>
    </div>
  );

  const SlideDetailsModal = () => (
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
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
                      src={selectedSlide.mediaUrl}
                      alt={selectedSlide.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={selectedSlide.mediaUrl}
                      className="w-full h-full object-cover"
                      controls
                      poster="https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=800"
                    />
                  )}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedSlide.type === "image"
                          ? "bg-blue-100 text-blue-800"
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
                        <span className="text-gray-600">تاريخ الإنشاء</span>
                        <span className="font-medium">
                          {selectedSlide.createdAt}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">الحالة</span>
                        <div className="flex gap-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              selectedSlide.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {selectedSlide.isActive ? "نشط" : "غير نشط"}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              selectedSlide.isEnabled
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {selectedSlide.isEnabled ? "مفعل" : "معطل"}
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
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2"
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">إدارة السلايدر</h1>
          <p className="text-gray-600 text-sm">
            إدارة صور وفيديوهات الصفحة الرئيسية
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2 text-sm"
        >
          <Plus size={16} />
          إضافة سلايد جديد
        </button>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2">
          <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-orange-100/50">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="البحث في السلايدر..."
                className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-orange-100/50 text-center">
          <p className="text-2xl font-bold text-orange-600">
            {sliderItems.length}
          </p>
          <p className="text-sm text-gray-600">إجمالي السلايدات</p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-orange-100/50 text-center">
          <p className="text-2xl font-bold text-green-600">
            {sliderItems.filter((s) => s.isActive).length}
          </p>
          <p className="text-sm text-gray-600">السلايدات النشطة</p>
        </div>
      </div>

      {/* Slider Items List */}
      <div className="space-y-4">
        {filteredSlides.map((slide) => (
          <div
            key={slide.id}
            className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-orange-100/50 overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div className="p-6">
              <div className="flex items-start gap-6">
                {/* Media Thumbnail */}
                <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  {slide.type === "image" ? (
                    <img
                      src={slide.mediaUrl}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Video className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-1 right-1">
                    <span
                      className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                        slide.type === "image"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {slide.type === "image" ? "صورة" : "فيديو"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg mb-1 truncate">
                        {slide.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {slide.subtitle}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                        #{slide.order}
                      </span>
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            slide.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {slide.isActive ? "نشط" : "غير نشط"}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            slide.isEnabled
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {slide.isEnabled ? "مفعل" : "معطل"}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {slide.createdAt}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Move buttons */}
                      <button
                        onClick={() => moveSlide(slide.id, "up")}
                        disabled={slide.order === 1}
                        className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button
                        onClick={() => moveSlide(slide.id, "down")}
                        disabled={slide.order === sliderItems.length}
                        className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ArrowDown size={16} />
                      </button>

                      {/* Status toggles */}
                      <button
                        onClick={() => toggleSlideStatus(slide.id, "isActive")}
                        className={`p-2 rounded-lg transition-colors ${
                          slide.isActive
                            ? "text-green-600 bg-green-50 hover:bg-green-100"
                            : "text-gray-400 bg-gray-50 hover:bg-gray-100"
                        }`}
                      >
                        {slide.isActive ? (
                          <Eye size={16} />
                        ) : (
                          <EyeOff size={16} />
                        )}
                      </button>

                      {/* View details */}
                      <button
                        onClick={() => {
                          setSelectedSlide(slide);
                          setShowDetailsModal(true);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye size={16} />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => {
                          setSelectedSlide(slide);
                          setShowEditModal(true);
                        }}
                        className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteSlide(slide.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredSlides.length === 0 && (
          <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-orange-100/50">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              {searchTerm ? "لا توجد نتائج" : "لا توجد سلايدات"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm
                ? "لم يتم العثور على سلايدات تطابق البحث"
                : "ابدأ بإضافة سلايد جديد للصفحة الرئيسية"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2 mx-auto"
              >
                <Plus size={16} />
                إضافة سلايد جديد
              </button>
            )}
          </div>
        )}
      </div>

      {/* Slider Settings */}
      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          إعدادات السلايدر
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              سرعة التبديل (ثانية)
            </label>
            <input
              type="number"
              defaultValue="5"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              التبديل التلقائي
            </label>
            <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300">
              <option>مفعل</option>
              <option>معطل</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عرض النقاط
            </label>
            <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300">
              <option>مفعل</option>
              <option>معطل</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300">
            حفظ الإعدادات
          </button>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && <AddSlideModal />}
      {showEditModal && <EditSlideModal />}
      {showDetailsModal && <SlideDetailsModal />}
    </div>
  );
};

export default SliderPage;
