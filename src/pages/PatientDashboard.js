import React, { useState } from 'react';
import { Calendar, MapPin, User, Phone, Mail, FileText, Activity, Pill, Stethoscope, Heart, Brain, Eye, Bone } from 'lucide-react';

const PatientProfile = () => {
  const [selectedTab, setSelectedTab] = useState('recent');

  // Sample patient data
  const patient = {
    name: "Sarah Johnson",
    dob: "March 15, 1985",
    sex: "Female",
    address: "1234 Oak Street, Springfield, IL 62701",
    id: "PT-2024-001847",
    phone: "+1 (555) 123-4567",
    email: "sarah.johnson@email.com",
    avatar: "https://images.unsplash.com/photo-1589156191108-c762ff4b96ab?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmxhY2slMjB3b21hbnxlbnwwfHwwfHx8MA%3D%3D"
  };

  // Sample lab results
  const labResults = [
    { test: "Complete Blood Count", date: "2024-07-20", status: "Normal", value: "Within range" },
    { test: "Blood Glucose", date: "2024-07-18", status: "High", value: "145 mg/dL" },
    { test: "Cholesterol Panel", date: "2024-07-15", status: "Normal", value: "180 mg/dL" },
    { test: "Liver Function", date: "2024-07-10", status: "Normal", value: "Within range" }
  ];

  // Sample admission history
  const admissionHistory = [
    { date: "2024-07-01", reason: "Routine Checkup", department: "General Medicine", status: "Discharged" },
    { date: "2024-05-15", reason: "Chest Pain Investigation", department: "Cardiology", status: "Discharged" },
    { date: "2024-03-22", reason: "Annual Physical", department: "General Medicine", status: "Discharged" }
  ];

  // Sample prescriptions
  const prescriptions = [
    { medication: "Metformin 500mg", dosage: "Twice daily", prescribed: "2024-07-18", doctor: "Dr. Smith", status: "Active" },
    { medication: "Lisinopril 10mg", dosage: "Once daily", prescribed: "2024-07-15", doctor: "Dr. Wilson", status: "Active" },
    { medication: "Vitamin D3 1000IU", dosage: "Once daily", prescribed: "2024-07-10", doctor: "Dr. Smith", status: "Active" },
    { medication: "Ibuprofen 200mg", dosage: "As needed", prescribed: "2024-06-20", doctor: "Dr. Brown", status: "Completed" }
  ];

  // Sample doctors with specializations
  const doctors = [
    { 
      name: "Dr. Michael Smith", 
      specialty: "General Medicine", 
      avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face",
      colorCode: "#4A9782" // Primary care - green
    },
    { 
      name: "Dr. Emily Wilson", 
      specialty: "Cardiology", 
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
      colorCode: "#004030" // Heart specialist - dark green
    },
    { 
      name: "Dr. James Brown", 
      specialty: "Orthopedics", 
      avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face",
      colorCode: "#DCD0A8" // Bone specialist - beige
    },
    { 
      name: "Dr. Lisa Chen", 
      specialty: "Neurology", 
      avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face",
      colorCode: "#2D5832" // Brain specialist - darker green
    }
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'normal': return '#4A9782';
      case 'high': return '#dc2626';
      case 'low': return '#f59e0b';
      case 'active': return '#4A9782';
      case 'completed': return '#6b7280';
      default: return '#4A9782';
    }
  };

  const getSpecialtyIcon = (specialty) => {
    switch (specialty.toLowerCase()) {
      case 'cardiology': return <Heart size={16} />;
      case 'neurology': return <Brain size={16} />;
      case 'orthopedics': return <Bone size={16} />;
      case 'ophthalmology': return <Eye size={16} />;
      default: return <Stethoscope size={16} />;
    }
  };

  const customStyles = `
    .patient-bg {
      background-color: #FFF9E5;
      min-height: 100vh;
    }
    .patient-card {
      background-color: white;
      border-radius: 1rem;
    }
    .avatar-border {
      border: 4px solid #4A9782;
    }
    .primary-color { color: #004030; }
    .secondary-color { color: #4A9782; }
    .icon-bg-primary { background-color: #4A9782; }
    .icon-bg-secondary { background-color: #004030; }
    .lab-item, .admission-item, .prescription-item, .doctor-item {
      background-color: #FFF9E5;
      border-radius: 0.5rem;
    }
    .lab-item { border-left: 4px solid var(--status-color); }
    .admission-item { border-left: 4px solid #4A9782; }
    .prescription-item { border-left: 4px solid var(--status-color); }
    .status-badge {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 1rem;
    }
    .doctor-avatar {
      position: relative;
      border: 2px solid var(--doctor-color);
    }
    .doctor-specialty-icon {
      position: absolute;
      bottom: -2px;
      right: -2px;
      background-color: var(--doctor-color);
      border-radius: 50%;
      padding: 2px;
      color: white;
    }
  `;

  return (
    <>
      <style>{customStyles}</style>
      <div className="patient-bg">
        <div className="container-fluid p-4">
          <div className="row justify-content-center">
            <div className="col-12 col-xl-10">
              
              {/* Patient Info Card */}
              <div className="patient-card p-4 shadow mb-4">
                <div className="row align-items-center">
                  {/* Avatar */}
                  <div className="col-12 col-lg-2 text-center text-lg-start mb-3 mb-lg-0">
                    <img 
                      src={patient.avatar} 
                      alt={patient.name}
                      className="rounded-circle avatar-border shadow"
                      style={{ width: '96px', height: '96px', objectFit: 'cover' }}
                    />
                  </div>
                  
                  {/* Patient Details */}
                  <div className="col-12 col-lg-10">
                    <div className="row">
                      <div className="col-12 col-md-6">
                        <div className="mb-3">
                          <h1 className="h2 fw-bold mb-2 primary-color">
                            {patient.name}
                          </h1>
                          <p className="h5 fw-medium secondary-color mb-0">
                            Patient ID: {patient.id}
                          </p>
                        </div>
                        
                        <div className="d-flex flex-column gap-2">
                          <div className="d-flex align-items-center gap-2">
                            <Calendar className="secondary-color" size={16} />
                            <span className="small primary-color">
                              <strong>Date of Birth:</strong> {patient.dob}
                            </span>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <User className="secondary-color" size={16} />
                            <span className="small primary-color">
                              <strong>Sex:</strong> {patient.sex}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-12 col-md-6">
                        <div className="d-flex flex-column gap-2">
                          <div className="d-flex align-items-start gap-2">
                            <MapPin className="secondary-color mt-1" size={16} />
                            <span className="small primary-color">
                              <strong>Address:</strong> {patient.address}
                            </span>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <Phone className="secondary-color" size={16} />
                            <span className="small primary-color">
                              <strong>Phone:</strong> {patient.phone}
                            </span>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <Mail className="secondary-color" size={16} />
                            <span className="small primary-color">
                              <strong>Email:</strong> {patient.email}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lab Results and Admission History Row */}
              <div className="row mb-4">
                {/* Lab Results Card */}
                <div className="col-12 col-sm-6 mb-3 mb-sm-0">
                  <div className="patient-card p-4 shadow h-100">
                    <div className="d-flex align-items-center mb-3">
                      <div className="icon-bg-primary rounded-circle p-2 me-3">
                        <Activity className="text-white" size={20} />
                      </div>
                      <h3 className="h4 fw-bold primary-color mb-0">
                        Lab Results
                      </h3>
                    </div>
                    
                    <div className="d-flex flex-column gap-3">
                      {labResults.map((result, index) => (
                        <div 
                          key={index} 
                          className="lab-item p-3" 
                          style={{ '--status-color': getStatusColor(result.status) }}
                        >
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <p className="fw-medium primary-color mb-1">
                                {result.test}
                              </p>
                              <p className="small secondary-color mb-1">
                                {result.value}
                              </p>
                              <p className="small secondary-color mb-0">
                                {result.date}
                              </p>
                            </div>
                            <span 
                              className="status-badge text-white fw-medium"
                              style={{ backgroundColor: getStatusColor(result.status) }}
                            >
                              {result.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Admission History Card */}
                <div className="col-12 col-sm-6">
                  <div className="patient-card p-4 shadow h-100">
                    <div className="d-flex align-items-center mb-3">
                      <div className="icon-bg-secondary rounded-circle p-2 me-3">
                        <FileText className="text-white" size={20} />
                      </div>
                      <h3 className="h4 fw-bold primary-color mb-0">
                        Admission History
                      </h3>
                    </div>
                    
                    <div className="d-flex flex-column gap-3">
                      {admissionHistory.map((admission, index) => (
                        <div key={index} className="admission-item p-3">
                          <p className="fw-medium primary-color mb-1">
                            {admission.reason}
                          </p>
                          <p className="small secondary-color mb-2">
                            Department: {admission.department}
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <p className="small secondary-color mb-0">
                              {admission.date}
                            </p>
                            <span 
                              className="status-badge primary-color"
                              style={{ backgroundColor: '#DCD0A8' }}
                            >
                              {admission.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Prescription History and Doctors Row */}
              <div className="row">
                {/* Prescription History Card */}
                <div className="col-12 col-sm-6 mb-3 mb-sm-0">
                  <div className="patient-card p-4 shadow h-100">
                    <div className="d-flex align-items-center mb-3">
                      <div className="icon-bg-primary rounded-circle p-2 me-3">
                        <Pill className="text-white" size={20} />
                      </div>
                      <h3 className="h4 fw-bold primary-color mb-0">
                        Prescription History
                      </h3>
                    </div>
                    
                    <div className="d-flex flex-column gap-3">
                      {prescriptions.map((prescription, index) => (
                        <div 
                          key={index} 
                          className="prescription-item p-3" 
                          style={{ '--status-color': getStatusColor(prescription.status) }}
                        >
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <p className="fw-medium primary-color mb-1">
                                {prescription.medication}
                              </p>
                              <p className="small secondary-color mb-1">
                                {prescription.dosage}
                              </p>
                              <p className="small secondary-color mb-0">
                                Prescribed by {prescription.doctor} on {prescription.prescribed}
                              </p>
                            </div>
                            <span 
                              className="status-badge text-white fw-medium"
                              style={{ backgroundColor: getStatusColor(prescription.status) }}
                            >
                              {prescription.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Doctors Card */}
                <div className="col-12 col-sm-6">
                  <div className="patient-card p-4 shadow h-100">
                    <div className="d-flex align-items-center mb-3">
                      <div className="icon-bg-secondary rounded-circle p-2 me-3">
                        <Stethoscope className="text-white" size={20} />
                      </div>
                      <h3 className="h4 fw-bold primary-color mb-0">
                        Care Team
                      </h3>
                    </div>
                    
                    <div className="d-flex flex-column gap-3">
                      {doctors.map((doctor, index) => (
                        <div key={index} className="doctor-item p-3">
                          <div className="d-flex align-items-center gap-3">
                            <div 
                              className="doctor-avatar rounded-circle overflow-hidden"
                              style={{ '--doctor-color': doctor.colorCode }}
                            >
                              <img 
                                src={doctor.avatar} 
                                alt={doctor.name}
                                style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                              />
                              <div 
                                className="doctor-specialty-icon"
                                style={{ backgroundColor: doctor.colorCode }}
                              >
                                {getSpecialtyIcon(doctor.specialty)}
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <p className="fw-medium primary-color mb-1">
                                {doctor.name}
                              </p>
                              <div className="d-flex align-items-center">
                                <span 
                                  className="status-badge text-white fw-medium"
                                  style={{ backgroundColor: doctor.colorCode }}
                                >
                                  {doctor.specialty}
                                </span>
                              </div>
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

export default PatientProfile;