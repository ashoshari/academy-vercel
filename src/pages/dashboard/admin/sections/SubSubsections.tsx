import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Save,
  X,
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  File,
  Users,
  BookOpen,
  FileText,
  GraduationCap,
  CreditCard,
  Link,
  Calendar,
  Hash,
} from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";

export interface SubSection {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
  level: number;
  linkedSections: string[];
  studentsCount: number;
  itemsCount: number;
  isExpanded: boolean;
  createdAt: string;
}

const subsubsections = [
  {
    id: "e7463aa0-3511-469f-bd55-56971109c2b6",
    title: "توجيهي 2007",
    description:
      "هو ببساطة نص شكلي (بمعنى أن الغاية هي الشكل وليس المحتوى) ويُستخدم في صناعات المطابع ودور النشر",
    subsection: {
      id: "8f7ceded-57f5-43df-89e6-5019cc57cf9d",
      title: "التوجيهي",
      description:
        "هو ببساطة نص شكلي (بمعنى أن الغاية هي الشكل وليس المحتوى) ويُستخدم في صناعات المطابع ودور النشر",
      is_published: true,
      order: 1,
      icon: {
        id: "ee37f6cb-e059-4c64-b7f4-de2014a21f01",
        name: "امتحانات",
        icon: "https://fra1.digitaloceanspaces.com/tawjihi-s3/media/icon/exam_1_20250727230322.png?AWSAccessKeyId=DO801FWRNBU9HPQHZJ3K&Signature=DUCu2R2su%2B6c4vK40Ha5CfWpgNE%3D&Expires=1754146992",
      },
      sections: [
        {
          id: "1cc52e92-6309-4588-9bfe-262b16d6e61a",
          title: "الدورات",
          description: "دورات تعليمية متخصصة مع شهادات معتمدة",
          icon: {
            id: "cff4d8e0-cb42-4837-8c3d-21d294bd6f2e",
            name: "دورات",
            icon: "https://fra1.digitaloceanspaces.com/tawjihi-s3/media/icon/online-certificate_20250727230344.png?AWSAccessKeyId=DO801FWRNBU9HPQHZJ3K&Signature=eLx24albhKNUTReayQmPoYFHxZU%3D&Expires=1754146992",
          },
          color: {
            id: "aa2edf07-6704-4a17-b7cd-c8e403ea0af3",
            name: "Red",
            color: "#d90b23",
          },
          is_published: true,
          created_at: "2025-08-02T01:51:37.894619+03:00",
          order: 1,
        },
        {
          id: "d574f87d-69aa-497e-8149-e445103c7795",
          title: "الامتحانات الالكترونية",
          description: "اختبارات تفاعلية تحاكي الامتحان الحقيقي",
          icon: {
            id: "ee37f6cb-e059-4c64-b7f4-de2014a21f01",
            name: "امتحانات",
            icon: "https://fra1.digitaloceanspaces.com/tawjihi-s3/media/icon/exam_1_20250727230322.png?AWSAccessKeyId=DO801FWRNBU9HPQHZJ3K&Signature=DUCu2R2su%2B6c4vK40Ha5CfWpgNE%3D&Expires=1754146992",
          },
          color: {
            id: "7b65db1e-5d4d-4e87-b4c8-6c14545220af",
            name: "Blue",
            color: "#13eb1e",
          },
          is_published: true,
          created_at: "2025-08-02T01:55:14.729143+03:00",
          order: 2,
        },
      ],
    },
    is_published: true,
    order: 1,
    sections: [
      {
        id: "1cc52e92-6309-4588-9bfe-262b16d6e61a",
        title: "الدورات",
        description: "دورات تعليمية متخصصة مع شهادات معتمدة",
        icon: {
          id: "cff4d8e0-cb42-4837-8c3d-21d294bd6f2e",
          name: "دورات",
          icon: "https://fra1.digitaloceanspaces.com/tawjihi-s3/media/icon/online-certificate_20250727230344.png?AWSAccessKeyId=DO801FWRNBU9HPQHZJ3K&Signature=eLx24albhKNUTReayQmPoYFHxZU%3D&Expires=1754146992",
        },
        color: {
          id: "aa2edf07-6704-4a17-b7cd-c8e403ea0af3",
          name: "Red",
          color: "#d90b23",
        },
        is_published: true,
        created_at: "2025-08-02T01:51:37.894619+03:00",
        order: 1,
      },
      {
        id: "d574f87d-69aa-497e-8149-e445103c7795",
        title: "الامتحانات الالكترونية",
        description: "اختبارات تفاعلية تحاكي الامتحان الحقيقي",
        icon: {
          id: "ee37f6cb-e059-4c64-b7f4-de2014a21f01",
          name: "امتحانات",
          icon: "https://fra1.digitaloceanspaces.com/tawjihi-s3/media/icon/exam_1_20250727230322.png?AWSAccessKeyId=DO801FWRNBU9HPQHZJ3K&Signature=DUCu2R2su%2B6c4vK40Ha5CfWpgNE%3D&Expires=1754146992",
        },
        color: {
          id: "7b65db1e-5d4d-4e87-b4c8-6c14545220af",
          name: "Blue",
          color: "#13eb1e",
        },
        is_published: true,
        created_at: "2025-08-02T01:55:14.729143+03:00",
        order: 2,
      },
    ],
  },
];

