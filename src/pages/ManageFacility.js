// import React, { useState } from 'react';
// import { 
//   Building, Users, Bell, Activity, ClipboardList, 
//   Truck, Package, FileText, MapPin, Phone, 
//   Mail, Clock, User, Shield, FirstAid, PlusCircle, 
//   Thermometer, Syringe, Pill, HeartPulse
// } from 'lucide-react';
// import { Link, useLocation, useNavigate } from "react-router-dom";


// const ManageFacility = () => {
//   const [activeInventoryTab, setActiveInventoryTab] = useState('medications');
//   const [activeAuditTab, setActiveAuditTab] = useState('recent');
//   const navigate = useNavigate()

//   // Facility data
//   const facility = {
//     name: "Greenwood Medical Center",
//     type: "Tertiary Care Hospital",
//     id: "FAC-2024-001",
//     address: "123 Healthcare Blvd, Medical District, Springfield",
//     phone: "+1 (555) 123-4567",
//     email: "info@greenwoodmc.org",
//     license: "HL-IL-2020-7890",
//     beds: 250,
//     departments: 12,
//     accreditation: "JCI Accredited",
//     established: "2005"
//   };

//   // Staff data
//   const staff = [
//     { 
//       name: "Dr. Sarah Johnson", 
//       role: "Chief Medical Officer", 
//       department: "Administration",
//       contact: "s.johnson@greenwoodmc.org",
//       status: "Active",
//       avatar: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=50&h=50&fit=crop&crop=face"
//     },
//     { 
//       name: "Michael Chen", 
//       role: "Head Nurse", 
//       department: "Emergency",
//       contact: "m.chen@greenwoodmc.org",
//       status: "Active",
//       avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop&crop=face"
//     },
//     { 
//       name: "Lisa Rodriguez", 
//       role: "Pharmacy Manager", 
//       department: "Pharmacy",
//       contact: "l.rodriguez@greenwoodmc.org",
//       status: "Active",
//       avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face"
//     },
//     { 
//       name: "David Wilson", 
//       role: "Facility Manager", 
//       department: "Operations",
//       contact: "d.wilson@greenwoodmc.org",
//       status: "On Leave",
//       avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
//     }
//   ];

//   // Facility notices
//   const notices = [
//     { 
//       title: "Power Maintenance", 
//       message: "Scheduled power maintenance in North Wing on Friday 8AM-10AM",
//       priority: "High",
//       date: "2024-07-28",
//       read: false
//     },
//     { 
//       title: "New Safety Protocol", 
//       message: "Updated fire safety protocols effective immediately",
//       priority: "High",
//       date: "2024-07-25",
//       read: false
//     },
//     { 
//       title: "Annual Staff Meeting", 
//       message: "All staff required to attend the annual meeting next Monday",
//       priority: "Medium",
//       date: "2024-07-24",
//       read: true
//     },
//     { 
//       title: "Visitor Policy Update", 
//       message: "Revised visitor hours now 10AM-8PM daily",
//       priority: "Medium",
//       date: "2024-07-22",
//       read: true
//     }
//   ];

//   // Inventory data
//   const inventory = {
//     medications: [
//       { name: "Paracetamol 500mg", category: "Analgesic", stock: 1245, threshold: 200, status: "Adequate" },
//       { name: "Amoxicillin 250mg", category: "Antibiotic", stock: 876, threshold: 300, status: "Adequate" },
//       { name: "Lisinopril 10mg", category: "Hypertension", stock: 92, threshold: 100, status: "Low" },
//       { name: "Metformin 500mg", category: "Diabetes", stock: 543, threshold: 150, status: "Adequate" }
//     ],
//     equipment: [
//       { name: "ECG Machines", category: "Diagnostic", stock: 12, threshold: 2, status: "Adequate" },
//       { name: "Ventilators", category: "Critical Care", stock: 8, threshold: 3, status: "Adequate" },
//       { name: "Wheelchairs", category: "Mobility", stock: 15, threshold: 5, status: "Adequate" },
//       { name: "Infusion Pumps", category: "Therapy", stock: 4, threshold: 4, status: "Critical" }
//     ],
//     supplies: [
//       { name: "Surgical Masks", category: "PPE", stock: 2500, threshold: 1000, status: "Adequate" },
//       { name: "Sterile Gloves", category: "PPE", stock: 3200, threshold: 1500, status: "Adequate" },
//       { name: "IV Catheters", category: "Therapy", stock: 450, threshold: 300, status: "Adequate" },
//       { name: "Syringes 5ml", category: "Therapy", stock: 120, threshold: 200, status: "Low" }
//     ]
//   };

//   // Audit reports
//   const auditReports = {
//     recent: [
//       { id: "AUD-2024-007", type: "Medication", auditor: "Quality Team", date: "2024-07-20", status: "Completed", findings: "Minor discrepancies" },
//       { id: "AUD-2024-006", type: "Equipment", auditor: "Safety Team", date: "2024-07-18", status: "Completed", findings: "All satisfactory" },
//       { id: "AUD-2024-005", type: "Facility", auditor: "External", date: "2024-07-15", status: "Completed", findings: "3 areas for improvement" },
//       { id: "AUD-2024-004", type: "Safety", auditor: "Internal", date: "2024-07-12", status: "Completed", findings: "1 critical finding" }
//     ],
//     upcoming: [
//       { id: "AUD-2024-008", type: "Pharmacy", auditor: "Regulatory", date: "2024-07-30", status: "Scheduled" },
//       { id: "AUD-2024-009", type: "Infection Control", auditor: "Quality Team", date: "2024-08-05", status: "Pending" },
//       { id: "AUD-2024-010", type: "Facility", auditor: "External", date: "2024-08-15", status: "Pending" }
//     ]
//   };

