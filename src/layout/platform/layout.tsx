import Navbar from "@/layout/platform/navbar/navbar";
import Footer from "@/layout/platform/footer/footer";
import { Outlet } from "react-router";

export const PlatformLayout = () => {
  
  return (
    <div className="min-h-screen" dir="rtl">
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
