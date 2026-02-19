// export default App;
import logo from './logo.svg';
import './App.css';
import './index.css';
import {HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';

import Sidebar from './components/sidebar'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import TopNavBar from "./components/TopNavBar";
import AdminDashboard from "./pages/AdminDashboard.js";
import AuthPage from "./pages/AuthPage"

import StudentsPage from './pages/StudentsPage.js';
import StudentProfile from './pages/StudentProfile.js';
import StaffManagementPage from "./pages/StaffManagementPage.js"
import FacilitiesManagement from './pages/FacilitiesManagement.js';
import AccomodationManagement from "./pages/AccomodationManagement.js";
import StaffAttendance from "./pages/StaffAttendance.js";
import FaultReporting from './pages/FaultReporting.js';
import UserProfile from './pages/UserProfile.js';
import WardenSchedule from './pages/WardenSchedule.js';
import ManageSchedule from './pages/ManageSchedule.js';
import EmployeeProfile from './pages/EmployeeProfile.js';
import StudentRecords from './pages/StudentRecords.js';
import ThankYouPage from './pages/ThankYouPage.js';
import MaintenanceAuthPage from './pages/MaintenanceAuthPage.js';
import MaintenanceDashboard from './pages/MaintenanceDashboard.js';
import ReportsPage from './pages/ReportsPage.js';
import ForgotPasswordPage from './pages/ForgotPasswordPage.js';
import StaffRequests from './pages/StaffRequests.js';
import ManageNoticesEvents from './pages/ManageEventsNotices.js';
import AdminStaffRequests from './pages/AdminStaffRequests.js';
import MaintenanceReportsPage from './pages/MaintenanceReportsPage.js';


// ProtectedRoute component to check for authentication
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');

  console.log(!isAuthenticated)
  
  if (!isAuthenticated) {
    // Redirect to the auth page if not authenticated
    return <Navigate to="/auth" replace />;
  }

  return children;
};

const AdminOnlyRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  const userType = localStorage.getItem('userType'); // or localStorage.userType

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  if (userType === 'maintenance') {
    return <Navigate to="/maintenance-dashboard" replace />;
  }
  return children;
};




// Create a layout component that uses useLocation
function Layout({ children }) {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';
  const isMainAuthPage = location.pathname === '/maintenance-auth';
  const isThankYouPage = location.pathname === '/thank-you';
  const isForgotPasswordPage = location.pathname === '/forgot-password';
  const hideLayout = isAuthPage || isThankYouPage || isMainAuthPage || isForgotPasswordPage;

  return (
    <div className="row">
      <div className="d-flex col">
        {!hideLayout && <Sidebar userRole={localStorage.userType}/>}
        
        <div className={`container-fluid ${hideLayout ? 'col-12' : 'col'}`}>
          {!isThankYouPage && <TopNavBar />}
          {children}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public route */}
          <Route path="/auth" element={<AuthPage/>} />
          <Route path="/maintenance-auth" element={<MaintenanceAuthPage/>} />
          <Route path="/thank-you" element={<ThankYouPage/>} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          
          {/* Protected routes */}
          <Route path="/" element={<AdminOnlyRoute><AdminDashboard /></AdminOnlyRoute>} />


          <Route path="/students" element={
            <AdminOnlyRoute>
              <StudentsPage />
            </AdminOnlyRoute>
          } />
          
          <Route path="/student-profile" element={
            <AdminOnlyRoute>
              <StudentProfile />
            </AdminOnlyRoute>
          } />
          
          {/* <Route path="/staff" element={
            <ProtectedRoute>
              <StaffManagementPage />
            </ProtectedRoute>
          } /> */}

          <Route path="/staff" element={<AdminOnlyRoute><StaffManagementPage /></AdminOnlyRoute>} />

          <Route path="/facilities-management" element={
            <ProtectedRoute>
              <FacilitiesManagement />
            </ProtectedRoute>
          } />

          <Route path="/accomodation" element={
            <ProtectedRoute>
              <AccomodationManagement />
            </ProtectedRoute>
          } />

          <Route path="/staff-attendance" element={
            <AdminOnlyRoute>
              <StaffAttendance />
            </AdminOnlyRoute>
          } />

          <Route path="/fault-reporting" element={
            <ProtectedRoute>
              <FaultReporting />
            </ProtectedRoute>
          } />

          <Route path="/user-profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />

          <Route path="/my-schedule" element={
            <ProtectedRoute>
              <WardenSchedule />
            </ProtectedRoute>
          } />

          <Route path="/manage-schedule" element={
            <ProtectedRoute>
              <ManageSchedule />
            </ProtectedRoute>
          } />

          <Route path="/employee-profile/:id" element={
            <AdminOnlyRoute>
              <EmployeeProfile />
            </AdminOnlyRoute>
          } />

          <Route path="/student-records/" element={
            <AdminOnlyRoute>
              <StudentRecords />
            </AdminOnlyRoute>
          } />

          <Route path="/maintenance-dashboard" element={
            <ProtectedRoute>
              <MaintenanceDashboard />
            </ProtectedRoute>
          } />

          <Route path="/reports-page" element={
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/staff-requests" element={
            <AdminOnlyRoute>
              <StaffRequests />
            </AdminOnlyRoute>
          } />

          <Route path="/admin-staff-requests" element={
            <AdminOnlyRoute>
              <AdminStaffRequests />
            </AdminOnlyRoute>
          } />

          <Route path="/manage-notices" element={
            <ProtectedRoute>
              <ManageNoticesEvents />
            </ProtectedRoute>
          } />

          <Route path="/maintenance-reports" element={
            <ProtectedRoute>
              <MaintenanceReportsPage />
            </ProtectedRoute>
          } />

          {/* Optional: Redirect any unknown paths to /auth or / */}
          <Route path="*" element={
              localStorage.getItem('userType') === 'maintenance' 
                ? <Navigate to="/maintenance-auth" replace />
                : <Navigate to="/auth" replace />
            } />
        </Routes>
      </Layout>      
    </Router>
  );
}

export default App;
