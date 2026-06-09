import { useMemo, useState } from "react";
import { BookOpen, Plus, Search } from "lucide-react";
import toast from "react-hot-toast";

import { useCustomQuery } from "@/hooks/useQuery";
import {
  useCustomPost,
  useCustomRemove,
  useCustomUpdate,
} from "@/hooks/useMutation";
import handleErrorAlerts from "@/utils/showErrorMessages";
import EditButton from "@/components/dashboard/core/EditButton";
import DeleteButton from "@/components/dashboard/core/DeleteButton";
import { ConfirmationModal } from "@/components/dashboard/core/ConfirmationModal";
import Skeleton from "@/components/dashboard/Skeleton";
import AddSubsectionModal from "@/components/dashboard/admin/subsections/AddSubsectionModal";
import EditModal from "@/components/dashboard/admin/subsections/EditSubsectionModal";
import {
  buildSpecializationMaterialPayload,
  flattenSpecializationMaterials,
  flattenSpecializations,
  flattenSubsubsections,
  normalizeSubsectionIdsData,
  type SpecializationMaterialRow,
} from "@/utils/specializationMaterials";

const EMPTY_MATERIAL_FORM = {
  material: "",
  is_published: true,
  subsubsection: "",
  specialization: "",
};

export default function MaterialsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] =
    useState<SpecializationMaterialRow | null>(null);
  const [pendingDelete, setPendingDelete] =
    useState<SpecializationMaterialRow | null>(null);
  const [newMaterial, setNewMaterial] = useState(EMPTY_MATERIAL_FORM);
  const [editMaterial, setEditMaterial] = useState(EMPTY_MATERIAL_FORM);

  const { data: subsectionsRes, isLoading } = useCustomQuery(
    "/training/admin/subsections-ids/",
    ["subsections", "materials"],
  );

  const subsectionData = useMemo(
    () => normalizeSubsectionIdsData(subsectionsRes?.data),
    [subsectionsRes?.data],
  );

  const subsubsectionsList = useMemo(
    () => flattenSubsubsections(subsectionData),
    [subsectionData],
  );

  const specializationsList = useMemo(
    () => flattenSpecializations(subsectionData),
    [subsectionData],
  );

  const allMaterials = useMemo(
    () => flattenSpecializationMaterials(subsectionData),
    [subsectionData],
  );

  const filteredMaterials = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return allMaterials;
    return allMaterials.filter(
      (m) =>
        m.material.toLowerCase().includes(q) ||
        m.subsubsectionTitle.toLowerCase().includes(q) ||
        (m.specializationName ?? "").toLowerCase().includes(q),
    );
  }, [allMaterials, searchTerm]);

  const createMaterial = useCustomPost(
    "/training/admin/specialization-materials/",
    ["subsections", "subsubsections", "specializations", "materials"],
  );

  const updateMaterial = useCustomUpdate(
    () =>
      `/training/admin/specialization-materials/${editTarget?.id ?? "noop"}/`,
    ["subsections", "subsubsections", "specializations", "materials"],
  );

  const deleteMaterial = useCustomRemove(
    () =>
      `/training/admin/specialization-materials/${pendingDelete?.id ?? "noop"}/`,
    ["subsections", "subsubsections", "specializations", "materials"],
  );

  const handleCreate = () => {
    if (!newMaterial.material.trim()) {
      toast.error("يرجى إدخال اسم المادة");
      return;
    }
    if (!newMaterial.subsubsection && !newMaterial.specialization) {
      toast.error("يرجى اختيار الصف أو التخصص");
      return;
    }

    createMaterial
      .mutateAsync(buildSpecializationMaterialPayload(newMaterial))
      .then((s) => {
        if (s.status) {
          toast.success(s.message ?? "تمت إضافة المادة بنجاح");
          setNewMaterial(EMPTY_MATERIAL_FORM);
          setCreateOpen(false);
        } else {
          toast.error(s.message ?? "Error");
        }
      })
      .catch((err) => handleErrorAlerts(err?.response?.data?.error));
  };

  // const handleUpdate = () => {
  //   if (!editTarget?.id) return;
  //   if (!editMaterial.material.trim()) {
  //     toast.error("يرجى إدخال اسم المادة");
  //     return;
  //   }

  //   updateMaterial
  //     .mutateAsync(buildSpecializationMaterialPayload(editMaterial))
  //     .then((s) => {
  //       if (s.status) {
  //         toast.success(s.message ?? "تم تحديث المادة بنجاح");
  //         setEditTarget(null);
  //       } else {
  //         toast.error(s.message ?? "Error");
  //       }
  //     })
  //     .catch((err) => handleErrorAlerts(err?.response?.data?.error));
  // };

  const handleDelete = async () => {
    if (!pendingDelete?.id) return;
    try {
      const res = await deleteMaterial.mutateAsync();
      toast.success(res?.message ?? "تم حذف المادة بنجاح");
      setPendingDelete(null);
    } catch (err: any) {
      handleErrorAlerts(err?.response?.data?.error || "حدث خطأ");
    }
  };

  const openEdit = (m: SpecializationMaterialRow) => {
    setEditTarget(m);
    setEditMaterial({
      material: m.material,
      is_published: m.is_published,
      subsubsection: m.subsubsectionId,
      specialization: m.specializationId ?? "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex md:flex-row flex-col gap-5 items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">المواد</h1>
          <p className="text-gray-600 text-sm">
            إدارة مواد التخصص ({allMaterials.length} مادة)
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="btn-brand-slide px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 text-sm"
        >
          <Plus size={16} />
          إضافة مادة
        </button>
      </div>

      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-(--brand)">
        <div className="w-full relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="البحث في المواد أو الصف..."
            className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all duration-300 text-sm"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} variant="card" className="h-64 rounded-xl" />
          ))}
        </div>
      ) : filteredMaterials.length === 0 ? (
        <div className="col-span-full bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-(--brand)">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            {searchTerm ? "لا توجد نتائج" : "لا توجد مواد"}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm
              ? "لم يتم العثور على مواد تطابق البحث"
              : "ابدأ بإضافة مواد جديدة للمنصة"}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setCreateOpen(true)}
              className="btn-brand-slide px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              <Plus size={16} />
              إضافة مادة
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredMaterials.map((m) => (
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
                    {m.material}
                  </div>
                  <div className="text-sm opacity-90 line-clamp-1">
                    {m.subsubsectionTitle}
                  </div>
                  {m.specializationName && (
                    <div className="text-xs opacity-75 mt-1 line-clamp-1">
                      {m.specializationName}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      m.is_published
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {m.is_published ? "مفعل" : "معطل"}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <EditButton
                    onClick={() => openEdit(m)}
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
      )}

      {createOpen && (
        <AddSubsectionModal
          level="mat"
          standalone
          subsubsections={subsubsectionsList}
          specializations={specializationsList}
          onSave={handleCreate}
          data={newMaterial}
          onChange={setNewMaterial}
          onClose={setCreateOpen}
          isPending={createMaterial.isPending}
        />
      )}

      {editTarget && (
        <EditModal
          level="mat"
          nameOnly
          endpointBase="/training/admin/specialization-materials/"
          queryKey={[
            "subsections",
            "subsubsections",
            "specializations",
            "materials",
          ]}
          mainSections={[]}
          data={{ ...editMaterial, id: editTarget.id }}
          onChange={setEditMaterial}
          onClose={() => !updateMaterial.isPending && setEditTarget(null)}
        />
      )}

      {pendingDelete && (
        <ConfirmationModal
          open
          onClose={() => !deleteMaterial.isPending && setPendingDelete(null)}
          onConfirm={handleDelete}
          title="حذف المادة"
          variant="danger"
          confirmLabel="نعم، حذف"
          isPending={deleteMaterial.isPending}
          description={
            <>
              <p className="text-base">
                هل أنت متأكد أنك تريد حذف{" "}
                <span className="font-bold text-gray-900">
                  {pendingDelete.material}
                </span>
                ؟
              </p>
              <p className="text-sm text-gray-600">
                الصف:{" "}
                <span className="font-semibold">
                  {pendingDelete.subsubsectionTitle}
                </span>
              </p>
            </>
          }
        />
      )}
    </div>
  );
}
