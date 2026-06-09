import {
  BookOpen,
  CheckCircle,
  Clock,
  Sparkles,
  Users,
} from "lucide-react";
import type { StudentCourse } from "@/pages/platform/publicCourses/types";

function formatPrice(price: number) {
  return price.toLocaleString("ar-IQ");
}

function formatEnrolledCount(count: number) {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toLocaleString("ar-IQ", { maximumFractionDigits: 1 })}م`;
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toLocaleString("ar-IQ", { maximumFractionDigits: 1 })}ألف`;
  }
  return count.toLocaleString("ar-IQ");
}

function courseImageUrl(image?: string) {
  return (
    image ||
    "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1200"
  );
}

function refTitle(ref?: { title?: string; name?: string }) {
  return ref?.title ?? ref?.name ?? null;
}

function teacherAvatarUrl(teacher?: StudentCourse["teacher"]) {
  if (teacher?.image) return teacher.image;
  if (!teacher?.name) return null;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}&background=2465c9&color=fff&size=64&bold=true`;
}

interface CourseCardProps {
  course: StudentCourse;
  onClick?: (course: StudentCourse) => void;
}

export default function CourseCard({ course, onClick }: CourseCardProps) {
  const price = course.is_free ? 0 : (course.card_price?.price ?? 0);
  const isEnrolled = course.is_enrolled;
  const isActive = course.is_enrollment_active;
  const enrolledCount = course.total_number_of_enrolled_students;
  const subsectionTitle = refTitle(course.subsection);
  const subsubsectionTitle = refTitle(course.subsubsection);
  const specializationLabel = refTitle(
    course.specialization_material ?? course.specialization,
  );
  const teacherAvatar = teacherAvatarUrl(course.teacher);
  const hasTaxonomy = Boolean(subsectionTitle || subsubsectionTitle);

  return (
    <article
      className="course-card group cursor-pointer"
      onClick={() => onClick?.(course)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.(course);
        }
      }}
    >
      <div className="course-card__media">
        <img
          src={courseImageUrl(course.image)}
          alt={course.name}
          className="course-card__image"
          loading="lazy"
        />
        <div className="course-card__media-overlay" aria-hidden="true" />

        <div className="course-card__statuses">
          {course.is_free && (
            <span className="course-card__status course-card__status--free">
              مجاني
            </span>
          )}
          {course.is_special && (
            <span className="course-card__status course-card__status--special">
              <Sparkles className="w-3 h-3" />
              مميزة
            </span>
          )}
          {isEnrolled && (
            <span
              className={`course-card__status ${
                isActive
                  ? "course-card__status--enrolled"
                  : "course-card__status--paused"
              }`}
            >
              <CheckCircle className="w-3 h-3" />
              {isActive ? "مسجّل" : "موقوف"}
            </span>
          )}
        </div>

        {!course.is_free && (
          <div className="course-card__price-pill">
            <span className="course-card__price-pill-text">
              {formatPrice(price)}
              <small>د.ع</small>
            </span>
          </div>
        )}
      </div>

      <div className="course-card__body">
        {hasTaxonomy && (
          <dl className="course-card__taxonomy">
            {subsectionTitle && (
              <div className="course-card__taxonomy-row">
                <dt>القسم الفرعي</dt>
                <dd>{subsectionTitle}</dd>
              </div>
            )}
            {subsubsectionTitle && (
              <div className="course-card__taxonomy-row">
                <dt>المستوى</dt>
                <dd>{subsubsectionTitle}</dd>
              </div>
            )}
          </dl>
        )}

        <h3 className="course-card__title">{course.name}</h3>

        {specializationLabel && (
          <p className="course-card__specialization">{specializationLabel}</p>
        )}

        {course.teacher && (
          <div className="course-card__teacher">
            {teacherAvatar ? (
              <img
                src={teacherAvatar}
                alt=""
                className="course-card__teacher-avatar"
                loading="lazy"
              />
            ) : (
              <span className="course-card__teacher-avatar course-card__teacher-avatar--fallback" />
            )}
            <span className="course-card__teacher-name">{course.teacher.name}</span>
          </div>
        )}

        {(course.total_number_of_lessons != null &&
          course.total_number_of_lessons > 0) ||
        (course.time_in_hours != null && course.time_in_hours > 0) ? (
          <div className="course-card__meta">
            {course.total_number_of_lessons != null &&
              course.total_number_of_lessons > 0 && (
                <span className="course-card__meta-item">
                  <BookOpen className="w-3.5 h-3.5" />
                  {course.total_number_of_lessons} درس
                </span>
              )}
            {course.time_in_hours != null && course.time_in_hours > 0 && (
              <span className="course-card__meta-item">
                <Clock className="w-3.5 h-3.5" />
                {course.time_in_hours} ساعة
              </span>
            )}
          </div>
        ) : null}

        {enrolledCount != null && enrolledCount > 0 ? (
          <div className="course-card__footer">
            <span className="course-card__enrolled">
              <Users className="w-3.5 h-3.5" />
              {formatEnrolledCount(enrolledCount)} مسجّل
            </span>
          </div>
        ) : null}
      </div>
    </article>
  );
}

/** @deprecated Use StudentCourse from publicCourses/types */
export interface CourseCardData {
  id: string;
  title: string;
  instructor: string;
  rating: number;
  reviewCount: number;
  lessonsCount: number;
  enrolledCount: number;
  price: number;
  image: string;
  categoryLabel: string;
  categoryColor: string;
  categoryTextColor: string;
}