const specialisations = [
  {
    id: "4bfdcc50-ac2d-4fe7-9be3-645b44cee9b2",
    name: "مهني",
    description:
      "هو ببساطة نص شكلي (بمعنى أن الغاية هي الشكل وليس المحتوى) ويُستخدم في صناعات المطابع ودور النشر. كان لوريم إيبسوم ولايزال المعيار للنص الشكلي منذ القرن الخامس عشر عندما قامت مطبعة مجهولة برص مجموعة من الأحرف بشكل عشوائي أخذتها من نص، لتكوّن كتيّب بمثابة دليل أو مرجع شكلي لهذه الأحرف.",
    subsubsection: {
      id: "e7463aa0-3511-469f-bd55-56971109c2b6",
      title: "توجيهي 2007",
      description:
        "هو ببساطة نص شكلي (بمعنى أن الغاية هي الشكل وليس المحتوى) ويُستخدم في صناعات المطابع ودور النشر",
      subsection: {
        id: "8f7ceded-57f5-43df-89e6-5019cc57cf9d",
        title: "التوجيهي",
        description:
          "هو ببساطة نص شكلي (بمعنى أن الغاية هي الشكل وليس المحتوى) ويُستخدم في صناعات المطابع ودور النشر",
        is_published: true,
        order: 1,
        icon: {
          id: "ee37f6cb-e059-4c64-b7f4-de2014a21f01",
          name: "امتحانات",
          icon: "https://fra1.digitaloceanspaces.com/tawjihi-s3/media/icon/exam_1_20250727230322.png?AWSAccessKeyId=DO801FWRNBU9HPQHZJ3K&Signature=0OyLCUKQHTU05rArTOTuXkJI%2Flw%3D&Expires=1754152760",
        },
        sections: [
          {
            id: "1cc52e92-6309-4588-9bfe-262b16d6e61a",
            title: "الدورات",
            description: "دورات تعليمية متخصصة مع شهادات معتمدة",
            icon: {
              id: "cff4d8e0-cb42-4837-8c3d-21d294bd6f2e",
              name: "دورات",
              icon: "https://fra1.digitaloceanspaces.com/tawjihi-s3/media/icon/online-certificate_20250727230344.png?AWSAccessKeyId=DO801FWRNBU9HPQHZJ3K&Signature=S7WgFoxKEezKMqPJ%2B3pX5dSqIWI%3D&Expires=1754152760",
            },
            color: {
              id: "aa2edf07-6704-4a17-b7cd-c8e403ea0af3",
              name: "Red",
              color: "#d90b23",
            },
            is_published: true,
            created_at: "2025-08-02T01:51:37.894619+03:00",
            order: 1,
          },
          {
            id: "d574f87d-69aa-497e-8149-e445103c7795",
            title: "الامتحانات الالكترونية",
            description: "اختبارات تفاعلية تحاكي الامتحان الحقيقي",
            icon: {
              id: "ee37f6cb-e059-4c64-b7f4-de2014a21f01",
              name: "امتحانات",
              icon: "https://fra1.digitaloceanspaces.com/tawjihi-s3/media/icon/exam_1_20250727230322.png?AWSAccessKeyId=DO801FWRNBU9HPQHZJ3K&Signature=0OyLCUKQHTU05rArTOTuXkJI%2Flw%3D&Expires=1754152760",
            },
            color: {
              id: "7b65db1e-5d4d-4e87-b4c8-6c14545220af",
              name: "Blue",
              color: "#13eb1e",
            },
            is_published: true,
            created_at: "2025-08-02T01:55:14.729143+03:00",
            order: 2,
          },
        ],
      },
      is_published: true,
      order: 1,
      sections: [
        {
          id: "1cc52e92-6309-4588-9bfe-262b16d6e61a",
          title: "الدورات",
          description: "دورات تعليمية متخصصة مع شهادات معتمدة",
          icon: {
            id: "cff4d8e0-cb42-4837-8c3d-21d294bd6f2e",
            name: "دورات",
            icon: "https://fra1.digitaloceanspaces.com/tawjihi-s3/media/icon/online-certificate_20250727230344.png?AWSAccessKeyId=DO801FWRNBU9HPQHZJ3K&Signature=S7WgFoxKEezKMqPJ%2B3pX5dSqIWI%3D&Expires=1754152760",
          },
          color: {
            id: "aa2edf07-6704-4a17-b7cd-c8e403ea0af3",
            name: "Red",
            color: "#d90b23",
          },
          is_published: true,
          created_at: "2025-08-02T01:51:37.894619+03:00",
          order: 1,
        },
        {
          id: "d574f87d-69aa-497e-8149-e445103c7795",
          title: "الامتحانات الالكترونية",
          description: "اختبارات تفاعلية تحاكي الامتحان الحقيقي",
          icon: {
            id: "ee37f6cb-e059-4c64-b7f4-de2014a21f01",
            name: "امتحانات",
            icon: "https://fra1.digitaloceanspaces.com/tawjihi-s3/media/icon/exam_1_20250727230322.png?AWSAccessKeyId=DO801FWRNBU9HPQHZJ3K&Signature=0OyLCUKQHTU05rArTOTuXkJI%2Flw%3D&Expires=1754152760",
          },
          color: {
            id: "7b65db1e-5d4d-4e87-b4c8-6c14545220af",
            name: "Blue",
            color: "#13eb1e",
          },
          is_published: true,
          created_at: "2025-08-02T01:55:14.729143+03:00",
          order: 2,
        },
      ],
    },
    is_published: true,
    order: 1,
    sections: [
      {
        id: "1cc52e92-6309-4588-9bfe-262b16d6e61a",
        title: "الدورات",
        description: "دورات تعليمية متخصصة مع شهادات معتمدة",
        icon: {
          id: "cff4d8e0-cb42-4837-8c3d-21d294bd6f2e",
          name: "دورات",
          icon: "https://fra1.digitaloceanspaces.com/tawjihi-s3/media/icon/online-certificate_20250727230344.png?AWSAccessKeyId=DO801FWRNBU9HPQHZJ3K&Signature=S7WgFoxKEezKMqPJ%2B3pX5dSqIWI%3D&Expires=1754152760",
        },
        color: {
          id: "aa2edf07-6704-4a17-b7cd-c8e403ea0af3",
          name: "Red",
          color: "#d90b23",
        },
        is_published: true,
        created_at: "2025-08-02T01:51:37.894619+03:00",
        order: 1,
      },
      {
        id: "d574f87d-69aa-497e-8149-e445103c7795",
        title: "الامتحانات الالكترونية",
        description: "اختبارات تفاعلية تحاكي الامتحان الحقيقي",
        icon: {
          id: "ee37f6cb-e059-4c64-b7f4-de2014a21f01",
          name: "امتحانات",
          icon: "https://fra1.digitaloceanspaces.com/tawjihi-s3/media/icon/exam_1_20250727230322.png?AWSAccessKeyId=DO801FWRNBU9HPQHZJ3K&Signature=0OyLCUKQHTU05rArTOTuXkJI%2Flw%3D&Expires=1754152760",
        },
        color: {
          id: "7b65db1e-5d4d-4e87-b4c8-6c14545220af",
          name: "Blue",
          color: "#13eb1e",
        },
        is_published: true,
        created_at: "2025-08-02T01:55:14.729143+03:00",
        order: 2,
      },
    ],
  },
];

