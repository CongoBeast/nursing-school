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





// ProtectedRoute component to check for authentication
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  
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
          
          
          {/* Optional: Redirect any unknown paths to /auth or / */}
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;