/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Plus,
  Search,
  Folder,
  BookOpen,
  FileText,
  GraduationCap,
  CreditCard,
} from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";
import TreeItem from "@/components/dashboard/admin/sebsections/TreeItem";
import AddSubsectionModal from "@/components/dashboard/admin/sebsections/AddSubsectionModal";
import EditSubsectionModal from "@/components/dashboard/admin/sebsections/EditSubsectionModal";
import LinkSectionsModal from "@/components/dashboard/admin/sebsections/LinkSectionsModal";

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
  const [selectedSubsection, setSelectedSubsection] =
    useState<SubSection | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [newSubsection, setNewSubsection] = useState<Partial<SubSection>>({
    name: "",
    description: "",
    parentId: null,
    level: 1,
    linkedSections: [],
  });

  const data = useCustomQuery("/training/admin/subsections/", ["subsections"]);

  // Build tree structure
  const buildTree = (items: any[], id: string | null = null): any[] => {
    return items
      ?.filter((item) => item.id == id)
      .sort((a, b) => a.title.localeCompare(b.title))
      .map((item) => ({
        ...item,
        children: buildTree(items, item.id),
      })) as any[];
  };

  const getMainSectionIcon = (sectionId: string) => {
    const section = data?.data?.data?.sections?.find(
      (s: any) => s.id === sectionId
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
      (s: any) => s.id === sectionId
    );
    if (!section) return "text-blue-600";

    switch (section.color) {
      case "green":
        return "text-green-600";
      case "purple":
        return "text-purple-600";
      case "red":
        return "text-red-600";
      case "yellow":
        return "text-yellow-600";
      case "pink":
        return "text-pink-600";
      default:
        return "text-blue-600";
    }
  };

  // const toggleExpanded = (id: number) => {
  //   // setSubsections(
  //   //   subsections.map((item) =>
  //   //     item.id === id ? { ...item, isExpanded: !item.isExpanded } : item
  //   //   )
  //   // );
  //   console.log(id);
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
  };

  const handleEditSubsection = () => {
    // if (
    //   selectedSubsection &&
    //   selectedSubsection.name &&
    //   selectedSubsection.description
    // ) {
    //   setSubsections(
    //     subsections.map((subsection) =>
    //       subsection.id === selectedSubsection.id
    //         ? selectedSubsection
    //         : subsection
    //     )
    //   );
    //   setShowEditModal(false);
    //   setSelectedSubsection(null);
    // }
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

  const updateLinkedSections = (
    subsectionId: number,
    linkedSections: number[]
  ) => {
    // setSubsections(
    //   subsections.map((subsection) =>
    //     subsection.id === subsectionId
    //       ? { ...subsection, linkedSections }
    //       : subsection
    //   )
    // );
    console.log(subsectionId);
    console.log(linkedSections);
  };

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">الأقسام الفرعية</h1>
          <p className="text-gray-600 text-sm">
            إدارة الهيكل الشجري للأقسام الفرعية
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2 text-sm"
        >
          <Plus size={16} />
          إضافة قسم فرعي
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
                placeholder="البحث في الأقسام الفرعية..."
                className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-orange-100/50 text-center">
          <p className="text-2xl font-bold text-orange-600">
            {/* {subsections.length} */}1
          </p>
          <p className="text-sm text-gray-600">إجمالي الأقسام</p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-orange-100/50 text-center">
          <p className="text-2xl font-bold text-green-600">
            {/* {subsections.filter((s) => s.linkedSections.length > 0).length} */}
            11
          </p>
          <p className="text-sm text-gray-600">الأقسام المرتبطة</p>
        </div>
      </div>

      {/* Tree View */}
      <div className="space-y-4">
        {data?.data?.data?.length > 0 ? (
          data?.data?.data?.map((item: any) => {
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
                  // showSubsub={showSubsub}
                  // setShowSubsub={setShowSubsub}
                  type="subsections"
                />
                {isExpanded &&
                  item?.subsubsections?.length > 0 &&
                  item?.subsubsections?.map((s: any) => {
                    const isSubExpanded = expandedItems[s.id];
                    return (
                      <>
                        <TreeItem
                          getMainSectionColor={getMainSectionColor}
                          getMainSectionIcon={getMainSectionIcon}
                          index={2}
                          item={s}
                          isExpanded={isSubExpanded}
                          // expand={expand}
                          // setExpand={setExpand}
                          key={s.id}
                          toggleExpanded={toggleExpanded}
                          type="subsubsections"
                        />
                        {isSubExpanded &&
                          s?.specializations?.length > 0 &&
                          s?.specializations?.map((spec: any) => {
                            const isSpecExpanded = expandedItems[spec.id];
                            return (
                              <>
                                <TreeItem
                                  getMainSectionColor={getMainSectionColor}
                                  getMainSectionIcon={getMainSectionIcon}
                                  index={3}
                                  item={spec}
                                  // expand={expand}
                                  // setExpand={setExpand}
                                  key={spec.id}
                                  isExpanded={isSpecExpanded}
                                  toggleExpanded={toggleExpanded}
                                  type="specializations"
                                />
                                {isSpecExpanded &&
                                  spec?.specialization_materials?.length > 0 &&
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
                                          index={4}
                                          item={mat}
                                          key={mat.id}
                                          // expand={expand}
                                          // setExpand={setExpand}
                                          type="specialization_materials"
                                        />
                                      );
                                    }
                                  )}
                              </>
                            );
                          })}
                      </>
                    );
                  })}
              </div>
            );
          })
        ) : (
          <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-orange-100/50">
            <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              {searchTerm ? "لا توجد نتائج" : "لا توجد أقسام فرعية"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm
                ? "لم يتم العثور على أقسام تطابق البحث"
                : "ابدأ بإضافة قسم فرعي جديد لتنظيم المحتوى"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2 mx-auto"
              >
                <Plus size={16} />
                إضافة قسم فرعي
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddSubsectionModal
          getMainSectionIcon={getMainSectionIcon}
          handleAddSubsection={handleAddSubsection}
          mainSections={[]}
          newSubsection={newSubsection}
          setNewSubsection={setNewSubsection}
          setShowAddModal={setShowAddModal}
          subsections={[]}
        />
      )}
      {showEditModal && (
        <EditSubsectionModal
          handleEditSubsection={handleEditSubsection}
          selectedSubsection={selectedSubsection}
          setSelectedSubsection={setSelectedSubsection}
          setShowEditModal={setShowEditModal}
          subsections={[]}
        />
      )}
      {showLinkModal && (
        <LinkSectionsModal
          getMainSectionColor={getMainSectionColor}
          getMainSectionIcon={getMainSectionIcon}
          mainSections={[]}
          selectedSubsection={selectedSubsection}
          setSelectedSubsection={setSelectedSubsection}
          updateLinkedSections={updateLinkedSections}
          handleAddSubsection={handleAddSubsection}
          setShowLinkModal={setShowLinkModal}
        />
      )}
    </div>
  );
};

export default SubsectionsPage;
