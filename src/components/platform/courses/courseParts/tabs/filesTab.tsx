import { Download, FolderOpen } from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";
import { useParams } from "react-router";
export const FilesTab = () => {
  const token = window.localStorage.getItem("accessToken");
  const { courseId } = useParams();
  const { data, isLoading } = useCustomQuery(
    `/training/students/course/${courseId}/`,
    ["courses"],
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const files = data?.data?.resources;
  if (isLoading) {
    console.log("loading");
  } else {
    console.log("files:", files);
  }
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">ملفات الدورة</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <FolderOpen className="w-4 h-4" />
          <span>{files?.length} ملف</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {files?.map((file: any) => (
          <div
            key={file.id}
            className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex items-start space-x-4 mb-4">
              <img
                className="w-12 h-12"
                src={
                  file?.image ||
                  "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1200"
                }
                alt={file?.desctiption}
              />
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                  {file?.description}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {file?.description}
                </p>
              </div>
            </div>
            {/* files details */}
            {/* <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{file.size}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Download className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{file.downloads} تحميل</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{file.uploadDate}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">{file.type.toUpperCase()}</span>
              </div>
            </div> */}

            <a
              href={file?.file}
              target="_blank"
              download
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>تحميل الملف</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
