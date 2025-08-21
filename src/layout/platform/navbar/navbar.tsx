import { useState } from "react";
import { Image, Menu, X } from "lucide-react";
import AuthModal from "@/layout/platform/navbar/authModal";
import useTokenStore from "@/store/platform/useToken";
import useToken from "@/store/platform/useToken";
import { Link, useNavigate } from "react-router";
import { useCustomQuery } from "@/hooks/platform/usePlatformQuery";
import toast from "react-hot-toast";

const Navbar: React.FC = () => {
  const { data } = useCustomQuery("/core/footer/", ["footer"]);
  const { data: footer, isLoading: footerLoading } = useCustomQuery(
    "/core/footer/",
    ["footer"]
  );
  const headerData = data?.data;
  const footerData = footer?.data;
  const navigate = useNavigate();
  const clearTokens = useToken((state) => state.clearTokens);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = useTokenStore((state) => state.isLoggedIn);
  // const setIsLoggedIn = useUserAuthStore((state) => state.setIsLoggedIn);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLogin = () => {
    setShowAuthModal(false);
  };
  const handleLogout = () => {
    setShowAuthModal(false);
    clearTokens();
    navigate("/");
    toast.success("تم تسجيل الخروج بنجاح");
  };
  const handleLoginClick = () => {
    setShowAuthModal(true);
  };
  if (footerLoading) return null;
  return (
    <>
      <nav className="h-[8vh] bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-full">
            {/* Logo */}
            <button onClick={() => navigate("/")} className="cursor-pointer flex items-center space-x-2">
              <div className="flex items-center space-x-3">
                {headerData?.logo ? (
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl">
                    <img
                      loading="lazy"
                      className="rounded-xl w-10 h-10 text-white"
                      src={headerData?.logo}
                      alt="logo"
                    />
                  </div>
                ) : (
                  <Image className="rounded-xl w-10 h-10 text-gray-600" />
                )}
                <div className="text-right">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                    {headerData?.platform_name || "اسم المنصة"}
                  </h1>
                  <p className="text-xs text-gray-500">
                    {headerData?.slogan || "شعار المنصة"}
                  </p>
                </div>
              </div>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {footerData?.links?.slice(0, 3).map((item: any) => (
                <button
                  key={item.id}
                  onClick={() => navigate(`/sections/${item?.id}`)}
                  className="cursor-pointer text-gray-700 hover:text-yellow-600 font-medium transition-colors duration-200"
                >
                  {item.title}
                </button>
              ))}
              {footerData?.links?.length > 3 && (
                <Link
                  to="/"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/", { replace: false });
                    setTimeout(() => {
                      const el = document.getElementById("discover");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                  className=" text-white bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl px-4 py-2 font-medium transition-colors duration-200"
                >
                  عرض الكل
                </Link>
              )}
            </div>

            {/* Search and User Actions */}
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:from-gray-600 hover:to-gray-500 transition-all duration-200 transform hover:scale-105 cursor-pointer"
                >
                  تسجيل الخروج
                </button>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 transform hover:scale-105 cursor-pointer"
                >
                  تسجيل الدخول
                </button>
              )}

              {/* Mobile menu button */}
              {footerData?.links && (
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="cursor-pointer md:hidden p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all duration-200"
                >
                  {isMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && footerData?.links && (
            <div className="md:hidden py-4 border-t border-gray-100 bg-gradient-to-b from-yellow-50 to-white">
              <div className="flex flex-col space-y-3">
                {footerData?.links?.slice(0, 3).map((item: any) => (
                  <button
                    key={item.id}
                    onClick={() => navigate(`/sections/${item?.id}`)}
                    className="cursor-pointer text-gray-700 hover:text-yellow-600 font-medium transition-colors duration-200"
                  >
                    {item.title}
                  </button>
                ))}
                {footerData?.links?.length > 3 && (
                  <Link
                    to="/"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/", { replace: false });
                      setTimeout(() => {
                        const el = document.getElementById("discover");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                    }}
                    className=" text-white bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl px-4 py-2 font-medium transition-colors duration-200"
                  >
                    عرض الكل
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      />
    </>
  );
};
export default Navbar;
