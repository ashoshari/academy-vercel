import { NavigateFunction } from "react-router";

const AUTH_TOKEN_KEY = "auth_tokens";
const PLATFORM_TOKEN_KEY = "platform_auth_tokens";

export function getStoredTokens(): string | null {
  try {
    const tokens =
      localStorage.getItem(AUTH_TOKEN_KEY) ??
      localStorage.getItem(PLATFORM_TOKEN_KEY);
    return tokens ? JSON.parse(tokens) : null;
  } catch {
    return null;
  }
}

export async function storeTokens(
  tokens: string,
  navigate?: NavigateFunction,
  setIsAuthenticated?: () => void,
): Promise<void> {
  await localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));

  if (setIsAuthenticated) setIsAuthenticated();

  if (navigate) navigate("/dashboard");
}

export async function removeTokens(
  navigate?: NavigateFunction,
  setIsAuthenticated?: () => void,
): Promise<void> {
  await localStorage.removeItem(TOKEN_KEY);
  await localStorage.removeItem("company_domian");

  if (setIsAuthenticated) setIsAuthenticated();

  if (navigate) navigate("/", { replace: true });
}

export function isAuthenticated(): boolean {
  return !!getStoredTokens();
}

export type User = {
  type?: { id?: number; name?: string };
  is_active?: boolean;
  [k: string]: any;
};

export function readUserFromStorage(): User | null {
  const raw = localStorage.getItem("user");
  try {
    const u = JSON.parse(raw as string);
    if (u && typeof u === "object" && "type" in u) return u as User;
  } catch {
    console.log("no user logged in");
  }
  return null;
}

export const roleOf = (u: User | null): string | null =>
  u?.type?.name?.toLowerCase?.() ?? null;
