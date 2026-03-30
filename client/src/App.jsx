import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import { Toaster } from "react-hot-toast";

// Slices
import { getUserProfile, selectAuthUser } from "./slices/authSlice";

// Components & Pages
import CommonDashboard from "./components/CommonDashboard";
import Dashboard from "./components/Dashboard";
import Layout from "./components/company/Layout";
import LoginPage from "./components/Authentication/LoginPage";
import RegisterPage from "./components/Authentication/RegisterPage";

// Student Views
import ProfilePage from "./components/students/ProfilePage";
import ViewProfilePage from "./pages/ViewProfilePage";
import StudentDashBoard from "./components/students/StudentDashboard";
import CompaniesInPlacementDrive from "./components/students/CompaniesInPlacementDrive";
import JobsByDriveAndCompany from "./components/students/JobsByDriveAndCompany";
import StudentApplicationPage from "./components/students/StudentApplicationPage";

// Company Views
import CompanyDashboard from "./components/company/CompanyDashboard";
import CompanyForm from "./components/company/CompanyForm";
import CompanyProfilePage from "./components/company/CompanyProfilePage";
import CompanyJobsList from "./components/company/CompanyJobsList";
import PostJob from "./components/company/PostJob";
import EditJob from "./components/company/EditJob";
import PlacementDriveJobPostWrapper from "./components/company/PlacementDriveJobPostWrapper";
import ApplicationReviewPage from "./components/company/ApplicationReviewPage";
import ApplicationDetailPage from "./components/company/ApplicationDetailPage";
import InterviewSchedulingForm from "./components/company/InterviewSchedulingForm";
import InterviewDetailPage from "./components/company/InterviewDetailPage";
import InterviewFeedbackForm from "./components/company/InterviewFeedbackForm";
import JitsiMeetComponent from "./components/company/JitsiMeetComponent";

// Admin Views
import StudentManagementPage from "./pages/StudentManagementPage";
import StudentDetail from "./pages/StudentDetail";
import ManagePlacementDrives from "./pages/ManagePlacementDrives";
import ReportsPage from "./pages/ReportsPage";
import ReportDetailsPage from "./pages/ReportDetailsPage";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!user && token) {
      dispatch(getUserProfile());
    }
  }, [dispatch, user]);

  const LayoutWithNavbar = () => (
    <Layout>
      <Outlet />
    </Layout>
  );

  const routes = [
    // Public Routes
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
    { path: "/", element: <CommonDashboard /> },

    // Protected Routes (Wrapped with Navbar)
    {
      path: "/",
      element: <LayoutWithNavbar />,
      children: [
        // Dashboards
        { path: ":user/dashboard", element: <Dashboard /> },
        { path: "companydashboard", element: <CompanyDashboard /> },
        { path: "studentdashboard", element: <StudentDashBoard /> }, 
        
        // Profiles
        { path: ":user/studentProfile", element: <ProfilePage /> },
        { path: ":user/viewStudentProfile", element: <ViewProfilePage /> },
        { path: ":user/companyProfile", element: <CompanyForm /> },
        { path: ":user/profile/:id", element: <CompanyProfilePage /> },
        
        // Jobs & Applications
        { path: ":user/postJob", element: <PlacementDriveJobPostWrapper /> },
        { path: ":user/postJob/:placementDriveId", element: <PostJob /> },
        { path: "company/companyJobs", element: <CompanyJobsList /> },
        { path: "company/editJob/:id", element: <EditJob /> },
        { path: ":user/applyJob/:driveId", element: <CompaniesInPlacementDrive /> },
        { path: ":user/applyJob/:driveId/:companyId", element: <JobsByDriveAndCompany /> },
        { path: ":user/applyJob/:driveId/:companyId/:jobId", element: <StudentApplicationPage /> },
        { path: ":user/applications", element: <ApplicationReviewPage /> },
        { path: ":user/applications/:id", element: <ApplicationDetailPage /> },
        
        // Interviews
        { path: ":user/interview", element: <InterviewSchedulingForm /> },
        { path: ":user/interview/:interviewId", element: <InterviewDetailPage /> },
        { path: ":user/interview/interviewFeedback/:interviewId", element: <InterviewFeedbackForm /> },
        { path: ":user/:meetingId", element: <JitsiMeetComponent /> },
        
        // Admin
        { path: ":user/placementDrive", element: <ManagePlacementDrives /> },
        { path: ":user/student/profiles", element: <StudentManagementPage /> },
        { path: ":user/student/profiles/:studentId", element: <StudentDetail /> },
        { path: ":user/reports", element: <ReportsPage /> },
        { path: "dashboard/reports/:id", element: <ReportDetailsPage /> },
      ]
    }
  ];

  const router = createBrowserRouter(routes, {
    future: {
      v7_startTransition: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  });

  return (
    <>
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
      <Toaster 
        position="top-center" 
        reverseOrder={false} 
        toastOptions={{
          style: {
            fontFamily: 'Inter, sans-serif',
            fontWeight: '600',
            borderRadius: '10px',
          }
        }} 
      />
    </>
  );
};

export default App;