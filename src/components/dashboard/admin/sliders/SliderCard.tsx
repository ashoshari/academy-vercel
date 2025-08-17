/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCustomUpdate } from "@/hooks/useMutation";
import { Slider } from "@/pages/dashboard/admin/sliders/SliderPage";
import handleErrorAlerts from "@/utils/showErrorMessages";
import {
  ArrowDown,
  ArrowUp,
  Edit,
  Eye,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Video,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface SliderCardProps {
  slide: Slider;
  prevId: string | null;
  nextId: string | null;
  prevOrder?: number;
  nextOrder?: number;
  onSwap: (aId: string, bId: string) => void;
  setSelectedSlide: (s: Slider) => void;
  setShowEditModal: (s: boolean) => void;
  setShowDetailsModal: (s: boolean) => void;
}

export default function SliderCard({
  slide,
  nextId,
  prevId,
  nextOrder,
  prevOrder,
  onSwap,
  setSelectedSlide,
  setShowEditModal,
  setShowDetailsModal,
}: SliderCardProps) {
  const updateSlideStatus = useCustomUpdate(
    `/training/admin/sliders/${slide?.id}/`,
    ["sliders"]
  );

  const toggleSlideStatus = async () => {
    const payload = {
      is_published: !slide?.is_published,
    };
    await updateSlideStatus
      .mutateAsync(payload)
      .then((res) => {
        if (res.status) {
          toast.success(res.message ?? "تم الحفظ");
        } else toast.error(res.message ?? "فشل الحفظ");
      })
      .catch((e) => handleErrorAlerts(e?.response?.data?.error));
  };

  const moveSelf = useCustomUpdate(`/training/admin/sliders/${slide.id}/`, [
    "sliders",
  ]);

  const movePrev = useCustomUpdate(
    `/training/admin/sliders/${prevId ?? "noop"}/`,
    ["sliders"]
  );

  const moveNext = useCustomUpdate(
    `/training/admin/sliders/${nextId ?? "noop"}/`,
    ["sliders"]
  );

  const [isMoving, setIsMoving] = useState<null | "up" | "down">(null);

  const moveSlide = async (direction: "up" | "down") => {
    const neighborId = direction === "up" ? prevId : nextId;
    const neighborOrder = direction === "up" ? prevOrder : nextOrder;
    const neighborMutation = direction === "up" ? movePrev : moveNext;

    if (!neighborId || neighborOrder == null) return;

    const oldSelfOrder = slide.order;

    try {
      setIsMoving(direction);

      await neighborMutation.mutateAsync({ order: oldSelfOrder });

      await moveSelf.mutateAsync({ order: neighborOrder });

      onSwap(slide.id, neighborId);

      toast.success("تم تحديث ترتيب السلايدرز");
    } catch (e: any) {
      handleErrorAlerts(e?.response?.data?.error);
    } finally {
      setIsMoving(null);
    }
  };

  return (
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
                src={slide.image}
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
                  {slide.header}
                </h3>
                <h6 className="font-semibold text-gray-800 mb-1 truncate">
                  {slide.title}
                </h6>
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
                  {/* <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      slide.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {slide.isActive ? "نشط" : "غير نشط"}
                  </span> */}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      slide.is_published
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {slide.is_published ? "مفعل" : "معطل"}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date().toISOString()}
                  {/* {slide.createdAt} */}
                </span>
              </div>

              <div className="flex items-center gap-1">
                {/* Move buttons */}
                <button
                  onClick={() => moveSlide("up")}
                  disabled={!prevId || !!isMoving}
                  className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  onClick={() => moveSlide("down")}
                  disabled={!nextId || !!isMoving}
                  className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowDown size={16} />
                </button>

                {/* Status toggles */}

                <button
                  onClick={toggleSlideStatus}
                  className={`p-1 rounded-full transition-colors ${
                    slide?.is_published ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {slide?.is_published ? (
                    <ToggleRight size={24} />
                  ) : (
                    <ToggleLeft size={24} />
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
                  // onClick={() => handleDeleteSlide(slide.id)}
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
  );
}
