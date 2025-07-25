import React from 'react';
import { GraduationCap, Phone, Mail, MapPin, Facebook, Instagram, Youtube, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div className="text-right">
                <h3 className="text-xl font-bold text-yellow-400">منصة التوجيهي</h3>
                <p className="text-sm text-gray-300">نحو التفوق</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              منصتك الشاملة للتفوق في التوجيهي. نوفر أفضل الدورات والمواد التعليمية لضمان نجاحك وتحقيق أحلامك الجامعية.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-yellow-400">روابط سريعة</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors duration-200">الدورات</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors duration-200">الدوسيات</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors duration-200">الامتحانات الالكترونية</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors duration-200">الاسئلة الوزارية</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors duration-200">دورات التأسيس</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-yellow-400">تواصل معنا</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-300 text-sm">+962 7 9999 9999</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-300 text-sm">info@tawjihi-platform.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-300 text-sm">عمان، الأردن</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-yellow-400">تابعنا</h4>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors duration-200">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center hover:bg-pink-700 transition-colors duration-200">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center hover:bg-red-700 transition-colors duration-200">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors duration-200">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
            <p className="text-gray-400 text-xs">
              انضم لآلاف الطلاب الذين حققوا التفوق معنا
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 منصة التوجيهي. جميع الحقوق محفوظة.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors duration-200">
              سياسة الخصوصية
            </a>
            <a href="#" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors duration-200">
              الشروط والأحكام
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;