// import Container from 'react-bootstrap/Container';
// import Nav from 'react-bootstrap/Nav';
// import Navbar from 'react-bootstrap/Navbar';
// import { Button } from "react-bootstrap";
// import NavDropdown from 'react-bootstrap/NavDropdown';
// import { Link, useLocation , useNavigate } from "react-router-dom";
// import React, { useState, useEffect } from "react";


// import { RxDashboard, RxPinLeft } from "react-icons/rx";
// import { GiTruck } from "react-icons/gi";
// import { IoPieChartSharp } from "react-icons/io5";
// import { FaInfoCircle } from "react-icons/fa";
// import { FaFileInvoiceDollar } from "react-icons/fa";
// import { IoIosPeople } from "react-icons/io";
// import { GiCoalWagon } from "react-icons/gi";
// import { BiSupport } from "react-icons/bi";
// import { SiMicrosoftexcel } from "react-icons/si";
// import { RiAlarmWarningFill } from "react-icons/ri";
// import { FaHome , FaTruck} from "react-icons/fa";
// import { BsFillFileBarGraphFill } from "react-icons/bs";
// import { IoIosInformationCircle } from "react-icons/io";
// import { FaNewspaper } from "react-icons/fa6";
// import { BiLogInCircle } from "react-icons/bi";



// function TopNavBar() {

//   const location = useLocation();
//   const navigate = useNavigate();
//   const [isOpen, setIsOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     // Check if token exists in local storage
//     const token = localStorage.getItem('token');
//     if (token) {
//       setIsLoggedIn(true);
//     } else {
//       setIsLoggedIn(false);
//     }
//   }, [location]); // Check login status on location change

//   const isLinkActive = (path) => location.pathname === path;

//   const handleLogout = () => {
//     // Remove token from local storage and update state
//     localStorage.removeItem('token');
//     setIsLoggedIn(false);
//     navigate('/'); // Redirect to home after logout
//   };

//   return (
//     // <Navbar collapseOnSelect expand="md" className="bg-body-tertiary d-lg-none mb-3 mx p-1">
//     <Navbar 
//       collapseOnSelect 
//       expand="md" 
//       style={{ backgroundColor: '#3a0ca3' }} 
//       className="mb-3 mx p-1 navbar-dark d-lg-none"
//       onToggle={() => setIsOpen(!isOpen)}
//       expanded={isOpen}
//     >
//       <Container>
//         <Navbar.Brand as={Link} to="/" className="text-white">
//           <img 
//             src="https://github.com/CongoBeast/SpaceShare/blob/main/public/Meli-removebg-preview.png?raw=true" 
//             alt="Imat Tech Logo"
//             style={{ maxHeight: "50px", maxWidth: "50px" }}
//             className="d-flex align-items-center"
//           />
//         </Navbar.Brand>

//         <Navbar.Toggle aria-controls="responsive-navbar-nav" className="border-0" />
//         <Navbar.Collapse id="responsive-navbar-nav">
//           <Nav className="ml-auto" style={{ textAlign: "right" }}>
//             <Nav.Link 
//               as={Link}
//               to="/"
//               className={`text-left d-flex align-items-center text-white ${isLinkActive("/") ? "active" : ""}`}
//               style={{ marginBottom: "1rem" }}
//               onClick={() => setIsOpen(false)}
//             >
//               <FaHome />
//               <span style={{ marginLeft: "1rem" }}>Home</span>
//             </Nav.Link>

//             {!isLoggedIn && (
//               <Nav.Link
//                 as={Link}
//                 to="/auth"
//                 className={`text-left d-flex align-items-center text-white ${isLinkActive("/auth") ? "active" : ""}`}
//                 style={{ marginBottom: "1rem" }}
//                 onClick={() => setIsOpen(false)}
//               >
//                 <BiLogInCircle />
//                 <span style={{ marginLeft: "1rem" }}>Client Login</span>
//               </Nav.Link>
//             )}

//             <Nav.Link 
//               as={Link}
//               to="/profile"
//               className={`text-left d-flex align-items-center text-white ${isLinkActive("/profile") ? "active" : ""}`}
//               style={{ marginBottom: "1rem" }}
//               onClick={() => setIsOpen(false)}
//             >
//               <FaNewspaper />
//               <span style={{ marginLeft: "1rem" }}>Profile</span>
//             </Nav.Link>

//             <Nav.Link 
//               as={Link}
//               to="/shippers"
//               className={`text-left d-flex align-items-center text-white ${isLinkActive("/shippers") ? "active" : ""}`}
//               style={{ marginBottom: "1rem" }}
//               onClick={() => setIsOpen(false)}
//             >
//               <FaTruck />
//               <span style={{ marginLeft: "1rem" }}>Pro Shippers</span>
//             </Nav.Link>

//             <Nav.Link
//               as={Link}
//               to="/about"
//               className={`text-left d-flex align-items-center text-white ${isLinkActive("/about") ? "active" : ""}`}
//               style={{ marginBottom: "1rem" }}
//               onClick={() => setIsOpen(false)}
//             >
//               <IoIosInformationCircle />
//               <span style={{ marginLeft: "1rem" }}>About Us</span>
//             </Nav.Link>