//   // Facility resources
//   const resources = [
//     { 
//       name: "Operating Theaters", 
//       status: "Available", 
//       count: 5, 
//       inUse: 3,
//       icon: <PlusCircle size={16} />
//     },
//     { 
//       name: "ICU Beds", 
//       status: "Limited", 
//       count: 12, 
//       inUse: 11,
//       icon: <Thermometer size={16} />
//     },
//     { 
//       name: "Dialysis Machines", 
//       status: "Available", 
//       count: 4, 
//       inUse: 2,
//       icon: <HeartPulse size={16} />
//     },
//     { 
//       name: "X-ray Machines", 
//       status: "Available", 
//       count: 3, 
//       inUse: 1,
//       icon: <Syringe size={16} />
//     }
//   ];

//   // Vehicle fleet
//   const vehicles = [
//     { 
//       id: "AMB-001", 
//       type: "Ambulance", 
//       status: "Available", 
//       lastService: "2024-07-10",
//       nextService: "2024-08-10",
//       mileage: "45,200"
//     },
//     { 
//       id: "AMB-002", 
//       type: "Ambulance", 
//       status: "In Service", 
//       lastService: "2024-07-15",
//       nextService: "2024-08-15",
//       mileage: "38,700"
//     },
//     { 
//       id: "VAN-001", 
//       type: "Medical Supply Van", 
//       status: "Available", 
//       lastService: "2024-06-28",
//       nextService: "2024-09-28",
//       mileage: "22,100"
//     },
//     { 
//       id: "SUV-001", 
//       type: "Mobile Clinic", 
//       status: "Maintenance", 
//       lastService: "2024-07-05",
//       nextService: "2024-08-05",
//       mileage: "31,450"
//     }
//   ];

//   const getPriorityColor = (priority) => {
//     switch (priority.toLowerCase()) {
//       case 'high':
//       case 'critical':
//         return '#dc2626';
//       case 'medium':
//         return '#f59e0b';
//       case 'low':
//       case 'normal':
//       case 'adequate':
//         return '#4A9782';
//       default:
//         return '#4A9782';
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status.toLowerCase()) {
//       case 'completed':
//       case 'available':
//       case 'active':
//         return '#4A9782';
//       case 'pending':
//       case 'scheduled':
//       case 'limited':
//         return '#f59e0b';
//       case 'in service':
//         return '#3b82f6';
//       case 'on leave':
//       case 'maintenance':
//         return '#8b5cf6';
//       default:
//         return '#6b7280';
//     }
//   };

//   const customStyles = `
//     .facility-bg {
//       background-color: #FFF9E5;
//       min-height: 100vh;
//     }
//     .facility-card {
//       background-color: white;
//       border-radius: 1rem;
//     }
//     .avatar-border {
//       border: 4px solid #004030;
//     }
//     .primary-color { color: #004030; }
//     .secondary-color { color: #4A9782; }
//     .icon-bg-primary { background-color: #4A9782; }
//     .icon-bg-secondary { background-color: #004030; }
//     .notice-item, .staff-item, .inventory-item, .audit-item, .resource-item, .vehicle-item {
//       background-color: #FFF9E5;
//       border-radius: 0.5rem;
//       transition: all 0.2s ease;
//     }
//     .notice-item:hover, .staff-item:hover, .inventory-item:hover, 
//     .audit-item:hover, .resource-item:hover, .vehicle-item:hover {
//       transform: translateY(-2px);
//       box-shadow: 0 4px 12px rgba(0,0,0,0.1);
//     }
//     .notice-item { border-left: 4px solid var(--priority-color); }
//     .staff-item { border-left: 4px solid #004030; }
//     .inventory-item { border-left: 4px solid #4A9782; }
//     .audit-item { border-left: 4px solid #004030; }
//     .resource-item { border-left: 4px solid #4A9782; }
//     .vehicle-item { border-left: 4px solid #004030; }
//     .status-badge {
//       font-size: 0.75rem;
//       padding: 0.25rem 0.5rem;
//       border-radius: 1rem;
//       font-weight: 500;
//     }
//     .unread-notice {
//       position: relative;
//     }
//     .unread-notice::before {
//       content: '';
//       position: absolute;
//       top: 0.5rem;
//       right: 0.5rem;
//       width: 8px;
//       height: 8px;
//       background-color: #dc2626;
//       border-radius: 50%;
//     }
//     .type-badge {
//       background-color: #004030;
//       color: white;
//       padding: 0.25rem 0.75rem;
//       border-radius: 1rem;
//       font-size: 0.875rem;
//       font-weight: 500;
//     }
//     .nav-tabs .nav-link {
//       color: #004030;
//       border: none;
//       padding: 0.5rem 1rem;
//     }
//     .nav-tabs .nav-link.active {
//       color: #004030;
//       border-bottom: 2px solid #004030;
//       font-weight: 500;
//     }
//     .view-all-btn {
//       color: #004030;
//       font-weight: 500;
//       text-decoration: none;
//       display: flex;
//       align-items: center;
//       gap: 0.25rem;
//     }
//     .view-all-btn:hover {
//       text-decoration: underline;
//     }
//   `;

//   return (
//     <>
//       <style>{customStyles}</style>
//       <div className="facility-bg">
//         <div className="container-fluid p-4">
//           <div className="row justify-content-center">
//             <div className="col-12 col-xl-10">
              
//               {/* Facility Profile Card */}
//               <div className="facility-card p-4 shadow mb-4">
//                 <div className="row align-items-center">
//                   {/* Facility Icon */}
//                   <div className="col-12 col-lg-2 text-center text-lg-start mb-3 mb-lg-0">
//                     <div className="position-relative d-inline-block">
//                       <div 
//                         className="rounded-circle avatar-border d-flex align-items-center justify-content-center shadow"
//                         style={{ 
//                           width: '96px', 
//                           height: '96px', 
//                           backgroundColor: '#004030'
//                         }}
//                       >
//                         <Building className="text-white" size={40} />
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Facility Details */}
//                   <div className="col-12 col-lg-10">
//                     <div className="row">
//                       <div className="col-12 col-md-6">
//                         <div className="mb-3">
//                           <h1 className="h2 fw-bold mb-2 primary-color">
//                             {facility.name}
//                           </h1>
//                           <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
//                             <span className="type-badge">{facility.type}</span>
//                             <span className="small secondary-color">ID: {facility.id}</span>
//                           </div>
//                           <p className="h6 secondary-color mb-0">
//                             {facility.accreditation}
//                           </p>
//                         </div>
                        
