import Layout from "@/layout/Layout";
import LoginPage from "@/pages/LoginPage";

import useAuth from "@/store/useAuth";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";

// react date picker
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
// import { HomeScreen } from "@/pages/HomeScreen";

import ContactPage from "@/pages/Contact";
import Home from "@/pages/Home";
import Dashboard from "@/pages/dashboard/admin/Dashboard";
import TeachersPage from "@/pages/dashboard/admin/teachers/TeachersPage";
import StudentsPage from "@/pages/dashboard/admin/StudentsPage";
import CoursesPage from "@/pages/dashboard/admin/CoursesPage";
import AddTeacherPage from "@/pages/dashboard/admin/teachers/AddTeacherPage";
import EditTeacherPage from "@/pages/dashboard/admin/teachers/EditTeacherPage";
import TeacherDetailsPage from "@/pages/dashboard/admin/teachers/TeacherDetailsPage";

export default function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="contact" element={<ContactPage />} />

        {isAuthenticated && (
          <Route path="dashboard" element={<Layout />}>
            <Route index element={<Dashboard />} />
            {/* teachers */}
            <Route path="teachers" element={<TeachersPage />} />
            <Route path="teachers/add" element={<AddTeacherPage />} />
            <Route path="teachers/edit/:id" element={<EditTeacherPage />} />
            <Route path="teachers/:id" element={<TeacherDetailsPage />} />

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