const specialization_material = [
  {
    id: "e600daa5-1edf-461d-a9f1-6a52beaa3345",
    is_published: true,
    material: {
      id: "bfa3309f-7d5f-4897-8855-304c55c5738b",
      name: "احياء",
    },
    created_at: "2025-07-30T01:05:37.342924+03:00",
    updated_at: "2025-07-30T01:05:37.967494+03:00",
    teachers: [
      {
        id: "5fa72884-fc22-4d5e-a67f-f2c26f487555",
        name: "Gary Wilcox",
        image: null,
        materials: [],
        total_enrolled_students: 0,
        type: {
          id: 2,
          name: "teacher",
        },
      },
      {
        id: "0bc3c31f-f4c8-4cc9-8e6e-006707650544",
        name: "Laith Teacher",
        image: null,
        materials: [
          {
            id: "bfa3309f-7d5f-4897-8855-304c55c5738b",
            name: "احياء",
          },
        ],
        total_enrolled_students: 1,
        type: {
          id: 2,
          name: "teacher",
        },
      },
    ],
  },
  {
    id: "e16bccf2-ff9b-4d46-bbe5-5ad4dc0dea03",
    is_published: true,
    material: {
      id: "f584da62-de97-418e-9504-d88555b27c2c",
      name: "فيزياء",
    },
    created_at: "2025-08-01T20:20:50.385384+03:00",
    updated_at: "2025-08-01T20:20:50.485107+03:00",
    teachers: [],
  },
];