//                         <div className="d-flex flex-column gap-2">
//                           <div className="d-flex align-items-center gap-2">
//                             <Building className="secondary-color" size={16} />
//                             <span className="small primary-color">
//                               <strong>Established:</strong> {facility.established}
//                             </span>
//                           </div>
//                           <div className="d-flex align-items-center gap-2">
//                             <Users className="secondary-color" size={16} />
//                             <span className="small primary-color">
//                               <strong>Capacity:</strong> {facility.beds} beds, {facility.departments} departments
//                             </span>
//                           </div>
//                         </div>
//                       </div>
                      
//                       <div className="col-12 col-md-6">
//                         <div className="d-flex flex-column gap-2">
//                           <div className="d-flex align-items-center gap-2">
//                             <Phone className="secondary-color" size={16} />
//                             <span className="small primary-color">
//                               <strong>Phone:</strong> {facility.phone}
//                             </span>
//                           </div>
//                           <div className="d-flex align-items-center gap-2">
//                             <Mail className="secondary-color" size={16} />
//                             <span className="small primary-color">
//                               <strong>Email:</strong> {facility.email}
//                             </span>
//                           </div>
//                           <div className="d-flex align-items-start gap-2">
//                             <MapPin className="secondary-color mt-1" size={16} />
//                             <span className="small primary-color">
//                               <strong>Address:</strong> {facility.address}
//                             </span>
//                           </div>
//                           <div className="d-flex align-items-center gap-2">
//                             <Shield className="secondary-color" size={16} />
//                             <span className="small primary-color">
//                               <strong>License:</strong> {facility.license}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Staff and Notices Row */}
//               <div className="row mb-4">
//                 {/* Staff Card */}
//                 <div className="col-12 col-sm-6 mb-3 mb-sm-0">
//                   <div className="facility-card p-4 shadow h-100">
//                     <div className="d-flex align-items-center justify-content-between mb-3">
//                       <div className="d-flex align-items-center">
//                         <div className="icon-bg-primary rounded-circle p-2 me-3">
//                           <Users className="text-white" size={20} />
//                         </div>
//                         <h3 className="h4 fw-bold primary-color mb-0">
//                           Key Staff
//                         </h3>
//                       </div>
//                       <a href="#" className="view-all-btn">
//                         View all <span>&rarr;</span>
//                       </a>
//                     </div>
                    
//                     <div className="d-flex flex-column gap-3">
//                       {staff.map((person, index) => (
//                         <div key={index} className="staff-item p-3">
//                           <div className="d-flex align-items-center gap-3">
//                             <img 
//                               src={person.avatar} 
//                               alt={person.name}
//                               className="rounded-circle"
//                               style={{ width: '40px', height: '40px', objectFit: 'cover' }}
//                             />
//                             <div className="flex-grow-1">
//                               <div className="d-flex justify-content-between align-items-start">
//                                 <div>
//                                   <p className="fw-medium primary-color mb-1">
//                                     {person.name}
//                                   </p>
//                                   <p className="small secondary-color mb-1">
//                                     {person.role} • {person.department}
//                                   </p>
//                                   <p className="small secondary-color mb-0">
//                                     {person.contact}
//                                   </p>
//                                 </div>
//                                 <span 
//                                   className="status-badge text-white"
//                                   style={{ backgroundColor: getStatusColor(person.status) }}
//                                 >
//                                   {person.status}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Facility Notices Card */}
//                 <div className="col-12 col-sm-6">
//                   <div className="facility-card p-4 shadow h-100">
//                     <div className="d-flex align-items-center justify-content-between mb-3">
//                       <div className="d-flex align-items-center">
//                         <div className="icon-bg-secondary rounded-circle p-2 me-3">
//                           <Bell className="text-white" size={20} />
//                         </div>
//                         <h3 className="h4 fw-bold primary-color mb-0">
//                           Facility Notices
//                         </h3>
//                       </div>
//                       <a href="#" className="view-all-btn">
//                         View all <span>&rarr;</span>
//                       </a>
//                     </div>
                    
//                     <div className="d-flex flex-column gap-3">
//                       {notices.map((notice, index) => (
//                         <div 
//                           key={index} 
//                           className={`notice-item p-3 ${!notice.read ? 'unread-notice' : ''}`}
//                           style={{ '--priority-color': getPriorityColor(notice.priority) }}
//                         >
//                           <div className="d-flex justify-content-between align-items-start">
//                             <div className="flex-grow-1">
//                               <p className="fw-medium primary-color mb-1">
//                                 {notice.title}
//                               </p>
//                               <p className="small secondary-color mb-1">
//                                 {notice.message}
//                               </p>
//                               <p className="small secondary-color mb-0">
//                                 {notice.date}
//                               </p>
//                             </div>
//                             <span 
//                               className="status-badge text-white"
//                               style={{ backgroundColor: getPriorityColor(notice.priority) }}
//                             >
//                               {notice.priority}
//                             </span>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Inventory and Audit Reports Row */}
//               <div className="row mb-4">
//                 {/* Inventory Card */}
//                 <div className="col-12 col-sm-6 mb-3 mb-sm-0">
//                   <div className="facility-card p-4 shadow h-100">
//                     <div className="d-flex align-items-center justify-content-between mb-3">
//                       <div className="d-flex align-items-center">
//                         <div className="icon-bg-primary rounded-circle p-2 me-3">
//                           <Package className="text-white" size={20} />
//                         </div>
//                         <h3 className="h4 fw-bold primary-color mb-0">
//                           Dispensary Inventory
//                         </h3>
//                       </div>
//                       <a href="#" className="view-all-btn">
//                         View all <span>&rarr;</span>
//                       </a>
//                     </div>
                    
