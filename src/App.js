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


import PatientProfile from "./pages/PatientDashboard";
import DoctorProfile from "./pages/DoctorProfile";
import HRManagement from "./pages/HRManagement.js";
import FacilitiesManagement from "./pages/FacilitiesManagement.js";
import ManageFacility from "./pages/ManageFacility.js";
import PandemicManagement from "./pages/PandemicManagement.js";
import AuditReports from "./pages/AuditReports.js";
import DoctorPatientList from "./pages/DoctorPatientList.js"
import DoctorLabResults from "./pages/DoctorLabResults.js"
import PrescriptionReview from "./pages/PrescriptionReview.js"
import DoctorSchedule from "./pages/DoctorSchedule.js"
import PatientRecords from "./pages/PatientRecords.js"
import PatientCareTeam from "./pages/PatientCareTeam.js"
import PatientBookings from "./pages/PatientBookings.js"
import FacilityResourceManagement from "./pages/FacilityResourceManagement.js"




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

  return (
    <div className="row">
      <div className="d-flex col">
        {!isAuthPage && <Sidebar userRole={localStorage.userType}/>}
        
        <div className={`container-fluid ${isAuthPage ? 'col-12' : 'col'}`}>
          <TopNavBar />
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
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />

            <Route path="/patient" element={
            <ProtectedRoute>
              <PatientProfile/>
            </ProtectedRoute>
          }/>
          <Route path="/doctor" element={
            <ProtectedRoute>
              <DoctorProfile/>
            </ProtectedRoute>
          }/>
          <Route path="/hrmanagement" element={
            <ProtectedRoute>
              <HRManagement/>
            </ProtectedRoute>
          }/>
          <Route path="/facilitiesmanagement" element={
            <ProtectedRoute>
              <FacilitiesManagement/>
            </ProtectedRoute>
          }/>
          <Route path="/managefacility" element={
            <ProtectedRoute>
              <ManageFacility/>
            </ProtectedRoute>
          }/>
          <Route path="/facility-resources" element={
            <ProtectedRoute>
              <FacilityResourceManagement/>
            </ProtectedRoute>
          }/>
          <Route path="/pandemicmanagement" element={
            <ProtectedRoute>
              <PandemicManagement/>
            </ProtectedRoute>
          }/>
           <Route path="/patient-list" element={
            <ProtectedRoute>
              <DoctorPatientList/>
            </ProtectedRoute>
          }/>
          <Route path="/lab-results" element={
            <ProtectedRoute>
              <DoctorLabResults/>
            </ProtectedRoute>
          }/>
          <Route path="/prescriptions" element={
            <ProtectedRoute>
              <PrescriptionReview/>
            </ProtectedRoute>
          }/>
           <Route path="/schedule" element={
            <ProtectedRoute>
              <DoctorSchedule/>
            </ProtectedRoute>
          }/>
          <Route path="/patient-records" element={
            <ProtectedRoute>
              <PatientRecords/>
              <PatientCareTeam/>
            </ProtectedRoute>
          }/>
          <Route path="/mydoctors" element={
            <ProtectedRoute>
              <PatientCareTeam/>
            </ProtectedRoute>
          }/>
          <Route path="/mybookings" element={
            <ProtectedRoute>
              <PatientBookings/>
            </ProtectedRoute>
          }/>
          <Route path="/audit-reports" element={
            <ProtectedRoute>
              <AuditReports />
            </ProtectedRoute>
          } />
          
          
          {/* Optional: Redirect any unknown paths to /auth or / */}
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
