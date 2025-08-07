import Navbar from "@/layout/platform/navbar/navbar";
import Footer from "@/layout/platform/footer/footer";
import { Outlet } from "react-router";
// import { useTranslation } from "react-i18next";

import ScrollToTop from "@/components/scrollToTop";
import GlobalLoading from "@/components/platform/globalLoading";

export const PlatformLayout = () => {
  // const { i18n } = useTranslation();
  return (
    <div className="min-h-screen" dir="rtl">
      <GlobalLoading />
      <ScrollToTop />
      {/* Navbar */}
      <Navbar />
      {/* Main Content */}
      <div className="flex-1">
        <div className="min-h-screen relative overflow-hidden" dir="rtl">
          <div className="relative z-10">{<Outlet />}</div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};
