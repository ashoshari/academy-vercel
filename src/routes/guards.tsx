import { Navigate, Outlet } from "react-router";
import { readUserFromStorage, roleOf } from "@/services/auth";

type Role = "admin" | "teacher" | "library" | string;

export function RequireRole({
  allow,
  exclude,
}: {
  allow?: Role[];
  exclude?: Role[];
}) {
  const user = readUserFromStorage();
  const role = roleOf(user) ?? "";

  if (exclude?.includes(role)) return <Navigate to="/dashboard" replace />;
  if (allow && !allow.includes(role))
    return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
