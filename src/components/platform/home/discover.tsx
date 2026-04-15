import { ArrowLeft } from "lucide-react";
import useTokenStore from "@/store/platform/useToken";
import { useNavigate } from "react-router";
import { useState } from "react";
import AuthModal from "@/layout/platform/navbar/authModal";
import { useCustomQuery } from "@/hooks/platform/usePlatformQuery";
import EmptyState from "@/components/core/EmptyState";
import { LayoutGrid } from "lucide-react";

const Discover: React.FC = () => {
  const isLoggedIn = useTokenStore((state) => state.isLoggedIn);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { data: sections } = useCustomQuery("/training/students/sections/", [
    "sections",
  ]);
  const handleLogin = () => {
    setShowAuthModal(false);
  };
  const handleLoginClick = () => {
    setShowAuthModal(true);
  };
  const navigate = useNavigate();
  const discoverNavHandler = (id: string) => {
    navigate(`/sections/${id}`);
  };

  return (
    <section
      id="discover"
      className="py-20 bg-linear-to-br from-gray-50 to-white relative overflow-hidden"
    >
      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      />
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-linear-to-br from-yellow-100/50 to-orange-100/50 rounded-full -translate-x-36 -translate-y-36 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-linear-to-tl from-blue-100/50 to-purple-100/50 rounded-full translate-x-48 translate-y-48 animate-pulse delay-1000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            اكتشف أقسامنا
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            منصة شاملة تضم كل ما تحتاجه للتفوق في التوجيهي - من الدورات
            التفاعلية إلى الامتحانات الالكترونية
          </p>
        </div>

        {/* Sections Grid */}
        {sections?.data?.length === 0 || !sections?.data ? (
          <EmptyState
            title="لا يوجد أقسام لعرضها"
            description="جرّب تحديث الصفحة بعد قليل."
            icon={LayoutGrid}
            tone="info"
            size="lg"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections?.data?.map((section: any, index: number) => {
              return (
                <div
                  key={index}
                  className={`justify-between group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 transform hover:scale-105 hover:-translate-y-2`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Card Background Gradient */}
                  <div
                    className={`absolute inset-0 bg-linear-to-br ${section.color?.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  ></div>

                  {/* Card Content */}
                  <div className="relative p-8 flex flex-col justify-between h-full">
                    <div>
                      {/* Icon */}
                      <div
                        className={`inline-flex items-center justify-center w-16 h-16 bg-linear-to-r ${section.color?.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                      >
                        <img
                          loading="lazy"
                          className="w-8 h-8 text-white"
                          src={
                            section.icon.icon ||
                            "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1200"
                          }
                          alt={section.icon.name || "icon"}
                        />
                      </div>

                      {/* Title and Description */}
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-300">
                        {section?.title}
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {section?.description}
                      </p>
                    </div>

                    {/* CTA Button */}
                    {/* temporary route until i got the proper routing */}
                    <button
                      onClick={() => discoverNavHandler(section.id)}
                      className={`bg-(--brand) hover:bg-(--brand-secondary) cursor-pointer w-full text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 group-hover:shadow-lg transform group-hover:scale-105`}
                    >
                      <span>استكشف الآن</span>
                      <ArrowLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>

                  {/* Hover Effect Decoration */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div
                      className={`w-3 h-3 bg-linear-to-r ${section.color.color} rounded-full animate-ping`}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        {!isLoggedIn && (
          <div className="text-center mt-16">
            <div className="bg-linear-to-r from-(--brand) to-(--brand-light) rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10 rounded-3xl"></div>
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  🚀 جاهز لبدء رحلة التفوق؟
                </h3>
                <p className="text-lg mb-6 opacity-90">
                  انضم لآلاف الطلاب الذين حققوا أحلامهم الدراسية معنا
                </p>
                <button
                  onClick={handleLoginClick}
                  className="cursor-pointer bg-white text-(--brand) px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
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
  );
};

export default Discover;
