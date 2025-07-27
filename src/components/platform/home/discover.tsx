import {
  ArrowRight,
  Users,
  Award,
} from "lucide-react";
import useNav from "@/store/platform/useNav";
import useTokenStore from "@/store/platform/useToken";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import AuthModal from "@/layout/platform/navbar/authModal";
import { useCustomQuery } from "@/hooks/useQuery";

const Discover: React.FC = () => {
  const isLoggedIn = useTokenStore((state) => state.isLoggedIn);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { data: sections, isLoading } = useCustomQuery(
    "/training/students/sections/",
    ["sections"]
  );
  const handleLogin = () => {
    setShowAuthModal(false);
  };
  const handleLoginClick = () => {
    setShowAuthModal(true);
  };
  // const sections = [
  //   {
  //     id: 1,
  //     navHeader: "courses",
  //     title: "الدورات",
  //     description: "دورات شاملة لجميع مواد التوجيهي مع أفضل المدرسين",
  //     icon: BookOpen,
  //     color: "from-blue-500 to-blue-600",
  //     hoverColor: "hover:from-blue-600 hover:to-blue-700",
  //     stats: { count: "50+", students: "5000+", rating: "4.9" },
  //     features: ["شرح مفصل", "أمثلة عملية", "متابعة مستمرة"],
  //   },
  //   {
  //     id: 2,
  //     navHeader: "booklets",
  //     title: "الدوسيات",
  //     description: "ملخصات ومراجعات شاملة لجميع المواد الدراسية",
  //     icon: FileText,
  //     color: "from-green-500 to-green-600",
  //     hoverColor: "hover:from-green-600 hover:to-green-700",
  //     stats: { count: "200+", downloads: "10K+", rating: "4.8" },
  //     features: ["ملخصات مركزة", "سهلة الفهم", "قابلة للتحميل"],
  //   },
  //   {
  //     id: 3,
  //     navHeader: "exams",
  //     title: "الامتحانات الالكترونية",
  //     description: "اختبارات تفاعلية تحاكي الامتحان الحقيقي",
  //     icon: Monitor,
  //     color: "from-purple-500 to-purple-600",
  //     hoverColor: "hover:from-purple-600 hover:to-purple-700",
  //     stats: { count: "500+", attempts: "25K+", accuracy: "95%" },
  //     features: ["تقييم فوري", "تحليل الأداء", "نصائح للتحسين"],
  //   },
  //   {
  //     id: 4,
  //     navHeader: "files",
  //     title: "الملفات",
  //     description: "مكتبة شاملة من الملفات والمراجع التعليمية",
  //     icon: FolderOpen,
  //     color: "from-orange-500 to-orange-600",
  //     hoverColor: "hover:from-orange-600 hover:to-orange-700",
  //     stats: { count: "1000+", size: "5GB+", types: "10+" },
  //     features: ["متنوعة", "منظمة", "سهلة الوصول"],
  //   },
  //   {
  //     id: 5,
  //     navHeader: "foundation-courses",
  //     title: "دورات التأسيس",
  //     description: "دورات أساسية لبناء قاعدة قوية في المواد الأساسية",
  //     icon: GraduationCap,
  //     color: "from-red-500 to-red-600",
  //     hoverColor: "hover:from-red-600 hover:to-red-700",
  //     stats: { count: "30+", hours: "200+", completion: "90%" },
  //     features: ["من الصفر", "تدرج منطقي", "تطبيق عملي"],
  //   },
  //   {
  //     id: 6,
  //     navHeader: "ministerial-questions",
  //     title: "الاسئلة الوزارية",
  //     description: "بنك شامل من الأسئلة الوزارية للسنوات السابقة",
  //     icon: HelpCircle,
  //     color: "from-indigo-500 to-indigo-600",
  //     hoverColor: "hover:from-indigo-600 hover:to-indigo-700",
  //     stats: { count: "2000+", years: "10+", subjects: "15+" },
  //     features: ["حلول مفصلة", "تصنيف حسب المادة", "محدثة باستمرار"],
  //   },
  // ];
  const setNavTitle = useNav((state) => state.setNavTitle);
  const setNavHeader = useNav((state) => state.setNavHeader);
  const navigate = useNavigate();
  const discoverNavHandler = (title: string, navHeader: string) => {
    setNavTitle(title);
    setNavHeader(navHeader);
    navigate(navHeader);
  };
  useEffect(() => {
    if (isLoading) {
      console.log("loading");
    } else if (sections) {
      console.log("sections:", sections);
      // You can also log specific values like:
      // console.log("sections.data:", sections.data);
    }
  }, [isLoading, sections]);
  return (
    <section>
      {isLoading ? (
        <div className="flex items-center justify-center h-full text-white">
          Loading...
        </div>
      ) : (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
          {/* Auth Modal */}
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            onLogin={handleLogin}
          />
          {/* Background Decorations */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-yellow-100/50 to-orange-100/50 rounded-full -translate-x-36 -translate-y-36 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-100/50 to-purple-100/50 rounded-full translate-x-48 translate-y-48 animate-pulse delay-1000"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                اكتشف{" "}
                <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                  أقسامنا
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                منصة شاملة تضم كل ما تحتاجه للتفوق في التوجيهي - من الدورات
                التفاعلية إلى الامتحانات الالكترونية
              </p>
              <div className="flex items-center justify-center mt-8 space-x-8">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-600 font-medium">
                    +15,000 طالب
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600 font-medium">95% نجاح</span>
                </div>
              </div>
            </div>

            {/* Sections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sections.data.map((section: any, index: number) => {
                // const IconComponent = section.icon?.icon;
                return (
                  <div
                    key={sections.id}
                    className={`group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 transform hover:scale-105 hover:-translate-y-2`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Card Background Gradient */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${section.color?.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                    ></div>

                    {/* Card Content */}
                    <div className="relative p-8">
                      {/* Icon */}
                      <div
                        className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${section.color?.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                      >
                        <img
                          className="w-8 h-8 text-white"
                          src={
                            // section.icon.icon ||
                            "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1200"
                          }
                          alt={section.icon.name || "icon"}
                        />

                        {/* <IconComponent className="w-8 h-8 text-white" /> */}
                      </div>

                      {/* Title and Description */}
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-300">
                        {section?.title}
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {section?.description}
                      </p>

                      {/* Features */}
                      {/* <div className="space-y-2 mb-6">
                    {section.data.features.map((feature: any, idx: number) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 bg-gradient-to-r ${section.data.color.color} rounded-full`}
                        ></div>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div> */}

                      {/* Stats */}
                      {/* <div className="grid grid-cols-3 gap-4 mb-6">
                    {Object.entries(section.stats).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div
                          className={`text-lg font-bold bg-gradient-to-r ${section.color} bg-clip-text text-transparent`}
                        >
                          {value}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {key === "count" && "عدد"}
                          {key === "students" && "طالب"}
                          {key === "rating" && "تقييم"}
                          {key === "downloads" && "تحميل"}
                          {key === "attempts" && "محاولة"}
                          {key === "accuracy" && "دقة"}
                          {key === "size" && "حجم"}
                          {key === "types" && "نوع"}
                          {key === "hours" && "ساعة"}
                          {key === "completion" && "إكمال"}
                          {key === "years" && "سنة"}
                          {key === "subjects" && "مادة"}
                        </div>
                      </div>
                    ))}
                  </div> */}

                      {/* CTA Button */}
                      {/* temporary route until i got the proper routing */}
                      <button
                        onClick={() =>
                          discoverNavHandler(
                            section.title,
                            section.title == "الدورات" ? "courses" : "exams"
                          )
                        }
                        style={{ backgroundColor: section.color?.color }}
                        className={`w-full bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 group-hover:shadow-lg transform group-hover:scale-105`}
                      >
                        <span>استكشف الآن</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                    </div>

                    {/* Hover Effect Decoration */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div
                        className={`w-3 h-3 bg-gradient-to-r ${section.color.color} rounded-full animate-ping`}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom CTA */}
            {!isLoggedIn && (
              <div className="text-center mt-16">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-3xl p-8 text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10 rounded-3xl"></div>
                  <div className="relative z-10">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">
                      🚀 جاهز لبدء رحلة التفوق؟
                    </h3>
                    <p className="text-lg mb-6 opacity-90">
                      انضم لآلاف الطلاب الذين حققوا أحلامهم الجامعية معنا
                    </p>
                    <button
                      onClick={handleLoginClick}
                      className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      ابدأ مجاناً الآن
                    </button>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full animate-pulse"></div>
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/10 rounded-full animate-pulse delay-1000"></div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </section>
  );
};

export default Discover;