function flattenHierarchy(api: any[]) {
  const flat: SubSection[] = [];

  const seen = new Set<string>();
  const pushUnique = (row: SubSection) => {
    if (!seen.has(row.id)) {
      flat.push(row);
      seen.add(row.id);
    }
  };

  const catalog: Record<string, any> = {};

  api.forEach((subsection) => {
    // level-1
    pushUnique({
      id: subsection.id,
      name: subsection.title,
      description: subsection.description,
      parentId: null,
      level: 1,
      linkedSections: subsection.sections?.map((s: any) => s.id) ?? [],
      studentsCount: 0,
      itemsCount: 0,
      isExpanded: true,
      createdAt:
        subsection.created_at?.split("T")[0] ?? `${new Date()}`.split("T")[0],
    });

    subsubsections
      .filter((s) => s.subsection.id === subsection.id)
      .forEach((subSub) => {
        pushUnique({
          id: subSub.id,
          name: subSub.title,
          description: subSub.description,
          parentId: subsection.id,
          level: 2,
          linkedSections: subSub.sections?.map((s: any) => s.id) ?? [],
          studentsCount: 0,
          itemsCount: 0,
          isExpanded: false,
          createdAt: `${new Date()}`.split("T")[0],
        });

        subSub.sections?.forEach((sec) => {
          catalog[sec.id] = {
            id: sec.id,
            created_at: sec.created_at,
            description: sec.description,
            is_published: sec.is_published,
            order: sec.order,
            title: sec.title,
            icon: {
              name: sec.icon?.name,
              id: sec.icon?.id,
              icon: sec.icon?.icon,
            },
            color: {
              name: sec.color?.name,
              id: sec.color?.id,
              color: sec.color?.color,
            },
          };
        });

        specialisations
          .filter((sp) => sp.subsubsection.id === subSub.id)
          .forEach((spec: any) => {
            // level-3  (specialisations)
            pushUnique({
              id: spec.id,
              name: spec.name,
              description: spec.description,
              parentId: subSub.id,
              level: 3,
              linkedSections: spec.sections?.map((s: any) => s.id) ?? [],
              studentsCount: 0,
              itemsCount: 0,
              isExpanded: false,
              createdAt:
                spec.created_at?.split("T")[0] ?? `${new Date()}`.split("T")[0],
            });

            specialization_material?.forEach((mat: any) => {
              // level-4  (subjects)
              pushUnique({
                id: mat.material.id,
                name: mat.material.name,
                description: "",
                parentId: spec.id,
                level: 4,
                linkedSections: mat.sections?.map((s: any) => s.id) ?? [],
                studentsCount: 0,
                itemsCount: 0,
                isExpanded: false,
                createdAt:
                  mat.created_at?.split("T")[0] ??
                  `${new Date()}`.split("T")[0],
              });
            });
          });
      });
  });

  return { flat, catalog };
}