//                     <ul className="nav nav-tabs mb-3">
//                       <li className="nav-item">
//                         <button 
//                           className={`nav-link ${activeInventoryTab === 'medications' ? 'active' : ''}`}
//                           onClick={() => setActiveInventoryTab('medications')}
//                         >
//                           Medications
//                         </button>
//                       </li>
//                       <li className="nav-item">
//                         <button 
//                           className={`nav-link ${activeInventoryTab === 'equipment' ? 'active' : ''}`}
//                           onClick={() => setActiveInventoryTab('equipment')}
//                         >
//                           Equipment
//                         </button>
//                       </li>
//                       <li className="nav-item">
//                         <button 
//                           className={`nav-link ${activeInventoryTab === 'supplies' ? 'active' : ''}`}
//                           onClick={() => setActiveInventoryTab('supplies')}
//                         >
//                           Supplies
//                         </button>
//                       </li>
//                     </ul>
                    
//                     <div className="d-flex flex-column gap-3">
//                       {inventory[activeInventoryTab].map((item, index) => (
//                         <div key={index} className="inventory-item p-3">
//                           <div className="d-flex justify-content-between align-items-start">
//                             <div className="flex-grow-1">
//                               <p className="fw-medium primary-color mb-1">
//                                 {item.name}
//                               </p>
//                               <p className="small secondary-color mb-1">
//                                 {item.category} • Stock: {item.stock} (Threshold: {item.threshold})
//                               </p>
//                             </div>
//                             <span 
//                               className="status-badge text-white"
//                               style={{ backgroundColor: getPriorityColor(item.status) }}
//                             >
//                               {item.status}
//                             </span>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Audit Reports Card */}
//                 <div className="col-12 col-sm-6">
//                   <div className="facility-card p-4 shadow h-100">
//                     <div className="d-flex align-items-center justify-content-between mb-3">
//                       <div className="d-flex align-items-center">
//                         <div className="icon-bg-secondary rounded-circle p-2 me-3">
//                           <ClipboardList className="text-white" size={20} />
//                         </div>
//                         <h3 className="h4 fw-bold primary-color mb-0">
//                           Audit Reports
//                         </h3>
//                       </div>
//                       <a href="#" className="view-all-btn">
//                         View all <span>&rarr;</span>
//                       </a>
//                     </div>
                    
//                     <ul className="nav nav-tabs mb-3">
//                       <li className="nav-item">
//                         <button 
//                           className={`nav-link ${activeAuditTab === 'recent' ? 'active' : ''}`}
//                           onClick={() => setActiveAuditTab('recent')}
//                         >
//                           Recent
//                         </button>
//                       </li>
//                       <li className="nav-item">
//                         <button 
//                           className={`nav-link ${activeAuditTab === 'upcoming' ? 'active' : ''}`}
//                           onClick={() => setActiveAuditTab('upcoming')}
//                         >
//                           Upcoming
//                         </button>
//                       </li>
//                     </ul>
                    
//                     <div className="d-flex flex-column gap-3">
//                       {auditReports[activeAuditTab].map((audit, index) => (
//                         <div key={index} className="audit-item p-3">
//                           <div className="d-flex justify-content-between align-items-start">
//                             <div className="flex-grow-1">
//                               <p className="fw-medium primary-color mb-1">
//                                 {audit.id} - {audit.type}
//                               </p>
//                               <p className="small secondary-color mb-1">
//                                 Auditor: {audit.auditor} • Date: {audit.date}
//                               </p>
//                               {audit.findings && (
//                                 <p className="small secondary-color mb-0">
//                                   Findings: {audit.findings}
//                                 </p>
//                               )}
//                             </div>
//                             <span 
//                               className="status-badge text-white"
//                               style={{ backgroundColor: getStatusColor(audit.status) }}
//                             >
//                               {audit.status}
//                             </span>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Resources and Fleet Management Row */}
//               <div className="row">
//                 {/* Facility Resources Card */}
//                 <div className="col-12 col-sm-6 mb-3 mb-sm-0">
//                   <div className="facility-card p-4 shadow h-100">
//                     <div className="d-flex align-items-center justify-content-between mb-3">
//                       <div className="d-flex align-items-center">
//                         <div className="icon-bg-primary rounded-circle p-2 me-3">
//                           <PlusCircle className="text-white" size={20} />
//                         </div>
//                         <h3 className="h4 fw-bold primary-color mb-0">
//                           Facility Resources
//                         </h3>
//                       </div>
//                       <a href="#" className="view-all-btn">
//                         View all <span>&rarr;</span>
//                       </a>
//                     </div>
                    
//                     <div className="d-flex flex-column gap-3">
//                       {resources.map((resource, index) => (
//                         <div key={index} className="resource-item p-3">
//                           <div className="d-flex justify-content-between align-items-start">
//                             <div className="flex-grow-1">
//                               <div className="d-flex align-items-center gap-2 mb-1">
//                                 {resource.icon}
//                                 <p className="fw-medium primary-color mb-0">
//                                   {resource.name}
//                                 </p>
//                               </div>
//                               <p className="small secondary-color mb-1">
//                                 Total: {resource.count} • In Use: {resource.inUse}
//                               </p>
//                             </div>
//                             <span 
//                               className="status-badge text-white"
//                               style={{ backgroundColor: getStatusColor(resource.status) }}
//                             >
//                               {resource.status}
//                             </span>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Vehicle Fleet Card */}
//                 <div className="col-12 col-sm-6">
//                   <div className="facility-card p-4 shadow h-100">
//                     <div className="d-flex align-items-center justify-content-between mb-3">
//                       <div className="d-flex align-items-center">
//                         <div className="icon-bg-secondary rounded-circle p-2 me-3">
//                           <Truck className="text-white" size={20} />
//                         </div>
//                         <h3 className="h4 fw-bold primary-color mb-0">
//                           Vehicle Fleet Management
//                         </h3>
//                       </div>
//                       <a href="#" className="view-all-btn">
//                         View all <span>&rarr;</span>
//                       </a>
//                     </div>
                    