//             {isLoggedIn && (
//               <>
//                 <Nav.Link
//                   as={Link}
//                   to="/notifications"
//                   className={`text-left d-flex align-items-center text-white ${isLinkActive("/notifications") ? "active" : ""}`}
//                   style={{ marginBottom: "1rem" }}
//                   onClick={() => setIsOpen(false)}
//                 >
//                   <IoIosInformationCircle />
//                   <span style={{ marginLeft: "1rem" }}>Notifications</span>
//                 </Nav.Link>
//                 <Nav.Link
//                   onClick={() => {
//                     handleLogout();
//                     setIsOpen(false);
//                   }}
//                   className="text-left d-flex align-items-center text-white"
//                   style={{ marginBottom: "1rem" }}
//                 >
//                   <span style={{ marginLeft: "1rem" }}>Logout</span>
//                 </Nav.Link>
//               </>
//             )}
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// }

// export default TopNavBar;

import React, { useState, useEffect } from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { 
  Users, ClipboardList, Calendar, Activity, 
  FileText, User, LogOut, Stethoscope,
  ClipboardCheck, Pill, BookOpen, Settings,
  BarChart2, Megaphone, Building, Shield, ShieldX ,
  Menu, X, House, HardHat, Handshake
} from 'lucide-react';
// import './topnavbar.css';
import { Link, useLocation, useNavigate } from "react-router-dom";


