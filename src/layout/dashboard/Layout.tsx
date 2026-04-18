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
import { useCustomQuery } from "@/hooks/useQuery";

const DASHBOARD_ROLE_LABEL_AR: Record<string, string> = {
  library: "مكتبة",
  admin: "مسؤول",
  teacher: "معلّم",
};

const Layout = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [smallScreen, setSmallScreen] = useState(false);
  const { data, isLoading } = useCustomQuery("/core/footer/", ["footer"]);

  const headerData = data?.data;

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
  const roleLabelAr = DASHBOARD_ROLE_LABEL_AR[role] ?? role;

  const menuItems = [
    { id: "", label: "الرئيسية", icon: Home },
    { id: "sales", label: "المبيعات", icon: Home },
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
  const TEACHER_DISALLOWED = new Set([
    "teachers",
    "students",
    "libraries",
    "slider",
    "sections",
    "sub-sections",
    "card-pricing",
    "custom-card-pricing",
    "card-codes",
  ]);
  const ADMIN_DISALLOWED = new Set(["sales"]);

  const filteredMenuItems =
    role === "library"
      ? menuItems.filter((i) => LIBRARY_ALLOWED.has(i.id))
      : role === "admin"
        ? menuItems.filter((i) => !ADMIN_DISALLOWED.has(i.id))
        : role === "teacher"
          ? menuItems.filter((i) => !TEACHER_DISALLOWED.has(i.id))
          : menuItems;

  useEffect(() => {
    if (headerData) {
      document.title = "Dashboard";

      const link =
        document.querySelector("link[rel='icon']") ||
        document.createElement("link");

      link.setAttribute("rel", "icon");
      link.setAttribute("href", headerData?.logo);
      document.head.appendChild(link);
    }
  }, [headerData, isLoading]);

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* Sidebar */}
      <div
        className={`${smallScreen && sidebarOpen ? "fixed z-100 h-full" : ""} ${
          sidebarOpen ? "min-w-64" : "min-w-16"
        } transition-all duration-300 bg-white/95 backdrop-blur-xl shadow-lg border-l border-(--brand)`}
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            {sidebarOpen && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-linear-to-br from-(--brand) to-(--brand-light) rounded-lg flex items-center justify-center">
                  <Settings className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-800 text-sm">
                    لوحة التحكم
                  </h2>
                  <p className="text-xs text-gray-500">{roleLabelAr}</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
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
                      ? "bg-linear-to-r from-(--brand) to-(--brand-light) text-white shadow-md"
                      : "text-gray-600 hover:bg-(--brand) hover:text-white"
                  }`
                }
              >
                <item.icon size={20} className="min-w-5" />
                {sidebarOpen && (
                  <span className="font-medium">{item.label}</span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="mt-6 pt-6 border-t border-(--brand)">
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
          {/* <AnimatedBackground /> */}
          <div className="relative z-10">{<Outlet />}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
