import { useCustomRemove, useCustomUpdate } from "@/hooks/useMutation";
import { formatDateTimeSimple } from "@/utils/formatDateTime";
import handleErrorAlerts from "@/utils/showErrorMessages";
import { ArrowDown, ArrowUp, Image, Video } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ConfirmationModal } from "@/components/dashboard/core/ConfirmationModal";
import StatusToggleButton from "@/components/dashboard/core/StatusToggleButton";
import DetailsButton from "@/components/dashboard/core/DetailsButton";
import EditButton from "@/components/dashboard/core/EditButton";
import DeleteButton from "@/components/dashboard/core/DeleteButton";

interface SliderCardProps {
  slide: any;
  prevId: string | null;
  nextId: string | null;
  prevOrder?: number;
  nextOrder?: number;
  onSwap: (aId: string, bId: string) => void;
  setSelectedSlide: (s: any) => void;
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
  const queryClient = useQueryClient();
  const [pendingSlideStatusToggle, setPendingSlideStatusToggle] = useState<{
    isPublished: boolean;
    header: string;
  } | null>(null);
  const [pendingDelete, setPendingDelete] = useState(false);
  const updateSlideStatus = useCustomUpdate(
    `/training/admin/sliders/${slide?.id}/`,
    ["sliders"],
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
          queryClient.invalidateQueries({
            predicate: (query) => query.queryKey[0] === "sliders",
          });
          queryClient.invalidateQueries({ queryKey: ["sliders-statistics"] });
        } else toast.error(res.message ?? "فشل الحفظ");
      })
      .catch((e) => handleErrorAlerts(e?.response?.data?.error));
  };

  const moveSelf = useCustomUpdate(`/training/admin/sliders/${slide.id}/`, [
    "sliders",
  ]);

  const movePrev = useCustomUpdate(
    `/training/admin/sliders/${prevId ?? "noop"}/`,
    ["sliders"],
  );

  const moveNext = useCustomUpdate(
    `/training/admin/sliders/${nextId ?? "noop"}/`,
    ["sliders"],
  );

  // Delete Slides
  const { mutateAsync: deleteSlide } = useCustomRemove(
    `/training/admin/sliders/${slide?.id}/`,
    ["deleteSliders"],
  );
  const handleDeleteSlide = async () => {
    try {
      const response = await deleteSlide();
      toast.success(response.message ?? "تم الحذف");
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "sliders",
      });
      queryClient.invalidateQueries({ queryKey: ["sliders-statistics"] });
      setPendingDelete(false);
    } catch (e: any) {
      handleErrorAlerts(e?.response?.data?.error);
    }
  };
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
      className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-(--brand) overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="p-6">
        <div className="flex items-start gap-6">
          {/* Media Thumbnail */}
          <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
            {slide.type === "image" ? (
              slide.image ? (
                <img
                  src={slide?.image}
                  alt={slide?.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Image className="w-8 h-8 text-gray-400" />
                </div>
              )
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <Video className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <div className="absolute top-1 right-1">
              <span
                className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                  slide.type === "image"
                    ? "bg-blue-100 text-(--brand-secondary)"
                    : "bg-purple-100 text-purple-800"
                }`}
              >
                {slide.type === "image" ? "صورة" : "فيديو"}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="lg:flex-1 min-w-0">
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
                <span className="bg-gray-100 text-(--brand) px-2 py-1 rounded-full text-xs font-medium">
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
                        ? "bg-blue-100 text-(--brand-secondary)"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {slide.is_published ? "مفعل" : "معطل"}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {formatDateTimeSimple(new Date().toISOString())}
                  {/* {slide.createdAt} */}
                </span>
              </div>

              <div className="flex items-center gap-1">
                {/* Move buttons */}
                <button
                  onClick={() => moveSlide("up")}
                  disabled={!prevId || !!isMoving}
                  className="cursor-pointer p-2 text-gray-400 hover:text-(--brand) hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="تحريك للأعلى"
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  onClick={() => moveSlide("down")}
                  disabled={!nextId || !!isMoving}
                  className="cursor-pointer p-2 text-gray-400 hover:text-(--brand) hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="تحريك للأسفل"
                >
                  <ArrowDown size={16} />
                </button>

                {/* Status toggles */}

                <StatusToggleButton
                  isOn={Boolean(slide?.is_published)}
                  onToggle={() =>
                    setPendingSlideStatusToggle({
                      isPublished: Boolean(slide?.is_published),
                      header: String(slide?.header ?? slide?.title ?? "—"),
                    })
                  }
                  titleOn="إلغاء التفعيل"
                  titleOff="تفعيل السلايدر"
                />

                {/* View details */}
                <DetailsButton
                  onClick={() => {
                    setSelectedSlide(slide);
                    setShowDetailsModal(true);
                  }}
                />

                {/* Edit */}
                <EditButton
                  onClick={() => {
                    setSelectedSlide(slide);
                    setShowEditModal(true);
                  }}
                  className="cursor-pointer p-2 text-gray-400 hover:text-(--brand) hover:bg-gray-50 rounded-lg transition-colors"
                  title="تعديل السلايد"
                />

                {/* Delete */}
                <DeleteButton
                  onClick={() => {
                    setPendingDelete(true);
                  }}
                  title="حذف السلايد"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {pendingSlideStatusToggle && (
        <ConfirmationModal
          open
          onClose={() =>
            !updateSlideStatus.isPending && setPendingSlideStatusToggle(null)
          }
          onConfirm={async () => {
            await toggleSlideStatus();
            setPendingSlideStatusToggle(null);
          }}
          title={
            pendingSlideStatusToggle.isPublished
              ? "إلغاء تفعيل السلايدر "
              : "تفعيل السلايدر "
          }
          variant={pendingSlideStatusToggle.isPublished ? "danger" : "success"}
          confirmLabel={
            pendingSlideStatusToggle.isPublished
              ? "نعم، إلغاء التفعيل"
              : "نعم، تفعيل"
          }
          isPending={updateSlideStatus.isPending}
          description={
            <>
              <p className="text-base">
                هل أنت متأكد أنك تريد{" "}
                <span className="font-bold text-gray-900">
                  {pendingSlideStatusToggle.isPublished
                    ? "إلغاء تفعيل"
                    : "تفعيل"}
                </span>{" "}
                هذا السلايد؟
              </p>
              <p className="text-sm text-gray-600">
                العنوان:{" "}
                <span className="font-semibold text-(--brand-secondary)">
                  {pendingSlideStatusToggle.header}
                </span>
              </p>
            </>
          }
        />
      )}

      {pendingDelete && (
        <ConfirmationModal
          open
          onClose={() => setPendingDelete(false)}
          onConfirm={handleDeleteSlide}
          title="حذف السلايد"
          variant="danger"
          confirmLabel="نعم، حذف"
          isPending={false}
          description={
            <p className="text-base">
              هل أنت متأكد من حذف هذا السلايد؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
          }
        />
      )}
    </div>
  );
}
