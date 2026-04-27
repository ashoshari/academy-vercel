import { useMemo, useState } from "react";
import { BookOpen, Plus } from "lucide-react";
import toast from "react-hot-toast";

import { useCustomQuery } from "@/hooks/useQuery";
import {
  useCustomPost,
  useCustomRemove,
  useCustomUpdate,
} from "@/hooks/useMutation";
import handleErrorAlerts from "@/utils/showErrorMessages";
import Pagination from "@/components/dashboard/core/Pagination";
import EditButton from "@/components/dashboard/core/EditButton";
import DeleteButton from "@/components/dashboard/core/DeleteButton";
import { ConfirmationModal } from "@/components/dashboard/core/ConfirmationModal";
import Skeleton from "@/components/dashboard/Skeleton";
import MaterialFormModal from "@/components/dashboard/admin/materials/MaterialFormModal";

type CoreMaterial = {
  id: string;
  name: string;
};

const DEFAULT_PAGE_SIZE = 12;

export default function MaterialsPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<CoreMaterial | null>(null);
  const [pendingDelete, setPendingDelete] = useState<CoreMaterial | null>(null);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("page_size", String(pageSize));
    return params.toString();
  }, [page, pageSize]);

  const materialsQuery = useCustomQuery(`/core/materials/?${queryString}`, [
    "materials",
    page,
    pageSize,
  ]);

  const rows: CoreMaterial[] = useMemo(() => {
    const list = materialsQuery?.data?.data;
    if (!Array.isArray(list)) return [];
    return list.map((m: any) => ({
      id: String(m?.id ?? ""),
      name: String(m?.name ?? ""),
    }));
  }, [materialsQuery?.data?.data]);

  const pagination = materialsQuery?.data?.pagination;

  const createMaterial = useCustomPost("/core/materials/", ["materials"]);
  const updateMaterial = useCustomUpdate(
    () => `/core/materials/${editTarget?.id ?? "noop"}/`,
    ["materials"],
  );
  const deleteMaterial = useCustomRemove(
    () => `/core/materials/${pendingDelete?.id ?? "noop"}/`,
    ["materials"],
  );

  const isCreating = createMaterial.isPending;
  const isUpdating = updateMaterial.isPending;
  const isDeleting = deleteMaterial.isPending;

  const handleCreate = async (payload: { name: string }) => {
    try {
      const res = await createMaterial.mutateAsync(payload);
      if (res?.status) {
        toast.success("تمت إضافة المادة بنجاح");
        setCreateOpen(false);
      } else {
        handleErrorAlerts(res?.error || "حدث خطأ");
      }
    } catch (err: any) {
      handleErrorAlerts(err?.response?.data?.message || "حدث خطأ");
    }
  };

  const handleUpdate = async (payload: { name: string }) => {
    if (!editTarget?.id) return;
    try {
      const res = await updateMaterial.mutateAsync(payload);
      if (res?.status) {
        toast.success("تم تحديث المادة بنجاح");
        setEditTarget(null);
      } else {
        handleErrorAlerts(res?.error || "حدث خطأ");
      }
    } catch (err: any) {
      handleErrorAlerts(err?.response?.data?.message || "حدث خطأ");
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete?.id) return;
    try {
      const res = await deleteMaterial.mutateAsync();
      if (res?.status) {
        toast.success("تم حذف المادة بنجاح");
        setPendingDelete(null);
      } else {
        handleErrorAlerts(res?.error || "حدث خطأ");
      }
    } catch (err: any) {
      handleErrorAlerts(err?.response?.data?.message || "حدث خطأ");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex md:flex-row flex-col gap-5 items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">المواد</h1>
          <p className="text-gray-600 text-sm">إدارة المواد الأساسية للمنصة</p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="btn-brand-slide px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 text-sm"
        >
          <Plus size={16} />
          إضافة مادة
        </button>
      </div>

      {/* Grid */}
      {materialsQuery?.isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} variant="card" className="h-64 rounded-xl" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="col-span-full bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-(--brand)">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            لا توجد مواد
          </h3>
          <p className="text-gray-500 mb-6">ابدأ بإضافة مواد جديدة للمنصة</p>
          <button
            onClick={() => setCreateOpen(true)}
            className="btn-brand-slide px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <Plus size={16} />
            إضافة مادة
          </button>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {rows.map((m) => (
              <div
                key={m.id}
                className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-(--brand) overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                <div className="p-6 text-white relative overflow-hidden bg-linear-to-br from-(--brand) to-(--brand-light)">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
                  <div className="relative z-10 text-center">
                    <BookOpen className="w-8 h-8 mx-auto mb-3" />
                    <div className="text-xl font-bold mb-1 line-clamp-2">
                      {m.name}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-center gap-2">
                    <EditButton
                      onClick={() => setEditTarget(m)}
                      className="cursor-pointer p-2 text-gray-400 hover:text-(--brand) hover:bg-gray-50 rounded-lg transition-colors"
                      title="تعديل المادة"
                    />
                    <DeleteButton
                      onClick={() => setPendingDelete(m)}
                      className="cursor-pointer p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="حذف المادة"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={page}
            count={pagination?.count ?? 0}
            onPageChange={setPage}
            pageSize={pageSize}
          />
        </div>
      )}

      {/* Create */}
      <MaterialFormModal
        open={createOpen}
        title="إضافة مادة"
        submitLabel="حفظ"
        isPending={isCreating}
        onClose={() => !isCreating && setCreateOpen(false)}
        onSubmit={handleCreate}
      />

      {/* Edit */}
      <MaterialFormModal
        open={Boolean(editTarget)}
        title="تعديل المادة"
        initialName={editTarget?.name ?? ""}
        submitLabel="حفظ التغييرات"
        isPending={isUpdating}
        onClose={() => !isUpdating && setEditTarget(null)}
        onSubmit={handleUpdate}
      />

      {/* Delete confirm */}
      {pendingDelete && (
        <ConfirmationModal
          open
          onClose={() => !isDeleting && setPendingDelete(null)}
          onConfirm={handleDelete}
          title="حذف المادة"
          variant="danger"
          confirmLabel="نعم، حذف"
          isPending={isDeleting}
          description={
            <>
              <p className="text-base">
                هل أنت متأكد أنك تريد حذف{" "}
                <span className="font-bold text-gray-900">
                  {pendingDelete.name}
                </span>
                ؟
              </p>
              <p className="text-sm text-gray-600">
                لن يمكنك التراجع عن هذا الإجراء.
              </p>
            </>
          }
        />
      )}
    </div>
  );
}
