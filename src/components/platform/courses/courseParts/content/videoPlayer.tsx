import { CheckCircle, FileText, Download, Clock } from "lucide-react";
import { useLesson } from "@/store/platform/useLesson";
import { useCustomPost } from "@/hooks/platform/usePlatformMutation";
import AppLogo from "@/assets/manasaty-logo.jpg";
// import { useState, useEffect } from "react";

const VideoPlayer = ({ markLessonComplete }: any) => {
  const user = JSON.parse(localStorage.getItem("platform_user") || "{}");
  const isAllowToUseWeb = user.is_allow_to_use_web;
  console.log(isAllowToUseWeb);
  const PROVIDER = "dailymotion";
  const currentLesson = useLesson((state) => state.currentLesson);
  const { mutateAsync: downloadFiles } = useCustomPost(
    "/training/students/resources-download/",
    ["downloadFiles"]
  );
  // const [isFullscreen, setIsFullscreen] = useState(false);
  // useEffect(() => {
  //   const handleFullscreenChange = () => {
  //     setIsFullscreen(!!document.fullscreenElement);
  //   };

  //   document.addEventListener("fullscreenchange", handleFullscreenChange);
  //   return () => {
  //     document.removeEventListener("fullscreenchange", handleFullscreenChange);
  //   };
  // }, []);
  const handleDownload = async (resourceId: any) => {
    try {
      await downloadFiles({
        resource_id: resourceId,
      });
    } catch (error) {}
  };
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="aspect-video rounded-t-2xl overflow-hidden">
        {isAllowToUseWeb === false || isAllowToUseWeb === "false" ? (
          // Application
          <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-2xl group shadow-md">
            {/* Background placeholder image */}
            <img
              src={AppLogo}
              alt="Video Placeholder"
              className="absolute top-0 left-0 w-full h-full object-cover bg-gray-900"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-300"></div>

            {/* Button overlay */}
            <a
              href={`manasaty://open?provider=${PROVIDER}&video_id=${currentLesson?.link}`}
              className="absolute inset-0 flex flex-col items-center justify-center text-white no-underline"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span className="text-lg font-semibold tracking-wide drop-shadow-md">
                  فتح الفيديو في التطبيق
                </span>
              </div>
            </a>
          </div>
        ) : (
          // Dailymotion
          <>
            <div className="relative pb-[56.25%] h-0 overflow-hidden">
              <iframe
                src={`https://geo.dailymotion.com/player.html?video=${currentLesson?.link}`}
                className="absolute top-0 left-0 w-full h-full border-none overflow-hidden"
                allowFullScreen
                title="Dailymotion Video Player"
                allow="web-share"
              />
            </div>
          </>
        )}
        {/* Mux */}
        <div className="relative aspect-video bg-black rounded-t-2xl overflow-hidden">
          {/* <iframe
            src={`https://player.mux.com/${currentLesson?.link}?metadata-video-title=%${currentLesson?.title}&video-title=${currentLesson?.title}`}
            className="w-full border-none aspect-video"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          ></iframe> */}

          {/* Overlays – positions in percentages so they always match */}
          {/* {isFullscreen ? (
            <>
              <div className="absolute top-[0%] left-[0%] w-[100%] h-[30%] bg-black"></div>
              <div className="absolute top-[35%] left-[55%] w-[25%] md:w-[20%] lg:w-[15%] h-[30%] bg-transparent"></div>
              <div className="absolute bottom-[0%] left-[0%] w-[14%] sm:w-[12%] md:w-[9.8%] lg:w-[8.4%] xl:w-[6.3%] 2xl:w-[4.85%] h-[25%] bg-transparent"></div>
            </>
          ) : (
            <>
              <div className="absolute top-[0%] left-[0%] w-[100%] sm:w-[92.5%] md:w-[94%] lg:w-[96%] xl:w-[96%] 2xl:w-[96.5%] h-[30%] lg:h-[15%] bg-transparent"></div>
              <div className="absolute top-[35%] left-[55%] w-[25%] md:w-[20%] lg:w-[15%] h-[30%] bg-transparent"></div>
              <div className="absolute bottom-[0%] left-[0%] w-[14%] sm:w-[12%] md:w-[9.8%] lg:w-[8.4%] xl:w-[6.3%] 2xl:w-[4.85%] h-[25%] bg-transparent"></div>
            </>
          )} */}
        </div>
        {/* Youtube */}
        <div>
          {/* <iframe
          width="100%"
          height="100%"
          src={
            // "https://www.youtube.com/embed/" + currentLesson?.link
            }
            title={currentLesson?.title}
            frameBorder="0"
            // allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            ></iframe> */}
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentLesson?.title}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {currentLesson?.description}
            </p>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{currentLesson?.time_in_minutes} دقيقة</span>
            </div>
          </div>
        </div>

        {/* Lesson Files */}
        {currentLesson?.resources && currentLesson.resources.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              ملفات الدرس
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentLesson?.resources.map((resource: any) => (
                <a
                  href={resource.file}
                  target="_blank"
                  key={resource?.id}
                  onClick={() => handleDownload(resource?.id)}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                  download
                >
                  <FileText className="w-5 h-5 text-blue-500" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">
                      {resource?.title ?? "ملف"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {(resource?.file_size / 1024).toFixed(1) ?? 0} MB
                    </div>
                  </div>
                  <button className="p-2 text-blue-600 cursor-pointer hover:bg-blue-50 rounded-lg transition-colors duration-200">
                    <Download className="w-4 h-4" />
                  </button>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Mark Complete Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={markLessonComplete}
            disabled={currentLesson?.is_completed}
            className={`cursor-pointer disabled:cursor-not-allowed px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
              currentLesson?.is_completed
                ? "bg-green-100 text-green-800 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transform hover:scale-105"
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            <span>
              {currentLesson?.is_completed ? "مكتمل" : "وضع علامة مكتمل"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
