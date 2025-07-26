import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Play, BookOpen } from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { data, isLoading } = useCustomQuery("training/students/sliders/", [
    "sliders",
  ]);
  // console.log(data?.data);
  useEffect(() => {
    setMounted(true);
  }, []);

  // const slides = [
  //   {
  //     id: 1,
  //     title: "ابدأ رحلتك نحو التفوق",
  //     subtitle: "منصة التوجيهي الشاملة",
  //     description:
  //       "أفضل الدورات والمواد التعليمية لضمان نجاحك في التوجيهي وتحقيق أحلامك الجامعية",
  //     image:
  //       "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1200",
  //     stats: { students: "10,000+", courses: "50+", success: "95%" },
  //   },
  //   {
  //     id: 2,
  //     title: "دورات تفاعلية عالية الجودة",
  //     subtitle: "تعلم مع أفضل المدرسين",
  //     description:
  //       "دورات مصممة خصيصاً لطلاب التوجيهي مع شرح مبسط وأمثلة عملية لضمان الفهم الكامل",
  //     image:
  //       "https://images.pexels.com/photos/5212700/pexels-photo-5212700.jpeg?auto=compress&cs=tinysrgb&w=1200",
  //     stats: { hours: "500+", teachers: "25+", students: "10,000+" },
  //   },
  //   {
  //     id: 3,
  //     title: "امتحانات الكترونية متقدمة",
  //     subtitle: "اختبر مستواك باستمرار",
  //     description:
  //       "نظام امتحانات الكتروني متطور يحاكي الامتحان الحقيقي مع تقييم فوري ونصائح للتحسين",
  //     image:
  //       "https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=1200",
  //     stats: { questions: "5000+", tests: "200+", accuracy: "99%" },
  //   },
  // ];

  const nextSlide = () => {
    const length = data?.data?.length ?? 4;
    setCurrentSlide((prev) => (prev - 1 + length) % length);
  };

  const prevSlide = () => {
    const length = data?.data?.length ?? 4;

    setCurrentSlide((prev) => (prev + 1) % length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);
  const videoRef = useRef<HTMLVideoElement>(null);
  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };
  return (
    <section className="relative h-screen overflow-hidden bg-gray-900">
      {isLoading ? (
        <div className="flex items-center justify-center h-full text-white">
          Loading...
        </div>
      ) : (
        <section className="relative h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
          {/* Background Slider  /// */}
          <div className="absolute inset-0">
            {data.data.map((slide: any, index: number) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="absolute inset-0 bg-black/50 z-10"></div>
                <img
                  src={
                    slide.image ||
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <div
                  className={`text-white space-y-8 transform transition-all duration-1000 ${
                    mounted
                      ? "translate-x-0 opacity-100"
                      : "translate-x-10 opacity-0"
                  }`}
                >
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-yellow-400 animate-pulse">
                      {data.data ? data.data[currentSlide].subtitle : ""}
                    </h2>
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                      {data.data ? data.data[currentSlide].title : ""}
                    </h1>
                    <p className="text-xl text-gray-200 leading-relaxed max-w-2xl">
                      {data.data[currentSlide].description ||
                        "No description available."}
                    </p>
                  </div>

                  {/* Stats */}
                  {/* <div className="grid grid-cols-3 gap-6">
                    {Object.entries(slides[currentSlide].stats).map(
                      ([key, value], index) => (
                        <div key={key} className="text-center">
                          <div className="text-2xl md:text-3xl font-bold text-yellow-400">
                            {value}
                          </div>
                          <div className="text-sm text-gray-300 capitalize">
                            {key === "students" && "طالب"}
                            {key === "courses" && "دورة"}
                            {key === "success" && "نجاح"}
                            {key === "hours" && "ساعة"}
                            {key === "teachers" && "مدرس"}
                            {key === "rating" && "تقييم"}
                            {key === "questions" && "سؤال"}
                            {key === "tests" && "اختبار"}
                            {key === "accuracy" && "دقة"}
                          </div>
                        </div>
                      )
                    )}
                  </div> */}

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center space-x-3">
                      <span>ابدأ التعلم الآن</span>
                      <BookOpen className="w-6 h-6" />
                    </button>
                    <button className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3">
                      <span>شاهد الفيديو</span>
                      <Play className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Video/Image Preview */}
                <div
                  className={`relative transform transition-all duration-1000 delay-300 ${
                    mounted
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-10 opacity-0"
                  }`}
                >
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                    {!data.data[currentSlide].link ? (
                      <img
                        src={
                          data.data[currentSlide].image ||
                          "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1200"
                        }
                        alt={data.data[currentSlide].title}
                        className="w-full h-80 md:h-96 object-cover"
                      />
                    ) : (
                      <>
                        {/* Video Player */}
                        <video
                          className="w-full h-80 md:h-96 object-cover"
                          controls
                        >
                          <source
                            src={
                              data.data[currentSlide].link ||
                              "https://www.w3schools.com/html/mov_bbb.mp4"
                            }
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      </>
                    )}
                    {/* <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div> */}
                    {/* <button
                          onClick={handlePlay}
                          className="absolute inset-0 flex items-center justify-center group"
                        >
                          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 transform group-hover:scale-110">
                            <Play className="w-8 h-8 text-white ml-1" />
                          </div>
                        </button> */}
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-2xl font-bold text-sm animate-bounce">
                    🏆 الأفضل في الأردن
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-green-500 text-white px-4 py-2 rounded-2xl font-bold text-sm animate-pulse">
                    ✅ مضمون النجاح
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 group"
          >
            <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 group"
          >
            <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-3">
            {data.data.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-yellow-400 w-8"
                    : "bg-white/50 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </section>
      )}
    </section>
  );
};

export default Hero;
