import { create } from "zustand";
interface LessonState {
  currentLessonIndex: number;
  setCurrentLessonIndex: (currentLessonIndex: number) => void;
  currentLesson: any;
  setCurrentLesson: (currentLesson: any) => void;
}

export const useLesson = create<LessonState>((set) => ({
  currentLessonIndex: 0,
  currentLesson: null,
  setCurrentLessonIndex: (currentLessonIndex: number) => {
    set({ currentLessonIndex });
  },
  setCurrentLesson: (currentLesson: any) => set({ currentLesson }),
}));
