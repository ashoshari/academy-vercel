import React, { useState } from "react";
import {
  Plus,
  Folder,
  BookOpen,
  FileText,
  GraduationCap,
  CreditCard,
  Search,
} from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";
import TreeItem from "@/components/dashboard/admin/subsections/TreeItem";
import AddSubsectionModal from "@/components/dashboard/admin/subsections/AddSubsectionModal";
import LinkSectionsModal from "@/components/dashboard/admin/subsections/LinkSectionsModal";
import { useCustomPost } from "@/hooks/useMutation";
import toast from "react-hot-toast";
import handleErrorAlerts from "@/utils/showErrorMessages";
import EditModal from "@/components/dashboard/admin/subsections/EditSubsectionModal";
import Skeleton from "@/components/dashboard/Skeleton";
import StatsCardsSkeleton from "@/components/dashboard/skeletons/StatsCardsSkeleton";
import EmptyState from "@/components/core/EmptyState";

export interface SubSection {
  id: number;
  name: string;
  description: string;
  parentId: number | null;
  level: number;
  linkedSections: number[];
  studentsCount: number;
  itemsCount: number;
  isExpanded: boolean;
  createdAt: string;
}

const SubsectionsPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);

  const [showAddSubSubsectionModal, setShowAddSubSubsectionModal] =
    useState(false);
  const [showEditSubSubsectionModal, setShowEditSubSubsectionModal] =
    useState(false);

  const [showAddSpecializationsModal, setShowAddSpecializationsModal] =
    useState(false);
  const [showEditSpecializationsModal, setShowEditSpecializationsModal] =
    useState(false);

  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [showAddMaterialSubSubModal, setShowAddMaterialSubSubModal] =
    useState(false);
  const [showEditMaterialModal, setShowEditMaterialModal] = useState(false);
  const [showEditMaterialSubSubModal, setShowEditMaterialSubSubModal] =
    useState(false);

  const [selectedSubsection, setSelectedSubsection] = useState<any>({
    id: "",
    title: "",
    description: "",
    sections: [],
    order: 0,
    is_published: false,
    // icon: ""
  });
  const [selectedSubSubsection, setSelectedSubSubsection] = useState<any>();
  const [selectedSpecialization, setSelectedSpecialization] = useState<any>();
  const [selectedMaterial, setSelectedMaterial] = useState<any>();

  const [newSubsection, setNewSubsection] = useState<any>({
    title: "",
    description: "",
    sections: [],
    order: 0,
    is_published: true,
    // icon: "",
  });

  const [newSubSubsection, setNewSubSubsection] = useState<any>({
    title: "",
    description: "",
    is_published: true,
    subsection: "",
    order: 0,
  });

  const [newSpecialization, setNewSpecialization] = useState<any>({
    name: "",
    description: "",
    is_published: true,
    order: 0,
    subsubsection: "",
  });

  const [newMaterial, setNewMaterial] = useState<any>({
    material: "",
    is_published: true,
    specialization: "",
  });

  const [newMaterialSubSub, setNewMaterialSubSub] = useState<any>({
    material: "",
    is_published: true,
    subsubsections: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const queryParams = new URLSearchParams();
  queryParams.append("title", searchTerm);
  const queryString = queryParams.toString();

  const data = useCustomQuery(`/training/admin/subsections/?${queryString}`, [
    "subsections",
    searchTerm,
  ]);
  const dataStatistics = useCustomQuery(
    "/training/admin/subsections-statistics/",
    ["subsections-statistics"],
  );
  const isLoadingStatistics = Boolean((dataStatistics as any)?.isLoading);
  const sectionsData = useCustomQuery("/training/admin/sections/", [
    "sections",
  ]);
  const subsubSectionsData = useCustomQuery("/training/admin/subsubsections/", [
    "subsubsections",
  ]);
  const specializationsData = useCustomQuery(
    "/training/admin/specializations/",
    ["specializations"],
  );

  const { mutateAsync: addSubSection, isPending: isAdding } = useCustomPost(
    "/training/admin/subsections/",
    ["subsections", "sections", "subsections-statistics"],
  );

  const { mutateAsync: addSubSubSection, isPending: isAddingSubSub } =
    useCustomPost("/training/admin/subsubsections/", [
      "subsections",
      "subsections-statistics",
    ]);

  const { mutateAsync: addSpecialization, isPending: isAddingSpecialization } =
    useCustomPost("/training/admin/specializations/", [
      "subsections",
      "subsubsections",
      "subsections-statistics",
    ]);

  const { mutateAsync: addMaterial, isPending: isAddingMaterial } =
    useCustomPost("/training/admin/specialization-materials/", [
      "subsections",
      "subsubsections",
      "specializations",
      "subsections-statistics",
    ]);

  const getMainSectionIcon = (sectionId: string) => {
    const section = data?.data?.data?.sections?.find(
      (s: any) => s.id === sectionId,
    );
    if (!section) return BookOpen;

    switch (section.icon) {
      case "FileText":
        return FileText;
      case "GraduationCap":
        return GraduationCap;
      case "CreditCard":
        return CreditCard;
      default:
        return BookOpen;
    }
  };

  const getMainSectionColor = (sectionId: string) => {
    const section = data?.data?.data?.sections?.find(
      (s: any) => s.id === sectionId,
    );
    if (!section) return "text-(--brand-secondary)";

    switch (section.color) {
      case "green":
        return "text-green-600";
      case "purple":
        return "text-purple-600";
      case "red":
        return "text-red-600";
      case "yellow":
        return "text-(--brand)";
      case "pink":
        return "text-pink-600";
      default:
        return "text-(--brand-secondary)";
    }
  };

  // const toggleExpanded = (id: number) => {
  //   // setSubsections(
  //   //   subsections.map((item) =>
  //   //     item.id === id ? { ...item, isExpanded: !item.isExpanded } : item
  //   //   )
  //   // );
  // };

  const handleAddSubsection = () => {
    // if (newSubsection.name && newSubsection.description) {
    //   const subsection: SubSection = {
    //     id: Date.now(),
    //     name: newSubsection.name,
    //     description: newSubsection.description,
    //     parentId: newSubsection.parentId || null,
    //     level: newSubsection.parentId
    //       ? (subsections.find((s) => s.id === newSubsection.parentId)?.level ||
    //           0) + 1
    //       : 1,
    //     linkedSections: newSubsection.linkedSections || [],
    //     studentsCount: Math.floor(Math.random() * 100),
    //     itemsCount: Math.floor(Math.random() * 50),
    //     isExpanded: false,
    //     createdAt: new Date().toISOString().split("T")[0],
    //   };
    //   setSubsections([...subsections, subsection]);
    //   setNewSubsection({
    //     name: "",
    //     description: "",
    //     parentId: null,
    //     level: 1,
    //     linkedSections: [],
    //   });
    //   setShowAddModal(false);
    // }

    addSubSection({
      title: newSubsection.title,
      description: newSubsection.description,
      sections: newSubsection.sections,
      is_published: newSubsection.is_published,
      // icon: "ee37f6cb-e059-4c64-b7f4-de2014a21f01",
      order: newSubsection.order || 0,
    })
      .then((s) => {
        if (s.status) {
          setShowAddModal(false);
          setNewSubsection({
            title: "",
            description: "",
            sections: [],
            is_published: true,
            order: 0,
          });
          toast.success(s.message ?? "success");
        } else {
          toast.error(s.message ?? "Error");
        }
      })
      .catch((err) => handleErrorAlerts(err?.response?.data?.error));
  };

  // Add Subsubsection

  const handleAddSubSubsection = () => {
    addSubSubSection({
      title: newSubSubsection.title,
      description: newSubSubsection.description,
      is_published: newSubSubsection.is_published,
      subsection: selectedSubsection.id,
      order: newSubSubsection.order || 0,
    })
      .then((s) => {
        if (s.status) {
          setShowAddSubSubsectionModal(false);
          setNewSubSubsection({
            title: "",
            description: "",
            is_published: true,
            order: 0,
          });
          toast.success(s.message ?? "success");
        } else {
          toast.error(s.message ?? "Error");
        }
      })
      .catch((err) => handleErrorAlerts(err?.response?.data?.error));
  };

  const handleAddSpecialization = () => {
    addSpecialization({
      name: newSpecialization.name,
      description: newSpecialization.description,
      is_published: newSpecialization.is_published,
      subsubsection: selectedSubSubsection.id,
      order: newSpecialization.order,
    })
      .then((s) => {
        if (s.status) {
          setShowAddSpecializationsModal(false);
          setNewSpecialization({
            name: "",
            description: "",
            is_published: true,
            order: 0,
          });
          toast.success(s.message ?? "success");
        } else {
          toast.error(s.message ?? "Error");
        }
      })
      .catch((err) => handleErrorAlerts(err?.response?.data?.error));
  };

  const handleAddMaterial = () => {
    addMaterial({
      name: newMaterial.material,
      material: newMaterial.material,
      specializations: [selectedSpecialization.id],
      is_published: newMaterial.is_published,
    })
      .then((s) => {
        if (s.status) {
          toast.success(s.message ?? "success");
          setNewMaterial({
            name: "",
            material: "",
            specializations: [],
            is_published: true,
          });
          setShowAddMaterialModal(false);
        } else {
          toast.error(s.message ?? "Error");
        }
      })
      .catch((err) => handleErrorAlerts(err?.response?.data?.error));
  };

  const handleAddMaterialSubSub = () => {
    addMaterial({
      name: newMaterialSubSub.material,
      material: newMaterialSubSub.material,
      subsubsections: [selectedSubSubsection.id],
      is_published: newMaterialSubSub.is_published,
    })
      .then((s) => {
        if (s.status) {
          toast.success(s.message ?? "success");
          setNewMaterialSubSub({
            name: "",
            material: "",
            subsubsections: [],
            is_published: true,
          });
          setShowAddMaterialSubSubModal(false);
        } else {
          toast.error(s.message ?? "Error");
        }
      })
      .catch((err) => handleErrorAlerts(err?.response?.data?.error));
  };

  // const handleDeleteSubsection = (id: number) => {
  // const hasChildren = subsections.some((s) => s.parentId === id);
  // const confirmMessage = hasChildren
  //   ? "هل أنت متأكد من حذف هذا القسم؟ سيتم حذف جميع الأقسام الفرعية التابعة له."
  //   : "هل أنت متأكد من حذف هذا القسم؟";
  // if (confirm(confirmMessage)) {
  //   // Delete the subsection and all its children recursively
  //   const deleteRecursively = (targetId: number) => {
  //     const children = subsections.filter((s) => s.parentId === targetId);
  //     children.forEach((child) => deleteRecursively(child.id));
  //     setSubsections((prev) => prev.filter((s) => s.id !== targetId));
  //   };
  //   deleteRecursively(id);
  // }
  // };

  // const updateLinkedSections = (
  //   subsectionId: number,
  //   linkedSections: number[]
  // ) => {
  //   // setSubsections(
  //   //   subsections.map((subsection) =>
  //   //     subsection.id === subsectionId
  //   //       ? { ...subsection, linkedSections }
  //   //       : subsection
  //   //   )
  //   // );
  // };

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {},
  );

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex md:flex-row flex-col gap-5 items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">الأقسام الفرعية</h1>
          <p className="text-gray-600 text-sm">
            إدارة الهيكل الشجري للأقسام الفرعية
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-brand-slide px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 text-sm"
        >
          <Plus size={16} />
          إضافة قسم فرعي
        </button>
      </div>
      {/* Search and Stats */}
      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-(--brand)">
        <div className="w-full relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="البحث في الأقسام..."
            className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all duration-300 text-sm"
          />
        </div>
      </div>
      {/* <div className="lg:col-span-2">
          <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-(--brand)">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="البحث في الأقسام الفرعية..."
                className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all duration-300 text-sm"
              />
            </div>
          </div>
        </div> */}

      {isLoadingStatistics ? (
        <StatsCardsSkeleton
          count={3}
          gridClassName="grid grid-cols-1 lg:grid-cols-3 gap-4"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-(--brand) text-center">
            <p className="text-2xl font-bold text-(--brand-secondary)">
              {dataStatistics?.data?.data?.total_subsections ?? "-"}
            </p>
            <p className="text-sm text-gray-600">إجمالي الأقسام</p>
          </div>

          <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-(--brand) text-center">
            <p className="text-2xl font-bold text-green-600">
              {dataStatistics?.data?.data?.active_subsections ?? "-"}
            </p>
            <p className="text-sm text-gray-600">الأقسام المفعلة</p>
          </div>

          <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-(--brand) text-center">
            <p className="text-2xl font-bold text-red-600">
              {dataStatistics?.data?.data?.inactive_subsections ?? "-"}
            </p>
            <p className="text-sm text-gray-600">الأقسام الغير مفعلة</p>
          </div>
        </div>
      )}
      {data?.isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : !data?.data?.data || data?.data?.data?.length === 0 ? (
        <div className="col-span-full bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-(--brand)">
          <EmptyState
            title="لا توجد نتائج"
            description="ابدأ بإضافة أقسام فرعية جديدة للمنصة"
            size="md"
            action={
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-brand-slide px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 mx-auto"
              >
                <Plus size={16} />
                إضافة قسم فرعي جديد
              </button>
            }
          />
        </div>
      ) : (
        // Tree View
        <div className="space-y-4">
          {data?.data?.data?.length > 0
            ? data?.data?.data?.map((item: any) => {
                const isExpanded = expandedItems[item.id];
                return (
                  <div key={item.id} className="space-y-2">
                    <TreeItem
                      getMainSectionColor={getMainSectionColor}
                      getMainSectionIcon={getMainSectionIcon}
                      index={1}
                      item={item}
                      toggleExpanded={toggleExpanded}
                      isExpanded={isExpanded}
                      type="subsections"
                      setShowAddSubSubsectionModal={
                        setShowAddSubSubsectionModal
                      }
                      setShowEditModal={setShowEditModal}
                      setSelectedSubsection={setSelectedSubsection}
                      setShowLinkModal={setShowLinkModal}
                    />
                    {isExpanded &&
                      item?.subsubsections?.length > 0 &&
                      item?.subsubsections?.map((s: any) => {
                        const isSubExpanded = expandedItems[s.id];
                        return (
                          <React.Fragment key={s.id}>
                            <TreeItem
                              getMainSectionColor={getMainSectionColor}
                              getMainSectionIcon={getMainSectionIcon}
                              index={2}
                              item={s}
                              subSectionId={item.id}
                              setShowEditSubSubsectionModal={
                                setShowEditSubSubsectionModal
                              }
                              setShowAddSpecializationsModal={
                                setShowAddSpecializationsModal
                              }
                              setSelectedSubSubsection={
                                setSelectedSubSubsection
                              }
                              setShowAddMaterialModal={
                                setShowAddMaterialSubSubModal
                              }
                              isExpanded={isSubExpanded}
                              key={s.id}
                              toggleExpanded={toggleExpanded}
                              type="subsubsections"
                            />
                            {isSubExpanded &&
                              s?.specializations?.length > 0 &&
                              s?.specializations?.map((spec: any) => {
                                const isSpecExpanded = expandedItems[spec.id];
                                return (
                                  <React.Fragment key={spec.id}>
                                    <TreeItem
                                      getMainSectionColor={getMainSectionColor}
                                      getMainSectionIcon={getMainSectionIcon}
                                      index={3}
                                      item={spec}
                                      setShowEditSpecializationsModal={
                                        setShowEditSpecializationsModal
                                      }
                                      setSelectedSpecialization={
                                        setSelectedSpecialization
                                      }
                                      setShowAddMaterialModal={
                                        setShowAddMaterialModal
                                      }
                                      subsubSectionId={s.id}
                                      key={spec.id}
                                      isExpanded={isSpecExpanded}
                                      toggleExpanded={toggleExpanded}
                                      type="specializations"
                                    />
                                    {isSpecExpanded &&
                                      spec?.specialization_materials?.length >
                                        0 &&
                                      spec?.specialization_materials?.map(
                                        (mat: any) => {
                                          return (
                                            <TreeItem
                                              getMainSectionColor={
                                                getMainSectionColor
                                              }
                                              getMainSectionIcon={
                                                getMainSectionIcon
                                              }
                                              setShowEditMaterialModal={
                                                setShowEditMaterialModal
                                              }
                                              setSelectedMaterial={
                                                setSelectedMaterial
                                              }
                                              specialization={spec.id}
                                              index={4}
                                              item={mat}
                                              key={mat.id}
                                              type="materials"
                                            />
                                          );
                                        },
                                      )}
                                  </React.Fragment>
                                );
                              })}

                            {s.specialization_materials &&
                              s.specialization_materials.map((mat: any) => {
                                return (
                                  <TreeItem
                                    getMainSectionColor={getMainSectionColor}
                                    getMainSectionIcon={getMainSectionIcon}
                                    setShowEditMaterialModal={
                                      setShowEditMaterialModal
                                    }
                                    setSelectedMaterial={setSelectedMaterial}
                                    specialization={s.id}
                                    index={2}
                                    item={mat}
                                    key={mat.id}
                                    type="materials"
                                  />
                                );
                              })}
                          </React.Fragment>
                        );
                      })}
                  </div>
                );
              })
            : data?.data?.data?.length === 0 && (
                <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-(--brand)">
                  <>
                    <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      {searchTerm ? "لا توجد نتائج" : "لا توجد أقسام فرعية"}
                    </h3>
                    <p className="text-gray-500 mb-6">
                      "لم يتم العثور على أقسام تطابق البحث"
                    </p>
                  </>
                  {data?.data?.data?.length === 0 && (
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="btn-brand-slide px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 mx-auto"
                    >
                      <Plus size={16} />
                      إضافة قسم فرعي
                    </button>
                  )}
                </div>
              )}
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <AddSubsectionModal
          level="sub"
          onSave={handleAddSubsection}
          mainSections={sectionsData?.data?.data ?? []}
          data={newSubsection}
          onChange={setNewSubsection}
          onClose={setShowAddModal}
          isPending={isAdding}
        />
      )}
      {showEditModal && (
        <EditModal
          level="sub"
          endpointBase="/training/admin/subsections/"
          queryKey={["subsections"]}
          mainSections={sectionsData.data.data ?? []}
          data={selectedSubsection}
          onChange={setSelectedSubsection}
          onClose={() => setShowEditModal(false)}
        />
      )}
      {showLinkModal && (
        <LinkSectionsModal
          getMainSectionColor={getMainSectionColor}
          getMainSectionIcon={getMainSectionIcon}
          mainSections={sectionsData.data.data ?? []}
          selectedSubsection={selectedSubsection}
          setSelectedSubsection={setSelectedSubsection}
          setShowLinkModal={setShowLinkModal}
        />
      )}
      {/* Subsubsections Modals */}
      {showAddSubSubsectionModal && (
        <AddSubsectionModal
          level="subsub"
          onSave={handleAddSubSubsection}
          data={newSubSubsection}
          onChange={setNewSubSubsection}
          onClose={setShowAddSubSubsectionModal}
          parent={selectedSubsection}
          isPending={isAddingSubSub}
        />
      )}
      {showEditSubSubsectionModal && (
        <EditModal
          level="subsub"
          endpointBase="/training/admin/subsubsections/"
          queryKey={["subsections"]}
          mainSections={data?.data?.data ?? []}
          data={selectedSubSubsection}
          onChange={setSelectedSubSubsection}
          onClose={() => setShowEditSubSubsectionModal(false)}
        />
      )}
      {/* Specializations Modals */}
      {showAddSpecializationsModal && (
        <AddSubsectionModal
          level="spec"
          onSave={handleAddSpecialization}
          data={newSpecialization}
          onChange={setNewSpecialization}
          onClose={setShowAddSpecializationsModal}
          parent={selectedSubSubsection}
          isPending={isAddingSpecialization}
        />
      )}
      {showEditSpecializationsModal && (
        <EditModal
          level="spec"
          endpointBase="/training/admin/specializations/"
          queryKey={["subsections", "subsubsections"]}
          mainSections={subsubSectionsData?.data?.data ?? []}
          data={selectedSpecialization}
          onChange={setSelectedSpecialization}
          onClose={() => setShowEditSpecializationsModal(false)}
        />
      )}

      {/* Material Modals */}
      {showAddMaterialModal && (
        <AddSubsectionModal
          level="mat"
          onSave={handleAddMaterial}
          data={newMaterial}
          onChange={setNewMaterial}
          onClose={setShowAddMaterialModal}
          parent={selectedSpecialization}
          isPending={isAddingMaterial}
        />
      )}

      {/* material to sub sub */}
      {showAddMaterialSubSubModal && (
        <AddSubsectionModal
          level="mat"
          onSave={handleAddMaterialSubSub}
          data={newMaterialSubSub}
          onChange={setNewMaterialSubSub}
          onClose={setShowAddMaterialSubSubModal}
          parent={selectedSubSubsection}
          selectedSubSubsection={selectedSubSubsection}
          type={"material-subsub"}
          isPending={isAddingMaterial}
        />
      )}
      {showEditMaterialModal && (
        <EditModal
          level="mat"
          endpointBase="/training/admin/specialization-materials/"
          queryKey={["subsections", "subsubsections", "specializations"]}
          mainSections={specializationsData?.data?.data ?? []}
          data={selectedMaterial}
          onChange={setSelectedMaterial}
          onClose={() => setShowEditMaterialModal(false)}
        />
      )}

      {showEditMaterialSubSubModal && (
        <EditModal
          level="mat"
          endpointBase="/training/admin/specialization-materials/"
          queryKey={["subsections", "subsubsections", "specializations"]}
          mainSections={[]}
          data={selectedMaterial}
          onChange={setSelectedMaterial}
          onClose={() => setShowEditMaterialSubSubModal(false)}
          type="material-subsub"
        />
      )}
    </div>
  );
};

export default SubsectionsPage;
