import React, { useState } from "react";
import { Eye, EyeOff, Phone, Lock, Mail } from "lucide-react";
import { useNavigate } from "react-router";
import AnimatedBackground from "@/components/login/AnimatedBackground";
import { useCustomPost } from "@/hooks/useMutation";
import { storeTokens } from "@/services/auth";
import useAuth from "@/store/useAuth";

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
          await storeTokens(
            res.data.tokens.access,
            onNavigate,
            setIsAuthenticated
          );

          localStorage.setItem("user", JSON.stringify(res?.data?.user));
        } else {
          setError(res.error);
        }
      })
      .catch((error) => {
        setError(error?.response?.data?.error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
      <AnimatedBackground />
      <div className="relative z-10">
        <div className="min-h-screen flex items-center justify-center p-4">
          {/* Navigation */}
          <div className="absolute top-6 left-6">
            <button
              onClick={() => onNavigate("/contact")}
              className="flex items-center gap-2 px-6 py-3 text-orange-600 hover:text-orange-700 hover:bg-white/60 rounded-xl transition-all duration-300 backdrop-blur-md shadow-lg border border-orange-200/30"
            >
              <Mail size={20} />
              <span className="font-medium">تواصل معنا</span>
            </button>
          </div>

          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-6 shadow-2xl transform hover:scale-105 transition-transform duration-300">
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
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-orange-100/50 transform hover:scale-[1.02] transition-all duration-300">
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
                    <Phone className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-orange-500 transition-colors" />
                    <input
                      id="phone"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pr-12 pl-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-right bg-white/90 backdrop-blur-sm hover:border-orange-300 text-lg"
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
                    <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-orange-500 transition-colors" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pr-12 pl-14 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-right bg-white/90 backdrop-blur-sm hover:border-orange-300 text-lg"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-600 transition-colors p-1"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl"
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
                    className="text-orange-600 hover:text-orange-700 font-semibold transition-colors hover:underline"
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
                <span className="font-bold text-orange-600 text-lg">
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
