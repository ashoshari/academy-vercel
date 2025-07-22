import { Users, BookOpen, Image } from "lucide-react";
import { useState } from "react";

const Dashboard = () => {
  // Sample data for slider items
  const [sliderItems, _] = useState<any[]>([
    {
      id: 1,
      type: "image",
      title: "مرحباً بكم في منصتنا التعليمية",
      subtitle: "تعلم مع أفضل المعلمين والدورات المتخصصة في جميع المجالات",
      mediaUrl:
        "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=800",
      isActive: true,
      isEnabled: true,
      order: 1,
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      type: "video",
      title: "دورات متقدمة في جميع التخصصات",
      subtitle: "احصل على شهادات معتمدة من خبراء المجال مع تدريب عملي",
      mediaUrl:
        "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
      isActive: true,
      isEnabled: true,
      order: 2,
      createdAt: "2024-01-14",
    },
    {
      id: 3,
      type: "image",
      title: "تعلم في أي وقت ومن أي مكان",
      subtitle: "منصة تعليمية متاحة 24/7 لجميع الطلاب مع دعم فني متواصل",
      mediaUrl:
        "https://images.pexels.com/photos/4145190/pexels-photo-4145190.jpeg?auto=compress&cs=tinysrgb&w=800",
      isActive: false,
      isEnabled: true,
      order: 3,
      createdAt: "2024-01-13",
    },
    {
      id: 4,
      type: "video",
      title: "تقنيات التعلم الحديثة",
      subtitle: "استخدم أحدث التقنيات في التعلم التفاعلي والذكي",
      mediaUrl:
        "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
      isActive: true,
      isEnabled: false,
      order: 4,
      createdAt: "2024-01-12",
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          مرحبًا بك في لوحة التحكم
        </h1>
        <p className="text-gray-600 text-sm">
          من هنا يمكنك إدارة جميع جوانب المنصة التعليمية بسهولة وفعالية
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">إجمالي الطلاب</p>
              <p className="text-3xl font-bold">1,247</p>
              <p className="text-orange-200 text-xs">+12% من الشهر الماضي</p>
            </div>
            <Users className="w-12 h-12 text-orange-200" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl p-6 shadow-lg border border-orange-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">الدورات النشطة</p>
              <p className="text-3xl font-bold text-gray-800">89</p>
              <p className="text-green-600 text-xs">+5 دورات جديدة</p>
            </div>
            <BookOpen className="w-12 h-12 text-orange-500" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl p-6 shadow-lg border border-orange-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">المعلمين</p>
              <p className="text-3xl font-bold text-gray-800">24</p>
              <p className="text-blue-600 text-xs">3 معلمين جدد</p>
            </div>
            <Users className="w-12 h-12 text-orange-500" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl p-6 shadow-lg border border-orange-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">السلايدات</p>
              <p className="text-3xl font-bold text-gray-800">
                {sliderItems.length}
              </p>
              <p className="text-green-600 text-xs">
                {sliderItems.filter((s) => s.isActive).length} نشطة
              </p>
            </div>
            <Image className="w-12 h-12 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            الإيرادات الشهرية
          </h2>
          <div className="h-64 flex items-end justify-between gap-2">
            {[65, 45, 78, 52, 89, 67, 94, 73, 85, 91, 76, 88].map(
              (height, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg transition-all duration-500 hover:from-orange-600 hover:to-orange-500"
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2">
                    {index + 1}
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Activity Chart */}
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
          <h2 className="text-lg font-bold text-gray-800 mb-4">نشاط الطلاب</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">الدورات المكتملة</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full">
                  <div className="w-3/4 h-full bg-orange-500 rounded-full"></div>
                </div>
                <span className="text-sm font-medium">75%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">الواجبات المسلمة</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full">
                  <div className="w-4/5 h-full bg-green-500 rounded-full"></div>
                </div>
                <span className="text-sm font-medium">82%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">الحضور</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full">
                  <div className="w-5/6 h-full bg-blue-500 rounded-full"></div>
                </div>
                <span className="text-sm font-medium">89%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">التفاعل</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full">
                  <div className="w-2/3 h-full bg-purple-500 rounded-full"></div>
                </div>
                <span className="text-sm font-medium">67%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          النشاطات الحديثة
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50/50 transition-colors">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-gray-800 font-medium text-sm">
                تم إضافة سلايد جديد للصفحة الرئيسية
              </p>
              <p className="text-gray-500 text-xs">منذ دقيقتين</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50/50 transition-colors">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-gray-800 font-medium text-sm">
                تم تسجيل طالب جديد: أحمد محمد
              </p>
              <p className="text-gray-500 text-xs">منذ 5 دقائق</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50/50 transition-colors">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-gray-800 font-medium text-sm">
                تم رفع محاضرة جديدة في الفيزياء
              </p>
              <p className="text-gray-500 text-xs">منذ 15 دقيقة</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50/50 transition-colors">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-gray-800 font-medium text-sm">
                تم إضافة معلم جديد: د. سارة أحمد
              </p>
              <p className="text-gray-500 text-xs">منذ ساعة</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
