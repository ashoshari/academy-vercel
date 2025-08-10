import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Home,
  ArrowRight,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useCustomQuery } from "@/hooks/useQuery";
import { useParams } from "react-router";
import errorIllustation from "@/assets/illustration/Error_illustration.svg";

const TreePage: React.FC = () => {
  const { navHeaderId } = useParams();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const { data: treeData } = useCustomQuery(
    "/training/students/sections/",
    ["sections"]
  );
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
  const renderTeacher = (teacher: any) => (
    <div
      key={teacher.id}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100 cursor-pointer group"
      onClick={() => navigate(`/teacher/${teacher.id}`)}
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative">
          <img
            src={
              teacher?.image ||
              "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1200"
            }
            alt={teacher?.name}
            className="w-16 h-16 rounded-full object-cover border-4 border-gradient-to-r from-yellow-400 to-orange-500"
          />
        </div>
        <div className="flex-1 text-right">
          <h4 className="text-lg font-bold text-gray-900 group-hover:text-yellow-600 transition-colors duration-200">
            {teacher?.name}
          </h4>
          <p className="text-gray-600 font-medium">
            {teacher?.materials?.[0].name}
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="text-lg font-bold text-gray-900">
              {teacher?.total_enrolled_students ?? 0}
            </span>
          </div>
          <p className="text-xs text-gray-500">طالب</p>
        </div>
      </div>

      <button className="w-full cursor-pointer bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 transform group-hover:scale-105">
        عرض الملف الشخصي
      </button>
    </div>
  );
  const renderNode = (node: any, level: number = 0) => {
    const isExpanded = expandedNodes.has(node?.id);

    const childKey = Object.keys(node).find(
      (key) =>
        Array.isArray(node[key]) &&
        node[key].length > 0 &&
        node[key].every((item: any) => typeof item === "object" && "id" in item)
    );

    const hasChildren = !!childKey;
    const hasTeachers =
      node.teachers && Array.isArray(node.teachers) && node.teachers.length > 0;
    return (
      <div key={node?.id} className="mb-4">
        <div
          className={`flex items-center space-x-3 p-4 rounded-xl cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 ${
            level === 0
              ? "bg-white shadow-md border border-gray-100"
              : "bg-gray-50 hover:bg-gray-100"
          }`}
          style={{ marginRight: `${level * 20}px` }}
          onClick={() => toggleNode(node.id)}
        >
          {(hasChildren || hasTeachers) && (
            <div className="flex-shrink-0">
              {isExpanded ? (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              )}
            </div>
          )}

          {node?.icon?.icon && level == 0 && (
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-xl ${
                level === 0
                  ? "bg-gradient-to-r from-yellow-500 to-orange-500"
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

          <span
            className={`font-semibold ${
              level === 0 ? "text-lg text-gray-900" : "text-gray-700"
            }`}
          >
            {node?.title || node?.name || node?.material?.name}
          </span>

          {hasTeachers && isExpanded && (
            <div className="mr-auto">
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
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
                renderNode(child, level + 1)
              )}

            {hasTeachers && (
              <div className="ms-[50px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
                {node.teachers.map(renderTeacher)}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.length > 1 ? navigate(-1) : navigate("/")}
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
              <div className="w-px h-12 bg-white/20"></div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {data?.statistics?.number_of_students || 0}
                </div>
                <div className="text-sm text-yellow-100">طالب</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center space-x-2 text-gray-600">
          <Home className="w-4 h-4" />
          <a href="/" className="">
            الرئيسية
          </a>
          <span>/</span>
          <span className="text-yellow-600 font-medium">{data?.title}</span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="space-y-6">
          {Array.isArray(data?.subsections) && data.subsections.length > 0 ? (
            data?.subsections.map((node: any) => renderNode(node))
          ) : (
            <div className="relative flex flex-col items-center">
              <img
                className="absolute top-0 w-[700px] h-[650px] z-0"
                src={errorIllustation}
                alt="error"
              />
              <h1 className="pt-[50px] absolute text-[2rem] top-[500px] z-[1]">
                لا يوجد محتوى لعرضه
              </h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TreePage;
