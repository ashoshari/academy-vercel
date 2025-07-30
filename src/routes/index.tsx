import Layout from "@/layout/dashboard/Layout";
import LoginPage from "@/pages/LoginPage";

import useAuth from "@/store/useAuth";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";

// react date picker
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
// import { HomeScreen } from "@/pages/HomeScreen";

import ContactPage from "@/pages/Contact";

import { PlatformLayout } from "@/layout/platform/layout";
import Home from "@/pages/platform/Home";
import Courses from "@/pages/platform/courses";
import TermsAndConditions from "@/pages/platform/termsAndConditions";
import PrivacyPolicy from "@/pages/platform/privacyPolicy";
import TeacherProfile from "@/pages/platform/teacher";
import CoursePage from "@/components/platform/courses/courseParts/coursePage";
import CoursePageOld from "@/components/platform/courses/coursePageOld";
// import  CoursePage  from "@/components/platform/exams/sidebar";
import Dashboard from "@/pages/dashboard/admin/Dashboard";
import TeachersPage from "@/pages/dashboard/admin/teachers/TeachersPage";
import StudentsPage from "@/pages/dashboard/admin/StudentsPage";
import CoursesPage from "@/pages/dashboard/admin/CoursesPage";
import AddTeacherPage from "@/pages/dashboard/admin/teachers/AddTeacherPage";
import EditTeacherPage from "@/pages/dashboard/admin/teachers/EditTeacherPage";
import TeacherDetailsPage from "@/pages/dashboard/admin/teachers/TeacherDetailsPage";
import CardPricingPage from "@/pages/dashboard/admin/cards/CardPricingPage";
import CardCodesPage from "@/pages/dashboard/admin/cards/CardCodesPage";
import AllCourses from "@/components/platform/courses/allCourses";
import PhoneUser from "@/pages/platform/phoneUser";

export default function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PlatformLayout />}>
          <Route index element={<Home />} />
          <Route path="sections/:navHeaderId" element={<Courses />} />
          <Route path="all-courses" element={<AllCourses />} />
          <Route path="teacher/:id" element={<TeacherProfile />} />
          <Route path="coursePageOld/:courseId" element={<CoursePageOld />} />
          <Route path="coursePage/:courseId" element={<CoursePage />} />
          <Route path="phone-user" element={<PhoneUser />} />
          <Route path="terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
        </Route>
        <Route path="contact" element={<ContactPage />} />

        {isAuthenticated && (
          <Route path="dashboard" element={<Layout />}>
            <Route index element={<Dashboard />} />
            {/* teachers */}
            <Route path="teachers" element={<TeachersPage />} />
            <Route path="teachers/add" element={<AddTeacherPage />} />
            <Route path="teachers/edit/:id" element={<EditTeacherPage />} />
            <Route path="teachers/:id" element={<TeacherDetailsPage />} />
            {/* teachers */}

            {/* cards */}
            <Route path="card-pricing" element={<CardPricingPage />} />
            <Route path="card-codes" element={<CardCodesPage />} />
            {/* cards */}

            {/*  */}

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
