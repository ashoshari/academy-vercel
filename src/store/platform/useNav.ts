// import { create } from "zustand";

// interface UserAuthState {
//   navHeader: string;
//   id: string;
//   setNavHeader: (navHeader: string) => void;
//   setId: (id: string) => void;
// }
// const useUserAuthStore = create<UserAuthState>((set) => ({
//   navHeader: window.localStorage.getItem("navHeader") || "الدورات",
//   id: window.localStorage.getItem("id") || "id",
//   setNavHeader: (navHeader) => {
//     window.localStorage.setItem("navHeader", navHeader);
//     set({ navHeader: navHeader });
//   },
//   setId: (id) => {
//     window.localStorage.setItem("id", id);
//     set({ id: id });
//   },
// }));

// export default useUserAuthStore;
