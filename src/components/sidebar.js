import React from 'react';
import { Nav } from 'react-bootstrap';
import { 
  Users, ClipboardList, Calendar, Activity, 
  FileText, User, LogOut, Stethoscope,House, 
  ClipboardCheck, Pill, BookOpen, Settings,
  BarChart2, Megaphone, Building, Shield, ShieldX, HardHat, Building2, Handshake
} from 'lucide-react';
import './sidebar.css';
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from './pari-logo.png'; // Update with your actual logo path

const Sidebar = ({ userRole, show, onHide }) => {
  // Define sidebar items based on user role
  const navigate = useNavigate();

  userRole = localStorage.userType

  console.log(userRole)

  const handleLogout = () => {
    // Remove token from local storage and update state
    const username = localStorage.getItem('username');

    var navString = ""

    if(localStorage.getItem('userType') == "maintenance"){
      navString = "/maintenance-auth"
    }
    else{
      navString = "/auth"
    }
  
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('user');
    localStorage.removeItem('email');
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');

  
    // Prepare notification data
    const notificationData = {
      description: `${username} has logged out.`,
      date: new Date().toISOString(),
      read: false,
      username: username,
    };
  
    // Send notification to backend
    // axios
    //   .post('https://spaceshare-backend.onrender.com/set-notification', notificationData)
    //   .then(() => {
    //     console.log('Logout notification sent successfully');
    //   })
    //   .catch((error) => {
    //     console.error('Error sending logout notification:', error);
    //   });
  
    navigate(navString); // Redirect to home after logout
    // toggleSidebar(); // Close the sidebar after logout
  };

  const handleNavClick = (href) => {
    // Handle navigation logic here
    console.log('Navigate to:', href);
    // navigate(href);
    // Close sidebar on mobile after navigation
    if (onHide && window.innerWidth < 992) {
      onHide();
    }
  };

  const sidebarItems = {
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
      { name: "Home", icon: <House size={18} />, href: "/#/" , onClick: handleNavClick },
      { name: "My Records", icon: <FileText size={18} />, href: "/#/student-records" , onClick: handleNavClick },
      { divider: true },
      { name: "View Profile", icon: <User size={18} />, href: "/#/user-profile"  , onClick: handleNavClick },
      { name: "Log Out", icon: <LogOut size={18} />, onClick: handleLogout }
    ],
    admin: [
      { name: "Home", icon: <Building size={18} />, href: "/#/" , onClick: handleNavClick},
      { name: "Student Management", icon: <ClipboardList size={18} />, href: "/#/students" , onClick: handleNavClick},
      { name: "Staff Management", icon: <BarChart2 size={18} />, href: "/#/staff" },
      { name: "Facilities Management", icon: <Building2 size={18} />, href: "/#/facilities-management" , onClick: handleNavClick},
      { name: "Manage Notices", icon: <Megaphone size={18} />, href: "/#/manage-notices" , onClick: handleNavClick},
      { name: "Manage Staff Request", icon: <Handshake size={18} />, href: "/#/admin-staff-requests" , onClick: handleNavClick},
      // { name: "Accomodation Management", icon: <Settings size={18} />, href: "/#/accomodation" },
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
      { name: "View Profile", icon: <User size={18} />, href: "/#/maintainance-profile"  , onClick: handleNavClick },
      { name: "Log Out", icon: <LogOut size={18} />, onClick: handleLogout }
    ]
  };

  // Get role-specific logo
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

  // Get portal title based on role
  const getPortalTitle = () => {
    switch(userRole) {
      case 'staff':
        return 'Staff Portal';
      case 'student':
        return 'Student Portal';
      case 'admin':
        return 'Admin Portal';
      case 'maintenance':
        return 'Maintenance Portal';
      default:
        return 'Portal';
    }
  };

  // Get user name based on role
  const getUserName = () => {
    switch(userRole) {
      case 'doctor':
        return 'Dr. Smith';
      case 'patient':
        return 'John Doe';
      case 'admin':
        return 'Admin User';
      default:
        return 'User';
    }
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {show && <div className="sidebar-backdrop show" onClick={onHide}></div>}
      
      {/* Sidebar */}
      <div className={`sidebar ${userRole || 'user'} ${show ? 'show' : ''}`}>
        {/* Header */}
      <div className="sidebar-header">
        {/* Logo Section - Shows on all sidebars */}
        <div className="sidebar-logo">
          <img src={logo} alt="Logo" className="logo-image" />
        </div>
        
        <div className="sidebar-portal-info">
          {getRoleLogo()}
          <h2 className="sidebar-brand">
            {getPortalTitle()}
          </h2>
        </div>
      </div>

        {/* Navigation */}
        <Nav className="flex-column">
          {sidebarItems[userRole]?.map((item, index) => (
            item.divider ? (
              <div key={`divider-${index}`} className="sidebar-divider"></div>
            ) : (
              <Nav.Item key={item.name}>
                <Nav.Link 
                  href={item.href}
                  // onClick={(e) => {
                  //   e.preventDefault();
                  //   handleNavClick(item.href);
                  // }}
                  onClick={item.onClick}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Nav.Link>
              </Nav.Item>
            )
          ))}
        </Nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="user-avatar">
            <User size={16} />
          </div>
          <div className="user-info">
            <p className="user-name">
              {getUserName()}
            </p>
            <p className="user-role">
              {userRole?.charAt(0).toUpperCase() + userRole?.slice(1)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;