import { useState } from "react";
import { Menu, X, GraduationCap } from "lucide-react";
import AuthModal from "@/layout/platform/navbar/authModal";
import useTokenStore from "@/store/platform/useToken";
import useToken from "@/store/platform/useToken";

const Navbar: React.FC = () => {
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
  };
  const handleLoginClick = () => {
    setShowAuthModal(true);
  };
  return (
    <>
      <nav className="bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <a href="/" className="flex items-center space-x-2">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                    منصة التوجيهي
                  </h1>
                  <p className="text-xs text-gray-500">نحو التفوق</p>
                </div>
              </div>
            </a>

            {/* Desktop Navigation */}
            {/* <div className="hidden md:flex items-center space-x-8">
              <a
                href="/"
                className="text-gray-700 hover:text-yellow-600 font-medium transition-colors duration-200"
              >
                الرئيسية
              </a>
              <a
                href="/courses"
                className="text-gray-700 hover:text-yellow-600 font-medium transition-colors duration-200"
              >
                الدورات
              </a>
              <a
                href="/exams"
                className="text-gray-700 hover:text-yellow-600 font-medium transition-colors duration-200"
              >
                الامتحانات
              </a>
              <a
                href="/about-us"
                className="text-gray-700 hover:text-yellow-600 font-medium transition-colors duration-200"
              >
                من نحن
              </a>
            </div> */}

            {/* Search and User Actions */}
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 transform hover:scale-105 cursor-pointer"
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
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all duration-200"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {/* {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <div className="flex flex-col space-y-3">
                <a
                  href="#"
                  className="text-gray-700 hover:text-yellow-600 font-medium py-2 px-4 rounded-lg hover:bg-yellow-50 transition-all duration-200"
                >
                  الرئيسية
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-yellow-600 font-medium py-2 px-4 rounded-lg hover:bg-yellow-50 transition-all duration-200"
                >
                  الدورات
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-yellow-600 font-medium py-2 px-4 rounded-lg hover:bg-yellow-50 transition-all duration-200"
                >
                  الامتحانات
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-yellow-600 font-medium py-2 px-4 rounded-lg hover:bg-yellow-50 transition-all duration-200"
                >
                  من نحن
                </a>
              </div>
            </div>
          )} */}
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
