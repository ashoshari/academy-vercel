import { CheckCircle, FileText, Download, Clock } from "lucide-react";
import { useLesson } from "@/store/platform/useLesson";

const VideoPlayer = ({ markLessonComplete }: any) => {
  const currentLesson = useLesson((state) => state.currentLesson);
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="aspect-video bg-black rounded-t-2xl overflow-hidden">
        <iframe
          width="100%"
          height="100%"
          src={
            currentLesson?.link ||
            "https://www.youtube.com/embed/watch?v=Eoo4HzILB-M"
          }
          title={currentLesson?.title}
          allow="clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
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
                  key={resource.id}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                  download
                >
                  {resource.image ? (
                    <img
                      className="w-[50px]"
                      src={resource.image}
                      alt={resource.name}
                    />
                  ) : (
                    <FileText className="w-5 h-5 text-blue-500" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">
                      {resource.description}
                    </div>
                    <div className="text-xs text-gray-500">{resource.size}</div>
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
            disabled={currentLesson.is_completed}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
              currentLesson.is_completed
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
