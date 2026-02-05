// import logo from './logo.svg';
// import './App.css';
// import './index.css';
// import {HashRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

// import Sidebar from './components/sidebar'
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import TopNavBar from "./components/TopNavBar";
// import AdminDashboard from "./pages/AdminDashboard.tsx";

// import PatientProfile from "./pages/PatientDashboard";
// import DoctorProfile from "./pages/DoctorProfile";
// import HRManagement from "./pages/HRManagement.js";
// import FacilitiesManagement from "./pages/FacilitiesManagement.js";
// import ManageFacility from "./pages/ManageFacility.js";
// import PandemicManagement from "./pages/PandemicManagement.js";
// import AuditReports from "./pages/AuditReports.js";
// import AuthPage from "./pages/AuthPage"


// function App() {
//   return (

//     <div className="row">
//     <Router>

//       <div className="d-flex col">
//         <Sidebar userRole="admin"/>

//         <div className="container-fluid col">
//             {/* <TopNavBar /> */}
//       <Routes>
//       <Route path="/" element={<AdminDashboard />} />
//       <Route path="/patient" element={<PatientProfile/>}/>
//       <Route path="/doctor" element={<DoctorProfile/>}/>
//       <Route path="/hrmanagement" element={<HRManagement/>}/>
//       <Route path="/facilitiesmanagement" element={<FacilitiesManagement/>}/>
//       <Route path="/managefacility" element={<ManageFacility/>}/>
//       <Route path="/pandemicmanagement" element={<PandemicManagement/>}/>
//       <Route path="/audit-reports" element={<AuditReports />} />
//       <Route path="/auth" element={<AuthPage/>} />
//       </Routes>
//             </div>
    
//       </div>
//     </Router>
//     </div>
//   );
// }

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

// Create a layout component that uses useLocation
function Layout({ children }) {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';
  const isThankYouPage = location.pathname === '/thank-you';
  const hideLayout = isAuthPage || isThankYouPage;

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
          <Route path="/thank-you" element={<ThankYouPage/>} />
          
          {/* Protected routes */}
          // <Route path="/" element={
          //   <ProtectedRoute>
          //     <AdminDashboard />
          //   </ProtectedRoute>
          // } />

          // <Route path="/students" element={
          //   <ProtectedRoute>
          //     <StudentsPage />
          //   </ProtectedRoute>
          // } />
          
          // <Route path="/student-profile" element={
          //   <ProtectedRoute>
          //     <StudentProfile />
          //   </ProtectedRoute>
          // } />
          
          // <Route path="/staff" element={
          //   <ProtectedRoute>
          //     <StaffManagementPage />
          //   </ProtectedRoute>
          // } />

          // <Route path="/facilities-management" element={
          //   <ProtectedRoute>
          //     <FacilitiesManagement />
          //   </ProtectedRoute>
          // } />

          // <Route path="/accomodation" element={
          //   <ProtectedRoute>
          //     <AccomodationManagement />
          //   </ProtectedRoute>
          // } />

          // <Route path="/staff-attendance" element={
          //   <ProtectedRoute>
          //     <StaffAttendance />
          //   </ProtectedRoute>
          // } />

          // <Route path="/fault-reporting" element={
          //   <ProtectedRoute>
          //     <FaultReporting />
          //   </ProtectedRoute>
          // } />

          // <Route path="/user-profile" element={
          //   <ProtectedRoute>
          //     <UserProfile />
          //   </ProtectedRoute>
          // } />

          // <Route path="/my-schedule" element={
          //   <ProtectedRoute>
          //     <WardenSchedule />
          //   </ProtectedRoute>
          // } />

          // <Route path="/manage-schedule" element={
          //   <ProtectedRoute>
          //     <ManageSchedule />
          //   </ProtectedRoute>
          // } />

          // <Route path="/employee-profile/:id" element={
          //   <ProtectedRoute>
          //     <EmployeeProfile />
          //   </ProtectedRoute>
          // } />

          // <Route path="/student-records/" element={
          //   <ProtectedRoute>
          //     <StudentRecords />
          //   </ProtectedRoute>
          // } />
          
          {/* Optional: Redirect any unknown paths to /auth or / */}
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </Layout>      
    </Router>
  );
}

export default App;
