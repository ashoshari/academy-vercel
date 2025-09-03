import { create } from "zustand";

interface TokenState {
  accessToken: string | null;
  isLoggedIn: boolean;
  setTokens: (access: string, user: any) => void;
  clearTokens: () => void;
}

// Read token from localStorage once during store initialization
const initialAccessToken = localStorage.getItem("platform_auth_tokens");

const useTokenStore = create<TokenState>((set) => ({
  accessToken: initialAccessToken,
  isLoggedIn: !!initialAccessToken,

  setTokens: (access:string, user:any) => {
    localStorage.setItem("platform_auth_tokens", JSON.stringify(access));
    localStorage.setItem("platform_user", JSON.stringify(user));
    localStorage.setItem("user_type", JSON.stringify(user.type.id));
    set({
      accessToken: access,
      isLoggedIn: true,
    });
  },

  clearTokens: () => {
    localStorage.removeItem("platform_auth_tokens");
    localStorage.removeItem("platform_user");
    localStorage.removeItem("user_type");
    set({
      accessToken: null,
      isLoggedIn: false,
    });
  },
}));

export default useTokenStore;