const TopNavbar = ({ userRole = localStorage.userType }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(window.innerWidth < 992);

  const navigate = useNavigate();
  

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      const shouldShow = window.innerWidth < 992; // Show only below lg (992px)
      setShowNavbar(shouldShow);
      if (!shouldShow) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {


    var navString = ""

    if(localStorage.getItem('userType') == "maintenance"){
      navString = "/maintenance-auth"
    }
    else{
      navString = "/auth"
    }

    const username = localStorage.getItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('user');
    localStorage.removeItem('email');
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
    
    console.log('Logged out');
    setIsMenuOpen(false);

    navigate(navString);
  };

  // const handleNavClick = (href) => {
  //   console.log('Navigate to:', href);
  //   setIsMenuOpen(false);
  //   navigate(href)
  // };
  const handleNavClick = (href) => {
  setIsMenuOpen(false);
  // Strip the /#  prefix so HashRouter gets a clean path
  const path = href.replace('/#', '') || '/';
  navigate(path);
};


  const navItems = {
    staff: [
      { name: "Home", icon: <Users size={18} />, href: "/#/" , onClick: handleNavClick },
      { name: "Attendance", icon: <ClipboardCheck size={18} />, href: "/#/staff-attendance" },
      { name: "Schedule", icon: <Calendar size={18} />, href: "/#/my-schedule" , onClick: handleNavClick},
      { name: "My Requests", icon: <BarChart2 size={18} />, href: "/#/staff-requests" },
      { name: "Fault Reports", icon: <ShieldX size={18} />, href: "/#/fault-reporting" , onClick: handleNavClick},
      { divider: true },
      { name: "View Profile", icon: <User size={18} />, href: "/#/user-profile" , onClick: handleNavClick},
      { name: "Log Out", icon: <LogOut size={18} />, onClick: handleLogout ,  }
    ],
    student: [
      { name: "Home", icon: <FileText size={18} />, href: "/#/" , onClick: handleNavClick },
      { name: "My Records", icon: <FileText size={18} />, href: "/#/student-records" , onClick: handleNavClick },
      { divider: true },
      { name: "View Profile", icon: <User size={18} />, href: "/#/user-profile"  , onClick: handleNavClick },
      { name: "Log Out", icon: <LogOut size={18} />, onClick: handleLogout }
    ],
    admin: [
          { name: "Home", icon: <Building size={18} />, href: "/#/" , onClick: handleNavClick},
          { name: "Student Management", icon: <ClipboardList size={18} />, href: "/#/students" , onClick: handleNavClick},
          { name: "Staff Management", icon: <BarChart2 size={18} />, href: "/#/staff" },
          { name: "Facilities Management", icon: <Megaphone size={18} />, href: "/#/facilities-management" , onClick: handleNavClick},
          { name: "Manage Notices", icon: <Megaphone size={18} />, href: "/#/manage-notices" , onClick: handleNavClick},
          { name: "Manage Staff Request", icon: <Handshake size={18} />, href: "/#/admin-staff-requests" , onClick: handleNavClick},
          // { name: "Accomodation Management", icon: <Settings size={18} />, href: "/#/accomodation" },/
          { name: "Fault Reports", icon: <ShieldX size={18} />, href: "/#/fault-reporting" , onClick: handleNavClick},
          // { name: "Schedule", icon: <Calendar size={18} />, href: "/#/manage-schedule" , onClick: handleNavClick},
          { divider: true },
          { name: "View Profile", icon: <User size={18} />, href: "/#/user-profile" },
          { name: "Log Out", icon: <LogOut size={18} />, onClick: handleLogout }
        ],
    maintenance: [
      { name: "Home", icon: <House size={18} />, href: "/#/maintenance-dashboard" , onClick: handleNavClick },
      { name: "Fault Reports", icon: <FileText size={18} />, href: "/#/reports-page" , onClick: handleNavClick },
      { name: "Maintenance Reports", icon: <FileText size={18} />, href: "/#/maintenance-reports" , onClick: handleNavClick },
      { divider: true },
      { name: "View Profile", icon: <User size={18} />, href: "/#/user-profile"  , onClick: handleNavClick },
      { name: "Log Out", icon: <LogOut size={18} />, onClick: handleLogout }
    ]
  };

  const getRoleLogo = () => {
    switch(userRole) {
      case 'staff':
        return <Stethoscope size={24} />;
      case 'student':
        return <User size={24} />;
      case 'admin':
        return <Shield size={24} />;
      case 'maintenance':
        return <HardHat size={24} />;
      default:
        return <User size={24} />;
    }
  };

  const getPortalTitle = () => {
    switch(userRole) {
      case 'staff':
        return 'Staff Portal';
      case 'student':
        return 'Student Portal';
      case 'admin':
        return 'Admin Portal';
      case 'maintenance':
        return 'Maintainance Portal';
      default:
        return 'Portal';
    }
  };

  const getUserName = () => {
    switch(userRole) {
      case 'doctor':
        return 'Dr. Smith';
      case 'patient':
        return 'John Doe';
      case 'admin':
        return 'Admin User';
      case 'maintenance':
        return 'Maintenance User';
      default:
        return 'User';
    }
  };
  

  // Don't render on large screens
  if (!showNavbar) {
    return null;
  }

  return (
    <>
      <style jsx>{`
        .top-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1050;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .top-navbar.staff {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        }
        
        .top-navbar.student {
          background: linear-gradient(135deg, #053f96ff 0%, #000443ff 100%);
        }
        
        .top-navbar.admin {
          background: linear-gradient(135deg, #16006eff 0%, #1a0043ff 100%);
        }

        .top-navbar.maintenance {
          background: linear-gradient(135deg, #056e00ff 0%, #044300ff 100%);
        }
        
        .navbar-brand {
          color: white !important;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .navbar-toggler {
          border: none;
          padding: 0.25rem 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        
        .navbar-toggler:focus {
          box-shadow: none;
        }
        
        .navbar-toggler-icon {
          color: white;
        }
        
        .navbar-collapse {
          background: white;
          margin-top: 1rem;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .user-info-section {
          padding: 1rem;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        
        .user-avatar.staff {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        }
        
        .user-avatar.student {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
        }
        
        .user-avatar.admin {
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
        }
        
        .user-avatar.maintenance {
          background: linear-gradient(135deg, #daded9ff 0%, #0f4204ff 100%);
        }
        
        .user-details h6 {
          margin: 0;
          color: #111827;
          font-weight: 600;
        }
        
        .user-details small {
          color: #6b7280;
          text-transform: capitalize;
        }
        
        .nav-link {
          color: #374151 !important;
          padding: 0.75rem 1rem !important;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
        }
        
        .nav-link:hover {
          background-color: #f3f4f6;
          color: #111827 !important;
        }
        
        .nav-link:active, .nav-link:focus {
          background-color: #e5e7eb;
        }
        
        .navbar-spacer {
          height: 56px;
        }
        
        @media (max-width: 575px) {
          .navbar-brand {
            font-size: 1rem;
          }
        }
      `}</style>

      <Navbar 
        expand="lg" 
        className={`top-navbar ${userRole}`}
        expanded={isMenuOpen}
        onToggle={setIsMenuOpen}
      >
        <Container fluid>
          <Navbar.Brand href="#">
            {getRoleLogo()}
            <span>{getPortalTitle()}</span>
          </Navbar.Brand>
          
          <Navbar.Toggle 
            aria-controls="basic-navbar-nav"
            className="navbar-toggler"
          >
            {isMenuOpen ? <X size={20} className="navbar-toggler-icon" /> : <Menu size={20} className="navbar-toggler-icon" />}
          </Navbar.Toggle>
          
          <Navbar.Collapse id="basic-navbar-nav">
            {/* User Info Section */}
            <div className="user-info-section">
              <div className={`user-avatar ${userRole}`}>
                <User size={20} />
              </div>
              <div className="user-details">
                <h6>{getUserName()}</h6>
                <small>{userRole}</small>
              </div>
            </div>
            
            {/* Navigation Links */}
            <Nav className="flex-column w-100">
              {navItems[userRole]?.map((item, index) => (
                <Nav.Link
                  key={index}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    console.log(item.href)
                    if (item.onClick) {
                      item.onClick(item.href);
                    } else {
                      handleNavClick(item.href);
                    }
                    // console.log(item.href)
                    //   if(item.href === "/logout"){
                    //     handleLogout()
                    //   }
                    //   else{
                    //     handleNavClick(item.href);
                    //   }
                      
                  }}
                  // onClick={item.onClick}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Nav.Link>
              ))}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="navbar-spacer"></div>
    </>
  );
};

export default TopNavbar;