//                     <div className="d-flex flex-column gap-3">
//                       {vehicles.map((vehicle, index) => (
//                         <div key={index} className="vehicle-item p-3">
//                           <div className="d-flex justify-content-between align-items-start">
//                             <div className="flex-grow-1">
//                               <p className="fw-medium primary-color mb-1">
//                                 {vehicle.id} - {vehicle.type}
//                               </p>
//                               <p className="small secondary-color mb-1">
//                                 Last Service: {vehicle.lastService} • Next: {vehicle.nextService}
//                               </p>
//                               <p className="small secondary-color mb-0">
//                                 Mileage: {vehicle.mileage}
//                               </p>
//                             </div>
//                             <span 
//                               className="status-badge text-white"
//                               style={{ backgroundColor: getStatusColor(vehicle.status) }}
//                             >
//                               {vehicle.status}
//                             </span>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ManageFacility;

import React, { useState } from 'react';
import { 
  Building, Users, Bell, Activity, ClipboardList, 
  Truck, Package, FileText, MapPin, Phone, 
  Mail, Clock, User, Shield, FirstAid, PlusCircle, 
  Thermometer, Syringe, Pill, HeartPulse, Home, ChevronRight
} from 'lucide-react';
import { Link, useLocation, useNavigate } from "react-router-dom";

