import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserAuthState {
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
}
const useUserAuthStore = create<UserAuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      setIsLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),
    }),
    {
      name: "user-auth", // 🔑 Key in localStorage
    }
  )
);

export default useUserAuthStore;
