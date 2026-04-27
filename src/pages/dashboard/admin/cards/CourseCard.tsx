import { Copy, Settings, User } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import {
  courseWithNormalizedOfferImports,
  getLevelColor,
  toCloneDraft,
} from "../courses/utils";
import StatusToggleButton from "@/components/dashboard/core/StatusToggleButton";
import EditButton from "@/components/dashboard/core/EditButton";
import DeleteButton from "@/components/dashboard/core/DeleteButton";

type CourseView = "list" | "create" | "clone" | "edit" | "content" | "activate";

type CourseMaterial = {
  id?: string | number;
  name: string;
};

type CourseTeacher = {
  id?: string | number;
  name?: string;
  image?: string | null;
  materials?: CourseMaterial[] | null;
};

type CourseLevel = {
  id?: string | number;
  name?: string;
};

type CourseSpecializationMaterial = {
  id?: string | number;
  name?: string;
};

type CourseCardPrice = {
  id?: string | number;
  price?: number | string | null;
};

export type Course = {
  id?: string | number;
  name?: string;
  short_description?: string | null;
  image?: string | null;
  is_special?: boolean;
  is_free?: boolean;
  is_published?: boolean;
  level?: CourseLevel | null;
  teacher?: CourseTeacher | null;
  specialization_material?: CourseSpecializationMaterial | null;
  time_in_hours?: number | null;
  card_price?: CourseCardPrice | null;
};

type CloneDraft = {
  name?: string;
  short_description?: string | null;
  long_description?: string | null;
  teacher?: string | number | undefined;
  time_in_hours?: number | undefined;
  image?: File | undefined;
  is_free?: boolean;
  card_price?: string | number | null;
  start_date?: string | null;
  end_date?: string | null;
  is_published?: boolean;
  is_special?: boolean;
  is_show_general_questions?: boolean;
  subsection?: string | number | null;
  subsubsection?: string | number | null;
  specialization?: string | number | null;
  specialization_material?: string | number | null;
  import_offer_target_ids?: string[];
};

export type CourseCardProps = {
  course: Course;
  role: string;
  setSelectedCourse: Dispatch<SetStateAction<any>>;
  setCurrentView: Dispatch<SetStateAction<CourseView>>;
  requestCoursePublishToggle: (course: Course) => void;
  setCloneSourceCourse: Dispatch<SetStateAction<Course | null>>;
  setCloneBaseDraft: Dispatch<SetStateAction<CloneDraft | null>>;
  setNewCourse: Dispatch<SetStateAction<any>>;
  setSelectedSubSection: Dispatch<SetStateAction<string>>;
  setSelectedSubSub: Dispatch<SetStateAction<string>>;
  setSelectedSpec: Dispatch<SetStateAction<string>>;
  requestDeleteCourse: (course: Course) => void;
};

export const CourseCard = ({
  course,
  role,
  setSelectedCourse,
  setCurrentView,
  requestCoursePublishToggle,
  setCloneSourceCourse,
  setCloneBaseDraft,
  setNewCourse,
  setSelectedSubSection,
  setSelectedSubSub,
  setSelectedSpec,
  requestDeleteCourse,
}: CourseCardProps) => (
  <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-(--brand) overflow-hidden hover:shadow-xl transition-all duration-300 group">
    {/* Thumbnail */}
    <div className="relative h-48 overflow-hidden">
      <img
        loading="lazy"
        src={
          course?.image ||
          "https://www.malvernbh.com/wp-content/uploads/2023/02/shutterstock_1079701271-1-min-1010x673.jpg"
        }
        alt={course?.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>

      {/* Status Badges */}
      <div className="absolute top-4 right-4 flex gap-2">
        {course?.is_special && (
          <span className="bg-(--brand) text-white px-2 py-1 rounded-full text-xs font-medium">
            مميز
          </span>
        )}
        {course?.is_free && (
          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            مجاني
          </span>
        )}
      </div>
      {course?.level?.name && (
        <div className="absolute top-4 left-4 flex gap-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(
              course?.level?.name,
            )}`}
          >
            {course?.level?.name}
          </span>
        </div>
      )}
    </div>

    {/* Content */}
    <div className="p-6 flex flex-col">
      {/* Header */}
      <div className="mb-4 h-20">
        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
          {course?.name}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2">
          {course?.short_description}
        </p>
      </div>

      <div>
        {/* Teacher */}
        {role !== "teacher" && (
          <div className="flex items-center gap-3 mb-4">
            {course?.teacher?.image ? (
              <img
                loading="lazy"
                src={course?.teacher?.image}
                alt={course?.teacher?.name}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <User size={24} className="text-gray-500" />
            )}
            <div>
              <p className="font-medium text-gray-800 text-sm">
                {course?.teacher?.name}
              </p>
              <p className="text-gray-500 text-xs">
                {course?.teacher?.materials?.map(
                  (material) => `${material.name} `,
                )}
              </p>
            </div>
          </div>
        )}
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-800">
              {course?.specialization_material?.name || "-"}
            </div>
            <div className="text-xs text-gray-500">مادة التخصص</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-(--brand-secondary)">
              {course?.time_in_hours ? course?.time_in_hours + "h" : "-"}
            </div>
            <div className="text-xs text-gray-500">ساعة</div>
          </div>

          {/* Is Free */}
          <div className="text-center col-span-2">
            <div className="text-lg font-bold text-green-600">
              {course.is_free
                ? "مجاني"
                : `${
                    course?.card_price?.price
                      ? course?.card_price?.price + " د.أ"
                      : "-"
                  }`}
            </div>
            <div className="text-xs text-gray-500">السعر</div>
          </div>
        </div>

        {/* Status */}
        <div className="flex gap-2 mb-4">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              course?.is_published
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {course?.is_published ? "منشور" : "مسودة"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setSelectedCourse(course);
              setCurrentView("content");
            }}
            className="cursor-pointer p-2 text-gray-400 hover:text-(--brand-secondary) hover:bg-blue-50 rounded-lg transition-colors"
            title="إدارة المحتوى"
          >
            <Settings size={16} />
          </button>

          <StatusToggleButton
            isOn={Boolean(course?.is_published)}
            onToggle={() => {
              requestCoursePublishToggle(course);
            }}
            titleOn="إلغاء النشر"
            titleOff="نشر الدورة"
          />
        </div>

        <div className="flex items-center gap-1">
          <EditButton
            onClick={() => {
              setSelectedCourse(courseWithNormalizedOfferImports(course));
              setCurrentView("edit");
            }}
            className="cursor-pointer p-2 text-gray-400 hover:text-(--brand) hover:bg-gray-50 rounded-lg transition-colors"
            title="تعديل الدورة"
          />
          <button
            onClick={() => {
              setCloneSourceCourse(course);
              const draft = toCloneDraft(course) as CloneDraft;
              setCloneBaseDraft(draft);
              setNewCourse(draft);
              setSelectedSubSection("");
              setSelectedSubSub("");
              setSelectedSpec("");
              setCurrentView("clone");
            }}
            className="cursor-pointer p-2 text-gray-400 hover:text-(--brand-secondary) hover:bg-blue-50 rounded-lg transition-colors"
            title="نسخ الدورة"
            type="button"
          >
            <Copy size={16} />
          </button>
          <DeleteButton
            onClick={() => {
              requestDeleteCourse(course);
            }}
            title="حذف الدورة"
          />
        </div>
      </div>
    </div>
  </div>
);
