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
