import { Bookmark, Star } from "lucide-react";

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

interface CourseCardProps {
  course: CourseCardData;
  onBookmark?: (id: string) => void;
}

function formatPrice(price: number) {
  return price.toLocaleString("ar-IQ");
}

export default function CourseCard({ course, onBookmark }: CourseCardProps) {
  return (
    <article className="course-card">
      <div className="course-card__media">
        <img
          src={course.image}
          alt={course.title}
          className="course-card__image"
          loading="lazy"
        />
        <button
          type="button"
          className="course-card__bookmark"
          aria-label="حفظ الدورة"
          onClick={() => onBookmark?.(course.id)}
        >
          <Bookmark className="w-4 h-4" />
        </button>
        <span
          className="course-card__badge"
          style={{
            backgroundColor: course.categoryColor,
            color: course.categoryTextColor,
          }}
        >
          {course.categoryLabel}
        </span>
      </div>

      <div className="course-card__body">
        <h3 className="course-card__title">{course.title}</h3>
        <p className="course-card__instructor">{course.instructor}</p>

        <div className="course-card__stats">
          <span className="course-card__rating">
            <Star className="course-card__rating-star" />
            <span>{course.rating}</span>
            <span className="text-gray-400">({course.reviewCount})</span>
          </span>
          <span>{course.lessonsCount} درس</span>
          <span>{course.enrolledCount}</span>
        </div>

        <div className="course-card__footer">
          <span className="course-card__price">
            {formatPrice(course.price)} د.ع
          </span>
        </div>
      </div>
    </article>
  );
}
