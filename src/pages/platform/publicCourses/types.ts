export interface StudentCourseTeacher {
  id: string;
  name: string;
  image?: string;
}

export interface StudentCourseCardPrice {
  id: string;
  price: number;
  image?: string;
  is_active?: boolean;
  default_library_price?: number;
  default_teacher_price?: number;
}

export interface StudentCourseRef {
  id: string;
  title?: string;
  name?: string;
}

export interface StudentCourse {
  id: string;
  name: string;
  image?: string;
  short_description?: string;
  long_description?: string;
  time_in_hours?: number;
  is_free?: boolean;
  is_special?: boolean;
  is_published?: boolean;
  order?: number;
  created_at?: string;
  teacher?: StudentCourseTeacher;
  card_price?: StudentCourseCardPrice | null;
  subsection?: StudentCourseRef;
  subsubsection?: StudentCourseRef;
  specialization?: StudentCourseRef;
  specialization_material?: StudentCourseRef;
  is_enrolled?: boolean;
  is_enrollment_active?: boolean;
  has_overdue_installment?: boolean;
  total_number_of_lessons?: number;
  total_number_of_enrolled_students?: number;
}

export interface StudentTeacher {
  id: string;
  name: string;
  image?: string | null;
  is_active?: boolean;
  number_of_students_enrolled?: number;
  number_of_courses_has?: number;
}

export interface CourseFilters {
  search: string;
  section_id: string;
  subsection_id: string;
  subsubsection_id: string;
  specialization_id: string;
  specialization_material_id: string;
  teacher: string;
  is_free: string;
  is_special: string;
}

export const EMPTY_COURSE_FILTERS: CourseFilters = {
  search: "",
  section_id: "",
  subsection_id: "",
  subsubsection_id: "",
  specialization_id: "",
  specialization_material_id: "",
  teacher: "",
  is_free: "",
  is_special: "",
};

export function buildCoursesQueryString(
  filters: CourseFilters,
  page: number,
  pageSize: number,
) {
  const params = new URLSearchParams();
  if (filters.search.trim()) params.set("search", filters.search.trim());
  if (filters.section_id) params.set("section_id", filters.section_id);
  if (filters.subsection_id) params.set("subsection_id", filters.subsection_id);
  if (filters.subsubsection_id)
    params.set("subsubsection_id", filters.subsubsection_id);
  if (filters.specialization_id)
    params.set("specialization_id", filters.specialization_id);
  if (filters.specialization_material_id)
    params.set("specialization_material_id", filters.specialization_material_id);
  if (filters.teacher) params.set("teacher", filters.teacher);
  if (filters.is_free) params.set("is_free", filters.is_free);
  if (filters.is_special) params.set("is_special", filters.is_special);
  params.set("page", String(page));
  params.set("page_size", String(pageSize));
  return params.toString();
}