const SubsectionsPage: React.FC = () => {
  const [subsections, setSubsections] = useState<SubSection[]>([]);
  const [sectionCatalog, setSectionCatalog] = useState<Record<string, any>>({});

  const { data } = useCustomQuery("training/admin/subsections/", [
    "subsections",
  ]);

  useEffect(() => {
    if (!data?.data) return;
    const { flat, catalog } = flattenHierarchy(data.data);
    setSubsections(flat);
    setSectionCatalog(catalog);
  }, [data]);

  const mainSections = Object.values(sectionCatalog);

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

  // Filter subsections based on search term
  const filteredSubsections = subsections.filter(
    (subsection) =>
      subsection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subsection.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Build tree structure
  const buildTree = (
    items: SubSection[],
    parentId: string | null = null
  ): SubSection[] => {
    return items
      .filter((item) => item.parentId === parentId)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((item) => ({
        ...item,
        children: buildTree(items, item.id),
      })) as SubSection[];
  };

  const treeData = buildTree(filteredSubsections);

  const getMainSectionIcon = (sectionId: string) => {
    const section = mainSections.find((s) => s.id === sectionId);
    if (!section) return BookOpen;

    switch (section.icon.name) {
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
    const section = mainSections.find((s) => s.id === sectionId);
    if (!section) return "text-blue-600";

    switch (section.color.name) {
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

  const toggleExpanded = (id: string) => {
    setSubsections(
      subsections.map((item) =>
        item.id === id ? { ...item, isExpanded: !item.isExpanded } : item
      )
    );
  };

  const handleAddSubsection = () => {
    if (newSubsection.name && newSubsection.description) {
      const subsection: SubSection = {
        id: `${Date.now()}`,
        name: newSubsection.name,
        description: newSubsection.description,
        parentId: newSubsection.parentId || null,
        level: newSubsection.parentId
          ? (subsections.find((s) => s.id === newSubsection.parentId)?.level ||
              0) + 1
          : 1,
        linkedSections: newSubsection.linkedSections || [],
        studentsCount: Math.floor(Math.random() * 100),
        itemsCount: Math.floor(Math.random() * 50),
        isExpanded: false,
        createdAt: new Date().toISOString().split("T")[0],
      };

      setSubsections([...subsections, subsection]);
      setNewSubsection({
        name: "",
        description: "",
        parentId: null,
        level: 1,
        linkedSections: [],
      });
      setShowAddModal(false);
    }
  };

  const handleEditSubsection = () => {
    if (
      selectedSubsection &&
      selectedSubsection.name &&
      selectedSubsection.description
    ) {
      setSubsections(
        subsections.map((subsection) =>
          subsection.id === selectedSubsection.id
            ? selectedSubsection
            : subsection
        )
      );
      setShowEditModal(false);
      setSelectedSubsection(null);
    }
  };

  const handleDeleteSubsection = (id: string) => {
    const hasChildren = subsections.some((s) => s?.parentId === id);
    const confirmMessage = hasChildren
      ? "هل أنت متأكد من حذف هذا القسم؟ سيتم حذف جميع الأقسام الفرعية التابعة له."
      : "هل أنت متأكد من حذف هذا القسم؟";

    if (confirm(confirmMessage)) {
      // Delete the subsection and all its children recursively
      const deleteRecursively = (targetId: string) => {
        const children = subsections.filter((s) => s.parentId === targetId);
        children.forEach((child) => deleteRecursively(child.id));
        setSubsections((prev) => prev.filter((s) => s.id !== targetId));
      };

      deleteRecursively(id);
    }
  };

  const updateLinkedSections = (
    subsectionId: string,
    linkedSections: string[]
  ) => {
    setSubsections(
      subsections.map((subsection) =>
        subsection.id === subsectionId
          ? {
              ...subsection,
              linkedSections: linkedSections.map((id) => id),
            }
          : subsection
      )
    );
  };

  const renderTreeItem = (
    item: SubSection & { children?: SubSection[] },
    depth: number = 0
  ) => {
    const hasChildren = item.children && item.children.length > 0;
    const indentClass = `ml-${depth * 6}`;

    return (
      <div key={item.id} className="space-y-2">
        <div
          className={`bg-white/95 backdrop-blur-xl rounded-lg shadow-sm border border-orange-100/50 hover:shadow-md transition-all duration-300 ${indentClass}`}
          style={{
            marginRight: `${(item.level - 1) * 16}px`,
          }}
        >
          <div className="p-4">
            <div className="flex items-start gap-4">
              {/* Expand/Collapse Button */}
              <div className="flex items-center gap-2 shrink-0">
                {hasChildren ? (
                  <button
                    onClick={() => toggleExpanded(item.id)}
                    className="p-1 hover:bg-orange-50 rounded transition-colors"
                  >
                    {item.isExpanded ? (
                      <ChevronDown size={16} className="text-orange-600" />
                    ) : (
                      <ChevronRight size={16} className="text-orange-600" />
                    )}
                  </button>
                ) : (
                  <div className="w-6 h-6 flex items-center justify-center">
                    <div className="w-2 h-2 bg-orange-300 rounded-full"></div>
                  </div>
                )}

                {/* Folder/File Icon */}
                {hasChildren ? (
                  item.isExpanded ? (
                    <FolderOpen size={20} className="text-orange-500" />
                  ) : (
                    <Folder size={20} className="text-orange-500" />
                  )
                ) : (
                  <File size={20} className="text-gray-400" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Level Badge */}
                  <div className="flex items-center gap-2 ml-4">
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Hash size={12} />
                      المستوى {item.level}
                    </span>
                  </div>
                </div>

                {/* Linked Sections */}
                {item.linkedSections.length > 0 && (
                  <div className="flex items-center gap-2 mb-3">
                    <Link size={14} className="text-gray-400" />
                    <div className="flex gap-1 flex-wrap">
                      {item.linkedSections.map((sectionId) => {
                        const section = mainSections.find(
                          (s) => s.id === sectionId
                        );
                        if (!section) return null;

                        const IconComponent = getMainSectionIcon(sectionId);
                        const colorClass = getMainSectionColor(sectionId);

                        return (
                          <span
                            key={sectionId}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs font-medium"
                          >
                            <IconComponent size={12} className={colorClass} />
                            {section.title}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Stats and Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      <span>{item.studentsCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen size={14} />
                      <span>{item.itemsCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{item.createdAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Link to Sections */}
                    <button
                      onClick={() => {
                        setSelectedSubsection(item);
                        setShowLinkModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="ربط بالأقسام الرئيسية"
                    >
                      <Link size={16} />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => {
                        setSelectedSubsection(item);
                        setShowEditModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                      title="تعديل القسم"
                    >
                      <Edit size={16} />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteSubsection(item.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="حذف القسم"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Render Children */}
        {hasChildren && item.isExpanded && item.children && (
          <div className="space-y-2">
            {item.children.map((child) => renderTreeItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const AddSubsectionModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              إضافة قسم فرعي جديد
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
          {/* Parent Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              القسم الأب
            </label>
            <select
              value={newSubsection.parentId || ""}
              onChange={(e) =>
                setNewSubsection({
                  ...newSubsection,
                  parentId: e.target.value ? e.target.value : null,
                })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            >
              <option value="">قسم رئيسي (بدون أب)</option>
              {subsections
                .filter((s) => s.level < 3)
                .map((subsection) => (
                  <option key={subsection.id} value={subsection.id}>
                    {"  ".repeat(subsection.level - 1)}└ {subsection.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Subsection Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم القسم الفرعي
            </label>
            <input
              type="text"
              value={newSubsection.name || ""}
              onChange={(e) =>
                setNewSubsection({ ...newSubsection, name: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              placeholder="أدخل اسم القسم الفرعي..."
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الوصف
            </label>
            <textarea
              value={newSubsection.description || ""}
              onChange={(e) =>
                setNewSubsection({
                  ...newSubsection,
                  description: e.target.value,
                })
              }
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
              placeholder="أدخل وصف القسم الفرعي..."
            />
          </div>

          {/* Linked Sections */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              ربط بالأقسام الرئيسية
            </label>
            <div className="grid grid-cols-2 gap-3">
              {mainSections.map((section) => {
                const IconComponent = getMainSectionIcon(section.id);
                const isLinked = newSubsection.linkedSections?.includes(
                  section.id
                );

                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      const currentLinks = newSubsection.linkedSections || [];
                      const newLinks = isLinked
                        ? currentLinks.filter((id) => id !== section.id)
                        : [...currentLinks, section.id];
                      setNewSubsection({
                        ...newSubsection,
                        linkedSections: newLinks,
                      });
                    }}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                      isLinked
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <IconComponent size={20} />
                    <span>{section.title}</span>
                  </button>
                );
              })}
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
            onClick={handleAddSubsection}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2"
          >
            <Save size={16} />
            حفظ القسم
          </button>
        </div>
      </div>
    </div>
  );

  const EditSubsectionModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              تعديل القسم الفرعي
            </h2>
            <button
              onClick={() => setShowEditModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {selectedSubsection && (
          <div className="p-6 space-y-6">
            {/* Parent Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                القسم الأب
              </label>
              <select
                value={selectedSubsection.parentId || ""}
                onChange={(e) =>
                  setSelectedSubsection({
                    ...selectedSubsection,
                    parentId: e.target.value ? e.target.value : null,
                  })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              >
                <option value="">قسم رئيسي (بدون أب)</option>
                {subsections
                  .filter((s) => s.level < 3 && s.id !== selectedSubsection.id)
                  .map((subsection) => (
                    <option key={subsection.id} value={subsection.id}>
                      {"  ".repeat(subsection.level - 1)}└ {subsection.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Subsection Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم القسم الفرعي
              </label>
              <input
                type="text"
                value={selectedSubsection.name}
                onChange={(e) =>
                  setSelectedSubsection({
                    ...selectedSubsection,
                    name: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="أدخل اسم القسم الفرعي..."
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الوصف
              </label>
              <textarea
                value={selectedSubsection.description}
                onChange={(e) =>
                  setSelectedSubsection({
                    ...selectedSubsection,
                    description: e.target.value,
                  })
                }
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
                placeholder="أدخل وصف القسم الفرعي..."
              />
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
            onClick={handleEditSubsection}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2"
          >
            <Save size={16} />
            حفظ التغييرات
          </button>
        </div>
      </div>
    </div>
  );

  const LinkSectionsModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              ربط بالأقسام الرئيسية
            </h2>
            <button
              onClick={() => setShowLinkModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {selectedSubsection && (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-2">
                {selectedSubsection.name}
              </h3>
              <p className="text-gray-600 text-sm">
                {selectedSubsection.description}
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">
                اختر الأقسام الرئيسية للربط:
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {mainSections.map((section) => {
                  const IconComponent = getMainSectionIcon(section.id);
                  const colorClass = getMainSectionColor(section.id);
                  const isLinked = selectedSubsection.linkedSections.includes(
                    section.id
                  );

                  return (
                    <button
                      key={section.id}
                      onClick={() => {
                        const newLinks = isLinked
                          ? selectedSubsection.linkedSections.filter(
                              (id) => id !== section.id
                            )
                          : [...selectedSubsection.linkedSections, section.id];
                        setSelectedSubsection({
                          ...selectedSubsection,
                          linkedSections: newLinks,
                        });
                      }}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                        isLinked
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <IconComponent size={24} className={colorClass} />
                      <div className="flex-1 text-right">
                        <h5 className="font-medium text-gray-800">
                          {section.title}
                        </h5>
                        <p className="text-sm text-gray-500">
                          {section.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* {section.isFree && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            مجاني
                          </span>
                        )} */}
                        {isLinked && (
                          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                            مرتبط
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
          <button
            onClick={() => setShowLinkModal(false)}
            className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={() => {
              if (selectedSubsection) {
                updateLinkedSections(
                  selectedSubsection.id,
                  selectedSubsection.linkedSections
                );
                setShowLinkModal(false);
                setSelectedSubsection(null);
              }
            }}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2"
          >
            <Save size={16} />
            حفظ الروابط
          </button>
        </div>
      </div>
    </div>
  );

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
            {subsections.length}
          </p>
          <p className="text-sm text-gray-600">إجمالي الأقسام</p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-orange-100/50 text-center">
          <p className="text-2xl font-bold text-green-600">
            {subsections.filter((s) => s.linkedSections.length > 0).length}
          </p>
          <p className="text-sm text-gray-600">الأقسام المرتبطة</p>
        </div>
      </div>

      {/* Tree View */}
      <div className="space-y-4">
        {subsections.length > 0 ? (
          treeData.map((item) => renderTreeItem(item))
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
      {showAddModal && <AddSubsectionModal />}
      {showEditModal && <EditSubsectionModal />}
      {showLinkModal && <LinkSectionsModal />}
    </div>
  );
};

export default SubsectionsPage;
