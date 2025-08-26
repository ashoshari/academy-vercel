import Layout from "@/layout/dashboard/Layout";
import LoginPage from "@/pages/LoginPage";

import useAuth from "@/store/useAuth";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";

// react date picker
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
// import { HomeScreen } from "@/pages/HomeScreen";

import ContactPage from "@/pages/Contact";

// Platform
import { PlatformLayout } from "@/layout/platform/layout";
import Home from "@/pages/platform/Home";
import TreePage from "@/pages/platform/treePage";
import TermsAndConditions from "@/pages/platform/termsAndConditions";
import PrivacyPolicy from "@/pages/platform/privacyPolicy";
import TeacherProfile from "@/pages/platform/teacher";
import CoursePage from "@/components/platform/courses/courseParts/coursePage";

// Dashboard
import Dashboard from "@/pages/dashboard/admin/Dashboard";
import TeachersPage from "@/pages/dashboard/admin/teachers/TeachersPage";
import LibrariesPage from "@/pages/dashboard/admin/libraries/LibrariesPage";
import StudentsPage from "@/pages/dashboard/admin/students/StudentsPage";

// Courses
import CoursesPage from "@/pages/dashboard/admin/courses/CoursesPage";
// import MainCoursePage from "@/pages/dashboard/admin/courses/MainCoursePage";

import AddTeacherPage from "@/pages/dashboard/admin/teachers/AddTeacherPage";
import EditTeacherPage from "@/pages/dashboard/admin/teachers/EditTeacherPage";
import TeacherDetailsPage from "@/pages/dashboard/admin/teachers/TeacherDetailsPage";

import AddLibraryPage from "@/pages/dashboard/admin/libraries/AddLibraryPage";
import EditLibraryPage from "@/pages/dashboard/admin/libraries/EditLibraryPage";
import LibraryDetailsPage from "@/pages/dashboard/admin/libraries/LibraryDetailsPage";
import LibraryWalletPage from "@/pages/dashboard/admin/libraries/LibraryWallet";

import CardPricingPage from "@/pages/dashboard/admin/cards/CardPricingPage";
import CardCodesPage from "@/pages/dashboard/admin/cards/CardCodesPage";
import AllCourses from "@/components/platform/courses/allCourses";
import SectionsPage from "@/pages/dashboard/admin/sections/SectionsPage";
import PhoneUser from "@/pages/platform/phoneUser";
import SubsectionsPage from "@/pages/dashboard/admin/sections/SubSubsections";
import Exam from "@/components/platform/exams/exam";
import AddStudentPage from "@/pages/dashboard/admin/students/AddStudentPage";
import EditStudentPage from "@/pages/dashboard/admin/students/EditStudentPage";
import StudentDetailsPage from "@/pages/dashboard/admin/students/StudentDetailsPage";
import ExamsPage from "@/pages/dashboard/admin/exams/ExamsPage";
import ResourcesPage from "@/pages/dashboard/admin/files/filesPage";
import SliderPage from "@/pages/dashboard/admin/sliders/SliderPage";
import { RequireRole } from "./guards";
import { readUserFromStorage, roleOf } from "@/services/auth";

function DashboardIndexGate() {
  const user = readUserFromStorage();
  const role = roleOf(user) ?? "";
  return role === "library" ? (
    <Navigate to="card-pricing" replace />
  ) : (
    <Dashboard />
  );
}

export default function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PlatformLayout />}>
          <Route index element={<Home />} />
          <Route path="sections/:navHeaderId" element={<TreePage />} />
          <Route path="all-courses" element={<AllCourses />} />
          <Route path="teacher/:id" element={<TeacherProfile />} />
          <Route path="coursePage/:courseId" element={<CoursePage />} />
          <Route path="exam/:examId" element={<Exam />} />
          <Route path="phone-user" element={<PhoneUser />} />
          <Route path="terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
        </Route>
        <Route path="contact" element={<ContactPage />} />

        {isAuthenticated && (
          <Route path="dashboard" element={<Layout />}>
            <Route index element={<DashboardIndexGate />} />

            <Route element={<RequireRole exclude={["library"]} />}>
              {/* students */}
              <Route path="students" element={<StudentsPage />} />
              <Route path="students/add" element={<AddStudentPage />} />
              <Route path="students/edit/:id" element={<EditStudentPage />} />
              <Route path="students/:id" element={<StudentDetailsPage />} />
              {/* students */}

              {/* teachers */}
              <Route path="teachers" element={<TeachersPage />} />
              <Route path="teachers/add" element={<AddTeacherPage />} />
              <Route path="teachers/edit/:id" element={<EditTeacherPage />} />
              <Route path="teachers/:id" element={<TeacherDetailsPage />} />
              {/* teachers */}

              {/* libraries */}
              <Route path="libraries" element={<LibrariesPage />} />
              <Route path="libraries/add" element={<AddLibraryPage />} />
              <Route path="libraries/edit/:id" element={<EditLibraryPage />} />
              <Route
                path="libraries/wallet/:id"
                element={<LibraryWalletPage />}
              />
              <Route path="libraries/:id" element={<LibraryDetailsPage />} />
              {/* libraries */}

              {/* courses */}
              <Route path="courses" element={<CoursesPage />} />
              {/* courses */}

              {/* exams */}
              <Route path="exams" element={<ExamsPage />} />
              {/* exams */}

              {/* files */}
              <Route path="files" element={<ResourcesPage />} />
              {/* files */}

              {/* slider */}
              <Route path="slider" element={<SliderPage />} />
              {/* slider */}

              {/* sections */}
              <Route path="sections" element={<SectionsPage />} />
              <Route path="sub-sections" element={<SubsectionsPage />} />
              {/* sections */}
            </Route>
            {/* cards */}
            <Route path="card-pricing" element={<CardPricingPage />} />
            <Route path="card-codes" element={<CardCodesPage />} />
            {/* cards */}
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
