import { ArrowRight, Menu, Users } from "lucide-react";
const Header = ({
  setSidebarVisible,
  sidebarVisible,
  courseData
}: {
  setSidebarVisible: any;
  sidebarVisible: any;
  courseData: any;
}) => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.history.back()}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer flex items-center justify-center transition-colors duration-200"
            >
              <ArrowRight className="w-5 h-5 text-gray-600" />
            </button>

            <button
              onClick={() => setSidebarVisible(!sidebarVisible)}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer flex items-center justify-center transition-colors duration-200"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>

            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {courseData?.name}
              </h1>
              <p className="text-sm text-gray-600">
                {courseData?.teacher.name}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>
                  {courseData?.total_number_of_enrolled_students} طالب
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Header;
