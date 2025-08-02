import React from 'react';
import { Nav } from 'react-bootstrap';
import { 
  Users, ClipboardList, Calendar, Activity, 
  FileText, User, LogOut, Stethoscope,
  ClipboardCheck, Pill, BookOpen, Settings,
  BarChart2, Megaphone, Building, Shield
} from 'lucide-react';
import './sidebar.css';
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = ({ userRole, show, onHide }) => {
  // Define sidebar items based on user role
  const navigate = useNavigate();

  userRole = localStorage.userType

  const handleLogout = () => {
    // Remove token from local storage and update state
    const username = localStorage.getItem('username');
  
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('user');
    localStorage.removeItem('email');
    localStorage.removeItem('userType');

  
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
  
    navigate('/auth'); // Redirect to home after logout
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
    doctor: [
      { name: "My Patients", icon: <Users size={18} />, href: "/#/patient-list" , onClick: handleNavClick },
      { name: "Attendance", icon: <ClipboardCheck size={18} />, href: "#attendance" },
      { name: "Schedule", icon: <Calendar size={18} />, href: "/#/schedule" , onClick: handleNavClick},
      { name: "Lab Records", icon: <Activity size={18} />, href: "/#/lab-results" , onClick: handleNavClick},
      { name: "Prescriptions", icon: <Pill size={18} />, href: "/#/prescriptions" , onClick: handleNavClick },
      { divider: true },
      { name: "View Profile", icon: <User size={18} />, href: "/#/doctor" , onClick: handleNavClick},
      { name: "Log Out", icon: <LogOut size={18} />, onClick: handleLogout ,  }
    ],
    patient: [
      { name: "My Records", icon: <FileText size={18} />, href: "/#/patient-records" , onClick: handleNavClick },
      { name: "My Doctors", icon: <Stethoscope size={18} />, href: "/#/mydoctors" , onClick: handleNavClick },
      { name: "Prescriptions", icon: <Pill size={18} />, href: "/#/prescriptions" , onClick: handleNavClick},
      { name: "Bookings", icon: <BookOpen size={18} />, href: "/#/mybookings" , onClick: handleNavClick},
      { divider: true },
      { name: "View Profile", icon: <User size={18} />, href: "/#/patient" , onClick: handleNavClick },
      { name: "Log Out", icon: <LogOut size={18} />, onClick: handleLogout }
    ],
    admin: [
      { name: "Manage Facilities", icon: <Building size={18} />, href: "/#/facilitiesmanagement" , onClick: handleNavClick},
      { name: "Reports & Audits", icon: <ClipboardList size={18} />, href: "/#/audit-reports" , onClick: handleNavClick},
      { name: "HR Management", icon: <BarChart2 size={18} />, href: "/#/hrmanagement" },
      { name: "Pandemic Management", icon: <Megaphone size={18} />, href: "/#/pandemicmanagement" , onClick: handleNavClick},
      { name: "System Settings", icon: <Settings size={18} />, href: "#settings" },
      { divider: true },
      { name: "View Profile", icon: <User size={18} />, href: "#profile" },
      { name: "Log Out", icon: <LogOut size={18} />, onClick: handleLogout }
    ]
  };

  // Get role-specific logo
  const getRoleLogo = () => {
    switch(userRole) {
      case 'doctor':
        return <Stethoscope size={24} />;
      case 'patient':
        return <User size={24} />;
      case 'admin':
        return <Shield size={24} />;
      default:
        return <User size={24} />;
    }
  };

  // Get portal title based on role
  const getPortalTitle = () => {
    switch(userRole) {
      case 'doctor':
        return 'Doctor Portal';
      case 'patient':
        return 'Patient Portal';
      case 'admin':
        return 'Admin Portal';
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
      <div className={`sidebar ${userRole || 'doctor'} ${show ? 'show' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          {getRoleLogo()}
          <h2 className="sidebar-brand">
            {getPortalTitle()}
          </h2>
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