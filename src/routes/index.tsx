import Layout from "@/layout/dashboard/Layout";
import LoginPage from "@/pages/LoginPage";

import useAuth from "@/store/useAuth";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";

// react date picker
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
// import { HomeScreen } from "@/pages/HomeScreen";

import ContactPage from "@/pages/Contact";
import Home from "@/pages/platform/Home";
import Courses from '@/pages/platform/courses'
import Dashboard from "@/pages/dashboard/admin/Dashboard";
import TeachersPage from "@/pages/dashboard/admin/TeachersPage";
import StudentsPage from "@/pages/dashboard/admin/StudentsPage";
import CoursesPage from "@/pages/dashboard/admin/CoursesPage";
import { PlatformLayout } from "@/layout/platform/layout";

export default function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PlatformLayout />} >
          <Route index element={<Home />} />
          <Route path="courses" element={<Courses />} />
        </Route>
        <Route path="contact" element={<ContactPage />} />

        {isAuthenticated && (
          <Route path="dashboard" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="teachers" element={<TeachersPage />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="courses" element={<CoursesPage />} />
          </Route>
        )}

        {!isAuthenticated && <Route path="login" element={<LoginPage />} />}

        {isAuthenticated && (
          <Route path="login" element={<Navigate to="/dashboard" replace />} />
        )}

        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
