import React from 'react';
import { 
  Play, 
  Clock, 
  BookOpen, 
  ChevronRight,
  Award,
  Calendar,
} from 'lucide-react';
import useUserAuthStore from "@/store/platform/userAuth";
import { useNavigate } from 'react-router';

interface EnrolledCourse {
  id: number;
  title: string;
  teacher: string;
  subject: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  nextLesson: string;
  nextLessonDate: string;
  rating: number;
  lastAccessed: string;
  totalDuration: string;
  certificate: boolean;
}



const EnrolledCourses: React.FC = () => {
  const isLoggedIn = useUserAuthStore((state) => state.isLoggedIn);
  const navigate = useNavigate();
  // Sample enrolled courses data
  const enrolledCourses: EnrolledCourse[] = [
    {
      id: 1,
      title: "دورة الرياضيات الشاملة - الجبر والهندسة",
      teacher: "أ. محمد الأحمد",
      subject: "الرياضيات",
      progress: 75,
      totalLessons: 45,
      completedLessons: 34,
      nextLesson: "التفاضل والتكامل - الجزء الثالث",
      nextLessonDate: "2025-01-20",
      rating: 4.9,
      lastAccessed: "منذ يومين",
      totalDuration: "3 أشهر",
      certificate: true
    },
    {
      id: 2,
      title: "دورة الفيزياء المتقدمة",
      teacher: "أ. فاطمة السعد",
      subject: "الفيزياء",
      progress: 45,
      totalLessons: 38,
      completedLessons: 17,
      nextLesson: "الكهرباء والمغناطيسية",
      nextLessonDate: "2025-01-21",
      rating: 4.8,
      lastAccessed: "منذ 3 أيام",
      totalDuration: "2.5 أشهر",
      certificate: true
    },
    {
      id: 3,
      title: "دورة اللغة الإنجليزية التفاعلية",
      teacher: "أ. ليلى المحمود",
      subject: "اللغة الإنجليزية",
      progress: 90,
      totalLessons: 30,
      completedLessons: 27,
      nextLesson: "المراجعة النهائية",
      nextLessonDate: "2025-01-19",
      rating: 4.9,
      lastAccessed: "منذ يوم واحد",
      totalDuration: "2 أشهر",
      certificate: true
    },
    {
      id: 4,
      title: "دورة الكيمياء العضوية",
      teacher: "أ. أحمد الخالد",
      subject: "الكيمياء",
      progress: 60,
      totalLessons: 32,
      completedLessons: 19,
      nextLesson: "المركبات الأروماتية",
      nextLessonDate: "2025-01-22",
      rating: 4.7,
      lastAccessed: "منذ 4 أيام",
      totalDuration: "2.5 أشهر",
      certificate: true
    }
  ];

  if (!isLoggedIn) {
    return null;
  }

  // Show only first 3 courses in main page
  const displayedCourses = enrolledCourses.slice(0, 3);

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-100/20 to-purple-100/20 rounded-full translate-x-48 -translate-y-48 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-indigo-100/20 to-blue-100/20 rounded-full -translate-x-36 translate-y-36 animate-pulse delay-1000"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                دوراتي <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">الحالية</span>
              </h2>
              <p className="text-gray-600">تابع تقدمك واستكمل رحلتك التعليمية</p>
            </div>
          </div>
          
          <button
            onClick={() => navigate('/all-courses')}
            className="hidden md:flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
          >
            <span>عرض الكل</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {enrolledCourses.reduce((acc, course) => acc + course.completedLessons, 0)}
            </div>
            <div className="text-sm text-gray-600">دروس مكتملة</div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {Math.round(enrolledCourses.reduce((acc, course) => acc + course.progress, 0) / enrolledCourses.length)}%
            </div>
            <div className="text-sm text-gray-600">متوسط التقدم</div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {enrolledCourses.filter(course => course.certificate && course.progress >= 90).length}
            </div>
            <div className="text-sm text-gray-600">شهادات متاحة</div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {enrolledCourses.length}
            </div>
            <div className="text-sm text-gray-600">دورات نشطة</div>
          </div>
        </div>

        {/* Courses Grid - Compact Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 group cursor-pointer transform hover:scale-105"
            //   onClick={() => onCourseClick(course.id)}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-xs font-medium">
                        {course.subject}
                      </span>
                      {course.certificate && course.progress >= 90 && (
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center space-x-1">
                          <Award className="w-3 h-3" />
                          <span>شهادة</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{course.teacher}</p>
                  </div>
                  
                  {/* Circular Progress */}
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
                      <circle
                        cx="24"
                        cy="24"
                        r="18"
                        stroke="#e5e7eb"
                        strokeWidth="4"
                        fill="none"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="18"
                        stroke="#3b82f6"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={`${course.progress * 1.13} 113`}
                        strokeLinecap="round"
                        className="transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">{course.progress}%</span>
                    </div>
                  </div>
                </div>

                {/* Progress Details */}
                <div className="bg-gray-50 rounded-xl p-3 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">التقدم</span>
                    <span className="text-sm font-medium text-gray-900">
                      {course.completedLessons}/{course.totalLessons}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Next Lesson */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3 mb-4">
                  <div className="flex items-center space-x-2 mb-1">
                    <Play className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">الدرس التالي:</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-1 mb-2">{course.nextLesson}</p>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-500">{course.nextLessonDate}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-600">{course.lastAccessed}</span>
                  </div>
                </div>

                {/* Continue Button */}
                <button onClick={() => navigate(`/coursePage/${course.id}`)} className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2.5 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center space-x-2 text-sm">
                  <Play className="w-4 h-4" />
                  <span>متابعة التعلم</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button - Mobile */}
        <div className="text-center mt-8 md:hidden">
          <button
            onClick={() => navigate('/all-courses')}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto"
          >
            <BookOpen className="w-5 h-5" />
            <span>عرض جميع دوراتي</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default EnrolledCourses;