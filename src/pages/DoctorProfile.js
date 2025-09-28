import React, { useState } from 'react';
import { Calendar, MapPin, User, Phone, Mail, Clock, FileText, Users, Activity, Stethoscope, Heart, Brain, Eye, Bone, Bell, UserCheck } from 'lucide-react';

const DoctorProfile = () => {
  const [selectedScheduleView, setSelectedScheduleView] = useState('today');

  // Sample doctor data
  const doctor = {
    name: "Dr. Emily Wilson",
    specialty: "Cardiology",
    id: "DOC-2024-00542",
    department: "Cardiovascular Department",
    experience: "12 years",
    education: "MD, Harvard Medical School",
    phone: "+1 (555) 987-6543",
    email: "emily.wilson@hospital.com",
    office: "Room 302, Cardiology Wing",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    license: "MD-IL-2012-4567"
  };

  // Sample notices
  const notices = [
    { 
      title: "New Treatment Protocol", 
      message: "Updated cardiac catheterization guidelines effective immediately",
      priority: "High",
      date: "2024-07-25",
      read: false
    },
    { 
      title: "Department Meeting", 
      message: "Monthly cardiology department meeting scheduled for tomorrow",
      priority: "Medium",
      date: "2024-07-24",
      read: false
    },
    { 
      title: "Equipment Update", 
      message: "New ECG machines installed in rooms 301-305",
      priority: "Low",
      date: "2024-07-23",
      read: true
    },
    { 
      title: "Conference Reminder", 
      message: "International Cardiology Conference registration deadline approaching",
      priority: "Medium",
      date: "2024-07-22",
      read: true
    }
  ];

  // Sample schedule
  const scheduleData = {
    today: [
      { time: "09:00 AM", patient: "John Smith", type: "Consultation", duration: "30 min", status: "Confirmed" },
      { time: "10:00 AM", patient: "Mary Johnson", type: "Follow-up", duration: "20 min", status: "Confirmed" },
      { time: "11:30 AM", patient: "Robert Davis", type: "Procedure", duration: "60 min", status: "In Progress" },
      { time: "02:00 PM", patient: "Lisa Brown", type: "Consultation", duration: "30 min", status: "Upcoming" },
      { time: "03:30 PM", patient: "Michael Wilson", type: "Follow-up", duration: "20 min", status: "Upcoming" }
    ],
    tomorrow: [
      { time: "08:30 AM", patient: "Sarah Jones", type: "Procedure", duration: "90 min", status: "Scheduled" },
      { time: "11:00 AM", patient: "David Miller", type: "Consultation", duration: "30 min", status: "Scheduled" },
      { time: "01:00 PM", patient: "Department Meeting", type: "Meeting", duration: "60 min", status: "Scheduled" },
      { time: "03:00 PM", patient: "Emma Taylor", type: "Follow-up", duration: "20 min", status: "Scheduled" }
    ]
  };

  // Sample patients
  const patients = [
    { 
      name: "John Smith", 
      id: "PT-2024-001234", 
      condition: "Hypertension", 
      lastVisit: "2024-07-20",
      status: "Stable",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
    },
    { 
      name: "Mary Johnson", 
      id: "PT-2024-001456", 
      condition: "Arrhythmia", 
      lastVisit: "2024-07-18",
      status: "Monitoring",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=50&h=50&fit=crop&crop=face"
    },
    { 
      name: "Robert Davis", 
      id: "PT-2024-001789", 
      condition: "Post-Surgery", 
      lastVisit: "2024-07-15",
      status: "Recovery",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
    },
    { 
      name: "Lisa Brown", 
      id: "PT-2024-002001", 
      condition: "Chest Pain", 
      lastVisit: "2024-07-12",
      status: "Under Investigation",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face"
    }
  ];

  // Sample lab results ordered
  const labResults = [
    {
      patient: "John Smith",
      test: "Lipid Panel",
      ordered: "2024-07-20",
      status: "Completed",
      result: "Elevated cholesterol",
      priority: "Normal"
    },
    {
      patient: "Mary Johnson",
      test: "Cardiac Enzymes",
      ordered: "2024-07-18",
      status: "Pending",
      result: "Awaiting results",
      priority: "Urgent"
    },
    {
      patient: "Robert Davis",
      test: "ECG",
      ordered: "2024-07-15",
      status: "Completed",
      result: "Normal rhythm",
      priority: "Normal"
    },
    {
      patient: "Lisa Brown",
      test: "Stress Test",
      ordered: "2024-07-12",
      status: "Scheduled",
      result: "Scheduled for tomorrow",
      priority: "High"
    },
    {
      patient: "Michael Wilson",
      test: "Echocardiogram",
      ordered: "2024-07-10",
      status: "Completed",
      result: "Mild valve regurgitation",
      priority: "Normal"
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
      case 'urgent':
        return '#dc2626';
      case 'medium':
        return '#f59e0b';
      case 'low':
      case 'normal':
        return '#4A9782';
      default:
        return '#4A9782';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'confirmed':
      case 'stable':
        return '#4A9782';
      case 'pending':
      case 'upcoming':
      case 'scheduled':
        return '#f59e0b';
      case 'in progress':
      case 'monitoring':
        return '#3b82f6';
      case 'under investigation':
      case 'recovery':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  const getSpecialtyIcon = () => {
    return <Heart size={16} />;
  };

  const customStyles = `
    .doctor-bg {
      background-color: #FFF9E5;
      min-height: 100vh;
    }
    .doctor-card {
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
    .icon-bg-cardiology { background-color: #004030; }
    .notice-item, .schedule-item, .patient-item, .lab-item {
      background-color: #FFF9E5;
      border-radius: 0.5rem;
      transition: all 0.2s ease;
    }
    .notice-item:hover, .schedule-item:hover, .patient-item:hover, .lab-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .notice-item { border-left: 4px solid var(--priority-color); }
    .schedule-item { border-left: 4px solid #4A9782; }
    .patient-item { border-left: 4px solid #004030; }
    .lab-item { border-left: 4px solid var(--priority-color); }
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
    .specialty-badge {
      background-color: #004030;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.875rem;
      font-weight: 500;
    }
  `;

  return (
    <>
      <style>{customStyles}</style>
      <div className="doctor-bg">
        <div className="container-fluid p-4">
          <div className="row justify-content-center">
            <div className="col-12 col-xl-10">
              
              {/* Doctor Profile Card */}
              <div className="doctor-card p-4 shadow mb-4">
                <div className="row align-items-center">
                  {/* Avatar */}
                  <div className="col-12 col-lg-2 text-center text-lg-start mb-3 mb-lg-0">
                    <div className="position-relative d-inline-block">
                      <img 
                        src={doctor.avatar} 
                        alt={doctor.name}
                        className="rounded-circle avatar-border shadow"
                        style={{ width: '96px', height: '96px', objectFit: 'cover' }}
                      />
                      <div 
                        className="position-absolute rounded-circle d-flex align-items-center justify-content-center"
                        style={{ 
                          bottom: '-4px', 
                          right: '-4px', 
                          width: '32px', 
                          height: '32px',
                          backgroundColor: '#004030'
                        }}
                      >
                        {getSpecialtyIcon()}
                      </div>
                    </div>
                  </div>
                  
                  {/* Doctor Details */}
                  <div className="col-12 col-lg-10">
                    <div className="row">
                      <div className="col-12 col-md-6">
                        <div className="mb-3">
                          <h1 className="h2 fw-bold mb-2 primary-color">
                            {doctor.name}
                          </h1>
                          <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                            <span className="specialty-badge">{doctor.specialty}</span>
                            <span className="small secondary-color">ID: {doctor.id}</span>
                          </div>
                          <p className="h6 secondary-color mb-0">
                            {doctor.department}
                          </p>
                        </div>
                        
                        <div className="d-flex flex-column gap-2">
                          <div className="d-flex align-items-center gap-2">
                            <Stethoscope className="secondary-color" size={16} />
                            <span className="small primary-color">
                              <strong>Experience:</strong> {doctor.experience}
                            </span>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <FileText className="secondary-color" size={16} />
                            <span className="small primary-color">
                              <strong>Education:</strong> {doctor.education}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-12 col-md-6">
                        <div className="d-flex flex-column gap-2">
                          <div className="d-flex align-items-center gap-2">
                            <Phone className="secondary-color" size={16} />
                            <span className="small primary-color">
                              <strong>Phone:</strong> {doctor.phone}
                            </span>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <Mail className="secondary-color" size={16} />
                            <span className="small primary-color">
                              <strong>Email:</strong> {doctor.email}
                            </span>
                          </div>
                          <div className="d-flex align-items-start gap-2">
                            <MapPin className="secondary-color mt-1" size={16} />
                            <span className="small primary-color">
                              <strong>Office:</strong> {doctor.office}
                            </span>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <User className="secondary-color" size={16} />
                            <span className="small primary-color">
                              <strong>License:</strong> {doctor.license}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notices and Schedule Row */}
              <div className="row mb-4">
                {/* Notices Card */}
                <div className="col-12 col-sm-6 mb-3 mb-sm-0">
                  <div className="doctor-card p-4 shadow h-100">
                    <div className="d-flex align-items-center mb-3">
                      <div className="icon-bg-primary rounded-circle p-2 me-3">
                        <Bell className="text-white" size={20} />
                      </div>
                      <h3 className="h4 fw-bold primary-color mb-0">
                        Notices
                      </h3>
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

                {/* Schedule Card */}
                <div className="col-12 col-sm-6">
                  <div className="doctor-card p-4 shadow h-100">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center">
                        <div className="icon-bg-secondary rounded-circle p-2 me-3">
                          <Clock className="text-white" size={20} />
                        </div>
                        <h3 className="h4 fw-bold primary-color mb-0">
                          Schedule
                        </h3>
                      </div>
                      <select 
                        value={selectedScheduleView}
                        onChange={(e) => setSelectedScheduleView(e.target.value)}
                        className="form-select form-select-sm"
                        style={{ width: 'auto', borderColor: '#4A9782' }}
                      >
                        <option value="today">Today</option>
                        <option value="tomorrow">Tomorrow</option>
                      </select>
                    </div>
                    
                    <div className="d-flex flex-column gap-3">
                      {scheduleData[selectedScheduleView].map((appointment, index) => (
                        <div key={index} className="schedule-item p-3">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-center gap-2 mb-1">
                                <Clock className="secondary-color" size={14} />
                                <span className="fw-medium primary-color">
                                  {appointment.time}
                                </span>
                                <span className="small secondary-color">
                                  ({appointment.duration})
                                </span>
                              </div>
                              <p className="fw-medium primary-color mb-1">
                                {appointment.patient}
                              </p>
                              <p className="small secondary-color mb-0">
                                {appointment.type}
                              </p>
                            </div>
                            <span 
                              className="status-badge text-white"
                              style={{ backgroundColor: getStatusColor(appointment.status) }}
                            >
                              {appointment.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Patients and Lab Results Row */}
              <div className="row">
                {/* Patients Card */}
                <div className="col-12 col-sm-6 mb-3 mb-sm-0">
                  <div className="doctor-card p-4 shadow h-100">
                    <div className="d-flex align-items-center mb-3">
                      <div className="icon-bg-primary rounded-circle p-2 me-3">
                        <Users className="text-white" size={20} />
                      </div>
                      <h3 className="h4 fw-bold primary-color mb-0">
                        My Patients
                      </h3>
                    </div>
                    
                    <div className="d-flex flex-column gap-3">
                      {patients.map((patient, index) => (
                        <div key={index} className="patient-item p-3">
                          <div className="d-flex align-items-center gap-3">
                            <img 
                              src={patient.avatar} 
                              alt={patient.name}
                              className="rounded-circle"
                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            />
                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <p className="fw-medium primary-color mb-1">
                                    {patient.name}
                                  </p>
                                  <p className="small secondary-color mb-1">
                                    {patient.condition}
                                  </p>
                                  <p className="small secondary-color mb-0">
                                    Last visit: {patient.lastVisit}
                                  </p>
                                </div>
                                <span 
                                  className="status-badge text-white"
                                  style={{ backgroundColor: getStatusColor(patient.status) }}
                                >
                                  {patient.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Lab Results Card */}
                <div className="col-12 col-sm-6">
                  <div className="doctor-card p-4 shadow h-100">
                    <div className="d-flex align-items-center mb-3">
                      <div className="icon-bg-secondary rounded-circle p-2 me-3">
                        <Activity className="text-white" size={20} />
                      </div>
                      <h3 className="h4 fw-bold primary-color mb-0">
                        Lab Results Ordered
                      </h3>
                    </div>
                    
                    <div className="d-flex flex-column gap-3">
                      {labResults.map((lab, index) => (
                        <div 
                          key={index} 
                          className="lab-item p-3"
                          style={{ '--priority-color': getPriorityColor(lab.priority) }}
                        >
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <p className="fw-medium primary-color mb-1">
                                {lab.test} - {lab.patient}
                              </p>
                              <p className="small secondary-color mb-1">
                                {lab.result}
                              </p>
                              <p className="small secondary-color mb-0">
                                Ordered: {lab.ordered}
                              </p>
                            </div>
                            <div className="d-flex flex-column align-items-end gap-1">
                              <span 
                                className="status-badge text-white"
                                style={{ backgroundColor: getStatusColor(lab.status) }}
                              >
                                {lab.status}
                              </span>
                              <span 
                                className="status-badge text-white"
                                style={{ 
                                  backgroundColor: getPriorityColor(lab.priority),
                                  fontSize: '0.65rem'
                                }}
                              >
                                {lab.priority}
                              </span>
                            </div>
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

export default DoctorProfile;