const ManageFacility = () => {
  const [activeInventoryTab, setActiveInventoryTab] = useState('medications');
  const [activeAuditTab, setActiveAuditTab] = useState('recent');

  const navigate = useNavigate()

  // Facility data
  const facility = {
    name: "Parirenyatwa Hospital",
    type: "Central Referral Hospital",
    id: "FAC-2024-001",
    address: "Mazowe Street, Avondale, Harare, Zimbabwe",
    phone: "+263 4 791631",
    email: "info@parirenyatwa.ac.zw",
    license: "HL-ZW-2020-7890",
    beds: 850,
    departments: 18,
    accreditation: "MOH Accredited",
    established: "1962"
  };

  // Staff data
  const staff = [
    { 
      name: "Dr. Tendai Mukamuri", 
      role: "Chief Medical Officer", 
      department: "Administration",
      contact: "t.mukamuri@parirenyatwa.ac.zw",
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=50&h=50&fit=crop&crop=face"
    },
    { 
      name: "Sister Chipo Mangwende", 
      role: "Head Nurse", 
      department: "Emergency",
      contact: "c.mangwende@parirenyatwa.ac.zw",
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face"
    },
    { 
      name: "Dr. Farai Nyamukapa", 
      role: "Pharmacy Manager", 
      department: "Pharmacy",
      contact: "f.nyamukapa@parirenyatwa.ac.zw",
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop&crop=face"
    },
    { 
      name: "Mr. Tatenda Chinembiri", 
      role: "Facility Manager", 
      department: "Operations",
      contact: "t.chinembiri@parirenyatwa.ac.zw",
      status: "On Leave",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
    }
  ];

  // Facility notices
  const notices = [
    { 
      title: "Power Maintenance", 
      message: "Scheduled power maintenance in North Wing on Friday 8AM-10AM",
      priority: "High",
      date: "2024-07-28",
      read: false
    },
    { 
      title: "New Safety Protocol", 
      message: "Updated fire safety protocols effective immediately",
      priority: "High",
      date: "2024-07-25",
      read: false
    },
    { 
      title: "Annual Staff Meeting", 
      message: "All staff required to attend the annual meeting next Monday",
      priority: "Medium",
      date: "2024-07-24",
      read: true
    },
    { 
      title: "Visitor Policy Update", 
      message: "Revised visitor hours now 10AM-8PM daily",
      priority: "Medium",
      date: "2024-07-22",
      read: true
    }
  ];

  // Inventory data
  const inventory = {
    medications: [
      { name: "Paracetamol 500mg", category: "Analgesic", stock: 1245, threshold: 200, status: "Adequate" },
      { name: "Amoxicillin 250mg", category: "Antibiotic", stock: 876, threshold: 300, status: "Adequate" },
      { name: "Lisinopril 10mg", category: "Hypertension", stock: 92, threshold: 100, status: "Low" },
      { name: "Metformin 500mg", category: "Diabetes", stock: 543, threshold: 150, status: "Adequate" }
    ],
    equipment: [
      { name: "ECG Machines", category: "Diagnostic", stock: 12, threshold: 2, status: "Adequate" },
      { name: "Ventilators", category: "Critical Care", stock: 8, threshold: 3, status: "Adequate" },
      { name: "Wheelchairs", category: "Mobility", stock: 15, threshold: 5, status: "Adequate" },
      { name: "Infusion Pumps", category: "Therapy", stock: 4, threshold: 4, status: "Critical" }
    ],
    supplies: [
      { name: "Surgical Masks", category: "PPE", stock: 2500, threshold: 1000, status: "Adequate" },
      { name: "Sterile Gloves", category: "PPE", stock: 3200, threshold: 1500, status: "Adequate" },
      { name: "IV Catheters", category: "Therapy", stock: 450, threshold: 300, status: "Adequate" },
      { name: "Syringes 5ml", category: "Therapy", stock: 120, threshold: 200, status: "Low" }
    ]
  };

  // Audit reports
  const auditReports = {
    recent: [
      { id: "AUD-2024-007", type: "Medication", auditor: "Quality Team", date: "2024-07-20", status: "Completed", findings: "Minor discrepancies" },
      { id: "AUD-2024-006", type: "Equipment", auditor: "Safety Team", date: "2024-07-18", status: "Completed", findings: "All satisfactory" },
      { id: "AUD-2024-005", type: "Facility", auditor: "External", date: "2024-07-15", status: "Completed", findings: "3 areas for improvement" },
      { id: "AUD-2024-004", type: "Safety", auditor: "Internal", date: "2024-07-12", status: "Completed", findings: "1 critical finding" }
    ],
    upcoming: [
      { id: "AUD-2024-008", type: "Pharmacy", auditor: "Regulatory", date: "2024-07-30", status: "Scheduled" },
      { id: "AUD-2024-009", type: "Infection Control", auditor: "Quality Team", date: "2024-08-05", status: "Pending" },
      { id: "AUD-2024-010", type: "Facility", auditor: "External", date: "2024-08-15", status: "Pending" }
    ]
  };

  // Facility resources
  const resources = [
    { 
      name: "Operating Theaters", 
      status: "Available", 
      count: 5, 
      inUse: 3,
      icon: <PlusCircle size={16} />
    },
    { 
      name: "ICU Beds", 
      status: "Limited", 
      count: 12, 
      inUse: 11,
      icon: <Thermometer size={16} />
    },
    { 
      name: "Dialysis Machines", 
      status: "Available", 
      count: 4, 
      inUse: 2,
      icon: <HeartPulse size={16} />
    },
    { 
      name: "X-ray Machines", 
      status: "Available", 
      count: 3, 
      inUse: 1,
      icon: <Syringe size={16} />
    }
  ];

  // Vehicle fleet
  const vehicles = [
    { 
      id: "AMB-001", 
      type: "Ambulance", 
      status: "Available", 
      lastService: "2024-07-10",
      nextService: "2024-08-10",
      mileage: "45,200"
    },
    { 
      id: "AMB-002", 
      type: "Ambulance", 
      status: "In Service", 
      lastService: "2024-07-15",
      nextService: "2024-08-15",
      mileage: "38,700"
    },
    { 
      id: "VAN-001", 
      type: "Medical Supply Van", 
      status: "Available", 
      lastService: "2024-06-28",
      nextService: "2024-09-28",
      mileage: "22,100"
    },
    { 
      id: "SUV-001", 
      type: "Mobile Clinic", 
      status: "Maintenance", 
      lastService: "2024-07-05",
      nextService: "2024-08-05",
      mileage: "31,450"
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
      case 'critical':
        return '#dc2626';
      case 'medium':
        return '#f59e0b';
      case 'low':
      case 'normal':
      case 'adequate':
        return '#4A9782';
      default:
        return '#4A9782';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'available':
      case 'active':
        return '#4A9782';
      case 'pending':
      case 'scheduled':
      case 'limited':
        return '#f59e0b';
      case 'in service':
        return '#3b82f6';
      case 'on leave':
      case 'maintenance':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

    const handleClick = () => {
    navigate("/facility-recources")
  }

  const customStyles = `
    .facility-bg {
      background-color: #FFF9E5;
      min-height: 100vh;
    }
    .facility-card {
      background-color: white;
      border-radius: 1rem;
    }
    .avatar-border {
      border: 4px solid #004030;
    }
    .primary-color { color: #004030; }
    .secondary-color { color: #4A9782; }
    .icon-bg-primary { background-color: #4A9782; }
    .icon-bg-secondary { background-color: #004030; }
    .notice-item, .staff-item, .inventory-item, .audit-item, .resource-item, .vehicle-item {
      background-color: #FFF9E5;
      border-radius: 0.5rem;
      transition: all 0.2s ease;
    }
    .notice-item:hover, .staff-item:hover, .inventory-item:hover, 
    .audit-item:hover, .resource-item:hover, .vehicle-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .notice-item { border-left: 4px solid var(--priority-color); }
    .staff-item { border-left: 4px solid #004030; }
    .inventory-item { border-left: 4px solid #4A9782; }
    .audit-item { border-left: 4px solid #004030; }
    .resource-item { border-left: 4px solid #4A9782; }
    .vehicle-item { border-left: 4px solid #004030; }
    .status-badge {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 1rem;
      font-weight: 500;
    }
    .unread-notice {
      position: relative;
    }
    .unread-notice::before {
      content: '';
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      width: 8px;
      height: 8px;
      background-color: #dc2626;
      border-radius: 50%;
    }
    .type-badge {
      background-color: #004030;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.875rem;
      font-weight: 500;
    }
    .nav-tabs .nav-link {
      color: #004030;
      border: none;
      padding: 0.5rem 1rem;
    }
    .nav-tabs .nav-link.active {
      color: #004030;
      border-bottom: 2px solid #004030;
      font-weight: 500;
    }
    .view-all-btn {
      color: #004030;
      font-weight: 500;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    .view-all-btn:hover {
      text-decoration: underline;
    }
    .breadcrumb {
      background-color: transparent;
      padding: 0;
      margin-bottom: 1rem;
    }
    .breadcrumb-item {
      font-size: 0.875rem;
    }
    .breadcrumb-item + .breadcrumb-item::before {
      content: none;
    }
    .breadcrumb-item a {
      color: #4A9782;
      text-decoration: none;
    }
    .breadcrumb-item a:hover {
      color: #004030;
      text-decoration: underline;
    }
    .breadcrumb-item.active {
      color: #004030;
      font-weight: 500;
    }
  `;

  return (
    <>
      <style>{customStyles}</style>
      <div className="facility-bg">
        <div className="container-fluid p-4">
          <div className="row justify-content-center">
            <div className="col-12 col-xl-10">
              
              {/* Breadcrumbs */}
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="#" className="d-flex align-items-center gap-1">
                      <Home size={14} />
                      Home
                    </a>
                  </li>
                  <li className="breadcrumb-item">
                    <ChevronRight size={14} className="text-muted" />
                  </li>
                  <li className="breadcrumb-item">
                    <a href="/#/facilitiesmanagement" className="d-flex align-items-center gap-1">
                      <Building size={14} />
                      Manage Facilities
                    </a>
                  </li>
                  <li className="breadcrumb-item">
                    <ChevronRight size={14} className="text-muted" />
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Parirenyatwa Hospital
                  </li>
                </ol>
              </nav>
              
              {/* Facility Profile Card */}
              <div className="facility-card p-4 shadow mb-4">
                <div className="row align-items-center">
                  {/* Facility Icon */}
                  <div className="col-12 col-lg-2 text-center text-lg-start mb-3 mb-lg-0">
                    <div className="position-relative d-inline-block">
                      <div 
                        className="rounded-circle avatar-border d-flex align-items-center justify-content-center shadow"
                        style={{ 
                          width: '96px', 
                          height: '96px', 
                          backgroundColor: '#004030'
                        }}
                      >
                        <Building className="text-white" size={40} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Facility Details */}
                  <div className="col-12 col-lg-10">
                    <div className="row">
                      <div className="col-12 col-md-6">
                        <div className="mb-3">
                          <h1 className="h2 fw-bold mb-2 primary-color">
                            {facility.name}
                          </h1>
                          <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                            <span className="type-badge">{facility.type}</span>
                            <span className="small secondary-color">ID: {facility.id}</span>
                          </div>
                          <p className="h6 secondary-color mb-0">
                            {facility.accreditation}
                          </p>
                        </div>
                        
                        <div className="d-flex flex-column gap-2">
                          <div className="d-flex align-items-center gap-2">
                            <Building className="secondary-color" size={16} />
                            <span className="small primary-color">
                              <strong>Established:</strong> {facility.established}
                            </span>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <Users className="secondary-color" size={16} />
                            <span className="small primary-color">
                              <strong>Capacity:</strong> {facility.beds} beds, {facility.departments} departments
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-12 col-md-6">
                        <div className="d-flex flex-column gap-2">
                          <div className="d-flex align-items-center gap-2">
                            <Phone className="secondary-color" size={16} />
                            <span className="small primary-color">
                              <strong>Phone:</strong> {facility.phone}
                            </span>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <Mail className="secondary-color" size={16} />
                            <span className="small primary-color">
                              <strong>Email:</strong> {facility.email}
                            </span>
                          </div>
                          <div className="d-flex align-items-start gap-2">
                            <MapPin className="secondary-color mt-1" size={16} />
                            <span className="small primary-color">
                              <strong>Address:</strong> {facility.address}
                            </span>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <Shield className="secondary-color" size={16} />
                            <span className="small primary-color">
                              <strong>License:</strong> {facility.license}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Staff and Notices Row */}
              <div className="row mb-4">
                {/* Staff Card */}
                <div className="col-12 col-sm-6 mb-3 mb-sm-0">
                  <div className="facility-card p-4 shadow h-100">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center">
                        <div className="icon-bg-primary rounded-circle p-2 me-3">
                          <Users className="text-white" size={20} />
                        </div>
                        <h3 className="h4 fw-bold primary-color mb-0">
                          Key Staff
                        </h3>
                      </div>
                      <a href="#" className="view-all-btn">
                        View all <span>&rarr;</span>
                      </a>
                    </div>
                    
                    <div className="d-flex flex-column gap-3">
                      {staff.map((person, index) => (
                        <div key={index} className="staff-item p-3">
                          <div className="d-flex align-items-center gap-3">
                            <img 
                              src={person.avatar} 
                              alt={person.name}
                              className="rounded-circle"
                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            />
                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <p className="fw-medium primary-color mb-1">
                                    {person.name}
                                  </p>
                                  <p className="small secondary-color mb-1">
                                    {person.role} • {person.department}
                                  </p>
                                  <p className="small secondary-color mb-0">
                                    {person.contact}
                                  </p>
                                </div>
                                <span 
                                  className="status-badge text-white"
                                  style={{ backgroundColor: getStatusColor(person.status) }}
                                >
                                  {person.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Facility Notices Card */}
                <div className="col-12 col-sm-6">
                  <div className="facility-card p-4 shadow h-100">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center">
                        <div className="icon-bg-secondary rounded-circle p-2 me-3">
                          <Bell className="text-white" size={20} />
                        </div>
                        <h3 className="h4 fw-bold primary-color mb-0">
                          Facility Notices
                        </h3>
                      </div>
                      <a href="#" className="view-all-btn">
                        View all <span>&rarr;</span>
                      </a>
                    </div>
                    
                    <div className="d-flex flex-column gap-3">
                      {notices.map((notice, index) => (
                        <div 
                          key={index} 
                          className={`notice-item p-3 ${!notice.read ? 'unread-notice' : ''}`}
                          style={{ '--priority-color': getPriorityColor(notice.priority) }}
                        >
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <p className="fw-medium primary-color mb-1">
                                {notice.title}
                              </p>
                              <p className="small secondary-color mb-1">
                                {notice.message}
                              </p>
                              <p className="small secondary-color mb-0">
                                {notice.date}
                              </p>
                            </div>
                            <span 
                              className="status-badge text-white"
                              style={{ backgroundColor: getPriorityColor(notice.priority) }}
                            >
                              {notice.priority}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Inventory and Audit Reports Row */}
              <div className="row mb-4">
                {/* Inventory Card */}
                <div className="col-12 col-sm-6 mb-3 mb-sm-0">
                  <div className="facility-card p-4 shadow h-100">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center">
                        <div className="icon-bg-primary rounded-circle p-2 me-3">
                          <Package className="text-white" size={20} />
                        </div>
                        <h3 className="h4 fw-bold primary-color mb-0">
                          Dispensary Inventory
                        </h3>
                      </div>
                      <a href="#" className="view-all-btn">
                        View all <span>&rarr;</span>
                      </a>
                    </div>
                    
                    <ul className="nav nav-tabs mb-3">
                      <li className="nav-item">
                        <button 
                          className={`nav-link ${activeInventoryTab === 'medications' ? 'active' : ''}`}
                          onClick={() => setActiveInventoryTab('medications')}
                        >
                          Medications
                        </button>
                      </li>
                      <li className="nav-item">
                        <button 
                          className={`nav-link ${activeInventoryTab === 'equipment' ? 'active' : ''}`}
                          onClick={() => setActiveInventoryTab('equipment')}
                        >
                          Equipment
                        </button>
                      </li>
                      <li className="nav-item">
                        <button 
                          className={`nav-link ${activeInventoryTab === 'supplies' ? 'active' : ''}`}
                          onClick={() => setActiveInventoryTab('supplies')}
                        >
                          Supplies
                        </button>
                      </li>
                    </ul>
                    
                    <div className="d-flex flex-column gap-3">
                      {inventory[activeInventoryTab].map((item, index) => (
                        <div key={index} className="inventory-item p-3">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <p className="fw-medium primary-color mb-1">
                                {item.name}
                              </p>
                              <p className="small secondary-color mb-1">
                                {item.category} • Stock: {item.stock} (Threshold: {item.threshold})
                              </p>
                            </div>
                            <span 
                              className="status-badge text-white"
                              style={{ backgroundColor: getPriorityColor(item.status) }}
                            >
                              {item.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Audit Reports Card */}
                <div className="col-12 col-sm-6">
                  <div className="facility-card p-4 shadow h-100">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center">
                        <div className="icon-bg-secondary rounded-circle p-2 me-3">
                          <ClipboardList className="text-white" size={20} />
                        </div>
                        <h3 className="h4 fw-bold primary-color mb-0">
                          Audit Reports
                        </h3>
                      </div>
                      <a href="#" className="view-all-btn">
                        View all <span>&rarr;</span>
                      </a>
                    </div>
                    
                    <ul className="nav nav-tabs mb-3">
                      <li className="nav-item">
                        <button 
                          className={`nav-link ${activeAuditTab === 'recent' ? 'active' : ''}`}
                          onClick={() => setActiveAuditTab('recent')}
                        >
                          Recent
                        </button>
                      </li>
                      <li className="nav-item">
                        <button 
                          className={`nav-link ${activeAuditTab === 'upcoming' ? 'active' : ''}`}
                          onClick={() => setActiveAuditTab('upcoming')}
                        >
                          Upcoming
                        </button>
                      </li>
                    </ul>
                    
                    <div className="d-flex flex-column gap-3">
                      {auditReports[activeAuditTab].map((audit, index) => (
                        <div key={index} className="audit-item p-3">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <p className="fw-medium primary-color mb-1">
                                {audit.id} - {audit.type}
                              </p>
                              <p className="small secondary-color mb-1">
                                Auditor: {audit.auditor} • Date: {audit.date}
                              </p>
                              {audit.findings && (
                                <p className="small secondary-color mb-0">
                                  Findings: {audit.findings}
                                </p>
                              )}
                            </div>
                            <span 
                              className="status-badge text-white"
                              style={{ backgroundColor: getStatusColor(audit.status) }}
                            >
                              {audit.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Resources and Fleet Management Row */}
              <div className="row">
                {/* Facility Resources Card */}
                <div className="col-12 col-sm-6 mb-3 mb-sm-0">
                  <div className="facility-card p-4 shadow h-100">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center">
                        <div className="icon-bg-primary rounded-circle p-2 me-3">
                          <PlusCircle className="text-white" size={20} />
                        </div>
                        <h3 className="h4 fw-bold primary-color mb-0">
                          Facility Resources
                        </h3>
                      </div>
                      <a href="/#/facility-resources" className="view-all-btn">
                        View all <span>&rarr;</span>
                      </a>
                    </div>
                    
                    <div className="d-flex flex-column gap-3">
                      {resources.map((resource, index) => (
                        <div key={index} className="resource-item p-3">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-center gap-2 mb-1">
                                {resource.icon}
                                <p className="fw-medium primary-color mb-0">
                                  {resource.name}
                                </p>
                              </div>
                              <p className="small secondary-color mb-1">
                                Total: {resource.count} • In Use: {resource.inUse}
                              </p>
                            </div>
                            <span 
                              className="status-badge text-white"
                              style={{ backgroundColor: getStatusColor(resource.status) }}
                            >
                              {resource.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Vehicle Fleet Card */}
                <div className="col-12 col-sm-6">
                  <div className="facility-card p-4 shadow h-100">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center">
                        <div className="icon-bg-secondary rounded-circle p-2 me-3">
                          <Truck className="text-white" size={20} />
                        </div>
                        <h3 className="h4 fw-bold primary-color mb-0">
                          Vehicle Fleet Management
                        </h3>
                      </div>
                      <a href="#" className="view-all-btn">
                        View all <span>&rarr;</span>
                      </a>
                    </div>
                    
                    <div className="d-flex flex-column gap-3">
                      {vehicles.map((vehicle, index) => (
                        <div key={index} className="vehicle-item p-3">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <p className="fw-medium primary-color mb-1">
                                {vehicle.id} - {vehicle.type}
                              </p>
                              <p className="small secondary-color mb-1">
                                Last Service: {vehicle.lastService} • Next: {vehicle.nextService}
                              </p>
                              <p className="small secondary-color mb-0">
                                Mileage: {vehicle.mileage}
                              </p>
                            </div>
                            <span 
                              className="status-badge text-white"
                              style={{ backgroundColor: getStatusColor(vehicle.status) }}
                            >
                              {vehicle.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageFacility;