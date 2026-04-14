import React, { useEffect, useState } from "react";
import { Eye, EyeOff, Phone, Lock, Mail } from "lucide-react";
import { useNavigate } from "react-router";
import AnimatedBackground from "@/components/login/AnimatedBackground";
import { useCustomPost } from "@/hooks/useMutation";
import { storeTokens } from "@/services/auth";
import useAuth from "@/store/useAuth";
import handleErrorAlerts from "@/utils/showErrorMessages";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const onNavigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  const { mutateAsync } = useCustomPost("account/login/");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formdata = new FormData();
    formdata.append("mobile_number", phoneNumber);
    formdata.append("password", password);

    mutateAsync(formdata)
      .then(async (res) => {
        if (res.status) {
          if (
            !["admin", "library", "teacher"].includes(
              res?.data?.user?.type?.name?.toLowerCase(),
            )
          ) {
            toast.error("You are not allowed to access dashboard");
            localStorage.removeItem("user");
          } else {
            await storeTokens(
              res.data.tokens.access,
              onNavigate,
              setIsAuthenticated,
            );

            localStorage.setItem("user", JSON.stringify(res?.data?.user));
          }
        } else {
          setError(res.error);
        }
      })
      .catch((error) => {
        handleErrorAlerts(error?.response?.data?.error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    document.title = "تسجيل الدخول";

    // const link =
    //   document.querySelector("link[rel='icon']") ||
    //   document.createElement("link");

    // link.setAttribute("rel", "icon");
    // link.setAttribute("href", "/favicon.ico");
    // document.head.appendChild(link);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
      <AnimatedBackground />
      <div className="relative z-10">
        <div className="min-h-screen flex items-center justify-center p-4">
          {/* Navigation */}
          <div className="absolute top-6 left-6">
            <button
              onClick={() => onNavigate("/contact")}
              className="cursor-pointer flex items-center gap-2 px-6 py-3 text-(--brand) hover:text-(--brand) hover:bg-white/60 rounded-xl transition-all duration-300 backdrop-blur-md shadow-lg border border-(--brand)"
            >
              <Mail size={20} />
              <span className="font-medium">تواصل معنا</span>
            </button>
          </div>

          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-(--brand) to-(--brand-light) rounded-2xl mb-6 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-3">
                مرحبًا بك
              </h1>
              <p className="text-gray-600 text-lg">
                سجل دخولك للوصول إلى منصتك التعليمية
              </p>
            </div>

            {/* Login Form */}
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-(--brand) transform hover:scale-[1.02] transition-all duration-300">
              {error && (
                <div className="mt-4 text-red-600 text-sm text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Phone Number Field */}
                <div className="space-y-3">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    رقم الهاتف
                  </label>
                  <div className="relative group">
                    <Phone className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-(--brand) transition-colors" />
                    <input
                      id="phone"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => {
                        const onlyNums = e.target.value.replace(/[^0-9]/g, "");
                        setPhoneNumber(onlyNums);
                      }}
                      pattern="^07[0-9]{8}$"
                      maxLength={10}
                      minLength={10}
                      className="w-full pr-12 pl-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all duration-300 text-right bg-white/90 backdrop-blur-sm hover:border-(--brand) text-lg"
                      placeholder="07XXXXXXXX"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-3">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    كلمة المرور
                  </label>
                  <div className="relative group">
                    <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-(--brand) transition-colors" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={6}
                      className="w-full pr-12 pl-14 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all duration-300 text-right bg-white/90 backdrop-blur-sm hover:border-(--brand) text-lg"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="cursor-pointer absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-(--brand) transition-colors p-1"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="cursor-pointer w-full bg-linear-to-r from-(--brand) to-(--brand-light) text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-(--brand-light) hover:to-(--brand) focus:outline-none focus:ring-4 focus:ring-(--brand)/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>جاري تسجيل الدخول...</span>
                    </div>
                  ) : (
                    "تسجيل الدخول"
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                  مواجهة مشكلة في تسجيل الدخول؟{" "}
                  <button
                    onClick={() => onNavigate("/contact")}
                    className="cursor-pointer text-(--brand) hover:text-(--brand) font-semibold transition-colors hover:underline"
                  >
                    تواصل معنا
                  </button>
                </p>
              </div>
            </div>

            {/* Company Branding */}
            <div className="text-center mt-10">
              <p className="text-gray-600">
                مدعوم من{" "}
                <span className="font-bold text-(--brand) text-lg">
                  Supervision Software
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
