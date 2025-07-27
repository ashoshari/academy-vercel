import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Home,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router";
import useNav from "@/store/platform/useNav";
import { useCustomQuery } from "@/hooks/useQuery";
// interface Teacher {
//   id: number;
//   name: string;
//   subject: string;
//   rating: number;
//   students: number;
//   experience: number;
//   image: string;
// }

// interface TreeNode {
//   id: string;
//   title: string;
//   type: "category" | "level" | "teacher";
//   children?: TreeNode[];
//   teachers?: Teacher[];
//   icon?: React.ComponentType<any>;
// }
interface subSubSections{
  id: string;
  title: string;
  description: string;
  is_published: boolean;
  order: number;
}
interface TreePageProps {
  sectionTitle: string;
}

const TreePage: React.FC<TreePageProps> = () => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const { data: treeData, isLoading: treeLoading } = useCustomQuery(
    "/training/students/sections/",
    ["sections"]
  );
  // const { data: teachersData, isLoading: teachersLoading } = useCustomQuery(
  //   "/training/students/subsubsection/93b9ec25-0838-4b39-8036-2a9d9e767479/teachers/",
  //   ["teachers"]
  // );
  const title = useNav((state) => state.navTitle);
  // const { navHeaderId } = useParams<{ navHeaderId: string }>();
  const navigate = useNavigate();
  // console.log(
  //   treeData?.data.find((node: any) => node.title === title).subsections
  // );
  // Sample teachers data with Arabic names
  // const tawjihiTeachers: Teacher[] = [
  //   {
  //     id: 1,
  //     name: "أ. محمد الأحمد",
  //     subject: "الرياضيات",
  //     rating: 4.9,
  //     students: 1200,
  //     experience: 15,
  //     image:
  //       "https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?auto=compress&cs=tinysrgb&w=150",
  //   },
  //   {
  //     id: 2,
  //     name: "أ. فاطمة السعد",
  //     subject: "الفيزياء",
  //     rating: 4.8,
  //     students: 980,
  //     experience: 12,
  //     image:
  //       "https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=150",
  //   },
  //   {
  //     id: 3,
  //     name: "أ. أحمد الخالد",
  //     subject: "الكيمياء",
  //     rating: 4.9,
  //     students: 1100,
  //     experience: 18,
  //     image:
  //       "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=150",
  //   },
  //   {
  //     id: 4,
  //     name: "أ. نور العلي",
  //     subject: "الأحياء",
  //     rating: 4.7,
  //     students: 850,
  //     experience: 10,
  //     image:
  //       "https://images.pexels.com/photos/5212700/pexels-photo-5212700.jpeg?auto=compress&cs=tinysrgb&w=150",
  //   },
  //   {
  //     id: 5,
  //     name: "أ. سامر الحسن",
  //     subject: "اللغة العربية",
  //     rating: 4.8,
  //     students: 1300,
  //     experience: 20,
  //     image:
  //       "https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=150",
  //   },
  //   {
  //     id: 6,
  //     name: "أ. ليلى المحمود",
  //     subject: "اللغة الإنجليزية",
  //     rating: 4.9,
  //     students: 1150,
  //     experience: 14,
  //     image:
  //       "https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=150",
  //   },
  // ];

  // const basicTeachers: Teacher[] = [
  //   {
  //     id: 7,
  //     name: "أ. خالد الزهراني",
  //     subject: "الرياضيات",
  //     rating: 4.8,
  //     students: 800,
  //     experience: 12,
  //     image:
  //       "https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?auto=compress&cs=tinysrgb&w=150",
  //   },
  //   {
  //     id: 8,
  //     name: "أ. هدى الشامي",
  //     subject: "العلوم",
  //     rating: 4.7,
  //     students: 650,
  //     experience: 9,
  //     image:
  //       "https://images.pexels.com/photos/5212700/pexels-photo-5212700.jpeg?auto=compress&cs=tinysrgb&w=150",
  //   },
  //   {
  //     id: 9,
  //     name: "أ. عمر الطيب",
  //     subject: "اللغة العربية",
  //     rating: 4.9,
  //     students: 900,
  //     experience: 16,
  //     image:
  //       "https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=150",
  //   },
  //   {
  //     id: 10,
  //     name: "أ. رنا القاسم",
  //     subject: "اللغة الإنجليزية",
  //     rating: 4.6,
  //     students: 720,
  //     experience: 8,
  //     image:
  //       "https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=150",
  //   },
  //   {
  //     id: 11,
  //     name: "أ. يوسف الدين",
  //     subject: "الاجتماعيات",
  //     rating: 4.8,
  //     students: 600,
  //     experience: 13,
  //     image:
  //       "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=150",
  //   },
  // ];

  // const treeData: TreeNode[] = [
  //   {
  //     id: 'tawjihi',
  //     title: 'التوجيهي',
  //     type: 'category',
  //     icon: GraduationCap,
  //     children: [
  //       {
  //         id: 'tawjihi-2007',
  //         title: 'توجيهي 2007',
  //         type: 'level',
  //         teachers: tawjihiTeachers
  //       },
  //       {
  //         id: 'tawjihi-2008',
  //         title: 'توجيهي 2008',
  //         type: 'level',
  //         teachers: tawjihiTeachers
  //       },
  //       {
  //         id: 'tawjihi-2009',
  //         title: 'توجيهي 2009',
  //         type: 'level',
  //         teachers: tawjihiTeachers
  //       }
  //     ]
  //   },
  //   {
  //     id: 'basic',
  //     title: 'الصفوف الأساسية',
  //     type: 'category',
  //     icon: BookOpen,
  //     children: [
  //       { id: 'grade-1', title: 'الصف الأول', type: 'level', teachers: basicTeachers },
  //       { id: 'grade-2', title: 'الصف الثاني', type: 'level', teachers: basicTeachers },
  //       { id: 'grade-3', title: 'الصف الثالث', type: 'level', teachers: basicTeachers },
  //       { id: 'grade-4', title: 'الصف الرابع', type: 'level', teachers: basicTeachers },
  //       { id: 'grade-5', title: 'الصف الخامس', type: 'level', teachers: basicTeachers },
  //       { id: 'grade-6', title: 'الصف السادس', type: 'level', teachers: basicTeachers },
  //       { id: 'grade-7', title: 'الصف السابع', type: 'level', teachers: basicTeachers },
  //       { id: 'grade-8', title: 'الصف الثامن', type: 'level', teachers: basicTeachers },
  //       { id: 'grade-9', title: 'الصف التاسع', type: 'level', teachers: basicTeachers },
  //       { id: 'grade-10', title: 'الصف العاشر', type: 'level', teachers: basicTeachers }
  //     ]
  //   }
  // ];

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    console.log("Expanded Nodes:", newExpanded);
    setExpandedNodes(newExpanded);
  };

  // const renderTeacher = (teacher: Teacher) => (
  //   <div
  //     key={teacher.id}
  //     className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100 cursor-pointer group"
  //     onClick={() => navigate(`/teacher/${teacher.id}`)}
  //   >
  //     <div className="flex items-center space-x-4 mb-4">
  //       <div className="relative">
  //         <img
  //           src={teacher.image}
  //           alt={teacher.name}
  //           className="w-16 h-16 rounded-full object-cover border-4 border-gradient-to-r from-yellow-400 to-orange-500"
  //         />
  //       </div>
  //       <div className="flex-1 text-right">
  //         <h4 className="text-lg font-bold text-gray-900 group-hover:text-yellow-600 transition-colors duration-200">
  //           {teacher.name}
  //         </h4>
  //         <p className="text-gray-600 font-medium">{teacher.subject}</p>
  //       </div>
  //     </div>

  //     <div className="flex justify-center gap-4 mb-4">
  //       <div className="text-center">
  //         <div className="flex items-center justify-center space-x-1 mb-1">
  //           <Users className="w-4 h-4 text-blue-500" />
  //           <span className="text-lg font-bold text-gray-900">
  //             {teacher.students}
  //           </span>
  //         </div>
  //         <p className="text-xs text-gray-500">طالب</p>
  //       </div>
  //     </div>

  //     <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 transform group-hover:scale-105">
  //       عرض الملف الشخصي
  //     </button>
  //   </div>
  // );

  const renderNode = (node:any, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    // console.log(node);
    const hasChildren = node.subsubsections && node.subsubsections.length > 0;
    console.log(node);
    // const hasTeachers = node.teachers && node.teachers.length > 0;
    // const IconComponent = node.icon;
    // console.log(
    //   treeData.data
    //     .find((n: any) => n.title === title)
    //     .subsections
    // );

    return (
      <section>
        {treeLoading ? (
          <div className="flex items-center justify-center h-full text-white">
            Loading...
          </div>
        ) : (
          <div key={node.id} className="mb-4">
            <div
              className={`flex items-center space-x-3 p-4 rounded-xl cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 ${
                level === 0
                  ? "bg-white shadow-md border border-gray-100"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
              style={{ marginRight: `${level * 20}px` }}
              onClick={() =>
                toggleNode(node.id)
              }
            >
              {(hasChildren
              //  || hasTeachers
              ) && (
                <div className="flex-shrink-0">
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  )}
                </div>
              )}

              {treeData.data.find((n: any) => n.title === title).icon.icon && (
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-xl ${
                    level === 0
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                      : "bg-gray-200"
                  }`}
                >
                  <img
                    src={
                      "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1200"
                      // || treeData.data.find((n: any) => n.title === title).icon.icon
                    }
                    alt={node.title}
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
                {node.title}
              </span>

              {
              // hasTeachers && 
              isExpanded && (
                <div className="mr-auto">
                  {/* <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    {node.teachers!.length} أستاذ
                  </span> */}
                </div>
              )}
            </div>

            {isExpanded && (
              <div className="mt-4 space-y-4">
                {hasChildren &&
                  node.subsubsections!.map((child:subSubSections) => renderNode(child, level + 1))}

                {/* {
                // hasTeachers && 
                (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
                    {node.teachers!.map(renderTeacher)}
                  </div>
                )} */}
              </div>
            )}
          </div>
        )}
      </section>
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
                onClick={() => navigate(-1)}
                className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all duration-200 group"
              >
                <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              {/* <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div> */}
              <div className="text-white">
                <h1 className="text-3xl font-bold">{title}</h1>
                <p className="text-yellow-100 text-lg">
                  اختر المستوى والأستاذ المناسب
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4 text-white">
              <div className="text-center">
                <div className="text-2xl font-bold">15+</div>
                <div className="text-sm text-yellow-100">أستاذ</div>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div className="text-center">
                <div className="text-2xl font-bold">5000+</div>
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
          <span className="text-yellow-600 font-medium">{title}</span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <section>
          {treeLoading ? (
            <div className="flex items-center justify-center h-full text-white">
              Loading...
            </div>
          ) : (
            <div className="space-y-6">
              {treeData?.data
                .find((node: any) => node.title === title)
                .subsections.map((node: any) => renderNode(node))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default TreePage;
