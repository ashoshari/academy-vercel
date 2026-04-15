import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCustomQuery } from "@/hooks/platform/usePlatformQuery";
import { useCallback } from "react";
import EmptyState from "@/components/core/EmptyState";
import { Images } from "lucide-react";

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [stopSlider, setStopSlider] = useState(false);
  const { data } = useCustomQuery("training/students/sliders/", ["sliders"]);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (data?.data?.length) {
      setSlides(data?.data);
    }
  }, [data?.data]);
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => {
      // Get current slides length from state or props
      const length = slides.length;
      if (length === 0) return prev;
      return (prev + 1) % length;
    });
  }, [slides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => {
      const length = slides?.length;
      if (length === 0) return prev;
      return (prev - 1 + length) % length;
    });
  }, [slides]);

  useEffect(() => {
    if (slides?.length === 0) return;
    if (stopSlider) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, slides.length, stopSlider]);
  return (
    <section className="relative h-[75vh] overflow-hidden bg-gray-900">
      <section className="relative h-full overflow-hidden bg-linear-to-br from-indigo-900 via-purple-900 to-blue-900">
        {/* Background Slider  /// */}
        {slides?.length > 0 ? (
          <>
            <div className="absolute inset-0">
              {slides.map((slide: any, index: number) => (
                <div
                  key={slide?.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="absolute inset-0 bg-black/50 z-10"></div>
                  <img
                    loading="lazy"
                    src={
                      slide?.image ||
                      "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1200"
                    }
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            {/* Content */}
            <div className="relative z-20 h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                    stopSlider ? "lg:grid-col-1" : ""
                  }`}
                >
                  {/* Text Content */}
                  <div
                    className={`text-white space-y-8 transform transition-all duration-1000 ${
                      stopSlider ? "hidden" : "block"
                    } ${
                      mounted
                        ? "translate-x-0 opacity-100"
                        : "translate-x-10 opacity-0"
                    }`}
                  >
                    <div className="space-y-4 w-full">
                      <h2 className="text-lg font-semibold text-(--brand) animate-pulse">
                        {slides?.length > 0
                          ? slides[currentSlide]?.subtitle
                          : ""}
                      </h2>
                      <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                        {slides?.length > 0 ? slides[currentSlide]?.title : ""}
                      </h1>
                      <p className="text-xl text-gray-200 leading-relaxed max-w-2xl">
                        {slides?.length > 0
                          ? slides[currentSlide]?.header
                          : "لا توجد بيانات في السلايدر "}
                      </p>
                    </div>
                  </div>

                  {/* Video/Image Preview */}
                  <div
                    className={`${
                      stopSlider ? "lg:col-span-2" : ""
                    } relative transform transition-all duration-1000 delay-300 ${
                      mounted
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-10 opacity-0"
                    }`}
                  >
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                      {slides[currentSlide]?.link && (
                        <>
                          {/* Video Player */}

                          {/* DailyMotion */}
                          <iframe
                            src={`https://geo.dailymotion.com/player.html?video=${slides[currentSlide]?.link}`}
                            className="absolute top-0 left-0 w-full h-full border-none overflow-hidden"
                            allowFullScreen
                            title="Dailymotion Video Player"
                            allow="web-share"
                          ></iframe>

                          {/* Old DailyMotion */}
                          {/* <iframe
                            className="aspect-video h-full"
                            width="100%"
                            height="100%"
                            src={`https://www.dailymotion.com/embed/video/${slides[currentSlide]?.link}?queue-enable=false&endscreen-enable=false&ui-start-screen-info=false`}
                            title={slides[currentSlide]?.title}
                            frameBorder="0"
                            allow="autoplay; fullscreen; picture-in-picture"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                          ></iframe> */}

                          {/* Mux */}
                          {/* <iframe
                            src={`https://player.mux.com/${slides[currentSlide]?.link}?metadata-video-title=%${slides[currentSlide]?.title}&video-title=${slides[currentSlide]?.title}`}
                            className="w-full border-none aspect-video"
                            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                            allowFullScreen
                          ></iframe> */}
                          <button
                            onClick={() => {
                              setStopSlider(!stopSlider);
                            }}
                            className={`cursor-pointer absolute bottom-12 right-2 bg-white hover:bg-linear-to-r hover:text-white hover:from-(--brand) hover:to(--brand-light) text-gray-900 px-4 py-2 rounded-2xl font-bold text-sm`}
                          >
                            {!stopSlider
                              ? " ▶️ شاهد الفيديو"
                              : "  ❌ أوقف الفيديو"}
                          </button>
                        </>
                      )}
                    </div>

                    {/* Floating Elements */}
                    {slides[currentSlide]?.link && !stopSlider && (
                      <div>
                        <div className="absolute -top-4 -right-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-2xl font-bold text-sm animate-bounce">
                          🏆 الأفضل في الأردن
                        </div>
                        <div className="absolute -bottom-4 -left-4 bg-green-500 text-white px-4 py-2 rounded-2xl font-bold text-sm animate-pulse">
                          ✅ مضمون النجاح
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {slides?.length > 1 && (
              <>
                {/* Navigation Arrows */}
                <button
                  onClick={() => {
                    setStopSlider(false);
                    prevSlide();
                  }}
                  className="cursor-pointer absolute left-4 top-1/2 transform -translate-y-1/2 z-30 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 group"
                >
                  <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
                </button>
                <button
                  onClick={() => {
                    setStopSlider(false);
                    nextSlide();
                  }}
                  className="cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2 z-30 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 group"
                >
                  <ChevronRight className="cursor-pointer w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
                </button>

                {/* Slide Indicators */}
                <div
                  className={`absolute ${
                    stopSlider ? "hidden" : "block"
                  } bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-3`}
                >
                  {slides?.map((_: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`cursor-pointer w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? "bg-(--brand) w-8"
                          : "bg-white/50 hover:bg-white/70"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="h-full flex items-center justify-center">
            <EmptyState
              title="لا يوجد سلايدات لعرضها"
              description="سيتم إضافة سلايدات قريباً."
              icon={Images}
              tone="neutral"
              size="lg"
              dir="rtl"
            />
          </div>
        )}
      </section>
    </section>
  );
};

export default Hero;
