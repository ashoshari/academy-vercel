import type { CourseCardData } from "@/components/core/CourseCard";
import type { FilterOption } from "@/components/core/FilterSection";
import {
  BookOpen,
  GraduationCap,
  Layers,
  Library,
  Sparkles,
  Target,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface CategoryItem {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

export const CATEGORIES: CategoryItem[] = [
  {
    id: "tawjihi",
    title: "توجيهي",
    subtitle: "دورات شاملة",
    icon: GraduationCap,
    iconBg: "#ede9fe",
    iconColor: "#7c3aed",
  },
  {
    id: "tawjihi-supplementary",
    title: "توجيهي تكميلي",
    subtitle: "مراجعة مكثفة",
    icon: Sparkles,
    iconBg: "#fce7f3",
    iconColor: "#db2777",
  },
  {
    id: "basics",
    title: "أساسيات",
    subtitle: "بناء القاعدة",
    icon: BookOpen,
    iconBg: "#fef3c7",
    iconColor: "#d97706",
  },
  {
    id: "skills",
    title: "مهارات",
    subtitle: "تطوير الذات",
    icon: Target,
    iconBg: "#dbeafe",
    iconColor: "#2563eb",
  },
  {
    id: "exams",
    title: "امتحانات",
    subtitle: "تدريب ومحاكاة",
    icon: Layers,
    iconBg: "#d1fae5",
    iconColor: "#059669",
  },
  {
    id: "library",
    title: "مكتبة",
    subtitle: "مصادر تعليمية",
    icon: Library,
    iconBg: "#e0e7ff",
    iconColor: "#4f46e5",
  },
];

export const FILTER_SECTIONS: {
  key: string;
  title: string;
  options: FilterOption[];
}[] = [
  {
    key: "departments",
    title: "الأقسام",
    options: [
      { id: "dept-tawjihi", label: "توجيهي" },
      { id: "dept-tawjihi-sup", label: "توجيهي تكميلي" },
      { id: "dept-fourth", label: "رابع" },
      { id: "dept-fifth", label: "خامس" },
      { id: "dept-sixth", label: "سادس" },
    ],
  },
  {
    key: "grades",
    title: "الصفوف",
    options: [
      { id: "grade-2007", label: "توجيهي 2007" },
      { id: "grade-2008", label: "توجيهي 2008" },
      { id: "grade-2009", label: "توجيهي 2009" },
      { id: "grade-2010", label: "توجيهي 2010" },
    ],
  },
  {
    key: "specialization",
    title: "التخصص",
    options: [
      { id: "spec-scientific", label: "علمي" },
      { id: "spec-literary", label: "أدبي" },
      { id: "spec-vocational", label: "مهني" },
    ],
  },
  {
    key: "subjects",
    title: "مواد التخصص",
    options: [
      { id: "subj-biology", label: "أحياء" },
      { id: "subj-physics", label: "فيزياء" },
      { id: "subj-chemistry", label: "كيمياء" },
      { id: "subj-math", label: "رياضيات" },
      { id: "subj-arabic", label: "لغة عربية" },
      { id: "subj-english", label: "لغة إنجليزية" },
    ],
  },
];

/** Verified working Unsplash URLs (w=600&h=380&fit=crop) */
const COURSE_IMAGES = [
  "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=380&fit=crop",
  "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&h=380&fit=crop",
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=380&fit=crop",
  "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=380&fit=crop",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=380&fit=crop",
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=380&fit=crop",
  "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=380&fit=crop",
  "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&h=380&fit=crop",
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=380&fit=crop",
];

const BADGE_STYLES = [
  { label: "توجيهي", bg: "#ede9fe", text: "#6d28d9" },
  { label: "علمي", bg: "#dbeafe", text: "#1d4ed8" },
  { label: "أدبي", bg: "#fef3c7", text: "#b45309" },
  { label: "رياضيات", bg: "#fce7f3", text: "#be185d" },
  { label: "فيزياء", bg: "#d1fae5", text: "#047857" },
  { label: "كيمياء", bg: "#e0e7ff", text: "#4338ca" },
];

export const MOCK_COURSES: CourseCardData[] = [
  {
    id: "1",
    title: "الرياضيات - الثالث متوسط",
    instructor: "أ. أحمد الساعدي",
    rating: 4.8,
    reviewCount: 124,
    lessonsCount: 32,
    enrolledCount: 450,
    price: 25000,
    image: COURSE_IMAGES[0],
    categoryLabel: BADGE_STYLES[0].label,
    categoryColor: BADGE_STYLES[0].bg,
    categoryTextColor: BADGE_STYLES[0].text,
  },
  {
    id: "2",
    title: "الفيزياء - توجيهي علمي",
    instructor: "د. محمد العلي",
    rating: 4.9,
    reviewCount: 89,
    lessonsCount: 28,
    enrolledCount: 320,
    price: 30000,
    image: COURSE_IMAGES[1],
    categoryLabel: BADGE_STYLES[1].label,
    categoryColor: BADGE_STYLES[1].bg,
    categoryTextColor: BADGE_STYLES[1].text,
  },
  {
    id: "3",
    title: "اللغة العربية - توجيهي أدبي",
    instructor: "أ. فاطمة الحسن",
    rating: 4.7,
    reviewCount: 156,
    lessonsCount: 24,
    enrolledCount: 280,
    price: 22000,
    image: COURSE_IMAGES[2],
    categoryLabel: BADGE_STYLES[2].label,
    categoryColor: BADGE_STYLES[2].bg,
    categoryTextColor: BADGE_STYLES[2].text,
  },
  {
    id: "4",
    title: "الكيمياء - توجيهي علمي",
    instructor: "أ. سارة محمود",
    rating: 4.6,
    reviewCount: 98,
    lessonsCount: 30,
    enrolledCount: 210,
    price: 28000,
    image: COURSE_IMAGES[3],
    categoryLabel: BADGE_STYLES[3].label,
    categoryColor: BADGE_STYLES[3].bg,
    categoryTextColor: BADGE_STYLES[3].text,
  },
  {
    id: "5",
    title: "الأحياء - توجيهي علمي",
    instructor: "د. خالد يوسف",
    rating: 4.8,
    reviewCount: 112,
    lessonsCount: 26,
    enrolledCount: 195,
    price: 27000,
    image: COURSE_IMAGES[4],
    categoryLabel: BADGE_STYLES[4].label,
    categoryColor: BADGE_STYLES[4].bg,
    categoryTextColor: BADGE_STYLES[4].text,
  },
  {
    id: "6",
    title: "اللغة الإنجليزية - توجيهي",
    instructor: "أ. ليلى أحمد",
    rating: 4.5,
    reviewCount: 76,
    lessonsCount: 22,
    enrolledCount: 340,
    price: 20000,
    image: COURSE_IMAGES[5],
    categoryLabel: BADGE_STYLES[5].label,
    categoryColor: BADGE_STYLES[5].bg,
    categoryTextColor: BADGE_STYLES[5].text,
  },
  {
    id: "7",
    title: "التاريخ - توجيهي أدبي",
    instructor: "أ. عمر ناصر",
    rating: 4.4,
    reviewCount: 64,
    lessonsCount: 20,
    enrolledCount: 175,
    price: 18000,
    image: COURSE_IMAGES[6],
    categoryLabel: BADGE_STYLES[2].label,
    categoryColor: BADGE_STYLES[2].bg,
    categoryTextColor: BADGE_STYLES[2].text,
  },
  {
    id: "8",
    title: "الجغرافيا - توجيهي أدبي",
    instructor: "أ. نور الهدى",
    rating: 4.6,
    reviewCount: 82,
    lessonsCount: 18,
    enrolledCount: 160,
    price: 19000,
    image: COURSE_IMAGES[7],
    categoryLabel: BADGE_STYLES[2].label,
    categoryColor: BADGE_STYLES[2].bg,
    categoryTextColor: BADGE_STYLES[2].text,
  },
  {
    id: "9",
    title: "الرياضيات - توجيهي علمي",
    instructor: "د. ياسر كريم",
    rating: 4.9,
    reviewCount: 201,
    lessonsCount: 35,
    enrolledCount: 520,
    price: 32000,
    image: COURSE_IMAGES[8],
    categoryLabel: BADGE_STYLES[1].label,
    categoryColor: BADGE_STYLES[1].bg,
    categoryTextColor: BADGE_STYLES[1].text,
  },
];
