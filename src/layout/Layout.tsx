import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";

// import { useTranslation } from "react-i18next";
import { removeTokens } from "@/services/auth";
import useAuth from "@/store/useAuth";
import {
  Menu,
  X,
  LogOut,
  Home,
  Settings,
  // Image,
  // Layers,
  // FolderTree,
  Users,
  // CreditCard,
  // Hash,
  GraduationCap,
  BookOpen,
  CreditCard,
  Hash,
  // Upload,
  // BarChart3,
} from "lucide-react";
import AnimatedBackground from "@/components/login/AnimatedBackground";

const Layout = () => {
  // const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();
  // const [currentPage, setCurrentPage] = useState<DashboardPage>("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Sample data for card pricing - SIMPLIFIED
  // const [cardPricing, setCardPricing] = useState<any[]>([
  //   {
  //     id: 1,
  //     price: 20.0,
  //     isActive: true,
  //     createdAt: "2024-01-01",
  //   },
  //   {
  //     id: 2,
  //     price: 50.0,
  //     isActive: true,
  //     createdAt: "2024-01-05",
  //   },
  //   {
  //     id: 3,
  //     price: 15.0,
  //     isActive: false,
  //     createdAt: "2024-01-10",
  //   },
  //   {
  //     id: 4,
  //     price: 75.0,
  //     isActive: true,
  //     createdAt: "2024-01-12",
  //   },
  // ]);

  // Sample data for students
  // const [students, setStudents] = useState<any[]>([]);

  const menuItems = [
    { id: "", label: "الرئيسية", icon: Home },
    { id: "students", label: "الطلاب", icon: GraduationCap },
    { id: "teachers", label: "المعلمين", icon: Users },
    { id: "courses", label: "الدورات", icon: BookOpen },
    // { id: "exams", label: "الامتحانات", icon: BookOpen },
    // { id: "files", label: "الملفات", icon: Upload },
    // { id: "slider", label: "السلايدر", icon: Image },
    // { id: "sections", label: "الأقسام الرئيسية", icon: Layers },
    // { id: "subsections", label: "الأقسام الفرعية", icon: FolderTree },
    { id: "card-pricing", label: "أسعار البطاقات", icon: CreditCard },
    { id: "card-codes", label: "كودات البطاقات", icon: Hash },
    // { id: "reports", label: "التقارير", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* Sidebar */}
      <div
        className={`${
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
              className="p-2 rounded-lg hover:bg-orange-50 transition-colors"
            >
              {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>

          {/* Menu Items */}
          <nav className="space-y-1">
            {menuItems.map((item) => (
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
                console.log("removeTokens");
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
        <div className="min-h-screen relative overflow-hidden" dir="rtl">
          <AnimatedBackground />
          <div className="relative z-10">{<Outlet />}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
