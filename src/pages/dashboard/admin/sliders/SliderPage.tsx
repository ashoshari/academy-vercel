import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";
import { useCustomPost, useCustomUpdate } from "@/hooks/useMutation";
import SliderCard from "@/components/dashboard/admin/sliders/SliderCard";
import toast from "react-hot-toast";
import EditSliderModal from "@/components/dashboard/admin/sliders/EditSliderModal";
import handleErrorAlerts from "@/utils/showErrorMessages";
import AddSliderModal from "@/components/dashboard/admin/sliders/AddSliderModal";
import ShowSliderModal from "@/components/dashboard/admin/sliders/ShowSliderModal";
import { useQueryClient } from "@tanstack/react-query";
import Skeleton from "@/components/dashboard/Skeleton";
import StatsCardsSkeleton from "@/components/dashboard/skeletons/StatsCardsSkeleton";
import EmptyState from "@/components/core/EmptyState";
// import Pagination from "@/components/dashboard/core/Pagination";

export type SlideType = "image" | "video";

// export interface Slider {
//   id: string;
//   header: string;
//   title: string;
//   subtitle: string;
//   image: string;
//   type: SlideType;
//   link: string | null;
//   is_published: boolean;
//   order: number;
// }

const SliderPage = () => {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  // const [page, setPage] = useState<any>(null);

  const queryParams = new URLSearchParams();
  if (searchTerm) queryParams.append("title", searchTerm);
  // if (page) queryParams.append("page", page.toString());
  const queryString = queryParams.toString();

  const slidersData = useCustomQuery(
    `/training/admin/sliders/?${queryString}`,
    ["sliders", searchTerm],
  );
  // const paginationData = slidersData?.data?.pagination;
  const sliderStatisticsData = useCustomQuery(
    "/training/admin/sliders-statistics/",
    ["sliders-statistics"],
  );
  const isLoadingStatistics = Boolean((sliderStatisticsData as any)?.isLoading);

  const updateSlide = useCustomUpdate(
    `/training/admin/sliders/${selectedSlide?.id ?? "noop"}/`,
    ["putSliders"],
  );

  const addSlide = useCustomPost(`/training/admin/sliders/`, ["postSliders"]);

  const [sliderItems, setSliderItems] = useState<any>([]);

  useEffect(() => {
    if (slidersData?.data?.data) setSliderItems(slidersData?.data?.data);
  }, [slidersData?.data?.data]);

  const sorted = useMemo(
    () => [...(sliderItems ?? [])].sort((a, b) => a.order - b.order),
    [sliderItems],
  );

  const swapById = (aId: string, bId: string) => {
    setSliderItems((prev: any) => {
      const next = prev.map((s: any) => ({ ...s }));
      const ai = next.findIndex((s: any) => s.id === aId);
      const bi = next.findIndex((s: any) => s.id === bId);
      if (ai === -1 || bi === -1) return prev;

      // swap only the two order values
      const t = next[ai].order;
      next[ai].order = next[bi].order;
      next[bi].order = t;

      return next; // sorted useMemo will re-order visually
    });
  };

  const [newSlide, setNewSlide] = useState<any>({
    type: "image",
    title: "",
    header: "",
    subtitle: "",
    link: "",
    order: 0,
    image: "",
    is_published: true,
  });

  const handleAddSlide = async () => {
    if (!newSlide) return;

    try {
      const fd = new FormData();

      fd.append("title", newSlide.title ?? "");
      fd.append("header", newSlide.header ?? "");
      fd.append("subtitle", newSlide.subtitle ?? "");
      fd.append("type", newSlide.type as SlideType);
      fd.append("link", newSlide.link ?? "");
      fd.append("is_published", String(newSlide.is_published));
      fd.append("order", newSlide.order ?? 1);

      if (selectedImageFile) {
        fd.append("image", selectedImageFile);
      } else if (newSlide.image) {
        fd.append("image", newSlide.image);
      }

      await addSlide.mutateAsync(fd);

      toast.success("تم اضافة السلايد");
      setShowAddModal(false);
      setSelectedImageFile(null);
      queryClient.invalidateQueries({ queryKey: ["sliders", searchTerm] });
      queryClient.invalidateQueries({ queryKey: ["sliders-statistics"] });
      setNewSlide({
        type: "image",
        is_published: true,
      });
    } catch (e: any) {
      handleErrorAlerts(e?.response?.data?.error);
    }
  };

  const handleEditSlide = async () => {
    if (!selectedSlide) return;

    try {
      const fd = new FormData();

      fd.append("title", selectedSlide.title ?? "");
      fd.append("header", selectedSlide.header ?? "");
      fd.append("subtitle", selectedSlide.subtitle ?? "");
      fd.append("type", selectedSlide.type);
      fd.append("link", selectedSlide.link ?? "");
      fd.append("is_published", String(selectedSlide.is_published));
      fd.append("order", String(selectedSlide.order));

      if (selectedImageFile) {
        fd.append("image", selectedImageFile);
      }

      await updateSlide.mutateAsync(fd);

      toast.success("تم حفظ التغييرات");
      setShowEditModal(false);
      setSelectedImageFile(null);
      queryClient.invalidateQueries({ queryKey: ["sliders", searchTerm] });
      queryClient.invalidateQueries({ queryKey: ["sliders-statistics"] });
    } catch (e: any) {
      handleErrorAlerts(e?.response?.data?.error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex md:flex-row flex-col gap-5 items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">إدارة السلايدر</h1>
          <p className="text-gray-600 text-sm">
            إدارة صور وفيديوهات الصفحة الرئيسية
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-brand-slide px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 text-sm"
        >
          <Plus size={16} />
          إضافة سلايد جديد
        </button>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-3">
          <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-(--brand)">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="البحث في السلايدر..."
                className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all duration-300 text-sm"
              />
            </div>
          </div>
        </div>

        {isLoadingStatistics ? (
          <StatsCardsSkeleton
            count={3}
            gridClassName="grid grid-cols-1 lg:grid-cols-3 col-span-4 gap-4"
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 col-span-4 gap-4">
            <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-(--brand) text-center">
              <p className="text-2xl font-bold text-(--brand)">
                {sliderStatisticsData?.data?.data?.total_sliders ?? "-"}
              </p>
              <p className="text-sm text-gray-600">إجمالي السلايدات</p>
            </div>

            <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-(--brand) text-center">
              <p className="text-2xl font-bold text-green-600">
                {sliderStatisticsData?.data?.data?.active_sliders ?? "-"}
              </p>
              <p className="text-sm text-gray-600">السلايدات النشطة</p>
            </div>

            <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-(--brand) text-center">
              <p className="text-2xl font-bold text-gray-600">
                {sliderStatisticsData?.data?.data?.inactive_sliders ?? "-"}
              </p>
              <p className="text-sm text-gray-600">السلايدات الغير النشطة</p>
            </div>
          </div>
        )}
      </div>

      {/* Slider Items List */}
      {slidersData?.isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} variant="card" className="h-24 rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {sorted.map((slide: any, idx: number) => {
              const prev = idx > 0 ? sorted[idx - 1] : null;
              const next = idx < sorted.length - 1 ? sorted[idx + 1] : null;
              return (
                <SliderCard
                  key={slide.id}
                  slide={slide}
                  prevId={prev?.id ?? null}
                  nextId={next?.id ?? null}
                  prevOrder={prev?.order}
                  nextOrder={next?.order}
                  onSwap={swapById}
                  setSelectedSlide={setSelectedSlide}
                  setShowEditModal={setShowEditModal}
                  setShowDetailsModal={setShowDetailsModal}
                />
              );
            })}

            {sorted?.length === 0 && (
              <div className="col-span-full bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-(--brand)">
                <EmptyState
                  title="لا توجد نتائج"
                  description={
                    searchTerm
                      ? "لم يتم العثور على سلايدات تطابق البحث"
                      : "ابدأ بإضافة سلايد جديد للصفحة الرئيسية"
                  }
                  size="md"
                  action={
                    !searchTerm && (
                      <button
                        onClick={() => setShowAddModal(true)}
                        className="btn-brand-slide px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 mx-auto"
                      >
                        <Plus size={16} />
                        إضافة سلايد جديد
                      </button>
                    )
                  }
                />
              </div>
            )}
          </div>
          {/* <Pagination
            currentPage={page}
            count={paginationData?.count}
            onPageChange={setPage}
          /> */}
        </>
      )}

      {/* Slider Settings */}
      {/* <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-(--brand)">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          إعدادات السلايدر
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              سرعة التبديل (ثانية)
            </label>
            <input
              type="text"
              inputMode="decimal"
              pattern="[0-9]*"
              lang="en"
              defaultValue="5"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all duration-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              التبديل التلقائي
            </label>
            <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all duration-300">
              <option>مفعل</option>
              <option>معطل</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عرض النقاط
            </label>
            <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all duration-300">
              <option>مفعل</option>
              <option>معطل</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button className="bg-gradient-to-r from-(--brand) to-(--brand-light) text-white px-6 py-2 rounded-lg font-medium hover:from-(--brand-light) hover:to-(--brand) transition-all duration-300">
            حفظ الإعدادات
          </button>
        </div>
      </div> */}

      {/* Modals */}
      {showEditModal && (
        <EditSliderModal
          setShowEditModal={setShowEditModal}
          setSelectedSlide={setSelectedSlide as any}
          selectedSlide={selectedSlide as any}
          handleEditSlide={handleEditSlide}
          setSelectedImageFile={setSelectedImageFile}
          selectedImageFile={selectedImageFile}
        />
      )}
      {showAddModal && (
        <AddSliderModal
          handleAddSlide={handleAddSlide}
          newSlide={newSlide as any}
          selectedImageFile={selectedImageFile}
          setNewSlide={setNewSlide}
          setSelectedImageFile={setSelectedImageFile}
          setShowAddModal={setShowAddModal}
        />
      )}
      {showDetailsModal && (
        <ShowSliderModal
          selectedSlide={selectedSlide as any}
          setShowDetailsModal={setShowDetailsModal}
          setShowEditModal={setShowEditModal}
        />
      )}
    </div>
  );
};

export default SliderPage;
