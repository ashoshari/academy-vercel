import AnimatedBackground from "@/components/login/AnimatedBackground";
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  ArrowRight,
  Building2,
  Clock,
  Users,
  Code,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router";

const ContactPage = () => {
  const navigate = useNavigate();
  const contactInfo = [
    {
      icon: Phone,
      label: "رقم الهاتف",
      value: "+962 7 9100 3360",
      action: "tel:+962791003360",
    },
    {
      icon: Mail,
      label: "البريد الإلكتروني",
      value: "contact@vision-jo.com",
      action: "mailto:contact@vision-jo.com",
    },
    {
      icon: Globe,
      label: "الموقع الإلكتروني",
      value: "www.techvision.dev",
      action: "https://www.techvision.dev",
    },
    {
      icon: MapPin,
      label: "عنوان المكتب",
      value: "عمان - الأردن",
      action: null,
    },
  ];

  const features = [
    {
      icon: Code,
      title: "تطوير متقدم",
      description: "حلول برمجية مبتكرة تلبي احتياجاتك",
    },
    {
      icon: Users,
      title: "فريق خبير",
      description: "مطورون محترفون بخبرة واسعة",
    },
    {
      icon: Zap,
      title: "أداء عالي",
      description: "تطبيقات سريعة وموثوقة",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
      <AnimatedBackground />
      <div className="relative z-10">
        <div className="min-h-screen p-4">
          {/* Navigation */}
          <div className="absolute top-6 left-6">
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 px-6 py-3 text-(--brand) hover:text-(--brand-light) hover:bg-white/60 rounded-xl transition-all duration-300 backdrop-blur-md shadow-lg border border-(--brand)"
            >
              <ArrowRight size={20} />
              <span className="font-medium">تسجيل الدخول</span>
            </button>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16 pt-20">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-linear-to-br from-(--brand) to-(--brand-light) rounded-2xl mb-8 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <Building2 className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
                Supervision Software
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                شركة متخصصة في تطوير الحلول البرمجية المتقدمة والمنصات التعليمية
                الحديثة
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-start">
              {/* Contact Information */}
              <div className="space-y-10">
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-(--brand) transform hover:scale-[1.02] transition-all duration-300">
                  <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-4">
                    <Phone className="w-8 h-8 text-(--brand)" />
                    معلومات التواصل
                  </h2>

                  <div className="space-y-6">
                    {contactInfo.map((item, index) => (
                      <div key={index} className="group">
                        {item.action ? (
                          <a
                            href={item.action}
                            className="flex items-center gap-6 p-6 rounded-2xl hover:bg-orange-50/80 transition-all duration-300 border-2 border-transparent hover:border-(--brand) transform hover:scale-[1.02]"
                          >
                            <div className="flex items-center justify-center w-16 h-16 bg-orange-100/80 rounded-xl group-hover:bg-orange-200/80 transition-colors shadow-lg">
                              <item.icon className="w-8 h-8 text-(--brand)" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-500 mb-1">
                                {item.label}
                              </p>
                              <p className="text-xl font-bold text-gray-800 group-hover:text-(--brand) transition-colors">
                                {item.value}
                              </p>
                            </div>
                          </a>
                        ) : (
                          <div className="flex items-center gap-6 p-6 rounded-2xl">
                            <div className="flex items-center justify-center w-16 h-16 bg-orange-100/80 rounded-xl shadow-lg">
                              <item.icon className="w-8 h-8 text-(--brand)" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-500 mb-1">
                                {item.label}
                              </p>
                              <p className="text-xl font-bold text-gray-800">
                                {item.value}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Working Hours */}
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-(--brand) transform hover:scale-[1.02] transition-all duration-300">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-4">
                    <Clock className="w-7 h-7 text-(--brand)" />
                    ساعات العمل
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-(--brand)">
                      <span className="text-gray-600 text-lg">
                        الأحد - الخميس
                      </span>
                      <span className="font-bold text-gray-800 text-lg">
                        9:00 ص - 6:00 م
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-gray-600 text-lg">
                        الجمعة - السبت
                      </span>
                      <span className="font-bold text-gray-800 text-lg">
                        مغلق
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features & About */}
              <div className="space-y-10">
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-(--brand) transform hover:scale-[1.02] transition-all duration-300">
                  <h2 className="text-3xl font-bold text-gray-800 mb-8">
                    لماذا نحن؟
                  </h2>
                  <div className="space-y-8">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-6">
                        <div className="flex items-center justify-center w-16 h-16 bg-orange-100/80 rounded-xl shrink-0 shadow-lg">
                          <feature.icon className="w-8 h-8 text-(--brand)" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800 mb-2 text-xl">
                            {feature.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed text-lg">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* About Section */}
                <div className="bg-linear-to-br from-orange-500/95 to-orange-600/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 text-white border border-(--brand) transform hover:scale-[1.02] transition-all duration-300">
                  <h2 className="text-3xl font-bold mb-6">عن الشركة</h2>
                  <p className="text-(--brand) leading-relaxed mb-8 text-lg">
                    نحن في Supervision Software نركز على تقديم حلول تقنية متطورة
                    ومنصات تعليمية تفاعلية تساعد المؤسسات والأفراد على تحقيق
                    أهدافهم التعليمية والمهنية بكفاءة عالية.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
                      <span className="font-semibold">تطوير الويب</span>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
                      <span className="font-semibold">المنصات التعليمية</span>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
                      <span className="font-semibold">الحلول المخصصة</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-16 text-center">
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-(--brand) transform hover:scale-[1.02] transition-all duration-300">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  هل تحتاج مساعدة؟
                </h2>
                <p className="text-gray-600 mb-10 text-lg">
                  فريقنا مستعد لمساعدتك في أي استفسار أو مشكلة تقنية
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <a
                    href="tel:+962791003360"
                    className="bg-linear-to-r from-(--brand) to-(--brand-light) text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-(--brand-light) hover:to-(--brand) transition-all duration-300 transform hover:scale-[1.05] shadow-xl hover:shadow-2xl"
                  >
                    اتصل بنا الآن
                  </a>
                  <a
                    href="mailto:contact@vision-jo.com"
                    className="border-2 border-(--brand) text-(--brand) px-8 py-4 rounded-xl font-semibold text-lg hover:bg-orange-50/80 transition-all duration-300 backdrop-blur-sm transform hover:scale-[1.05] shadow-lg"
                  >
                    راسلنا عبر البريد
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
