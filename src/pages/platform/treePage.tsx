import React, { useState } from "react";
import { ChevronDown, ChevronRight, Home, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import { useCustomQuery } from "@/hooks/platform/usePlatformQuery";
import { useParams } from "react-router";
import EmptyState from "@/components/core/EmptyState";

/** Query params for `/training/students/teacher/:id/` so tabs reflect the tree path. */
type TeacherTreeQueryFilters = {
  section_id: string;
  subsection_id: string;
  subsubsection_id?: string;
  specialization_material_id?: string;
};

function buildTeacherProfileSearchParams(
  teacher: { id: string; materials?: { id?: string }[] },
  filters: TeacherTreeQueryFilters,
) {
  const params = new URLSearchParams();
  params.set("section_id", filters.section_id);
  params.set("subsection_id", filters.subsection_id);
  if (filters.subsubsection_id) {
    params.set("subsubsection_id", filters.subsubsection_id);
  }
  const materialId =
    filters.specialization_material_id ?? teacher.materials?.[0]?.id;
  if (materialId) {
    params.set("specialization_material_id", String(materialId));
  }
  return params;
}

function nextTeacherTreeFilters(
  parentChildKey: string | undefined,
  child: { id: string },
  prev: TeacherTreeQueryFilters,
): TeacherTreeQueryFilters {
  if (!parentChildKey) return prev;
  const next = { ...prev };
  if (parentChildKey === "subsubsections" || parentChildKey === "subsections") {
    next.subsubsection_id = child.id;
  } else if (parentChildKey === "specialization_materials") {
    next.specialization_material_id = child.id;
  }
  return next;
}

const TreePage: React.FC = () => {
  const { navHeaderId } = useParams();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const { data: treeData } = useCustomQuery("/training/students/sections/", [
    "sections",
  ]);
  const navigate = useNavigate();

  const data = treeData?.data.find((node: any) => node.id === navHeaderId);
  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };
  const hasValidChildren = (node: any, childKey: string) => {
    if (!childKey || !node[childKey]) return false;

    return node[childKey].some((child: any) => {
      const childChildKey = Object.keys(child).find(
        (key) =>
          Array.isArray(child[key]) &&
          child[key].length > 0 &&
          child[key].every(
            (item: any) => typeof item === "object" && "id" in item,
          ),
      );

      const childHasChildren =
        !!childChildKey && hasValidChildren(child, childChildKey);
      const childHasTeachers =
        child.teachers &&
        Array.isArray(child.teachers) &&
        child.teachers.length > 0;

      return childHasChildren || childHasTeachers;
    });
  };
  const renderTeacher = (teacher: any, filters: TeacherTreeQueryFilters) => (
    <div
      key={teacher.id}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100 cursor-pointer group"
      onClick={() => {
        const params = buildTeacherProfileSearchParams(teacher, filters);
        const qs = params.toString();
        navigate(`/teacher/${teacher.id}${qs ? `?${qs}` : ""}`);
      }}
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative">
          <img
            src={
              teacher?.image ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                teacher?.name,
              )}&background=ffffff&color=2465c9&size=64`
            }
            alt={teacher?.name}
            className="w-16 h-16 rounded-full object-cover border-4 border-gradient-to-r from-yellow-400 to-orange-500"
          />
        </div>
        <div className="flex-1 text-right">
          <h4 className="text-lg font-bold text-gray-900 group-hover:text-(--brand) transition-colors duration-200">
            {teacher?.name}
          </h4>
          <p className="text-gray-600 font-medium">
            {teacher?.materials?.[0].name}
          </p>
        </div>
      </div>

      <button className="w-full cursor-pointer text-white py-3 px-4 rounded-xl font-semibold bg-[linear-gradient(to_right,var(--brand),var(--brand-light),var(--brand))] bg-size-[200%_100%] bg-left hover:bg-right transition-all duration-700 transform group-hover:scale-105">
        عرض الملف الشخصي
      </button>
    </div>
  );
  const renderNode = (
    node: any,
    level: number = 0,
    teacherFilters: TeacherTreeQueryFilters,
  ) => {
    const isExpanded = expandedNodes.has(node?.id);

    const childKey = Object.keys(node).find(
      (key) =>
        Array.isArray(node[key]) &&
        node[key].length > 0 &&
        node[key].every(
          (item: any) => typeof item === "object" && "id" in item,
        ),
    );
    const hasChildren = !!childKey && hasValidChildren(node, childKey);
    const hasTeachers =
      node.teachers && Array.isArray(node.teachers) && node.teachers.length > 0;
    if (!hasChildren && !hasTeachers) {
      return null;
    }
    return (
      <div key={node?.id} className="mb-4">
        <div
          className={`flex items-center space-x-3 p-4 rounded-xl cursor-pointer transition-all duration-300 hover:bg-(--brand) hover:text-white`}
          style={{ marginRight: `${level * 20}px` }}
          onClick={() => toggleNode(node.id)}
        >
          {(hasChildren || hasTeachers) && (
            <div className="shrink-0">
              {isExpanded ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </div>
          )}

          {node?.icon?.icon && level == 0 && (
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-xl ${
                level === 0
                  ? "bg-linear-to-r from-(--brand) to-(--brand-light)"
                  : "bg-gray-200"
              }`}
            >
              <img
                src={
                  node?.icon?.icon ||
                  "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1200"
                }
                alt={node?.title}
                className={`w-5 h-5 ${
                  level === 0 ? "text-white" : "text-gray-600"
                }`}
              />
            </div>
          )}
          <div>
            <p className={`font-semibold ${level === 0 ? "text-lg" : ""}`}>
              {node?.title || node?.name || node?.material?.name}
            </p>
            {node?.description && (
              <p
                className={`font-semibold p-2 ${
                  level === 0
                    ? "text-sm text-gray-500"
                    : "text-xs text-gray-500"
                }`}
              >
                {node?.description}
              </p>
            )}
          </div>

          {hasTeachers && isExpanded && (
            <div className="mr-auto">
              <span className="bg-(--brand) text-white px-3 py-1 rounded-full text-sm font-medium">
                {node?.teachers?.length || 0} أستاذ
              </span>
            </div>
          )}
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-4">
            {hasChildren &&
              !hasTeachers &&
              node[childKey!]?.map((child: any) =>
                renderNode(
                  child,
                  level + 1,
                  nextTeacherTreeFilters(childKey, child, teacherFilters),
                ),
              )}

            {hasTeachers && (
              <div className="ms-12.5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
                {node.teachers.map((t: any) =>
                  renderTeacher(t, teacherFilters),
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-linear-to-r from-(--brand) to-(--brand-light) shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  if (window.history.length > 1) {
                    navigate(-1);
                  } else {
                    navigate("/");
                  }
                }}
                className="w-12 h-12 cursor-pointer bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all duration-200 group"
              >
                <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              {/* <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div> */}
              <div className="text-white">
                <h1 className="text-3xl font-bold">
                  {data?.title || "لا يوجد قسم"}
                </h1>
                <p className="text-yellow-100 text-lg">
                  اختر المستوى والأستاذ المناسب
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4 text-white">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {data?.statistics?.number_of_teachers || 0}
                </div>
                <div className="text-sm text-yellow-100">أستاذ</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center space-x-2 text-gray-600">
          <a
            href="/"
            className="flex items-center space-x-1 hover:text-gray-900"
          >
            <Home className="w-4 h-4" />
            <p>الرئيسية</p>
          </a>
          <span className="cursor-default">/</span>
          <span className="cursor-default text-(--brand) font-medium">
            {data?.title}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="space-y-6">
          {Array.isArray(data?.subsections) && data.subsections.length > 0 ? (
            data.subsections.every((node: any) => {
              const childKey = Object.keys(node).find(
                (key) =>
                  Array.isArray(node[key]) &&
                  node[key].length > 0 &&
                  node[key].every(
                    (item: any) => typeof item === "object" && "id" in item,
                  ),
              );
              const hasChildren =
                !!childKey && hasValidChildren(node, childKey);
              const hasTeachers =
                node.teachers &&
                Array.isArray(node.teachers) &&
                node.teachers.length > 0;

              return !hasChildren && !hasTeachers;
            }) ? (
              // Show empty state once if ALL subsections are empty
              <EmptyState title="لا يوجد محتوى لعرضه" tone="info" size="lg" />
            ) : (
              // Otherwise render the nodes normally
              data.subsections.map((node: any) => (
                <React.Fragment key={node.id}>
                  {renderNode(node, 0, {
                    section_id: navHeaderId ?? "",
                    subsection_id: node.id,
                  })}
                </React.Fragment>
              ))
            )
          ) : (
            <EmptyState title="لا يوجد محتوى لعرضه" tone="info" size="lg" />
          )}
        </div>
      </div>
    </div>
  );
};

export default TreePage;
