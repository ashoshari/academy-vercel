import EditButton from "@/components/dashboard/core/EditButton";
import { Eye, EyeOff, CheckCircle, Settings, Copy } from "lucide-react";
import { courseWithNormalizedOfferImports, toCloneDraft } from "./utils";
import DeleteButton from "@/components/dashboard/core/DeleteButton";

import type { Dispatch, SetStateAction } from "react";

type CourseView = "list" | "create" | "clone" | "edit" | "content" | "activate";

type Id = string | number;

type CourseTeacher = {
  id?: Id;
  name?: string;
  is_active?: boolean;
};

type CourseLevel = {
  id?: Id;
  name?: string;
};

type CourseSubsection = {
  id?: Id;
  title?: string;
};

type CourseSpecialization = {
  id?: Id;
  name?: string;
};

type CourseSpecializationMaterial = {
  id?: Id;
  name?: string;
};

type CourseCardPrice = {
  id?: Id;
  price?: number | string | null;
};

export type CourseRow = {
  id: Id;
  name?: string;
  time_in_hours?: number | null;
  level?: CourseLevel | null;
  teacher?: CourseTeacher | null;
  subsection?: CourseSubsection | null;
  subsubsection?: CourseSubsection | null;
  specialization?: CourseSpecialization | null;
  specialization_material?: CourseSpecializationMaterial | null;
  is_free?: boolean;
  card_price?: CourseCardPrice | Id | null;
  is_published?: boolean;
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

export type CoursesTableProps = {
  courseData: CourseRow[] | undefined;
  setSelectedCourse: Dispatch<SetStateAction<CourseRow | null>>;
  setCurrentView: Dispatch<SetStateAction<CourseView>>;
  requestCoursePublishToggle: (course: CourseRow) => void;
  setCloneSourceCourse: Dispatch<SetStateAction<CourseRow | null>>;
  setCloneBaseDraft: Dispatch<SetStateAction<CloneDraft | null>>;
  setNewCourse: Dispatch<SetStateAction<any>>;
  setSelectedSubSection: Dispatch<SetStateAction<string>>;
  setSelectedSubSub: Dispatch<SetStateAction<string>>;
  setSelectedSpec: Dispatch<SetStateAction<string>>;
  requestDeleteCourse: (course: CourseRow) => void;
};

function CoursesTable({
  courseData,
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
}: CoursesTableProps) {
  return (
    <div className="w-full max-w-50 min-w-full pb-6 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-(--brand) overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الدورة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                المعلم
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                القسم
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الصف
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                التخصص
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                مادة التخصص
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                السعر
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الحالة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 overflow-x-auto">
            {courseData
              ?.filter((course) => course?.teacher?.is_active === true)
              .map((course) => (
                <tr key={course?.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-medium text-gray-900 line-clamp-1">
                          {course?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {course?.time_in_hours}h{" "}
                          {course?.level?.name && "•" + course?.level?.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-900">
                        {course?.teacher?.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {course?.subsection?.title || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {course?.subsubsection?.title || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {course?.specialization?.name || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {course?.specialization_material?.name || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {course?.is_free
                      ? "مجاني"
                      : `${
                          typeof course?.card_price === "object" &&
                          course.card_price &&
                          "price" in course.card_price &&
                          course.card_price.price
                            ? String(course.card_price.price) + " د.أ"
                            : "-"
                        }`}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
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
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedCourse(course);
                          setCurrentView("content");
                        }}
                        className="cursor-pointer p-1 text-gray-400 hover:text-(--brand-secondary) transition-colors"
                        title="إدارة المحتوى"
                      >
                        <Settings size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCourse(course);
                          setCurrentView("activate");
                        }}
                        className="cursor-pointer p-1 text-gray-400 hover:text-(--brand-secondary) transition-colors"
                        title="تفعيل الدورة"
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button
                        onClick={() => {
                          requestCoursePublishToggle(course);
                        }}
                        className={`cursor-pointer p-2 rounded-lg transition-colors ${
                          course?.is_published
                            ? "text-(--brand-secondary)"
                            : "text-gray-400"
                        }`}
                        title={
                          course?.is_published ? "إلغاء النشر" : "نشر الدورة"
                        }
                      >
                        {course?.is_published ? (
                          <Eye size={16} />
                        ) : (
                          <EyeOff size={16} />
                        )}
                      </button>

                      <EditButton
                        onClick={() => {
                          setSelectedCourse(
                            courseWithNormalizedOfferImports(course),
                          );
                          setCurrentView("edit");
                        }}
                        className="cursor-pointer p-1 text-gray-400 hover:text-(--brand) transition-colors"
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
                        className="cursor-pointer p-1 text-gray-400 hover:text-(--brand-secondary) transition-colors"
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
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CoursesTable;
