import Navbar from "@/layout/platform/navbar/navbar";
import Footer from "@/layout/platform/footer/footer";
import { Outlet } from "react-router";
// import { useTranslation } from "react-i18next";

import ScrollToTop from "@/components/scrollToTop";
import GlobalLoading from "@/components/platform/globalLoading";
import DisableDevtool from "disable-devtool";
import devtools from "devtools-detect";

const isProduction = import.meta.env.MODE === "production"; // ✅ check env

if (isProduction) {
  document.onkeydown = function (e: any) {
    if (e.keyCode == 123) {
      return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == "I".charCodeAt(0)) {
      return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == "J".charCodeAt(0)) {
      return false;
    }
    if (e.ctrlKey && e.keyCode == "U".charCodeAt(0)) {
      return false;
    }
    // if (e.ctrlKey && e.keyCode == "C".charCodeAt(0)) {
    //   return false;
    // }
    if (e.ctrlKey && e.keyCode == "X".charCodeAt(0)) {
      return false;
    }
    if (e.ctrlKey && e.keyCode == "Y".charCodeAt(0)) {
      return false;
    }
    if (e.ctrlKey && e.keyCode == "Z".charCodeAt(0)) {
      return false;
    }
    // if (e.ctrlKey && e.keyCode == "V".charCodeAt(0)) {
    //   return false;
    // }
    if (e.keyCode == 67 && e.shiftKey && (e.ctrlKey || e.metaKey)) {
      return false;
    }
    if (
      e.keyCode == "J".charCodeAt(0) &&
      e.altKey &&
      (e.ctrlKey || e.metaKey)
    ) {
      return false;
    }
    if (
      e.keyCode == "I".charCodeAt(0) &&
      e.altKey &&
      (e.ctrlKey || e.metaKey)
    ) {
      return false;
    }
    if (
      (e.keyCode == "V".charCodeAt(0) && e.metaKey) ||
      (e.metaKey && e.altKey)
    ) {
      return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == "C".charCodeAt(0)) {
      return false;
    }
    if (e.ctrlKey && e.keyCode == "S".charCodeAt(0)) {
      return false;
    }
    if (e.ctrlKey && e.keyCode == "H".charCodeAt(0)) {
      return false;
    }
    if (e.ctrlKey && e.keyCode == "A".charCodeAt(0)) {
      return false;
    }
    if (e.ctrlKey && e.keyCode == "F".charCodeAt(0)) {
      return false;
    }
    if (e.ctrlKey && e.keyCode == "E".charCodeAt(0)) {
      return false;
    }
  };

  if (document.addEventListener) {
    document.addEventListener(
      "contextmenu",
      function (e) {
        e.preventDefault();
      },
      false
    );
  } else {
    // For very old IE browsers, fallback to setting oncontextmenu directly
    document.oncontextmenu = function () {
      return false;
    };
  }

  if (devtools.isOpen) {
    DisableDevtool({ url: "https://youtu.be/ZJcR20KjVJM?t=20" });
  } else {
    DisableDevtool({ url: "https://youtu.be/ZJcR20KjVJM?t=20" });
  }
}

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
