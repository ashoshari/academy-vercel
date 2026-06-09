import { useEffect, useState } from "react";
import { Image, Menu, X } from "lucide-react";
import AuthModal from "@/layout/platform/navbar/authModal";
import useTokenStore from "@/store/platform/useToken";
import useToken from "@/store/platform/useToken";
import { Link, useLocation, useNavigate } from "react-router";
import { useCustomQuery } from "@/hooks/platform/usePlatformQuery";
import toast from "react-hot-toast";
import { resolveSectionUrlSegment } from "@/utils/sectionUrl";

const Navbar: React.FC = () => {
  const { data, isLoading } = useCustomQuery("/core/footer/", ["footer"]);
  const { data: footer, isLoading: footerLoading } = useCustomQuery(
    "/core/footer/",
    ["footer"],
  );
  const headerData = data?.data;
  const footerData = footer?.data;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";
  const activeSectionSegment = (() => {
    if (!normalizedPath.startsWith("/sections/")) return null;
    const rest = normalizedPath.slice("/sections/".length);
    const raw = rest.split("/").filter(Boolean)[0];
    if (raw == null) return null;
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  })();
  const isDiscoverAllActive = normalizedPath === "/";

  const { data: sectionsRes } = useCustomQuery("/training/students/sections/", [
    "sections",
  ]);
  const trainingSections = sectionsRes?.data as
    | { id: string; title?: string }[]
    | undefined;
  const footerLinks = footerData?.links ?? [];
  const sectionNavSegment = (item: { id: string; title?: string }) =>
    resolveSectionUrlSegment(item, trainingSections, footerLinks);
  const isSectionNavActive = (item: { id: string; title?: string }) =>
    activeSectionSegment != null &&
    sectionNavSegment(item) === activeSectionSegment;

  const navActiveClass =
    "cursor-pointer px-5 py-2 rounded-lg text-white font-medium shadow-sm hover:shadow-md bg-[linear-gradient(to_right,var(--brand),var(--brand-light),var(--brand))] bg-size-[200%_100%] bg-left hover:bg-right transition-all duration-700";
  const navInactiveClass =
    "cursor-pointer relative overflow-hidden px-5 py-2 rounded-lg text-gray-700 font-medium group";

  const mobileNavActiveClass =
    "cursor-pointer w-full text-right px-4 py-3 rounded-xl text-white font-medium shadow-md bg-[linear-gradient(to_right,var(--brand),var(--brand-light),var(--brand))] bg-size-[200%_100%] bg-left hover:bg-right transition-all duration-700";
  const mobileNavInactiveClass =
    "cursor-pointer w-full text-right px-4 py-3 rounded-xl bg-white shadow-sm border border-gray-100 text-gray-700 font-medium hover:bg-yellow-50 hover:text-yellow-700 transition-all duration-200";
  const clearTokens = useToken((state) => state.clearTokens);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const isLoggedIn = useTokenStore((state) => state.isLoggedIn);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLogin = () => {
    setShowAuthModal(false);
  };
  const handleLogout = () => {
    setShowAuthModal(false);
    clearTokens();
    navigate("/");
    toast.success("تم تسجيل الخروج بنجاح");
    window.location.reload();
  };
  const handleLoginClick = () => {
    setShowAuthModal(true);
  };

  useEffect(() => {
    if (headerData) {
      document.title = headerData?.platform_name;

      const link =
        document.querySelector("link[rel='icon']") ||
        document.createElement("link");

      link.setAttribute("rel", "icon");
      link.setAttribute("href", headerData?.logo);
      document.head.appendChild(link);
    }
  }, [headerData, isLoading]);

  if (footerLoading) return null;
  return (
    <>
      <nav className="h-20 bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="h-full max-w-440 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-4 items-center h-full">
            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={() => navigate("/")}
                className="cursor-pointer flex items-center space-x-2"
              >
                <div className="flex items-center space-x-3">
                  {headerData?.logo ? (
                    <div className="flex items-center justify-center w-15 h-15">
                      <img
                        loading="lazy"
                        className="w-full h-full"
                        src={headerData?.logo}
                        alt="logo"
                      />
                    </div>
                  ) : (
                    <Image className="rounded-xl w-10 h-10 text-gray-600" />
                  )}
                  <div className="text-right">
                    <h1 className="text-xl font-bold whitespace-nowrap bg-linear-to-r from-(--brand) to-(--brand-light) bg-clip-text text-transparent">
                      {headerData?.platform_name || "اسم المنصة"}
                    </h1>
                    <p className="text-xs text-gray-500">
                      {headerData?.slogan || "شعار المنصة"}
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="col-span-2 flex justify-center">
              <div className="hidden lg:flex items-center space-x-8">
                {footerData?.links?.slice(0, 2).map((item: any) => (
                  <button
                    key={item.id}
                    onClick={() =>
                      navigate(`/sections/${sectionNavSegment(item)}`)
                    }
                    className={
                      isSectionNavActive(item)
                        ? navActiveClass
                        : navInactiveClass
                    }
                  >
                    {!isSectionNavActive(item) && (
                      <span className="absolute inset-0 bg-linear-to-r from-(--brand) to-(--brand-light) opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"></span>
                    )}
                    <span
                      className={
                        isSectionNavActive(item)
                          ? "relative z-10"
                          : "relative z-10 transition-colors duration-300 ease-out group-hover:text-white"
                      }
                    >
                      {item.title}
                    </span>
                  </button>
                ))}

                {footerData?.links?.length > 3 && (
                  <Link
                    to="/"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/", { replace: false });
                      setTimeout(() => {
                        const el = document.getElementById("courses-results");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                    }}
                    className={
                      isDiscoverAllActive ? navActiveClass : navInactiveClass
                    }
                  >
                    {!isDiscoverAllActive && (
                      <span className="absolute inset-0 bg-linear-to-r from-(--brand) to-(--brand-light) opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"></span>
                    )}
                    <span
                      className={
                        isDiscoverAllActive
                          ? "relative z-10"
                          : "relative z-10 transition-colors duration-300 ease-out group-hover:text-white"
                      }
                    >
                      عرض الكل
                    </span>
                  </Link>
                )}
              </div>
            </div>

            {/* Auth and User Actions */}
            <div className="flex justify-end items-center space-x-4">
              {isLoggedIn ? (
                <div className="relative">
                  {/* Avatar button */}
                  <button
                    onClick={() => {
                      if (isMenuOpen) {
                        setIsMenuOpen(false);
                      }
                      setOpen(!open);
                    }}
                    className="w-12 h-12 rounded-full text-xs text-white font-bold bg-[linear-gradient(to_right,var(--brand),var(--brand-light),var(--brand))] bg-size-[200%_100%] bg-left hover:bg-right transition-all duration-700 flex items-center justify-center cursor-pointer"
                  >
                    حسابي
                  </button>

                  {/* Dropdown */}
                  {open && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                      <Link
                        to="/profile"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate("/profile", { replace: false });
                          setOpen(false);
                        }}
                        className="block w-full text-right px-5 py-3 text-sm text-gray-700 hover:bg-linear-to-r hover:from-(--brand) hover:to-(--brand-light) hover:text-white transition-all"
                      >
                        الملف الشخصي
                      </Link>

                      <Link
                        to="/all-courses"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate("/all-courses", { replace: false });
                          setOpen(false);
                        }}
                        className="block w-full text-right px-5 py-3 text-sm text-gray-700 hover:bg-linear-to-r hover:from-(--brand) hover:to-(--brand-light) hover:text-white transition-all"
                      >
                        دوراتي
                      </Link>

                      <div className="border-t border-gray-100" />

                      <button
                        onClick={handleLogout}
                        className="cursor-pointer curblock w-full text-right px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-all"
                      >
                        تسجيل الخروج
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="cursor-pointer text-white px-4 py-2 rounded-lg font-medium bg-[linear-gradient(to_right,var(--brand),var(--brand-light),var(--brand))] bg-size-[200%_100%] bg-left hover:bg-right transition-all duration-700 transform hover:scale-105"
                >
                  تسجيل الدخول
                </button>
              )}

              {/* Mobile menu button */}
              {footerData?.links && (
                <button
                  onClick={() => {
                    setIsMenuOpen(!isMenuOpen);
                    if (open) setOpen(false);
                  }}
                  className="cursor-pointer lg:hidden p-2 text-gray-600 hover:text-(--brand) hover:bg-gray-50 rounded-lg transition-all duration-200"
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
            <div className="lg:hidden py-4 border-t border-gray-100 bg-white to-white shadow-lg rounded-b-2xl animate-slideDown">
              <div className="flex flex-col space-y-3 px-4">
                {footerData?.links?.slice(0, 3).map((item: any) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate(`/sections/${sectionNavSegment(item)}`);
                    }}
                    className={
                      isSectionNavActive(item)
                        ? mobileNavActiveClass
                        : mobileNavInactiveClass
                    }
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
                        const el = document.getElementById("courses-results");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                      setIsMenuOpen(false);
                    }}
                    className={
                      isDiscoverAllActive
                        ? mobileNavActiveClass
                        : mobileNavInactiveClass
                    }
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
