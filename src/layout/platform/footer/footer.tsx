import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import {
  RiFacebookBoxLine,
  RiInstagramLine,
  RiYoutubeLine,
  RiSnapchatLine,
  RiTelegram2Line,
} from "react-icons/ri";
import { FaWhatsapp } from "react-icons/fa";
import { PiTiktokLogoLight } from "react-icons/pi";

import { useCustomQuery } from "@/hooks/useQuery";
import { useNavigate } from "react-router";

// interface socialMedia {
//   name: string;
//   icon: React.ElementType;
//   color: string;
//   link: any;
// }
const Footer: React.FC = () => {
  const { data } = useCustomQuery("/core/footer/", ["footer"]);
  const navigate = useNavigate();
  const footerData = data?.data;

  // if (isLoading) {
  //   console.log("loading");
  // } else if (footerData) {
  //     footerData?.links?.map(({ id, title }: { id: string; title: string }) => console.log("id",id," \n name",title))
  // }
  const socialMediaData: any = [
    {
      name: "Facebook",
      icon: RiFacebookBoxLine,
      color: "bg-blue-600",
      hover: "bg-blue-700",
      link:
        Object.entries(footerData || {}).find(
          ([key, _value]) =>
            key.toLowerCase().replace("_url", "") === "facebook"
        )?.[1] || null,
    },
    {
      name: "Instagram",
      icon: RiInstagramLine,
      color: "bg-pink-600",
      hover: "opacity-90",
      link:
        Object.entries(footerData || {}).find(
          ([key, _value]) =>
            key.toLowerCase().replace("_url", "") === "instagram"
        )?.[1] || null,
    },
    {
      name: "Youtube",
      icon: RiYoutubeLine,
      color: "bg-red-600",
      hover: "bg-red-700",
      link:
        Object.entries(footerData || "").find(
          ([key, _value]) => key.toLowerCase().replace("_url", "") === "youtube"
        )?.[1] || null,
    },
    {
      name: "Snapchat",
      icon: RiSnapchatLine,
      color: "bg-yellow-400",
      hover: "bg-yellow-500",
      link:
        Object.entries(footerData || {}).find(
          ([key, _value]) =>
            key.toLowerCase().replace("_url", "") === "snapchat"
        )?.[1] || null,
    },
    {
      name: "Telegram",
      icon: RiTelegram2Line,
      color: "bg-sky-500",
      hover: "bg-sky-600",
      link:
        Object.entries(footerData || {}).find(
          ([key, _value]) =>
            key.toLowerCase().replace("_url", "") === "telegram"
        )?.[1] || null,
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      color: "bg-green-500",
      hover: "bg-green-600",
      link:
        Object.entries(footerData || {}).find(
          ([key, _value]) =>
            key.toLowerCase().replace("_url", "") === "whatsapp"
        )?.[1] || null,
    },
    {
      name: "Tiktok",
      icon: PiTiktokLogoLight,
      color: "bg-pink-500",
      hover: "bg-pink-600",
      link:
        Object.entries(footerData || {}).find(
          ([key, _value]) => key.toLowerCase().replace("_url", "") === "tiktok"
        )?.[1] || null,
    },
  ];

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src={footerData?.logo}
                alt="Logo"
                className="rounded-xl w-12 h-12 text-white"
              />
              <div className="text-right">
                <h3 className="text-xl font-bold text-yellow-400">
                  {footerData?.platform_name}
                </h3>
                <p className="text-sm text-gray-300">{footerData?.slogan}</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {footerData?.short_description}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-yellow-400">
              روابط سريعة
            </h4>
            <ul className="space-y-2">
              {footerData?.links?.map(
                ({ id, title }: { id: string; title: string }) => (
                  <li key={id}>
                    <a
                      onClick={() => navigate(`sections/${id}`)}
                      className="text-gray-300 hover:text-yellow-400 transition-colors cursor-pointer duration-200"
                    >
                      {title}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-yellow-400">
              تواصل معنا
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-300 text-sm" dir="ltr">
                  {footerData?.contact_number}
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-300 text-sm">
                  {footerData?.contact_email}
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-300 text-sm" dir="ltr">
                  {footerData?.location}
                </span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-yellow-400">تابعنا</h4>

            <div className="flex space-x-4">
              {socialMediaData.map((link: any, index: number) => (
                <a
                  key={index}
                  href={link.link}
                  target="_blank"
                  className={`w-[25px] h-[25px] p-[5px] ${link.color} rounded-lg flex items-center justify-center hover:${link.hover} transition-colors duration-200`}
                >
                  {React.createElement(link.icon, { className: "w-5 h-5" })}
                </a>
              ))}
            </div>
            <p className="text-gray-400 text-xs">
              {footerData?.text_under_social ||
                "انضم لآلاف الطلاب الذين حققوا التفوق معنا"}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            {footerData?.rights_reserved ||
              "© 2025 منصة التوجيهي. جميع الحقوق محفوظة."}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="/privacy-policy"
              className="text-gray-400 hover:text-yellow-400 text-sm transition-colors duration-200"
            >
              سياسة الخصوصية
            </a>
            <a
              href="/terms-and-conditions"
              className="text-gray-400 hover:text-yellow-400 text-sm transition-colors duration-200"
            >
              الشروط والأحكام
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
