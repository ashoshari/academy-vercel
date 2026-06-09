import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  BadgeCheck,
  Clock,
  FileText,
  GraduationCap,
  LineChart,
  MonitorPlay,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import EmptyState from "@/components/core/EmptyState";

export interface SliderSlide {
  id: string | number;
  title?: string;
  subtitle?: string;
  header?: string;
  image?: string;
  link?: string;
}

const FALLBACK_IMAGE =
  "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1200";

const DEFAULT_TITLE = "ابدأ رحلتك نحو التفوق";
const DEFAULT_DESCRIPTION =
  "منصة تعليمية متكاملة لمساعدتك على فهم دروسك، حل الامتحانات، وتحقيق أعلى الدرجات في التوجيهي.";

interface FeatureItem {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}

// Right-to-left order (first item appears on the right).
const FEATURES: FeatureItem[] = [
  { icon: Clock, title: "الوصول في أي وقت", subtitle: "تعلم من أي مكان" },
  { icon: LineChart, title: "متابعة وتقييم", subtitle: "تقارير أداء مفصلة" },
  { icon: MonitorPlay, title: "شرح مبسط", subtitle: "على أحدث الطرق" },
  { icon: ShieldCheck, title: "محتوى موثوق", subtitle: "من أفضل المعلمين" },
];

interface StatItem {
  icon: LucideIcon;
  value: string;
  label: string;
}

const STATS: StatItem[] = [
  { icon: Users, value: "+25,000", label: "طالب وطالبة" },
  { icon: GraduationCap, value: "+350", label: "دورة تعليمية" },
  { icon: User, value: "+70", label: "معلم متخصص" },
  { icon: BadgeCheck, value: "95%", label: "نسبة رضا الطلاب" },
];

interface SliderCarouselProps {
  slides: SliderSlide[];
  className?: string;
  autoPlayInterval?: number;
  emptyTitle?: string;
  emptyDescription?: string;
}

export default function SliderCarousel({
  slides,
  className = "",
  autoPlayInterval = 5000,
  emptyTitle = "لا يوجد سلايدات لعرضها",
  emptyDescription = "سيتم إضافة سلايدات قريباً.",
}: SliderCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setCurrentSlide(0);
  }, [slides]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) =>
      slides.length === 0 ? prev : (prev + 1) % slides.length,
    );
  }, [slides.length]);

  // const prevSlide = useCallback(() => {
  //   setCurrentSlide((prev) =>
  //     slides.length === 0 ? prev : (prev - 1 + slides.length) % slides.length,
  //   );
  // }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(timer);
  }, [nextSlide, slides.length, autoPlayInterval]);

  if (slides.length === 0) {
    return (
      <section
        dir="rtl"
        className={`relative overflow-hidden bg-[#f5f6fb] ${className}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex items-center justify-center">
          <EmptyState
            title={emptyTitle}
            description={emptyDescription}
            tone="neutral"
            size="lg"
            dir="rtl"
          />
        </div>
      </section>
    );
  }

  const activeSlide = slides[currentSlide];
  const heading = activeSlide?.title || DEFAULT_TITLE;
  const description = activeSlide?.header || DEFAULT_DESCRIPTION;

  return (
    <section dir="rtl" className={`relative ${className}`}>
      <div className="relative pb-12 sm:pb-14">
        {/* Hero — full-width image with text overlaid */}
        <div className="relative min-h-[420px] sm:min-h-[480px] lg:min-h-[650px]">
          {/* Prev / Next arrows */}
          {/* {slides.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevSlide}
                aria-label="الشريحة السابقة"
                className="cursor-pointer absolute left-4 top-1/2 transform -translate-y-1/2 z-30 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 group"
              >
                <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="الشريحة التالية"
                className="cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2 z-30 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 group"
              >
                <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
              </button>
            </>
          )} */}

          {/* Full-width background slider */}
          <div className="absolute inset-0">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <div
                  className="absolute inset-0 bg-black/50 z-10"
                  aria-hidden="true"
                />
                <img
                  src={slide.image || FALLBACK_IMAGE}
                  alt={slide.title || DEFAULT_TITLE}
                  loading="lazy"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            ))}
          </div>

          {/* Text overlay — aligned with stats bar (max-w-7xl) */}
          <div className="absolute inset-0 z-10 flex items-center">
            <div className="w-full max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 h-full items-center">
                <div
                  className={`text-right pt-12 pb-24 sm:pb-28 lg:pb-32 lg:py-16 transform transition-all duration-1000 ${
                    mounted
                      ? "translate-x-0 opacity-100"
                      : "translate-x-10 opacity-0"
                  }`}
                >
                  {activeSlide?.subtitle && (
                    <span className="inline-block mb-4 text-sm font-semibold text-sky-300">
                      {activeSlide.subtitle}
                    </span>
                  )}

                  <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-5xl font-extrabold leading-tight text-sky-100">
                    {heading}
                  </h1>

                  <p className="mt-5 text-base sm:text-lg leading-relaxed text-gray-300 max-w-xl">
                    {description}
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Link
                      to="/courses"
                      className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium shadow-sm hover:shadow-md bg-[linear-gradient(to_right,var(--brand),var(--brand-light),var(--brand))] bg-size-[200%_100%] bg-left hover:bg-right transition-all duration-700"
                    >
                      <span>استعرض الدورات</span>
                      <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/courses"
                      className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-400/50 text-gray-200 font-bold hover:border-(--brand) transition-colors"
                    >
                      <FileText className="w-4 h-4 text-white" />
                      <span>جرب امتحان مجاني</span>
                    </Link>
                  </div>

                  {/* Feature highlights — single row on desktop, no title wrapping */}
                  <div className="mt-9 flex flex-wrap sm:flex-nowrap gap-x-4 sm:gap-x-5 gap-y-5">
                    {FEATURES.map((feature) => {
                      const Icon = feature.icon;
                      return (
                        <div
                          key={feature.title}
                          className="flex items-center gap-2 w-[calc(50%-0.5rem)] sm:w-auto sm:shrink-0"
                        >
                          <span className="shrink-0 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full text-(--brand)">
                            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                          </span>
                          <div className="min-w-0 leading-tight">
                            <p className="text-xs sm:text-sm font-bold text-gray-200 whitespace-nowrap">
                              {feature.title}
                            </p>
                            <p className="text-[11px] sm:text-xs text-gray-300 whitespace-nowrap">
                              {feature.subtitle}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="hidden lg:block" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* Pagination dots */}
          {slides.length > 1 && (
            <div className="absolute bottom-20 sm:bottom-24 left-0 right-0 z-20 flex items-center justify-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`الانتقال إلى الشريحة ${index + 1}`}
                  className={`cursor-pointer h-2.5 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "w-7 bg-(--brand-light)"
                      : "w-2.5 bg-gray-500/80 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Stats bar — half inside hero, half outside */}
          <div className="absolute bottom-0 left-0 right-0 z-30 translate-y-1/2">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.12)] py-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 lg:divide-x lg:divide-x-reverse lg:divide-gray-100">
                  {STATS.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div
                        key={stat.label}
                        className="flex items-center justify-center gap-3 px-2"
                      >
                        <div className="text-right">
                          <p className="text-xl sm:text-2xl font-extrabold text-(--brand-secondary)">
                            {stat.value}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-400">
                            {stat.label}
                          </p>
                        </div>
                        <span className="shrink-0 flex items-center justify-center w-11 h-11 rounded-full bg-(--brand)/10 text-(--brand)">
                          <Icon className="w-5 h-5" />
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
