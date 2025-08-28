import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";

import { removeTokens, readUserFromStorage, roleOf } from "@/services/auth";
import useAuth from "@/store/useAuth";
import {
  Menu,
  X,
  LogOut,
  Home,
  Settings,
  Users,
  Library,
  GraduationCap,
  BookOpen,
  CreditCard,
  Hash,
  Layers,
  FolderTree,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import AnimatedBackground from "@/components/login/AnimatedBackground";

const Layout = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [smallScreen, setSmallScreen] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setSmallScreen(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const user = readUserFromStorage();
  const role = roleOf(user) ?? "";

  const menuItems = [
    { id: "", label: "الرئيسية", icon: Home },
    { id: "students", label: "الطلاب", icon: GraduationCap },
    { id: "teachers", label: "المعلمين", icon: Users },
    { id: "libraries", label: "المكتبات", icon: Library },
    { id: "courses", label: "الدورات", icon: BookOpen },
    { id: "exams", label: "الامتحانات", icon: BookOpen },
    { id: "files", label: "الملفات", icon: Upload },
    { id: "slider", label: "السلايدر", icon: ImageIcon },
    { id: "sections", label: "الأقسام الرئيسية", icon: Layers },
    { id: "sub-sections", label: "الأقسام الفرعية", icon: FolderTree },
    { id: "card-pricing", label: "أسعار البطاقات", icon: CreditCard },
    {
      id: "custom-card-pricing",
      label: "أسعار البطاقات المخصصة",
      icon: CreditCard,
    },
    { id: "card-codes", label: "كودات البطاقات", icon: Hash },
    // { id: "reports", label: "التقارير", icon: BarChart3 },
  ];

  const LIBRARY_ALLOWED = new Set(["", "card-codes"]);
  const filteredMenuItems =
    role === "library"
      ? menuItems.filter((i) => LIBRARY_ALLOWED.has(i.id))
      : menuItems;

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* Sidebar */}
      <div
        className={`${smallScreen && sidebarOpen ? "fixed z-100 h-full" : ""} ${
          sidebarOpen ? "min-w-64" : "min-w-16"
        } transition-all duration-300 bg-white/95 backdrop-blur-xl shadow-lg border-l border-orange-100/50`}
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            {sidebarOpen && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Settings className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-800 text-sm">
                    لوحة التحكم
                  </h2>
                  <p className="text-xs text-gray-500">مدير النظام</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="cursor-pointer p-2 rounded-lg hover:bg-orange-50 transition-colors"
            >
              {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>

          {/* Menu Items */}
          <nav className="space-y-1">
            {filteredMenuItems.map((item) => (
              <NavLink
                to={item.id ? `/dashboard/${item.id}` : "/dashboard"}
                key={item.id || "dashboard-root"}
                end={!item.id}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 ${
                    sidebarOpen ? "p-3" : "p-1.5 my-2"
                  } rounded-lg transition-all duration-300 text-sm ${
                    isActive
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                  }`
                }
              >
                <item.icon size={20} className="min-w-[20px]" />
                {sidebarOpen && (
                  <span className="font-medium">{item.label}</span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="mt-6 pt-6 border-t border-orange-100">
            <button
              onClick={() => {
                removeTokens(navigate, setIsAuthenticated);
              }}
              className={`w-full flex items-center gap-3 cursor-pointer ${
                sidebarOpen ? "p-3" : "p-1.5 my-2"
              } rounded-lg text-red-600 hover:bg-red-50 transition-all duration-300 text-sm`}
            >
              <LogOut size={20} />
              {sidebarOpen && <span className="font-medium">تسجيل الخروج</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="min-h-screen relative overflow-auto" dir="rtl">
          <AnimatedBackground />
          <div className="relative z-10">{<Outlet />}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
