import { create } from "zustand";

interface UserAuthState {
  navHeader: string;
  navTitle: string;
  setNavHeader: (navHeader: string) => void;
  setNavTitle: (navTitle: string) => void;
}
const useUserAuthStore = create<UserAuthState>((set) => ({
  navHeader: "courses",
  navTitle: "الدورات",
  setNavHeader: (navHeader) => set({ navHeader: navHeader }),
  setNavTitle: (navTitle) => set({ navTitle: navTitle }),
}));

export default useUserAuthStore;
