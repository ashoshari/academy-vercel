import { useEffect, useState } from "react";
import { Image, User } from "lucide-react";
import { Link, useNavigate } from "react-router";
import AuthModal from "@/layout/platform/authModal/AuthModal";
import { useCustomQuery } from "@/hooks/platform/usePlatformQuery";
import useTokenStore from "@/store/platform/useToken";
import useToken from "@/store/platform/useToken";
import toast from "react-hot-toast";

export default function HeroNavbar() {
  const { data, isLoading } = useCustomQuery("/core/footer/", ["footer"]);
  const headerData = data?.data;
  const navigate = useNavigate();
  const clearTokens = useToken((state) => state.clearTokens);
  const isLoggedIn = useTokenStore((state) => state.isLoggedIn);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [open, setOpen] = useState(false);

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

  const handleLogout = () => {
    setOpen(false);
    clearTokens();
    navigate("/");
    toast.success("تم تسجيل الخروج بنجاح");
    window.location.reload();
  };

  return (
    <>
      <header className="absolute inset-x-0 top-5 z-40 pointer-events-none h-20">
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-full">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="pointer-events-auto cursor-pointer flex items-center space-x-2"
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
                  <h1 className="text-xl font-bold whitespace-nowrap text-(--brand)">
                    {headerData?.platform_name || "اسم المنصة"}
                  </h1>
                  <p className="text-xs text-white">
                    {headerData?.slogan || "شعار المنصة"}
                  </p>
                </div>
              </div>
            </button>

            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <div className="pointer-events-auto relative">
                  <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="w-12 h-12 rounded-full text-xs text-white font-bold bg-[linear-gradient(to_right,var(--brand),var(--brand-light),var(--brand))] bg-size-[200%_100%] bg-left hover:bg-right transition-all duration-700 flex items-center justify-center cursor-pointer"
                  >
                    حسابي
                  </button>

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
                        type="button"
                        onClick={handleLogout}
                        className="cursor-pointer block w-full text-right px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-all"
                      >
                        تسجيل الخروج
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAuthModal(true)}
                  className="pointer-events-auto cursor-pointer inline-flex items-center justify-center gap-2.5 h-11 px-9 rounded-full border border-white bg-transparent text-white text-[13px] font-normal tracking-[0.08em] hover:bg-white/10 transition-colors"
                >
                  <User className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                  <span>تسجيل الدخول</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={() => setShowAuthModal(false)}
      />
    </>
  );
}
